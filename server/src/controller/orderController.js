import db from '../models/index';
import { generateCustomId } from '../utils/idGenerator';

const handleCreateOrder = async (req, res) => {
    try {
        const maNguoiDung = req.user.id;
        const { sanPhams, tongTien } = req.body;

        if (!sanPhams || sanPhams.length === 0) {
            return res.status(400).json({
                EC: 1,
                EM: "Không có sản phẩm nào trong đơn hàng",
                DT: null
            });
        }

        const maDonHang = await generateCustomId('DH', db.DonHang, 'maDonHang');

        const newOrder = await db.DonHang.create({
            maDonHang,
            maNguoiDung,
            tongTien,
            trangThai: 'Cho_Thanh_Toan'
        });

        for (const sp of sanPhams) {
            const product = await db.SanPham.findByPk(sp.maSanPham);
            if (product) {

                const maChiTietDonHang = await generateCustomId('CTDH', db.ChiTietDonHang, 'maChiTietDonHang');

                await db.ChiTietDonHang.create({
                    maChiTietDonHang: maChiTietDonHang,
                    maDonHang: maDonHang,
                    maSanPham: sp.maSanPham,
                    soLuong: sp.soLuong,
                    gia: sp.gia,
                });

                const gioHang = await db.GioHang.findOne({ where: { maNguoiDung } });

                await db.ChiTietGioHang.destroy({
                    where: {
                        maGioHang: gioHang.maGioHang,
                        maSanPham: sp.maSanPham
                    }
                });
            }
        }

        return res.status(200).json({
            EC: 0,
            EM: "Tạo đơn hàng thành công",
            DT: newOrder
        });
    } catch (error) {
        console.error("Lỗi khi tạo đơn hàng:", error);
        return res.status(500).json({
            EC: -1,
            EM: "Lỗi server khi tạo đơn hàng",
            DT: null
        });
    }
}

const getOrderById = async (req, res) => {
    const { maDonHang } = req.params;
    const maNguoiDung = req.user.id;

    try {
        const order = await db.DonHang.findOne({
            where: {
                maDonHang,
                maNguoiDung
            },
            include: [
                {
                    model: db.ChiTietDonHang,
                    as: 'chiTietDonHang',
                    include: [
                        {
                            model: db.SanPham,
                            as: 'sanPham'
                        }
                    ]
                }
            ]
        });

        if (!order) {
            return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
        }

        res.json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi khi lấy đơn hàng" });
    }
}

module.exports = {
    handleCreateOrder, getOrderById
}