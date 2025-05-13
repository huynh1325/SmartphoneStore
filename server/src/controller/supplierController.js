import db from '../models/index'

const getAllSupplier = async (req, res) => {
    try {
        let suppliers = await db.NhaCungCap.findAll();
        return res.status(200).json({
            EM: "Lấy danh sách nhà cung cấp thành công",
            EC: 0,
            DT: suppliers
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
    getAllSupplier
}