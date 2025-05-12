import db from '../models/index'

const handleAddToCart = async (req, res) => {
    try {
        const { maSanPham } = req.body;
        const maNguoiDung = req.user.id;

        const product = await db.SanPham.findByPk(maSanPham);
        if (!product) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        }

        let gioHang = await db.GioHang.findOne({ where: { maNguoiDung } });

        if (!gioHang) {
            gioHang = await db.GioHang.create({ maNguoiDung });
        }

        let cartItem = await db.ChiTietGioHang.findOne({
            where: {
                maGioHang: gioHang.maGioHang,
                maSanPham,
            },
        });

        if (!cartItem) {
            cartItem = await db.ChiTietGioHang.create({
                maGioHang: gioHang.maGioHang,
                maSanPham,
                soLuong: 1,
            });
        } else {
            cartItem.soLuong += 1;
            await cartItem.save();
        }

        return res.status(200).json({
            message: 'Thêm sản phẩm vào giỏ hàng thành công',
            cartItem,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Lỗi server khi thêm vào giỏ hàng' });
    }
};

module.exports = {
    handleAddToCart
}