import axios from "./axios.customize";

const registerNewUser = (name, gender, email, phone, password) => {
    return axios.post('/api/v1/register', {
        name, gender, email, phone, password
    })
}

// const fetchAllProduct = () => {
//     return axios.get('/api/v1/getproduct')
// }

const createProduct = (tenSanPham, heDieuHanh, ram, dungLuongLuuTru, inch, gia, nuocSanXuat, nhanHieu, phanTramGiam, anh) => {
    return axios.post('/api/v1/products', {
        tenSanPham, heDieuHanh, ram, dungLuongLuuTru, inch, gia, nuocSanXuat, nhanHieu, phanTramGiam, anh
    })
}

const updateProduct = (maSanPham ,tenSanPham, heDieuHanh, ram, dungLuongLuuTru, inch, gia, nuocSanXuat, nhanHieu, phanTramGiam, anh) => {
    return axios.put(`/api/v1/products/${maSanPham}`, {
        tenSanPham, heDieuHanh, ram, dungLuongLuuTru, inch, gia, nuocSanXuat, nhanHieu, phanTramGiam, anh
    })
}


export {
    registerNewUser, createProduct, updateProduct
}