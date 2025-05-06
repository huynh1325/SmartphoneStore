import db from '../models/index'

const newProduct = async (rawData) => {

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

        if (sanPham) {
            await db.SanPham.update({
                tenSanPham: data.tenSanPham,
                heDieuHanh: data.heDieuHanh,
                moTa: 'none',
                cpu: data.cpu,
                ram: data.ram,
                dungLuongLuuTru: data.dungLuongLuuTru,
                gia: data.gia,
                inch: data.inch,
                nuocSanXuat: data.nuocSanXuat,
                nhanHieu: data.nhanHieu,
                phanTramGiam: data.phanTramGiam,
                anh: data.image
            },
                {
                    where: { maSanPham: data.maSanPham }
                }
            )

            return {
                EM: 'Cập nhật sản phẩm thành công',
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

module.exports = {
    newProduct, updateProduct
}