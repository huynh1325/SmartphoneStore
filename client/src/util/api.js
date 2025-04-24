import axios from "./axios.customize";

const registerNewUser = (name, username, gender, email, phone, provinceName, districtName, wardName ,street, password, confirmPassword) => {
    return axios.post('/api/v1/register', {
        name, username, gender, email, phone, provinceName, districtName, wardName ,street, password, confirmPassword
    })
}


export {
    registerNewUser
}