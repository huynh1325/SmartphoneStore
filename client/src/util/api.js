import axios from "./axios.customize";

const registerNewUser = (name, gender, email, phone, password) => {
    return axios.post('/api/v1/register', {
        name, gender, email, phone, password
    })
}

const fetchAllProduct = () => {
    return axios.get('/api/v1/getproduct')
}

const addProduct = (tenSanPham, heDieuHanh, moTa, ram, dungLuongLuuTru, inch, gia, nuocSanXuat, nhanHieu, phanTramGiam, anh) => {
    return axios.post('/api/v1/addproduct', {
        tenSanPham, heDieuHanh, moTa, ram, dungLuongLuuTru, inch, gia, nuocSanXuat, nhanHieu, phanTramGiam, anh
    })
}


export {
    registerNewUser, addProduct, fetchAllProduct
}