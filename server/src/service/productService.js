import db from '../models/index'

const newProduct = async (rawData) => {

    console.log('req.body:', rawData);

    try {
        await db.SanPham.create({
            tenSanPham: rawData.tenSanPham,
            heDieuHanh: rawData.heDieuHanh,
            moTa: 'none',
            cpu: rawData.cpu,
            ram: rawData.ram,
            dungLuongLuuTru: rawData.dungLuongLuuTru,
            gia: rawData.gia,
            inch: rawData.inch,
            nuocSanXuat: rawData.nuocSanXuat,
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

module.exports = {
    newProduct
}