import db from '../models/index'
import { Op, fn, col, literal } from 'sequelize';

const getDashboardStats = async (req, res) => {
    const Order = db.DonHang;
    const User = db.NguoiDung;
    const Supplier = db.NhaCungCap;
    const Voucher = db.KhuyenMai;

    try {
        const [orders, users, suppliers, vouchers] = await Promise.all([
            Order.count(),
            User.count(),
            Supplier.count(),
            Voucher.count()
        ]);

        return res.status(200).json({
            EC: 0,
            DT: {
                totalOrders: orders,
                totalUsers: users,
                totalSuppliers: suppliers,
                totalVouchers: vouchers
            }
        });
    } catch (err) {
        console.error('Lỗi khi lấy thống kê:', err);
        return res.status(500).json({ EC: 1, EM: 'Lỗi server' });
    }
};

const getTopSellingProducts = async (req, res) => {
    try {
        const topProducts = await db.ChiTietHoaDon.findAll({
            attributes: [
                'maSanPham',
                [db.Sequelize.fn('SUM', db.Sequelize.col('soLuong')), 'totalSold']
            ],
            include: [
                {
                    model: db.SanPham,
                    attributes: ['tenSanPham']
                }
            ],
            group: ['ChiTietHoaDon.maSanPham', 'SanPham.maSanPham', 'SanPham.tenSanPham'],
            order: [[db.Sequelize.literal('totalSold'), 'DESC']],
            limit: 10,
        });
            res.status(200).json({
            EC: 0,
            DT: topProducts
        });
    } catch (error) {
        console.error('Lỗi lấy sản phẩm bán chạy:', error);
            res.status(500).json({
            EC: 1,
            EM: 'Lỗi server'
        });
    }
};

const getRevenueLast10Days = async (req, res) => {
    try {
        const today = new Date();
        const tenDaysAgo = new Date();
        tenDaysAgo.setDate(today.getDate() - 9); 

        const revenue = await db.HoaDon.findAll({
            attributes: [
                [fn('DATE', col('createdAt')), 'date'],
                [fn('SUM', col('tongThanhToan')), 'totalRevenue']
            ],
            where: {
                createdAt: {
                    [Op.between]: [tenDaysAgo, today]
                }
            },
                group: [fn('DATE', col('createdAt'))],
                order: [[fn('DATE', col('createdAt')), 'ASC']]
            });

        const result = [];
        for (let i = 9; i >= 0; i--) {
            const d = new Date();
            d.setDate(today.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];

            const found = revenue.find(r => r.dataValues.date === dateStr);
                result.push({
                    date: dateStr,
                    totalRevenue: found ? parseInt(found.dataValues.totalRevenue) : 0
                });
            }

        return res.status(200).json({
            EC: 0,
            EM: 'Thành công',
            DT: result
        });
    } catch (error) {
        console.error('Lỗi thống kê doanh thu:', error);
        return res.status(500).json({ EC: 1, EM: 'Lỗi server' });
    }
};

module.exports = {
    getDashboardStats, getTopSellingProducts, getRevenueLast10Days
}