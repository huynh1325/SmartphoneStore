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
                                            Xiaomi Redmi 13 8GB/128GBXiaomi
                                        </div>
                                        <div className={cx('info')}>
                                            <span className={cx('ram-rom')}>8GB - 512GB</span>
                                            <span className={cx('inch')}>6.3''</span>
                                        </div>
                                        <div className={cx('price')}>
                                            <span className={cx('origin-price')}>13.000.000đ</span>
                                            <span className={cx('discount')}>10.000.000đ</span>
                                        </div>
                                    </div>
                                    <div onClick={handleClick} className={cx('product')}>
                                        <img src='https://cdn.tgdd.vn/Products/Images/42/325799/redmi-13-yellow-thumb-600x600.jpg' alt='Ảnh sản phẩm'/>
                                        <div className={cx('product-name')}>
                                            Xiaomi Redmi 13 8GB/128GBXiaomi
                                        </div>
                                        <div className={cx('info')}>
                                            <span className={cx('ram-rom')}>8GB - 512GB</span>
                                            <span className={cx('inch')}>6.3''</span>
                                        </div>
                                        <div className={cx('price')}>
                                            <span className={cx('origin-price')}>13.000.000đ</span>
                                            <span className={cx('discount')}>10.000.000đ</span>
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