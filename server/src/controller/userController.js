import userService from '../service/userService'
import db from '../models/index'

const getAllUser = async (req, res) => {
    try {
        let users = await db.NguoiDung.findAll({
            order: [['maNguoiDung', 'DESC']]
        });
        return res.status(200).json({
            EM: "Lấy danh sách người dùng thành công",
            EC: 0,
            DT: users
        })
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            EM: 'error from server',
            EC: -1,
            DT: []
        })
    }
}

const updateUserInfo = async (req, res) => {
    try {
        const { maNguoiDung, tenNguoiDung, gioiTinh, vaiTro } = req.body;

        if (!maNguoiDung || !tenNguoiDung || !gioiTinh || !vaiTro) {
            return res.status(400).json({
                EM: "Thiếu dữ liệu đầu vào",
                EC: 2,
                DT: null
            });
        }

        const result = await userService.updateUserInfo({ maNguoiDung, tenNguoiDung, gioiTinh, vaiTro });

        return res.status(200).json(result);
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            EM: "Lỗi từ server",
            EC: -1,
            DT: null
        });
    }
};

module.exports = {
    getAllUser, updateUserInfo
}