import db from '../models/index';
import { generateCustomId } from '../utils/idGenerator';

const tryCreateOrderWithUniqueId = async (orderData, maxRetry = 5) => {
    let retries = maxRetry;
    while (retries > 0) {
        const maDonHang = await generateCustomId('DH', db.DonHang, 'maDonHang');
        try {
            const order = await db.DonHang.create({
                ...orderData,
                maDonHang,
            });
            console.log(`Tạo đơn hàng thành công với mã: ${maDonHang}`);
            return order;
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                console.warn(`Mã đơn hàng bị trùng: ${maDonHang}. Thử lại (${maxRetry - retries + 1}/${maxRetry})`);
                retries--;
                if (retries === 0) throw error;
            } else {
                throw error;
            }
        }
    }
};

const tryCreateOrderDetailWithUniqueId = async (detailData, maxRetry = 5) => {
    let retries = maxRetry;
    while (retries > 0) {  
        const maChiTietDonHang = await generateCustomId('CTDH', db.ChiTietDonHang, 'maChiTietDonHang');
        try {
            const detail = await db.ChiTietDonHang.create({
                ...detailData,
                maChiTietDonHang,
            });
            return detail;
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                retries--;
                if (retries === 0) throw error;
            } else {
                throw error;
            }
        }
    }
};

const handleCreateOrder = async (req, res) => {
    try {
        const maNguoiDung = req.user.id;
        const { sanPhams, tongTienHang, tongTienGiam, tongThanhToan , phuongThucThanhToan, diaChi, maKhuyenMai } = req.body;

        if (!sanPhams || sanPhams.length === 0) {
            return res.status(400).json({
                EC: 1,
                EM: "Không có sản phẩm nào trong đơn hàng",
                DT: null,
            });
        }

        const newOrder = await tryCreateOrderWithUniqueId({
            maNguoiDung,
            maKhuyenMai,
            tongTienHang,
            tongTienGiam,
            tongThanhToan,
            trangThai: 'Cho_Xac_Nhan',
            phuongThucThanhToan,
            diaChiGiaoHang: diaChi
        });

        for (const sp of sanPhams) {
            const product = await db.SanPham.findByPk(sp.maSanPham);
            if (product) {
                await tryCreateOrderDetailWithUniqueId({
                    maDonHang: newOrder.maDonHang,
                    maSanPham: sp.maSanPham,
                    soLuong: sp.soLuong,
                    gia: sp.gia,
                    mau: sp.mau,
                });

                const gioHang = await db.GioHang.findOne({ where: { maNguoiDung } });
                if (gioHang) {
                    await db.ChiTietGioHang.destroy({
                        where: {
                            maGioHang: gioHang.maGioHang,
                            maSanPham: sp.maSanPham,
                        }
                    });
                }
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
            EM: "Lỗi server khi tạo đơn hàng"
        });
    }
};

const handleUpdateOrderStatus = async (req, res) => {
    try {
        const { maDonHang, trangThaiMoi } = req.body;

        if (!maDonHang || !trangThaiMoi) {
            return res.status(400).json({
                EC: 1,
                EM: "Thiếu mã đơn hàng hoặc trạng thái mới",
                DT: null,
            });
        }

        const donHang = await db.DonHang.findByPk(maDonHang);
        if (!donHang) {
            return res.status(404).json({
                EC: 2,
                EM: "Không tìm thấy đơn hàng",
                DT: null,
            });
        }

        donHang.trangThai = trangThaiMoi;
        await donHang.save();

        return res.status(200).json({
            EC: 0,
            EM: "Cập nhật trạng thái đơn hàng thành công",
            DT: donHang,
        });
    } catch (error) {
        console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
        return res.status(500).json({
            EC: -1,
            EM: "Lỗi server khi cập nhật trạng thái đơn hàng",
        });
    }
};

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
            return res.status(404).json({
            EM: "Không tìm thấy đơn hàng",
            EC: 2
        })
        }

        res.json(order);
    } catch (error) {
        console.error("Error: ", error);
        return res.status(500).json({
            EM: 'error from server',
            EC: -1
        })
    }
}


const getOrdersByUser = async (req, res) => {
    try {
        const maNguoiDung = req.user.id;
        const order = await db.DonHang.findAll({
            where: {
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

        return res.status(200).json({
            EM: "Lấy danh sách đơn hàng thành công",
            EC: 0,
            DT: order
        })
    } catch (error) {
        console.error("Error: ", error);
        return res.status(500).json({
            EM: 'error from server',
            EC: -1
        })
    }
}

module.exports = {
    handleCreateOrder, getOrderById, getOrdersByUser, handleUpdateOrderStatus
}