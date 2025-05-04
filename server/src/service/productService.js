import db from '../models/index'

const newProduct = async (rawData) => {

    try {
        await db.SanPham.create({
            tenSanPham: rawData.name,
            heDieuHanh: rawData.os,
            moTa: rawData.description,
            cpu: rawData.cpu,
            ram: rawData.ram,
            dungLuongLuuTru: rawData.rom,
            gia: rawData.price,
            inch: rawData.inch,
            nuocSanXuat: rawData.country,
            nhanHieu: rawData.brand,
            phanTramGiam: rawData.discount,
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

module.exports = {
    newProduct
}