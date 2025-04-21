import styles from './Register.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const Register = (props) => {
    
    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            props.onClose();
        }
    };

    if (!props.modalRegister) return null;

    return (
        <div className={cx('overlay')} onClick={handleOverlayClick}>
            <div className={cx('wrapper')}>
                <div className={cx('register')}>
                    <div className={cx('heading')}>
                        <h4>Xin chào,</h4>
                        <p>Đăng nhập hoặc tạo tài khoản</p>
                    </div>
                    <div className={cx('input')}>
                        <input placeholder="Nhập email" type="text" className={cx('register-input')} />
                        <input placeholder="Nhập mật khẩu" type="password" className={cx('register-input')} />
                    </div>
                    <button className={cx('register-btn')}>Tiếp tục</button>
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