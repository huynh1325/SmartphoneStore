import db from '../models/index'
import { generateCustomId } from '../utils/idGenerator';

const handleCreateAddress = async (req, res) => {
    try {
        const { tenDiaChi, tinhThanh, quanHuyen, phuongXa, diaChiChiTiet} = req.body;
        const maNguoiDung = req.user.id;
        
        const newId = await generateCustomId('DC', db.DiaChi, 'maDiaChi');

        const newAddress = await db.DiaChi.create({
            maDiaChi: newId,
            maNguoiDung,
            tenDiaChi,
            tinhThanh,
            quanHuyen,
            phuongXa,
            diaChiChiTiet
        });

        return res.status(201).json({
            EM: "Thêm địa hỉ thành công",
            EC: 0,
            DT: newAddress
        })
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({
            EM: 'error from server',
            EC: -1
        })
    }
}

const getAddressByUser = async (req, res) => {
    try {
        const maNguoiDung = req.user.id;
        const address = await db.DiaChi.findAll({
            where: {
                maNguoiDung
            }});

        if (!address) {
            return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
        }

        res.json(address);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            EM: 'error from server',
            EC: -1
        })
    }
}

module.exports = {
    handleCreateAddress, getAddressByUser
}