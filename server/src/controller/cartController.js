import db from '../models/index'
import { generateCustomId } from '../utils/idGenerator';

const handleAddToCart = async (req, res) => {
    try {
        const { maSanPham } = req.body;
        const maNguoiDung = req.user.id;
        const newId = await generateCustomId('DH', db.DonHang, 'maDonHang');

        const product = await db.SanPham.findByPk(maSanPham);
        if (!product) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        }

        let donHang = await db.DonHang.findOne({ where: { maNguoiDung } });

        if (!donHang) {
            donHang = await db.DonHang.create({
                maDonHang: newId,
                maNguoiDung
            });
        }

        const cartItem = await db.ChiTietDonHang.findOne({
            where: {
                maDonHang: donHang.maDonHang,
                maSanPham,
            },
        });

        if (cartItem) {
            return res.status(400).json({
                EM: "Sản phẩm đã có trong giỏ hàng",
                EC: 1,
            })
        }

        const newItem = await db.ChiTietDonHang.create({
            maDonHang: donHang.maDonHang,
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

        const donHang = await db.DonHang.findOne({
            where: { maNguoiDung }
        });

        if (!donHang) {
            return res.status(200).json({
                EM: 'Giỏ hàng rỗng',
                EC: 0,
                DT: []
            });
        }

        const cartItems = await db.ChiTietDonHang.findAll({
            where: {
                maDonHang: donHang.maDonHang
            },
            include: [
                {
                    model: db.SanPham,
                    as: 'sanPham',
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