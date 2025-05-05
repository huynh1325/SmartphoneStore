import styles from './Login.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const Login = (props) => {
    
    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            props.onClose();
        }
    };

    if (!props.modalLogin) return null;

    return (
        <div className={cx('overlay')} onClick={handleOverlayClick}>
            <div className={cx('wrapper')}>
                <div className={cx('login')}>
                    <div className={cx('heading')}>
                        <h4>Đăng nhập</h4>
                    </div>
                    <div className={cx('input')}>
                        <input placeholder="Nhập email" type="text" className={cx('login-input')} />
                        <input placeholder="Nhập mật khẩu" type="password" className={cx('login-input')} />
                    </div>
                    <span>Quên mật khẩu</span>
                    <button className={cx('login-btn')}>Tiếp tục</button>
                    <span>Bạn chưa có tài khoản? <a>Đăng ký</a> ngay!</span>
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