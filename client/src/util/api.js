import axios from "./axios.customize";

const registerNewUser = (name, gender, email, phone, password) => {
    return axios.post('/api/v1/register', {
        name, gender, email, phone, password
    })
}

const userLogin = (email, password) => {
    return axios.post('/api/v1/login', {
        email, password
    })
}

const fetchAllProduct = () => {
    return axios.get('/api/v1/products')
}

const createProduct = (formData) => {
    return axios.post('/api/v1/products', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}

const updateProduct = (maSanPham, formData) => {
    return axios.put(`/api/v1/products/${encodeURIComponent(maSanPham)}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}

const deleteProduct = (maSanPham) => {
    return axios.delete(`/api/v1/products/${encodeURIComponent(maSanPham)}`);
}

const verifyUserCode = (email, code) => {
    return axios.post(`/api/v1/verify-user`, {email, code})
}

const addToCart = (product) => {
    return axios.post(`/api/v1/carts/add`, product)
}

const getAllCart = () => {
    return axios.get(`/api/v1/carts`)
}

const createOrder = (orderData) => {
    return axios.post(`/api/v1/orders`, orderData)
}

const getOrderById = (id) => {
    return axios.get(`/api/v1/orders/${id}`)
}

const createPaymentUrl = ({ maDonHang: id }) => {
    return axios.post('/api/v1/create-payment-url', { maDonHang: id })
}

export {
    registerNewUser, createProduct, updateProduct, verifyUserCode, userLogin, addToCart, getAllCart, fetchAllProduct, deleteProduct, createOrder, getOrderById,
    createPaymentUrl
}