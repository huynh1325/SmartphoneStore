import db from '../models/index';
import { generateCustomId } from '../utils/idGenerator';

const handleCreateReview = async (req, res) => {
  try {
    const { maNguoiDung, maSanPham, xepHang, noiDung, maDonHang } = req.body;

    if (!maNguoiDung || !maSanPham || !xepHang || !maDonHang) {
      return res.status(400).json({
        EM: 'Thiếu thông tin bắt buộc',
        EC: 1,
        DT: ''
      });
    }

    if (xepHang < 1 || xepHang > 5) {
      return res.status(400).json({
        EM: 'Xếp hạng phải từ 1 đến 5',
        EC: 1,
        DT: ''
      });
    }

    const existed = await db.DanhGia.findOne({
      where: {
        maNguoiDung,
        maSanPham,
      }
    });

    if (existed) {
      return res.status(409).json({
        EM: 'Bạn đã đánh giá sản phẩm này',
        EC: 2,
        DT: ''
      });
    }

    const maDanhGia = await generateCustomId('DG', db.DanhGia, 'maDanhGia');

    const review = await db.DanhGia.create({
        maDanhGia,
        maNguoiDung,
        maSanPham,
        xepHang,
        noiDung
    });

    const reviewWithUser = await db.DanhGia.findOne({
        where: { maDanhGia },
        include: [
            {
                model: db.NguoiDung,
                as: 'nguoiDung',
                attributes: ['tenNguoiDung']
            },
            {
                model: db.SanPham,
                as: 'sanPham',
                attributes: ['tenSanPham']
            }
        ]
    });

    return res.status(201).json({
      EM: 'Đánh giá thành công',
      EC: 0,
      DT: reviewWithUser
    });
  } catch (e) {
    console.error('Lỗi tạo đánh giá:', e);
    return res.status(500).json({
      EM: 'Lỗi từ server',
      EC: -1,
      DT: ''
    });
  }
};

const handleGetReviewsByProduct = async (req, res) => {
  try {
    const { maSanPham } = req.params;

    if (!maSanPham) {
      return res.status(400).json({
        EM: 'Thiếu mã sản phẩm',
        EC: 1,
        DT: ''
      });
    }

    const reviews = await db.DanhGia.findAll({
      where: { maSanPham },
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: db.NguoiDung,
          as: 'nguoiDung',
          attributes: ['tenNguoiDung']
        },
        {
          model: db.SanPham,
          as: 'sanPham',
          attributes: ['tenSanPham']
        }
      ]
    });

    return res.status(200).json({
      EM: 'Lấy đánh giá thành công',
      EC: 0,
      DT: reviews
    });

  } catch (error) {
    console.error('Lỗi khi lấy đánh giá:', error);
    return res.status(500).json({
      EM: 'Lỗi từ server',
      EC: -1,
      DT: ''
    });
  }
};

module.exports = {
  handleCreateReview, handleGetReviewsByProduct
};
