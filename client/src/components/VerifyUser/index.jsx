import styles from './VerifyUser.module.scss';
import classNames from 'classnames/bind';
import { useState } from 'react';
import { toast } from "react-toastify";

const cx = classNames.bind(styles);

const VerifyUser = (props) => {
    
    const [code, setCode] = useState("");

    const handleVerify = async () => {
        
    }
    
    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            props.onClose();
        }
    };

    if (!props.modalVerifyUser) return null;

    return (
        <div className={cx('overlay')} onClick={handleOverlayClick}>
            <div className={cx('wrapper')}>
                <div className={cx('verifyuser')}>
                    <div className={cx('heading')}>
                        <h4>Xác thực tài khoản</h4>
                    </div>
                    <div className={cx('input')}>
                        <input
                            placeholder="Nhập mã code"
                            type="text"
                            className={cx('verifyuser-input')}
                            value={code} onChange={(e) => {setCode(e.target.value)}}
                        />
                    </div>
                    <button
                        className={cx('verify-btn')}
                        onClick={() => handleVerify()}
                    >
                        Tiếp tục
                    </button>
                    <span className={cx('login-redirect')}>Bạn đã có tài khoản?
                        <a onClick={switchToLogin}> Đăng nhập </a>
                        ngay!
                    </span>
                </div>
                <div className={cx('verifyuser-img')}>
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

export default VerifyUser;