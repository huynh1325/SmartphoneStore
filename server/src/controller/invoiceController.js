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
        handlebars.registerHelper('multiply', (a, b) => (a * b).toLocaleString('vi-VN'));
        const template = handlebars.compile(source);

        const htmlContent = template({
            orderId: hoaDon.maHoaDon,
            date: new Date().toLocaleDateString('vi-VN'),
            customer: {
                name: nguoiDung.tenNguoiDung,
                address: nguoiDung.diaChi,
                phone: nguoiDung.soDienThoai
            },
            items: chiTietItems.map(item => ({
                name: item.tenSanPham,
                quantity: item.soLuong,
                price: item.gia,
                mau: item.mau
            })),
            total: hoaDon.tongTien.toLocaleString('vi-VN')
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

        const tinhTongTien = (chiTietDonHang) => {
            return chiTietDonHang.reduce((total, item) => {
                const gia = parseFloat(item.gia) || 0;
                const soLuong = item.soLuong || 0;
                return total + gia * soLuong;
            }, 0);
        };

        const tongTien = tinhTongTien(chiTietDonHang);

        const hoaDon = await db.HoaDon.create({
            maHoaDon,
            maDonHang: donHang.maDonHang,
            maNguoiDung: donHang.maNguoiDung,
            tongTien
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

        console.log(nguoiDung)

        if (nguoiDung) {
            await sendEmailWithTemplate({
                maHoaDon,
                maDonHang: donHang.maDonHang,
                tongTien: tinhTongTien(chiTietDonHang)
            }, nguoiDung, chiTietItems);
        } else {
            console.warn(`Không tìm thấy người dùng với mã: ${donHang.maNguoiDung}`);
        }

    } catch (error) {
        console.error("Lỗi tạo hóa đơn:", error);
        throw error;
    }
}


module.exports = {
    createInvoice
}