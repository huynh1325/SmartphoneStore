import db from '../models/index'
import { generateCustomId } from '../utils/idGenerator';
import nodemailer from 'nodemailer';
import handlebars from 'handlebars';
import path from 'path';
import fs from 'fs';

const sendEmailWithTemplate = async (hoaDon, nguoiDung, chiTietItems) => {
    try {
        const templatePath = path.join(__dirname, '..', 'mail', 'templates', 'invoice.hbs');
        const source = fs.readFileSync(templatePath, 'utf8');
        handlebars.registerHelper('formatCurrency', (value) => {
            return Number(value).toLocaleString('vi-VN');
        });
        handlebars.registerHelper('multiply', (a, b) => (a * b).toLocaleString('vi-VN'));
        const template = handlebars.compile(source);

        const htmlContent = template({
            orderId: hoaDon.maHoaDon,
            date: new Date().toLocaleDateString('vi-VN'),
            customer: {
                name: nguoiDung.tenNguoiDung,
                address: hoaDon.diaChiGiaoHang,
                phone: nguoiDung.soDienThoai
            },
            items: chiTietItems.map(item => ({
                name: item.tenSanPham,
                quantity: item.soLuong,
                price: Number(item.gia),
                mau: item.mau
            })),
            thue: Number(hoaDon.thue || 0).toLocaleString('vi-VN'),
            tongTienHang: Number(hoaDon.tongTienHang || 0).toLocaleString('vi-VN'),
            tongTienGiam: Number(hoaDon.tongTienGiam || 0).toLocaleString('vi-VN'),
            tongThanhToan: Number(hoaDon.tongThanhToan || 0).toLocaleString('vi-VN')
        });

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASSWORD
            }
        });

        const mailOptions = {
            from: process.env.MAIL_USER,
            to: nguoiDung.email,
            subject: `Hóa đơn #${hoaDon.maHoaDon}`,
            html: htmlContent
        };

        await transporter.sendMail(mailOptions);

    } catch (err) {
        console.error("Gửi email thất bại:", err.message);
        throw err;
    }
};

const createInvoice = async (donHang, chiTietDonHang) => {
    try {
        const maHoaDon = await generateCustomId('HD', db.HoaDon, 'maHoaDon');

        const tongTienHang = donHang.tongTienHang || 0;
        const tongTienGiam = donHang.tongTienGiam || 0;
        const tongThanhToan = donHang.tongThanhToan || 0;

        const thue = Math.round(tongThanhToan - tongThanhToan / 1.1);

        const hoaDon = await db.HoaDon.create({
            maHoaDon,
            maDonHang: donHang.maDonHang,
            maNguoiDung: donHang.maNguoiDung,
            tongTienHang,
            tongTienGiam,
            tongThanhToan,
        });

        const chiTietItems = [];

        for (const item of chiTietDonHang) {
            const maChiTietHoaDon = await generateCustomId('CTHD', db.ChiTietHoaDon, 'maChiTietHoaDon');
            const sanPham = await db.SanPham.findOne({
                where: { maSanPham: item.maSanPham }
            });

            if (!sanPham) {
                console.warn(`Không tìm thấy sản phẩm với mã: ${item.maSanPham}`);
                continue;
            }

            chiTietItems.push({
                tenSanPham: sanPham.tenSanPham,
                soLuong: item.soLuong,
                gia: item.gia,
                mau: item.mau
            });

            await db.ChiTietHoaDon.create({
                maChiTietHoaDon,
                maHoaDon,
                maSanPham: item.maSanPham,
                tenSanPham: sanPham.tenSanPham,
                soLuong: item.soLuong,
                gia: item.gia,
                mau: item.mau
            });
        }

        const nguoiDung = await db.NguoiDung.findOne({
            where: { maNguoiDung: donHang.maNguoiDung }
        });

        if (nguoiDung) {
            await sendEmailWithTemplate({
                maHoaDon,
                maDonHang: donHang.maDonHang,
                tongTienGiam,
                tongThanhToan,
                thue,
                diaChiGiaoHang: donHang.diaChiGiaoHang
            }, nguoiDung, chiTietItems);
        } else {
            console.warn(`Không tìm thấy người dùng với mã: ${donHang.maNguoiDung}`);
        }

    } catch (error) {
        console.error("Lỗi tạo hóa đơn:", error);
        throw error;
    }
};

const handleGetInvoiceDetail = async (req, res) => {
    const { maDonHang } = req.params;

    try {
        const hoaDon = await db.HoaDon.findOne({
            where: { maDonHang },
        });

        if (!hoaDon) {
            return res.status(404).json({
                EC: 1,
                EM: `Không tìm thấy hóa đơn cho đơn hàng ${maDonHang}`,
                DT: null
            });
        }

        const donHang = await db.DonHang.findOne({
            where: { maDonHang },
        });

        const chiTiet = await db.ChiTietHoaDon.findAll({
            where: { maHoaDon: hoaDon.maHoaDon }
        });

        const nguoiDung = await db.NguoiDung.findOne({
            where: { maNguoiDung: hoaDon.maNguoiDung }
        });

        if (!nguoiDung) {
            return res.status(404).json({
                EC: 2,
                EM: `Không tìm thấy người dùng với mã ${hoaDon.maNguoiDung}`,
                DT: null
            });
        }

        const chiTietItems = await Promise.all(chiTiet.map(async item => {
            let tenSanPham = item.tenSanPham;
            if (!tenSanPham) {
                const sanPham = await db.SanPham.findOne({
                    where: { maSanPham: item.maSanPham }
                });
                tenSanPham = sanPham?.tenSanPham || "Không xác định";
            }
            return {
                tenSanPham,
                soLuong: item.soLuong,
                gia: item.gia,
                mau: item.mau
            };
        }));

        const data = {
            hoaDon: {
                maHoaDon: hoaDon.maHoaDon,
                maDonHang: hoaDon.maDonHang,
                tongTienHang: hoaDon.tongTienHang,
                tongTienGiam: hoaDon.tongTienGiam,
                tongThanhToan: hoaDon.tongThanhToan,
                ngayTao: hoaDon.createdAt,
                diaChiGiaoHang: donHang?.diaChiGiaoHang || "Không xác định"
            },
            nguoiDung: {
                tenNguoiDung: nguoiDung.tenNguoiDung,
                email: nguoiDung.email,
                soDienThoai: nguoiDung.soDienThoai
            },
            chiTietItems
        };

        return res.status(200).json({
            EC: 0,
            EM: 'Lấy thông tin hóa đơn thành công',
            DT: data
        });

    } catch (error) {
        console.error("Lỗi khi lấy chi tiết hóa đơn:", error);
        return res.status(500).json({
            EC: -1,
            EM: 'Lỗi server',
            DT: null
        });
    }
};


module.exports = {
    createInvoice, handleGetInvoiceDetail
}