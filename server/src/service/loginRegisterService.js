require('dotenv').config();
import db from '../models/index'
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid'
import path from 'path';
import fs from 'fs';
import handlebars from 'handlebars';
import jwt from 'jsonwebtoken'
// import { getGroupWithRoles } from './JWTService'
// import { createJWT } from '../middleware/JWTAction'

const salt = bcrypt.genSaltSync(10);

const sendEmailWithTemplate = async (email, name, codeId) => {
    try {
        const templatePath = path.join(__dirname, '..', 'mail', 'templates', 'register.hbs');
        const source = fs.readFileSync(templatePath, 'utf8');
        const template = handlebars.compile(source);
        const htmlContent = template({ name, codeId });
        
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASSWORD
            }
        });
        
        const mailOptions = {
            from: process.env.MAIL_USER,
            to: email,
            subject: 'Xác thực tài khoản',
            html: htmlContent
        };
        
        await transporter.sendMail(mailOptions);


    } catch (err) {
        console.error("Gửi email thất bại:", err.message);
        throw err;
    }
};

const generate6DigitCode = () => {
    const uuid = uuidv4();
    const numbersOnly = uuid.replace(/\D/g, '');
    const sixDigits = numbersOnly.slice(0, 6);
    return sixDigits;
};

const hashUserPassword = (userPassword) => {
    let hashPassword = bcrypt.hashSync(userPassword, salt);
    return hashPassword;
}

const checkEmailExist = async (userEmail) => {
    let user = await db.NguoiDung.findOne({
        where: {email: userEmail}
    })

    if (user) {
        return true;
    }
    return false;
}

const checkPhoneExist = async (userPhone) => {
    let user = await db.NguoiDung.findOne({
        where: {soDienThoai: userPhone}
    })

    if (user) {
        return true;
    }
    return false;
}

const registerNewUser = async (rawUserData) => {

    const codeId = generate6DigitCode();

    try {

        let isEmailExist = await checkEmailExist(rawUserData.email);
        if (isEmailExist === true) {
            return {
                EM: 'Email đã tồn tại',
                EC: 1
            }
        }
        let isPhoneExist = await checkPhoneExist(rawUserData.phone);
        if (isPhoneExist === true) {
            return {
                EM: 'Số điện thoại đã tồn tại',
                EC: 1
            }
        }
    
        let hashPassword = hashUserPassword(rawUserData.password);
        
        await db.NguoiDung.create({
            email: rawUserData.email,
            matKhau: hashPassword,
            soDienThoai: rawUserData.phone,
            xacThuc: false,
            tenNguoiDung: rawUserData.name,
            gioiTinh: rawUserData.gender,
            maXacThuc: codeId,
            vaiTro: 'Khách hàng'
        })

        sendEmailWithTemplate(rawUserData.email, rawUserData.name, codeId);

        return {
            EM: 'Đăng ký thành công!',
            EC: 0
        }
    } catch (e) {
        console.log(e.message)
        return {
            EM: 'Something wrongs in service...',
            EC: -2
        }
    }
}

const checkPassword = (inputPassword, hashPassword) => {
    return bcrypt.compareSync(inputPassword, hashPassword);
}

const loginService = async (email, password) => {
    try {
        console.log(email, password)
        const user = await db.NguoiDung.findOne({
            where: { email: email }
        });
        if (!user.xacThuc) {
            return {
                EC: 3,
                EM: "Tài khoản chưa được xác thực. Vui lòng kiểm tra email để xác minh tài khoản."
            };
        }
        if (user) {
            const isMatchPassword = await checkPassword(password, user.matKhau);
            if (!isMatchPassword) {
                return {
                    EC: 2,
                    EM: "Email/Password không hợp lệ"
                }
            } else {
                const payload = {
                    id: user.maNguoiDung,
                    email: user.email,
                    name: user.tenNguoiDung,
                    role: user.vaiTro
                }
                const access_token = jwt.sign(
                    payload,
                    process.env.JWT_SECRET,
                    {
                        expiresIn: process.env.JWT_EXPIRE
                    }
                );
                return {
                    EC: 0,
                    access_token,
                    user: {
                        email: user.email,
                        name: user.tenNguoiDung,
                        role: user.vaiTro
                    }
                }
            }
        } else {
            return {
                EC: 1,
                EM: "Email/Password không hợp lệ"
            }
        }
    } catch (error) {
        console.log(error);
        return {
            EM: 'Something wrongs in service...',
            EC: -2
        }
    }
}

const verifyUser = async (rawData) => {
    try {

        const user = await db.NguoiDung.findOne({
            where: {
                email: rawData.email,
                maXacThuc: rawData.code
            }
        })
        
        if (!user) {
            return {
                EM: 'Người dùng không tồn tại',
                EC: 1
            }
        }

        await db.NguoiDung.update (
            {
                xacThuc: true,
            },
            {
                where: { email: rawData.email }
            }
        )
        
        return {
            EM: 'Xác thực tài khoản thành công',
            EC: 0
        }
        
    }

    catch (e) {
        console.log(e);
        return {
            EM: 'Có lỗi xảy ra khi xác thực tài khoản',
            EC: -2
        }
    }
}

module.exports = {
    registerNewUser, loginService, hashUserPassword, checkEmailExist, checkPhoneExist, verifyUser
}