import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import Header from '../../components/Header';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

const Home = () => {
    const navigate = useNavigate(); 

    const handleClick = () => {
        navigate("productdetail");
    };

    return (
        <>
            <Header />
            <div className={cx('main')}>
                <div className={cx('wrapper')}>
                    <div className={cx('side-bar')}></div>
                    <div className={cx('container')}>
                        <div className={cx('container-content')}>
                            <div className={cx('container-header')}>
                                <div className={cx('header-title')}>Gợi ý cho bạn</div>
                                <div className={cx('header-right')}>Xem tất cả</div>
                            </div>
                            <div className={cx('content')}>
                                <div className={cx('list-product')}>
                                    <div onClick={handleClick} className={cx('product')}>
                                        <img src='https://cdn.tgdd.vn/Products/Images/42/325799/redmi-13-yellow-thumb-600x600.jpg' alt='Ảnh sản phẩm'/>
                                        <div className={cx('product-name')}>
                                            Xiaomi Redmi 13 8GB/128GBXiaomi Redmi 13 8GB/128GBXiaomi Redmi 13 8GB/128GB
                                        </div>
                                        <div className={cx('info')}>
                                            <span className={cx('price')}>10.000.000đ</span>
                                            <span className={cx('sell-qty')}>Đã bán 4k</span>
                                        </div>
                                        <div className={cx('buy')}>
                                            <button>Mua ngay</button>
                                        </div>
                                    </div>
                                    <div className={cx('product')}>
                                        <img src='https://cdn.tgdd.vn/Products/Images/42/325799/redmi-13-yellow-thumb-600x600.jpg' alt='Ảnh sản phẩm'/>
                                        <div className={cx('product-name')}>
                                            Xiaomi Redmi 13 8GB/128GBXiaomi
                                        </div>
                                        <div className={cx('info')}>
                                            <span className={cx('price')}>10.000.000đ</span>
                                            <span className={cx('sell-qty')}>Đã bán 4k</span>
                                        </div>
                                        <div className={cx('buy')}>
                                            <button>Mua ngay</button>
                                        </div>
                                    </div>
                                    <div className={cx('product')}>
                                        <img src='https://cdn.tgdd.vn/Products/Images/42/325799/redmi-13-yellow-thumb-600x600.jpg' alt='Ảnh sản phẩm'/>
                                        <div className={cx('product-name')}>
                                            Xiaomi Redmi 13 8GB/128GBXiaomi Redmi 13 8GB/128GBXiaomi Redmi 13 8GB/128GB
                                        </div>
                                        <div className={cx('info')}>
                                            <span className={cx('price')}>10.000.000đ</span>
                                            <span className={cx('sell-qty')}>Đã bán 4k</span>
                                        </div>
                                        <div className={cx('buy')}>
                                            <button>Mua ngay</button>
                                        </div>
                                    </div>
                                    <div className={cx('product')}>
                                        <img src='https://cdn.tgdd.vn/Products/Images/42/325799/redmi-13-yellow-thumb-600x600.jpg' alt='Ảnh sản phẩm'/>
                                        <div className={cx('product-name')}>
                                            Xiaomi Redmi 13 8GB/128GBXiaomi Redmi 13 8GB/128GBXiaomi Redmi 13 8GB/128GB
                                        </div>
                                        <div className={cx('info')}>
                                            <span className={cx('price')}>10.000.000đ</span>
                                            <span className={cx('sell-qty')}>Đã bán 4k</span>
                                        </div>
                                        <div className={cx('buy')}>
                                            <button>Mua ngay</button>
                                        </div>
                                    </div>
                                    <div className={cx('product')}>
                                        <img src='https://cdn.tgdd.vn/Products/Images/42/325799/redmi-13-yellow-thumb-600x600.jpg' alt='Ảnh sản phẩm'/>
                                        <div className={cx('product-name')}>
                                            Xiaomi Redmi 13 8GB/128GBXiaomi Redmi 13 8GB/128GBXiaomi Redmi 13 8GB/128GB
                                        </div>
                                        <div className={cx('info')}>
                                            <span className={cx('price')}>10.000.000đ</span>
                                            <span className={cx('sell-qty')}>Đã bán 4k</span>
                                        </div>
                                        <div className={cx('buy')}>
                                            <button>Mua ngay</button>
                                        </div>
                                    </div>
                                    <div className={cx('product')}>
                                        <img src='https://cdn.tgdd.vn/Products/Images/42/325799/redmi-13-yellow-thumb-600x600.jpg' alt='Ảnh sản phẩm'/>
                                        <div className={cx('product-name')}>
                                            Xiaomi Redmi 13 8GB/128GBXiaomi Redmi 13 8GB/128GBXiaomi Redmi 13 8GB/128GB
                                        </div>
                                        <div className={cx('info')}>
                                            <span className={cx('price')}>10.000.000đ</span>
                                            <span className={cx('sell-qty')}>Đã bán 4k</span>
                                        </div>
                                        <div className={cx('buy')}>
                                            <button>Mua ngay</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Home;