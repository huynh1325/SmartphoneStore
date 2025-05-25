require("dotenv").config();
import qs from 'qs';
import crypto from 'crypto';
import moment from 'moment';
import db from '../models';
import { createInvoice } from './invoiceController';

const createPaymentUrl = async (req, res) => {
    try {
        const ipAddrRaw = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        const ipAddr = ipAddrRaw && ipAddrRaw.split(',')[0].trim();
        const vnp_IpAddr = (ipAddr === '::1') ? '127.0.0.1' : ipAddr;
        const { maDonHang } = req.body;
        const donHang = await db.DonHang.findOne({ where: { maDonHang } });
        if (!donHang) {
            return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
        }
        
        const tongTien = donHang.tongTien;

        const tmnCode = process.env.VNP_TMNCODE;
        const secretKey = process.env.VNP_HASH_SECRET;
        let vnpUrl = process.env.VNP_URL;
        const returnUrl = 'https://4dfd-2a09-bac5-d5c8-e6-00-17-25d.ngrok-free.app/api/v1/vnpay-return'

        const vnp_TxnRef = maDonHang;
        const vnp_Locale = 'vn';
        const vnp_OrderInfo = `Thanhtoandonhang${maDonHang}`;
        const vnp_CreateDate = moment().format('YYYYMMDDHHmmss');

        const vnp_Params = {
            vnp_Version: '2.1.0',
            vnp_Command: 'pay',
            vnp_TmnCode: tmnCode,
            vnp_Locale,
            vnp_CurrCode: 'VND',
            vnp_TxnRef,
            vnp_OrderInfo,
            vnp_OrderType: 'other',
            vnp_Amount: (tongTien * 100).toString(),
            vnp_ReturnUrl: returnUrl,
            vnp_IpAddr,
            vnp_CreateDate,
        };

        let paymentUrl = new URL(vnpUrl);

        Object.entries(vnp_Params)
            .sort(([key1], [key2]) => key1.toString().localeCompare(key2.toString()))
            .forEach(([key, value]) => {
                if (value) {
                    
                  paymentUrl.searchParams.append(key, value.toString());
                }

            })

        const hmac = crypto.createHmac("sha512", secretKey);
        const signed = hmac.update(Buffer.from(paymentUrl.search.slice(1), "utf-8")).digest("hex");
        
        paymentUrl.searchParams.append("vnp_SecureHash", signed);


        return res.status(200).json({
            EM: 'Tạo URL thanh toán thành công',
            EC: 0,
            DT: paymentUrl.toString()
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            EM: 'Lỗi tạo thanh toán',
            EC: -1,
            DT: []
        });
    }
};

const vnpayReturn = async (req, res) => {
    try {
        const vnp_Params = { ...req.query };
        const secureHash = vnp_Params.vnp_SecureHash;
        const vnp_ResponseCode = vnp_Params.vnp_ResponseCode;
        const vnp_TxnRef = vnp_Params.vnp_TxnRef;

        delete vnp_Params.vnp_SecureHash;
        delete vnp_Params.vnp_SecureHashType;

        const secretKey = process.env.VNP_HASH_SECRET;
        const sortedParams = Object.fromEntries(Object.entries(vnp_Params).sort());
        const signData = qs.stringify(sortedParams, { encode: false });
        const hmac = crypto.createHmac('sha512', secretKey);
        const checkSum = hmac.update(signData).digest('hex');

        if (secureHash !== checkSum) {
            return res.status(400).json({ message: 'Chữ ký không hợp lệ' });
        }

        if (vnp_ResponseCode !== '00') {
            return res.redirect(`http://localhost:5173`);
        }

        await db.DonHang.update(
            { trangThai: 'Da_Thanh_Toan' },
            { where: { maDonHang: vnp_TxnRef } }
        );

        const donHang = await db.DonHang.findOne({ where: { maDonHang: vnp_TxnRef } });
        if (!donHang) {
            return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
        }

        const chiTietDonHang = await db.ChiTietDonHang.findAll({
            where: { maDonHang: vnp_TxnRef }
        });

        for (const item of chiTietDonHang) {
            const sanPham = await db.SanPham.findOne({
                where: { maSanPham: item.maSanPham }
            });

            if (sanPham) {
                const soLuongMoi = sanPham.soLuong - item.soLuong;
                await sanPham.update({ soLuong: Math.max(soLuongMoi, 0) });
            }
        }
        
        const invoiceResult = await createInvoice(donHang, chiTietDonHang);

        return res.redirect(`http://localhost:5173/purchase?payment=success`);
    } catch (error) {
        console.error('Lỗi khi xử lý phản hồi từ VNPAY:', error);
        return res.status(500).json({ message: 'Lỗi xử lý phản hồi từ VNPAY' });
    }
};

module.exports = {
    createPaymentUrl, vnpayReturn
}
