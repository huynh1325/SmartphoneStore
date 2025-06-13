import db from '../models/index'
import { generateCustomId } from '../utils/idGenerator';

const handleAddToCart = async (req, res) => {
    console.log(req.body)
    try {
        const { maSanPham, mau } = req.body;
        const maNguoiDung = req.user.id;
        const newIdGH = await generateCustomId('GH', db.GioHang, 'maGioHang');
        const newIdCTGH = await generateCustomId('CTGH', db.ChiTietGioHang, 'maChiTietGioHang');

        const product = await db.SanPham.findByPk(maSanPham);
        if (!product) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        }

        let gioHang = await db.GioHang.findOne({
            where: { maNguoiDung },
            include: [
                {
                    model: db.NguoiDung,
                    as: 'nguoiDung'
                }
            ]
        });

        if (!gioHang) {
            gioHang = await db.GioHang.create({
                maGioHang: newIdGH,
                maNguoiDung
            });
        }

        const cartItem = await db.ChiTietGioHang.findOne({
            where: {
                maGioHang: gioHang.maGioHang,
                maSanPham,
                mau
            },
        });

        if (cartItem) {
            return res.status(400).json({
                EM: "Sản phẩm đã có trong giỏ hàng",
                EC: 1,
            })
        }

        const newItem = await db.ChiTietGioHang.create({
            maChiTietGioHang: newIdCTGH,
            maGioHang: gioHang.maGioHang,
            maSanPham,
            mau,
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
                    as: 'sanPham',
                    attributes: ['tenSanPham', 'gia', 'anh', 'phanTramGiam']
                }
            ]
        });

        const result = await Promise.all(
            cartItems.map(async item => {
                const sanPham = item.sanPham;
                const goc = item.gia;
                const giam = sanPham?.phanTramGiam || 0;
                const giaDaGiam = Math.round(goc - (goc * giam / 100));

                const tonKho = await db.MauSanPham.findOne({
                    where: {
                        maSanPham: item.maSanPham,
                        mau: item.mau
                    }
                });

                return {
                    ...item.toJSON(),
                    giaDaGiam,
                    soLuongTon: tonKho?.soLuong || 0
                };
            })
        );

        return res.status(200).json({
            EM: 'Lấy giỏ hàng thành công',
            EC: 0,
            DT: result
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