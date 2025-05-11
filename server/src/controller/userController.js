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

module.exports = {
    getAllUser
}