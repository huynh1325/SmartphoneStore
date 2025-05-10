import styles from './Register.module.scss';
import classNames from 'classnames/bind';
import { useState } from 'react';
import { registerNewUser } from '../../util/api';
import { toast } from "react-toastify";

const cx = classNames.bind(styles);

const Register = (props) => {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [gender, setGender] = useState('');

    const switchToLogin = () => {
        props.onClose();
        props.openLogin();
    };

    const handleRegister = async () => {
        try {
            let serverData = await registerNewUser(name, gender, email, phone, password);
            if (+serverData.EC === 0) {
                toast.info("Nhập mã xác thực");
                props.setEmail(email);
                props.onClose();
                props.openVerifyUser();
            } else {
                toast.error(serverData.EM);
            }
        } catch (e) {
            console.error(e);
        }
    }

    if (!props.modalRegister) return null;

    return (
        <div className={cx('overlay')}>
            <div className={cx('wrapper')}>
                <div className={cx('register')}>
                    <div className={cx('heading')}>
                        <h4>Đăng ký</h4>
                    </div>
                    <div className={cx('input')}>
                        <input
                            placeholder="Họ và tên"
                            type="text"
                            className={cx('register-input')}
                            value={name} onChange={(e) => {setName(e.target.value)}}
                        />
                        <div className={cx('form-group-radio')}>
                            <span>Giới tính: </span>
                            <input
                                className={cx('genderMale')}
                                type="radio"
                                name="gender"
                                value="Nam"
                                id="genderMale"
                                checked={gender === 'Nam'}
                                onChange={(e) => setGender(e.target.value)}
                            />
                            <label htmlFor="genderMale">Nam</label>
                            <input
                                type="radio"
                                value="Nữ"
                                id="genderFemale"
                                checked={gender === 'Nữ'}
                                onChange={(e) => setGender(e.target.value)}
                            />
                            <label htmlFor="genderFemale">Nữ</label>
                        </div>
                        <input
                            placeholder="Email"
                            type="text"
                            className={cx('register-input')}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            placeholder="Số điện thoại"
                            type="text"
                            className={cx('register-input')}
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                        <input
                            placeholder="Mật khẩu"
                            type="password"
                            className={cx('register-input')}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button
                        className={cx('register-btn')}
                        onClick={() => handleRegister()}
                    >
                        Tiếp tục
                    </button>
                    <p className={cx('login-redirect')}>Bạn đã có tài khoản?
                        <a onClick={switchToLogin}> Đăng nhập </a>
                        ngay!
                    </p>
                </div>
                <div className={cx('register-img')}>
                    <img
                        src="https://salt.tikicdn.com/ts/upload/eb/f3/a3/25b2ccba8f33a5157f161b6a50f64a60.png"
                        alt="img"
                    />
                </div>
                <button className={cx('btn-close')} onClick={props.onClose}>
                    <img
                        src="https://salt.tikicdn.com/ts/upload/fe/20/d7/6d7764292a847adcffa7251141eb4730.png"
                        alt="close"
                    />
                </button>
            </div>
        </div> 
    )
}

export default Register;