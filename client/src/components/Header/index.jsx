import classNames from 'classnames/bind';
import styles from './Header.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCartShopping, faHouse, faMagnifyingGlass, faArrowDown} from '@fortawesome/free-solid-svg-icons';
import Login from '../Login';
import Register from '../Register';
import VerifyUser from '../VerifyUser'
import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../Context/auth.context';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCart } from '../../components/Context/CartContext';

const cx = classNames.bind(styles);

const Header = () => {

    const navigate = useNavigate();
    const [modalLogin, setModalLogin] = useState(false);    
    const [modalRegister, setModalRegister] = useState(false);
    const [modalVerifyUser, setModalVerifyUser] = useState(false);
    const [email, setEmail] = useState("");

    const { auth, setAuth } = useContext(AuthContext);
    const { cartItems, clearCart, fetchCart } = useCart();

    useEffect(() => {
        if (auth.isAuthenticated) {
            fetchCart();
        } else {
            clearCart();
        }
    }, [auth.isAuthenticated]);
    
    const totalQuantity = cartItems.reduce((total, item) => {
        return total + (item.soLuong || 1);
    }, 0);

    const lastName = (name) => {
        const nameParts = name.split(" ");
        const lastName = nameParts[nameParts.length - 1];
        return lastName;
    }

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

    const handleLogout = () => {
        localStorage.clear("access_token");
        setAuth({
            isAuthenticated: false,
            user: {
                email: "",
                name: "",
                role: ""
            }
        })
        toast.success("Đăng xuất thành công");
        clearCart();
        navigate("/");
    }

    const homeRedirect = () => {
        navigate("/");
    }

    const cartRedirect = () => {
        navigate("/cart");
    }


    return (
        <div>
            <div className={cx('header')}>
                <div className={cx('logo')} onClick={homeRedirect}>SmartphoneStore</div>
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
                <button className={cx('cart')} onClick={cartRedirect}>
                    <FontAwesomeIcon icon={faCartShopping} className={cx('cart-icon')}/>
                    <span>Giỏ hàng</span>
                    <span className={cx('cart-number-badge')}>{totalQuantity}</span>
                </button>
                <button className={cx('account')}>
                    <FontAwesomeIcon icon={faUser} className={cx('account-icon')}/>
                    {auth.isAuthenticated ? (
                        <span>
                            {lastName(auth.user.name)}
                        </span>
                    ) : (
                        <span>
                            Tài khoản
                        </span>
                    )}
                    <FontAwesomeIcon icon={faArrowDown} className={cx('down-icon')}/>
                    <div className={cx('account-option')}>
                        {auth.isAuthenticated ? (
                            <ul>
                                <li>Trang cá nhân</li>
                                <li onClick={handleLogout}>Đăng xuất</li>
                            </ul>
                        ) : (
                            <ul>
                                <li onClick={openModalLogin}>Đăng nhập</li>
                                <li onClick={openModalRegister}>Đăng ký</li>
                            </ul>
                        )}
                    </div>
                </button>
            </div>
            <Login
                modalLogin={modalLogin}
                onClose={closeModalLogin}
                openRegister={openModalRegister}
            />
            <Register
                modalRegister={modalRegister}
                onClose={closeModalRegister}
                openLogin={openModalLogin}
                openVerifyUser={openModalVerifyUser}
                setEmail={setEmail} 
            />
            <VerifyUser
                modalVerifyUser={modalVerifyUser}
                onClose={closeModalVerifyUser}
                openLogin={openModalLogin}
                openRegister={openModalRegister}
                email={email}
            />
        </div>
    )
}

export default Header;