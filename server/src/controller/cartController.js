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

        const cartItem = await db.ChiTietGioHang.findOne({
            where: {
                maGioHang: gioHang.maGioHang,
                maSanPham,
            },
        });

        if (cartItem) {
            return res.status(400).json({
                EM: "Sản phẩm đã có trong giỏ hàng",
                EC: 1,
            })
        }

        const newItem = await db.ChiTietGioHang.create({
            maGioHang: gioHang.maGioHang,
            maSanPham,
            gia: product.gia,
            soLuong: 1,
        });
        return res.status(200).json({
            EM: "Sản phẩm đã được thêm vào giỏ hàng",
            EC: 0,
            DT: newItem
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            EM: 'error from server',
            EC: -1,
            DT: []
        })
    }
};

const getAllCart = async (req, res) => {
try {
        const maNguoiDung = req.user.id;

        const gioHang = await db.GioHang.findOne({
            where: { maNguoiDung }
        });

        if (!gioHang) {
            return res.status(200).json({
                EM: 'Giỏ hàng rỗng',
                EC: 0,
                DT: []
            });
        }

        const cartItems = await db.ChiTietGioHang.findAll({
            where: {
                maGioHang: gioHang.maGioHang
            },
            include: [
                {
                    model: db.SanPham,
                    as: 'sanPham', // đúng alias bạn đã định nghĩa trong model
                    attributes: ['tenSanPham', 'gia', 'anh']
                }
            ]
        });

        return res.status(200).json({
            EM: 'Lấy giỏ hàng thành công',
            EC: 0,
            DT: cartItems
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            EM: 'Lỗi server khi lấy giỏ hàng',
            EC: -1,
            DT: []
        });
    }
}

module.exports = {
    handleAddToCart, getAllCart
}