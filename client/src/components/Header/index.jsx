import classNames from 'classnames/bind';
import styles from './Header.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCartShopping, faHouse, faMagnifyingGlass, faArrowDown} from '@fortawesome/free-solid-svg-icons';
import Login from '../Login';
import { useState } from 'react';

const cx = classNames.bind(styles);

const Header = () => {

    const [modalLogin, setModalLogin] = useState(false);

    const openModal = () => {
        setModalLogin(true);
    };

    const closeModal = () => {
        setModalLogin(false);
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
                <button onClick={openModal}  className={cx('account')}>
                    <FontAwesomeIcon icon={faUser} className={cx('account-icon')}/>
                    <span>Tài khoản</span>
                    <FontAwesomeIcon icon={faArrowDown} className={cx('down-icon')}/>
                    <div className={cx('account-option')}>
                        <ul>
                            <li>Đăng nhập</li>
                            <li>Đăng ký</li>
                        </ul>
                    </div>
                </button>
                <Login modalLogin={modalLogin} onClose={closeModal} />
            </div>
            <div className={cx('header-list')}>
                <ul>
                    <li>Samsung</li>
                    <li>Iphone</li>
                    <li>Xiaomi</li>
                    <li>Oppo</li>
                    <li>Vivo</li>
                </ul>
            </div>
        </div>
    )
}

export default Header;