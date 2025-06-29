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

//user
const updateUserInfo = (data) => {
    return axios.put(`/api/v1/update-user`, data);
};


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

// cart
const addToCart = (product) => {
    return axios.post(`/api/v1/carts/add`, product)
}

const getAllCart = () => {
    return axios.get(`/api/v1/carts`)
}

const deleteFromCart = (maChiTietGioHang) => {
    return axios.delete(`/api/v1/carts/${maChiTietGioHang}`)
}

// order
const createOrder = (orderData) => {
    return axios.post(`/api/v1/orders`, orderData)
}

const updateOrderStatus = (maDonHang, trangThaiXuLy, trangThaiThanhToan) => {
    return axios.put(`/api/v1/orders/${maDonHang}`, {
        maDonHang,
        trangThaiXuLy,
        trangThaiThanhToan
    });
};

const getOrderById = (id) => {
    return axios.get(`/api/v1/orders/${id}`)
}

const getOrderByUser = () => {
    return axios.get(`/api/v1/orders`)
}


const createPaymentUrl = ({ maDonHang: id }) => {
    return axios.post('/api/v1/create-payment-url', { maDonHang: id })
}

const fetchAllOrder = () => {
    return axios.get(`/api/v1/orders`)
}

const createAddress = () => {
    return axios.post(`/api/v1/address`)
}

const getAddressByUser = () => {
    return axios.get(`/api/v1/address`)
}

const fetctColorProduct = (id) => {
    return axios.get(`/api/v1/productcolor/${id}`)
}

const getVoucherByCode = (code) => {
    return axios.get(`/api/v1/vouchers/${encodeURIComponent(code)}`)
}

const fetchProductByName = (tenSanPham) => {
    return axios.get(`/api/v1/products/search`, {
        params: { tenSanPham }
    });
}

const fetchProductByBrand = (nhanHieu) => {
    return axios.get(`/api/v1/products/filter`, {
        params: { nhanHieu }
    });
}

const createReview = (reviewData) => {
    return axios.post(`/api/v1/review`, reviewData)
}

export {
    registerNewUser, createProduct, updateProduct, verifyUserCode, userLogin, addToCart, getAllCart, fetchAllProduct, deleteProduct, createOrder, getOrderById,
    createPaymentUrl, fetchAllOrder, createAddress, getAddressByUser, getOrderByUser, fetctColorProduct, getVoucherByCode, fetchProductByName, fetchProductByBrand,
    updateOrderStatus, deleteFromCart, updateUserInfo, createReview
}