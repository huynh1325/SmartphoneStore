import db from "../models/index";

const updateUserInfo = async ({ maNguoiDung, tenNguoiDung, gioiTinh, vaiTro }) => {
    try {
        const user = await db.NguoiDung.findOne({
            where: { maNguoiDung: maNguoiDung }
        });

        if (!user) {
            return {
                EM: "Người dùng không tồn tại",
                EC: 1,
                DT: null
            };
        }

        user.tenNguoiDung = tenNguoiDung;
        user.gioiTinh = gioiTinh;
        user.vaiTro = vaiTro;

        await user.save();

        return {
            EM: "Cập nhật thông tin người dùng thành công",
            EC: 0,
            DT: user
        };
    } catch (e) {
        console.log(e);
        return {
            EM: "Lỗi từ server",
            EC: -1,
            DT: null
        };
    }
};

export default {
    updateUserInfo
};
