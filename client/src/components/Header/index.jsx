import classNames from 'classnames/bind';
import styles from './Header.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCartShopping, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
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
        <div className={cx('header')}>
            <div className={cx('logo')}>SmartphoneStore</div>
            <div className={cx('search')}>
                <FontAwesomeIcon icon={faMagnifyingGlass} className={cx('search-icon')} />
                <input type='text' placeholder='Tìm kiếm' className={cx('search-input')}/>
                <button className={cx('search-btn')}>
                    Tìm kiếm
                </button>
            </div>
            <button className={cx('home')}>Trang chủ
                <FontAwesomeIcon icon={faCartShopping} className={cx('home-icon')}/>
            </button>
            <button className={cx('cart')}>Giỏ hàng
                <FontAwesomeIcon icon={faCartShopping} className={cx('cart-icon')}/>
            </button>
            <button onClick={openModal}  className={cx('account')}>Đăng nhập
                <FontAwesomeIcon icon={faUser} className={cx('account-icon')}/>
            </button>

            <Login modalLogin={modalLogin} onClose={closeModal} />
        </div>
    )
}

export default Header;