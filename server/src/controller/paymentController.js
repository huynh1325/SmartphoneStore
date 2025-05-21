require("dotenv").config();
import qs from 'qs';
import crypto from 'crypto';
import moment from 'moment';
import db from '../models';
import { generateCustomId } from '../utils/idGenerator';

const createPaymentUrl = async (req, res) => {
    try {
        const ipAddrRaw = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        const ipAddr = ipAddrRaw && ipAddrRaw.split(',')[0].trim();
        const vnp_IpAddr = (ipAddr === '::1') ? '127.0.0.1' : ipAddr;
        const maNguoiDung = req.user.id;
        const { danhSachSanPham, tongTien } = req.body;

        if (!danhSachSanPham || !Array.isArray(danhSachSanPham) || danhSachSanPham.length === 0) {
            return res.status(400).json({ message: 'Danh sách sản phẩm không hợp lệ' });
        }

        const maDonHang = await generateCustomId('DH', db.DonHang, 'maDonHang');
        const newOrder = await db.DonHang.create({
            maDonHang,
            maNguoiDung,
            trangThai: 'CHO_THANH_TOAN',
            tongTien: tongTien,
            phuongThucThanhToan: 'VNPAY'
        });

        for (const sp of danhSachSanPham) {
            const maChiTietDonHang = await generateCustomId('CTDH', db.ChiTietDonHang, 'maChiTietDonHang');

            await db.ChiTietDonHang.create({
                maChiTietDonHang,
                maDonHang,
                maSanPham: sp.maSanPham,
                soLuong: sp.soLuong,
                gia: sp.gia
            });
        }

        const tmnCode = process.env.VNP_TMNCODE;
        const secretKey = process.env.VNP_HASH_SECRET;
        const vnpUrl = process.env.VNP_URL;
        const returnUrl = process.env.VNP_RETURN_URL;

        const vnp_TxnRef = maDonHang;
        const vnp_Amount = tongTien * 100;
        const vnp_Locale = 'vn';
        const vnp_BankCode = '';
        // const vnp_IpAddr = ipAddr;
        const vnp_OrderInfo = `Thanh toan don hang ${maDonHang}`;
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
            vnp_Amount,
            vnp_ReturnUrl: returnUrl,
            vnp_IpAddr,
            vnp_CreateDate,
        };

        const sortedParams = Object.fromEntries(Object.entries(vnp_Params).sort());
        const signData = qs.stringify(sortedParams, { encode: true });
        const hmac = crypto.createHmac('sha512', secretKey);
        const secureHash = hmac.update(signData).digest('hex');
        console.log("sortedParams: ", sortedParams);
        console.log("signData: ", signData);
        console.log("hmac: ", hmac);
        console.log("secureHash: ", secureHash);



        sortedParams.vnp_SecureHash = secureHash;
        const paymentUrl = `${vnpUrl}?${qs.stringify(sortedParams, { encode: true })}`;

        return res.status(200).json({
            EM: 'Tạo URL thanh toán thành công',
            EC: 0,
            DT: paymentUrl
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
        const vnp_Params = req.query;
        const secureHash = vnp_Params.vnp_SecureHash;
        delete vnp_Params.vnp_SecureHash;
        delete vnp_Params.vnp_SecureHashType;

        const secretKey = process.env.VNP_HASH_SECRET;
        const sortedParams = Object.fromEntries(Object.entries(vnp_Params).sort());
        const signData = qs.stringify(sortedParams, { encode: true });
        const hmac = crypto.createHmac('sha512', secretKey);
        const checkSum = hmac.update(signData).digest('hex');

        console.log('signData on return:', signData);

        const maDonHang = vnp_Params.vnp_TxnRef;

        if (secureHash === checkSum) {
            if (vnp_Params.vnp_ResponseCode === '00') {
                await db.DonHang.update(
                    { trangThai: 'DA_THANH_TOAN' },
                    { where: { maDonHang } }
                );

                const donHang = await db.DonHang.findOne({ where: { maDonHang } });
                const maHoaDon = await generateCustomId('HD', db.HoaDon, 'maHoaDon');

                await db.HoaDon.create({
                    maHoaDon,
                    maDonHang,
                    maNguoiDung: donHang.maNguoiDung,
                    tongTien: donHang.tongTien
                });

                return res.redirect(`http://localhost:3000/thanh-toan-thanh-cong?orderId=${maDonHang}`);
            } else {
                return res.redirect(`http://localhost:3000/thanh-toan-that-bai?orderId=${maDonHang}`);
            }
        } else {
            return res.status(400).json({ message: 'Chữ ký không hợp lệ' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Lỗi xử lý phản hồi từ VNPAY' });
    }
};

module.exports = {
    createPaymentUrl, vnpayReturn
}
