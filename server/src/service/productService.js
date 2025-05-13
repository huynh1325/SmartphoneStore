import db from '../models/index'
const deleteImage = require('../utils/deleteImage'); 

const newProduct = async (rawData) => {

    try {
        await db.SanPham.create({
            tenSanPham: rawData.tenSanPham,
            heDieuHanh: rawData.heDieuHanh,
            cpu: rawData.cpu,
            ram: rawData.ram,
            soLuong: 0,
            dungLuongLuuTru: rawData.dungLuongLuuTru,
            chipDoHoa: rawData.chipDoHoa,
            theNho: rawData.theNho,
            gia: rawData.gia,
            inch: rawData.inch,
            nhanHieu: rawData.nhanHieu,
            phanTramGiam: rawData.phanTramGiam,
            anh: rawData.image
        })

        return {
            EM: 'Thêm sản phẩm thành công',
            EC: 0
        }
    } catch (e) {
        console.log(e)
        return {
            EM: 'Something wrongs in service...',
            EC: -2
        }
    }
}

const updateProduct = async (data) => {

    try {
        if (!data) {
            return {
                EM: 'Không có dữ liệu',
                EC: 1,
                DT: ''
            }
        }

        let sanPham = await db.SanPham.findOne({
            where: { maSanPham: data.maSanPham }
        })

        let anhCapNhat = sanPham.anh;

        if (data.image) {
            anhCapNhat = data.image;
        }

        if (sanPham) {
            await db.SanPham.update({
                tenSanPham: data.tenSanPham,
                heDieuHanh: data.heDieuHanh,
                cpu: data.cpu,
                ram: data.ram,
                dungLuongLuuTru: data.dungLuongLuuTru,
                gia: data.gia,
                inch: data.inch,
                chipDoHoa: data.chipDoHoa,
                theNho: data.theNho,
                nhanHieu: data.nhanHieu,
                phanTramGiam: data.phanTramGiam,
                anh: anhCapNhat
            },
            {
                where: { maSanPham: data.maSanPham }
            }
            )

            return {
                EM: 'Cập nhật sản phẩm thành công!',
                EC: 0
            }

        } else {
            return {
                EM: 'Không tìm thấy sản phẩm',
                EC: 2,
                DT: ''
            }
        }
    } catch (e) {
        console.log(e)
        return {
            EM: 'Something wrongs in service...',
            EC: -2
        }
    }
}

const deleteProduct = async (maSanPham) => {

    try {

        const sanPham = await db.SanPham.findOne({
            where: { maSanPham }
        })

        if (!sanPham) {
            return {
                EM: 'Không tìm thấy sản phẩm để xóa',
                EC: 2,
                DT: ''
            };
        }

        if (sanPham.anh) {
            deleteImage(sanPham.anh);
        }

        await db.SanPham.destroy({
            where: { maSanPham }
        });

        return {
            EM: 'Xóa sản phẩm thành công!',
            EC: 0,
            DT: ''
        }
    } catch (e) {
        console.log(e)
        return {
            EM: 'Something wrongs in service...',
            EC: -2
        }
    }
}

module.exports = {
    newProduct, updateProduct, deleteProduct
}