require('dotenv').config();
import db from '../models/index'
import bcrypt from 'bcryptjs';
import { Op } from 'sequelize';
import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid'
// import { getGroupWithRoles } from './JWTService'
// import { createJWT } from '../middleware/JWTAction'

const salt = bcrypt.genSaltSync(10);

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
    },
});


const hashUserPassword = (userPassword) => {
    let hashPassword = bcrypt.hashSync(userPassword, salt);
    return hashPassword;
}

const checkEmailExist = async (userEmail) => {
    let user = await db.User.findOne({
        where: {email: userEmail}
    })

    if (user) {
        return true;
    }
    return false;
}

// const mailOptions = {
//     from: "your_email@gmail.com",
//     to: "recipient@example.com",
//     subject: "Xác nhận đăng ký",
//     text: "Cảm ơn bạn đã đăng ký!",
//     // html: "<h1>Chào mừng!</h1>" // nếu bạn muốn gửi HTML
//   };

// Gửi email
//   transporter.sendMail(mailOptions, function (error, info) {
//     if (error) {
//       console.log("Lỗi gửi email: ", error);
//     } else {
//       console.log("Email đã được gửi: " + info.response);
//     }
//   });

// async function main() {
//     const info = transporter.sendMail({
//       from: '"Maddison Foo Koch " <maddison53@ethereal.email>',
//       to: "bar@example.com, baz@example.com",
//       subject: "Hello ✔",
//       text: "Hello world?",
//       html: "<b>Hello world?</b>",
//     });

//     console.log("Message sent: %s", info.messageId);
// }

const checkPhoneExist = async (userPhone) => {
    let user = await db.User.findOne({
        where: {phone: userPhone}
    })

    if (user) {
        return true;
    }
    return false;
}

const registerNewUser = async (rawUserData) => {

    const codeId = uuidv4();

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
    
        // let checkPassword = (password, confirmPassword) => {
        //     return password === confirmPassword
        // }
        // console.log(checkPassword)
        let hashPassword = hashUserPassword(rawUserData.password);
        
        await db.User.create({
            email: rawUserData.email,
            password: hashPassword,
            phone: rawUserData.phone,
            name: rawUserData.name,
            gender: rawUserData.gender,
            province: rawUserData.provinceName,
            district: rawUserData.districtName,
            ward: rawUserData.wardName,
            street: rawUserData.street
        })
    
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: rawUserData.email,
            subject: "Chào mừng bạn đến với hệ thống!",
            html: `<h2>Xin chào ${rawUserData.name},</h2><p>Cảm ơn bạn đã đăng ký tài khoản!</p>
            Code: ${codeId}`,
        };
        
        try {
            await transporter.sendMail(mailOptions);
        } catch (error) {
            console.error("Lỗi gửi email:", error);
        }

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
        let user = await db.User.findOne({
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

module.exports = {
    registerNewUser, handleUserLogin, hashUserPassword, checkEmailExist, checkPhoneExist
}