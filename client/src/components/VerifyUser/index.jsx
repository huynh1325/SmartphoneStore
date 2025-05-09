import styles from './VerifyUser.module.scss';
import classNames from 'classnames/bind';
import { useState } from 'react';
import { toast } from "react-toastify";
import { verifyUserCode } from "../../util/api";

const cx = classNames.bind(styles);

const VerifyUser = (props) => {
    
    const [code, setCode] = useState("");

    const handleVerify = async () => {
        if (!code) {
            toast.warning("Vui lòng nhập mã xác thực");
            return;
        }
    
        try {
            console.log({email: props.email, code})
            const res = await verifyUserCode({email: props.email, code});
            if (+res.EC === 0) {
                toast.success(res.EM);
                props.onClose();
            } else {
                toast.error(res.EM);
            }
        } catch (error) {
            toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
        }
    }

    if (!props.modalVerifyUser) return null;

    return (
        <div className={cx('overlay')}>
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
                    <p className={cx('login-redirect')}>Bạn đã có tài khoản?
                        <a
                            // onClick={switchToLogin}
                        > Đăng nhập </a>
                        ngay!
                    </p>
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