require("dotenv").config();
const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    if (req?.headers?.authorization?.split(' ')?.[1]) {
        const token = req.headers.authorization.split(' ')[1];
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET,);
            req.user = {
                id: decoded.id,
                email: decoded.email,
                name: decoded.name,
                phone: decoded.phone,
                createBy: "huynh"
            }
            next();
        } catch (error) {
            return res.status(401).json({
                message: "Token hết hạn hoặc kh hợp lệ"
            })
        }
    } else {
        return res.status(401).json({
            message: "Bạn chưa truyền Access Token ở header/Hoặc token bị hết hạn"
        })
    }
}

module.exports = auth;