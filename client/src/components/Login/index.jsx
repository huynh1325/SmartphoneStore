import { useState, useContext } from 'react';
import styles from './Login.module.scss';
import classNames from 'classnames/bind';
import { userLogin } from '../../util/api';
import { AuthContext } from '../Context/auth.context';
import { toast } from 'react-toastify';

const cx = classNames.bind(styles);

const Login = (props) => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { auth, setAuth } = useContext(AuthContext);

    // console.log("auth", auth)
    const switchToRegister = () => {
        props.onClose();
        props.openRegister();
    };

    const handleLogin = async () => {
        try {
            let res = await userLogin(email, password);
            if (+res.EC === 0) {
                localStorage.setItem("access_token", res.access_token);
                localStorage.setItem("user", JSON.stringify(res.user)); 
                toast.success("Đăng nhập thành công");
                props.onClose();
                setAuth({
                    isAuthenticated: true,
                    user: {
                        email: res?.user?.email ?? "",
                        name: res?.user?.name ?? "",
                        role: res?.user?.role ?? ""
                    }
            })
            } else {
                toast.error(res.EM);
            }
        } catch (e) {
            console.error(e);
        }
    }

    if (!props.modalLogin) return null;

    return (
        <div className={cx('overlay')}>
            <div className={cx('wrapper')}>
                <div className={cx('login')}>
                    <div className={cx('heading')}>
                        <h4>Đăng nhập</h4>
                    </div>
                    <div className={cx('input')}>
                        <input
                            placeholder="Nhập email"
                            type="text" 
                            value={email} onChange={(e) => {setEmail(e.target.value)}}
                            className={cx('login-input')} />
                        <input
                            placeholder="Nhập mật khẩu"
                            type="password"
                            value={password} onChange={(e) => {setPassword(e.target.value)}}
                            className={cx('login-input')}
                        />
                    </div>
                    <p className={cx("forgot-password")}>Quên mật khẩu</p>
                    <button className={cx('login-btn')} onClick={handleLogin}>Đăng nhập</button>
                    <p className={cx('register-redirect')}>Bạn chưa có tài khoản?
                        <a onClick={switchToRegister}> Đăng ký</a> ngay!</p>
                </div>
                <div className={cx('login-img')}>
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

export default Login;