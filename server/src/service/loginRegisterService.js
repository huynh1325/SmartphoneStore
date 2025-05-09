require('dotenv').config();
import db from '../models/index'
import bcrypt from 'bcryptjs';
import { Op } from 'sequelize';
import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid'
import path from 'path';
import fs from 'fs';
import handlebars from 'handlebars';
import { console } from 'inspector';
// import { getGroupWithRoles } from './JWTService'
// import { createJWT } from '../middleware/JWTAction'

const salt = bcrypt.genSaltSync(10);

const sendEmailWithTemplate = async (email, name, codeId) => {
    const templatePath = path.join(__dirname, '..', 'mail', 'templates', 'register.hbs');
    const source = fs.readFileSync(templatePath, 'utf8');
    const template = handlebars.compile(source);
    const htmlContent = template({ name, codeId });
    
    const transporter = nodemailer.createTransport({
        service: 'gmail',
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
            vaiTro: 'Khách hàng'
        })

        await sendEmailWithTemplate(rawUserData.email, rawUserData.name, codeId);

        return {
            EM: 'Đăng ký thành công!',
            EC: 0
        }
    } catch (e) {
        console.log(e)
        return {
            EM: 'Something wrongs in service...',
            EC: -2
        }
    }
}

const checkPassword = (inputPassword, hashPassword) => {
    return bcrypt.compareSync(inputPassword, hashPassword);
}

const handleUserLogin = async (rawData) => {
    try {
        let user = await db.NguoiDung.findOne({
            where: {
                [Op.or]: [
                    {email: rawData.valueLogin },
                    {phone: rawData.valueLogin }
                ]
            }
        })

        if (user) {
            let isCorrectPassword = checkPassword(rawData.password, user.password)
            if (isCorrectPassword === true) {

                let groupWithRoles = await getGroupWithRoles(user);
                let payload = {
                    email: user.email,
                    groupWithRoles,
                    username: user.username
                }
                let token = createJWT(payload);
                return {
                    EM: 'ok!',
                    EC: 0,
                    DT: {
                        access_token: token,
                        groupWithRoles,
                        email: user.email,
                        username: user.username
                    }
                }
            }
        }
        return {
            EM: 'Your email/phone number or password is incorrect!',
            EC: 1,
            DT: ''
        }
    } catch (error) {
        console.log(error)
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
                code: rawData.code
            }
        })
        
        if (!user) {
            return {
                EM: 'Mã xác thực không đúng hoặc người dùng không tồn tại',
                EC: 1
            }
        }

        await db.NguoiDung.update (
            {
                xacThuc: true,
            },
            {
                where: { email: data.email }
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
    registerNewUser, handleUserLogin, hashUserPassword, checkEmailExist, checkPhoneExist, verifyUser
}