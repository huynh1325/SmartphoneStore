import db from '../models/index'

const handleCreateStockIn = async (req, res) => {
    try {
        const { maSanPham, maNhaCungCap, soLuong, donGia } = req.body;

        if (!maSanPham || !maNhaCungCap || !soLuong || !donGia) {
            return res.status(400).json({
              EM: 'Thiếu dữ liệu',
              EC: 0,
            });
        }

        const sanPham = await db.SanPham.findByPk(maSanPham);
        if (!sanPham) {
            return res.status(404).json({
              EM: 'Không tìm thấy sản phẩm',
              EC: 2,
            });
        }

        const phieuNhap = await db.PhieuNhap.create({
            maSanPham,
            maNhaCungCap,
            soLuong,
            donGia
        });

        await sanPham.update({
            soLuong: sanPham.soLuong + Number(soLuong)
        });

        return res.status(201).json({
          EM: 'Nhập hàng thành công',
          EC: 0,
          DT: phieuNhap,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
          EM: 'Lỗi server',
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
          model: db.SanPham,
          attributes: ['tenSanPham'],
        },
        {
          model: db.NhaCungCap,
          attributes: ['tenNhaCungCap'],
        },
      ],
    });

    const data = receipts.map((receipt) => ({
      maPhieuNhap: receipt.maPhieuNhap,
      maSanPham: receipt.maSanPham,
      tenSanPham: receipt.SanPham?.tenSanPham || 'Không rõ',
      maNhaCungCap: receipt.maNhaCungCap,
      tenNhaCungCap: receipt.NhaCungCap?.tenNhaCungCap || 'Không rõ',
      soLuong: receipt.soLuong,
      donGia: receipt.donGia,
      ngayNhap: receipt.createdAt, // hoặc updatedAt nếu cần
    }));

    return res.status(200).json({
      EM: 'Lấy danh sách phiếu nhập thành công',
      EC: 0,
      DT: data,
    });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách phiếu nhập:', error);
    return res.status(500).json({
      EM: 'Lỗi từ server',
      EC: -1,
      DT: [],
    });
  }
}


module.exports = {
    handleCreateStockIn, getAllStockIn
}