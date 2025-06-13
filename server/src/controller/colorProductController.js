import db from '../models/index';

const getAllColorProduct = async (req, res) => {
  try {
    const { maSanPham } = req.params;

    if (!maSanPham) {
      return res.status(400).json({
        EM: 'Thiếu mã sản phẩm',
        EC: 1,
      });
    }

    const dsMau = await db.MauSanPham.findAll({
      where: { maSanPham },
      attributes: ['id', 'mau', 'soLuong'],
    });

    return res.status(200).json({
      EM: 'Lấy danh sách màu thành công',
      EC: 0,
      DT: dsMau,
    });
  } catch (error) {
    console.error('Lỗi khi lấy màu sản phẩm:', error);
    return res.status(500).json({
      EM: 'Lỗi server',
      EC: -1,
    });
  }
};

module.exports = {
    getAllColorProduct
}