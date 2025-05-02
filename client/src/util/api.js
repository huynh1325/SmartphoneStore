import axios from "./axios.customize";

const registerNewUser = (name, gender, email, phone, provinceName, districtName, wardName ,street, password, confirmPassword) => {
    return axios.post('/api/v1/register', {
        name, gender, email, phone, provinceName, districtName, wardName ,street, password, confirmPassword
    })
}

const fetchAllProduct = () => {
    return axios.get('/api/v1/getproduct')
}

const addProduct = (name, os, description, ram, rom, inch, price, country, brand, discount, image) => {
    return axios.post('/api/v1/addproduct', {
        name, os, description, ram, rom, inch, price, country, brand, discount, image
    })
}


export {
    registerNewUser, addProduct, fetchAllProduct
}