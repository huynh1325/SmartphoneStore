import classNames from 'classnames/bind';
import styles from './Header.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCartShopping, faHouse, faMagnifyingGlass, faArrowDown} from '@fortawesome/free-solid-svg-icons';
import Login from '../Login';
import Register from '../Register';
import VerifyUser from '../VerifyUser'
import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCart } from '../../components/Context/CartContext';
import { fetchProductByName } from '../../util/api';

const cx = classNames.bind(styles);

const Header = () => {
    const navigate = useNavigate();
    const [modalLogin, setModalLogin] = useState(false);    
    const [modalRegister, setModalRegister] = useState(false);
    const [modalVerifyUser, setModalVerifyUser] = useState(false);
    const [email, setEmail] = useState("");
    const [searchText, setSearchText] = useState("");

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

    const handleSearch = async () => {
        if (!searchText.trim()) {
            toast.warn("Vui lòng nhập từ khóa tìm kiếm!");
            return;
        }

        try {
            const response = await fetchProductByName(searchText);
            if (response.EC === 0) {
                navigate('/search', { state: { products: response.DT, searchText } });
            } else {
                toast.error(response.EM || "Không tìm thấy sản phẩm.");
            }
        } catch (error) {
            console.error("Lỗi tìm kiếm:", error);
            toast.error("Lỗi khi tìm kiếm sản phẩm");
        }
    };

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
                phone: "",
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
        if (!auth.isAuthenticated) {
            toast.warn("Vui lòng đăng nhập để xem giỏ hàng!");
            return;
        }
        navigate("/cart");
    }

    const purchaseRedirect = () => {
        navigate("/purchase");
    }

    return (
        <div>
            <div className={cx('header')}>
                <div className={cx('logo')} onClick={homeRedirect}>SmartphoneStore</div>
                <div className={cx('search')}>
                    <FontAwesomeIcon icon={faMagnifyingGlass} className={cx('search-icon')} />
                    <input
                        type='text'
                        placeholder='Tìm kiếm'
                        className={cx('search-input')}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSearch();
                        }}
                    />
                    <button className={cx('search-btn')} onClick={handleSearch}>
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
                                <li onClick={purchaseRedirect}>Đơn mua</li>
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