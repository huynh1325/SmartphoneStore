import { where } from 'sequelize';
import db from '../models/index'
import { generateCustomId } from '../utils/idGenerator';

const handleCreateVoucher = async (req, res) => {
    try {
        const data = req.body;

        const existingVoucher = await db.KhuyenMai.findOne({ where: { maNhap: data.maNhap } });
        if (existingVoucher) {
            return res.status(400).json({
                EM: 'Mã nhập đã tồn tại, vui lòng nhập mã khác',
                EC: 1,
            });
        }

        const voucherId = await generateCustomId('KM', db.KhuyenMai, 'maKhuyenMai');

        const newVoucher = await db.KhuyenMai.create({
            maKhuyenMai: voucherId,
            maNhap: data.maNhap,
            tenKhuyenMai: data.tenKhuyenMai,
            moTa: data.moTa,
            kieuGiamGia: data.kieuGiamGia,
            giaTriGiam: data.giaTriGiam,
            giaTriGiamToiDa: data.giaTriGiamToiDa,
            soLuong: data.soLuong,
            ngayBatDau: data.ngayBatDau,
            ngayKetThuc: data.ngayKetThuc,
            trangThai: data.trangThai
        });

        return res.status(201).json({
            EM: 'Tạo voucher thành công',
            EC: 0,
            DT: newVoucher
        })

    } catch (error) {
        console.error('Lỗi tạo voucher:', error);
        return res.status(500).json({
            EM: 'Lỗi server',
            EC: -1,
        });
    }
};

const fetchAllVoucher = async (req, res) => {
    try {
        const voucher = await db.KhuyenMai.findAll();
        return res.status(200).json({
            EM: "Lấy danh sách voucher thành công",
            EC: 0,
            DT: voucher
        })
    } catch (error) {
        console.error('Lỗi khi lấy danh sách voucher:', error);
        return res.status(500).json({
            EM: 'Lỗi server',
            EC: -1,
        });
    }
}

const getVoucherByCodeInput = async (req, res) => {
    try {
        const { maNhap } = req.params;

        const voucher = await db.KhuyenMai.findOne({
            where: { maNhap: maNhap.trim() }
        });
        
        return res.status(200).json({
            EM: "Lấy voucher thành công",
            EC: 0,
            DT: voucher
        })
    } catch (error) {
        console.error('Lỗi khi lấy voucher:', error);
        return res.status(500).json({
            EM: 'Lỗi server',
            EC: -1,
        });
    }
}

const handleUpdateVoucher = async (req, res) => {
    try {
        const maKhuyenMai = req.params.maKhuyenMai;
        const data = req.body;

        const voucher = await db.KhuyenMai.findOne({ where: { maKhuyenMai } });

        if (!voucher) {
            return res.status(404).json({
                EM: 'Không tìm thấy voucher',
                EC: 1,
            });
        }

        const existingVoucherWithMaNhap = await db.KhuyenMai.findOne({
            where: {
                maNhap: data.maNhap,
                maKhuyenMai: { [db.Sequelize.Op.ne]: maKhuyenMai }
            }
        });

        if (existingVoucherWithMaNhap) {
            return res.status(400).json({
                EM: 'Mã nhập đã tồn tại ở voucher khác, vui lòng nhập mã khác',
                EC: 1,
            });
        }

        await voucher.update({
            maNhap: data.maNhap,
            tenKhuyenMai: data.tenKhuyenMai,
            moTa: data.moTa,
            kieuGiamGia: data.kieuGiamGia,
            giaTriGiam: data.giaTriGiam,
            giaTriGiamToiDa: data.giaTriGiamToiDa,
            soLuong: data.soLuong,
            ngayBatDau: data.ngayBatDau,
            ngayKetThuc: data.ngayKetThuc,
            trangThai: data.trangThai
        });

        return res.status(200).json({
            EM: 'Cập nhật voucher thành công',
            EC: 0,
            DT: voucher
        });

    } catch (error) {
        console.error('Lỗi cập nhật voucher:', error);
        return res.status(500).json({
            EM: 'Lỗi server',
            EC: -1,
        });
    }
};

const handleDeleteVoucher = async (req, res) => {
    try {
        const maKhuyenMai = req.params.maKhuyenMai;

        const voucher = await db.KhuyenMai.findOne({ where: { maKhuyenMai } });

        if (!voucher) {
            return res.status(404).json({
                EM: 'Không tìm thấy voucher',
                EC: 1,
            });
        }

        await voucher.destroy();

        return res.status(200).json({
            EM: 'Xóa voucher thành công',
            EC: 0,
        });

    } catch (error) {
        console.error('Lỗi xóa voucher:', error);
        return res.status(500).json({
            EM: 'Lỗi server',
            EC: -1,
        });
    }
};

module.exports = {
    handleCreateVoucher, fetchAllVoucher, handleUpdateVoucher, handleDeleteVoucher, getVoucherByCodeInput
}