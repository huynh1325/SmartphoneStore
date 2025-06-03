import db from '../models/index'
import { v4 as uuidv4 } from 'uuid';

const handleCreateStockIn = async (req, res) => {
  const t = await db.sequelize.transaction();

  try {
    const { maNhaCungCap, sanPhamNhap, donGia } = req.body;

    if (!maNhaCungCap || !Array.isArray(sanPhamNhap) || sanPhamNhap.length === 0) {
      return res.status(400).json({
        EM: 'Thiếu dữ liệu nhập hàng',
        EC: 1,
      });
    }

    const maPhieuNhap = uuidv4();

    const data = await db.PhieuNhap.create({
      maPhieuNhap,
      maNhaCungCap,
      donGia
    }, { transaction: t });

    for (const item of sanPhamNhap) {
      const { maSanPham, mauSanPham, soLuong } = item;


      const sanPham = await db.SanPham.findByPk(maSanPham);
      if (!sanPham) {
        await t.rollback();
        return res.status(404).json({
          EM: `Không tìm thấy sản phẩm mã ${maSanPham}`,
          EC: 2,
        });
      }

      const chiTietMau = await db.MauSacSanPham.findOne({
        where: {
          maSanPham: maSanPham,
          mau: mauSanPham,
        },
      });

      if (!chiTietMau) {
        await t.rollback();
        return res.status(404).json({
          EM: `Không tìm thấy màu '${mauSanPham}' cho sản phẩm mã '${maSanPham}'`,
          EC: 3,
        });
      }

      const maChiTietPhieuNhap = uuidv4();

      await db.ChiTietPhieuNhap.create({
        maChiTietPhieuNhap,
        maPhieuNhap,
        maSanPham,
        maMauSacSanPham: chiTietMau.id,
        soLuong,
      }, { transaction: t });

      await db.MauSacSanPham.update(
        { soLuong: chiTietMau.soLuong + soLuong },
        {
          where: { id: chiTietMau.id },
          transaction: t,
        }
      );
    }

    await t.commit();

    return res.status(201).json({
      EM: 'Nhập hàng thành công',
      EC: 0,
      DT: data
    });

  } catch (err) {
    console.error(err);
    await t.rollback();
    return res.status(500).json({
      EM: 'Lỗi server khi nhập hàng',
      EC: -1,
    });
  }
}


const getAllStockIn = async (req, res) => {
  try {
    const receipts = await db.PhieuNhap.findAll({
      order: [['maPhieuNhap', 'DESC']],
      include: [
        {
          model: db.ChiTietPhieuNhap,
          as: 'chiTietPhieuNhap',
          include: [
            {
              model: db.SanPham,
              attributes: ['maSanPham', 'tenSanPham']
            },
            {
              model: db.MauSacSanPham,
              attributes: ['mau']
            }
          ]
        },
        {
          model: db.NhaCungCap,
          attributes: ['maNhaCungCap', 'tenNhaCungCap']
        }
      ]
    });

    const data = receipts.map((receipt) => ({
      maPhieuNhap: receipt.maPhieuNhap,
      tenNhaCungCap: receipt.NhaCungCap?.tenNhaCungCap || 'Không rõ',
      donGia: receipt.donGia,
      sanPhamNhap: receipt.chiTietPhieuNhap?.map(ct => ({
        sanPham: ct.SanPham?.tenSanPham,
        mau: ct.MauSacSanPham?.mau || 'Không rõ',
        soLuong: ct.soLuong,
      }))
    }));

    return res.status(200).json({
      EM: 'Lấy danh sách phiếu nhập thành công',
      EC: 0,
      DT: data
    });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách phiếu nhập:', error);
    return res.status(500).json({
      EM: 'Lỗi từ server',
      EC: -1,
      DT: [],
    });
  }
};


module.exports = {
    handleCreateStockIn, getAllStockIn
}