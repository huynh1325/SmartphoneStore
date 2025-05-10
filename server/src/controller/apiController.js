import loginRegisterService from '../service/loginRegisterService'

const handleRegister = async (req, res) => {
    try {
        if (!req.body.email || !req.body.phone || !req.body.password ) {
            return res.status(400).json({
                EM: 'Missing required parameters',
                EC: '1',
                DT: ''
            })
        }

        if (req.body.password && req.body.password.length < 7) {
            return res.status(400).json({
                EM: 'Mật khẩu phải có ít nhất 7 kí tự',
                EC: '1',
                DT: '' 
            })
        }

        let data = await loginRegisterService.registerNewUser(req.body)

        return res.status(201).json({
            EM: data.EM,
            EC: data.EC,
            DT: ''
        })

    } catch (e) {
        return res.status(500).json({
            EM: 'error from server',
            EC: '-1',
            DT: ''
        })
    }
}

const handleVerifyUser = async (req, res) => {

    const data = { ...req.body.email };
    try {
        const result = await loginRegisterService.verifyUser(data);
        return res.status(200).json({
            EM: result.EM,
            EC: result.EC,
            DT: ''
        })
        
    } catch (e) {
        return res.status(500).json({
            EM: 'error from server',
            EC: '-1',
            DT: ''
        })
    }
}


const handleLogin = async (req, res) => {
    const {email, password} = req.body;
    const data = await loginRegisterService.loginService(email, password);
    return res.status(200).json(data);
}

module.exports = {
    handleRegister, handleVerifyUser, handleLogin
}