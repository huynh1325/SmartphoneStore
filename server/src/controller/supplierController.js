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

const handleCreateSupplier = async (req, res) => {
    
    try {
        const { tenNhaCungCap } = req.body;

        if (!tenNhaCungCap || tenNhaCungCap.trim() === '') {
            return res.status(400).json({
                EM: 'Tên nhà cung cấp không được để trống',
                EC: 1,
            });
        }
        const existing = await db.NhaCungCap.findOne({
            where: db.sequelize.where(
                db.sequelize.fn('lower', db.sequelize.col('tenNhaCungCap')),
                tenNhaCungCap.toLowerCase()
            )
        });

        if (existing) {
            return res.status(400).json({
                EM: 'Nhà cung cấp đã tồn tại',
                EC: 1,
            });
        }
        
        let newSupplier = await db.NhaCungCap.create({ tenNhaCungCap })

        return res.status(201).json({
            EM: 'Đã thêm nhà cung cấp',
            EC: 0,
            DT: newSupplier
        })

    } catch (e) {
        return res.status(500).json({
            EM: 'error from server',
            EC: -1,
            DT: ''
        })
    }
}

module.exports = {
    getAllSupplier, handleCreateSupplier
}