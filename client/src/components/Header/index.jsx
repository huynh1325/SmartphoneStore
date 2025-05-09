import classNames from 'classnames/bind';
import styles from './Header.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCartShopping, faHouse, faMagnifyingGlass, faArrowDown} from '@fortawesome/free-solid-svg-icons';
import Login from '../Login';
import Register from '../Register';
import VerifyUser from '../VerifyUser'
import { useState } from 'react';

const cx = classNames.bind(styles);

const Header = () => {

    const [modalLogin, setModalLogin] = useState(false);    
    const [modalRegister, setModalRegister] = useState(false);
    const [modalVerifyUser, setModalVerifyUser] = useState(false);

    const openModalLogin = () => {
        setModalLogin(true);
    };

    const closeModalLogin = () => {
        setModalLogin(false);
    };

    const openModalRegister = () => {
        setModalRegister(true);
    };

    const closeModalRegister = () => {
        setModalRegister(false);
    };

    const openModalVerifyUser = () => {
        setModalVerifyUser(true);
    };

    const closeModalVerifyUser = () => {
        setModalVerifyUser(false);
    };

    return (
        <div>
            <div className={cx('header')}>
                <div className={cx('logo')}>SmartphoneStore</div>
                <div className={cx('search')}>
                    <FontAwesomeIcon icon={faMagnifyingGlass} className={cx('search-icon')} />
                    <input type='text' placeholder='Tìm kiếm' className={cx('search-input')}/>
                    <button className={cx('search-btn')}>
                        Tìm kiếm
                    </button>
                </div>
                <button className={cx('home')}>
                    <FontAwesomeIcon icon={faHouse} className={cx('home-icon')}/>
                    <span>Trang chủ</span>
                </button>
                <button className={cx('cart')}>
                    <FontAwesomeIcon icon={faCartShopping} className={cx('cart-icon')}/>
                    <span>Giỏ hàng</span>
                </button>
                <button className={cx('account')}>
                    <FontAwesomeIcon icon={faUser} className={cx('account-icon')}/>
                    <span>Tài khoản</span>
                    <FontAwesomeIcon icon={faArrowDown} className={cx('down-icon')}/>
                    <div className={cx('account-option')}>
                        <ul>
                            <li onClick={openModalLogin}>Đăng nhập</li>
                            <li onClick={openModalRegister}>Đăng ký</li>
                        </ul>
                    </div>
                </button>
            </div>
            <Login modalLogin={modalLogin} onClose={closeModalLogin}/>
            <Register modalRegister={modalRegister} onClose={closeModalRegister} openLogin={openModalLogin} openVerifyUser={openModalVerifyUser}/>
            <VerifyUser modalVerifyUser={modalVerifyUser} onClose={closeModalVerifyUser}/>
        </div>
    )
}

export default Header;