import loginRegisterService from '../service/loginRegisterService'

const handleRegister = async (req, res) => {
    try {
        if (!req.body.email || !req.body.phone || !req.body.password ) {
            return res.status(200).json({
                EM: 'Missing required parameters',
                EC: '1',
                DT: ''
            })
        }

        if (req.body.password && req.body.password.length < 7) {
            return res.status(200).json({
                EM: 'Your password mush have more than 6 letters',
                EC: '1',
                DT: '' 
            })
        }

        let data = await loginRegisterService.registerNewUser(req.body)

        return res.status(200).json({
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

    const data = { ...req.body };
    console.log(data)
    try {

        await loginRegisterService.handleVerifyUser(data);
        return res.status(200).json({
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

module.exports = {
    handleRegister, handleVerifyUser
}