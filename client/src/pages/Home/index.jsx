import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import Header from '../../components/Header';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Product from '../../models/Product';

const cx = classNames.bind(styles);

const Home = () => {
    const navigate = useNavigate();
    
    const [products, setProducts] = useState([]);
    
    const [modalProduct, setModalProduct] = useState(false);

    const openModalProduct = () => {
        setModalProduct(true);
    };

    const closeModalProduct = () => {
        setModalProduct(false);
        fetchProducts(); 
    };

    const handleClick = () => {
        navigate("productdetail");
    };

    const fetchProducts = useCallback(async () => {
        try {
            const response = await fetch('http://localhost:8080/api/v1/products');
            const result = await response.json();
            if (result.EC === 0) {
                setProducts(result.DT);
            } else {
                console.error('Lỗi API:', result.EM);
            }
        } catch (error) {
            console.error('Lỗi fetch:', error);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

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
                                    {/* <div onClick={handleClick} className={cx('product')}>
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
                                    </div> */}
                                    {products.map((product) => {
                                        const originalPrice = parseFloat(product.price);
                                        const discountedPrice = originalPrice * (1 - product.discount / 100);
                                        return (
                                            <div key={product.id} onClick={handleClick} className={cx('product')}>
                                                <img 
                                                    src={`http://localhost:8080${product.image}`}
                                                    alt='Ảnh sản phẩm'
                                                />
                                                <div className={cx('product-name')}>
                                                    {product.name}
                                                </div>
                                                <div className={cx('info')}>
                                                    <span className={cx('ram-rom')}>{product.ram} - {product.rom}</span>
                                                    <span className={cx('inch')}>{product.inch}"</span>
                                                </div>
                                                <div className={cx('price')}>
                                                    <span className={cx('origin-price')}>
                                                        {originalPrice.toLocaleString('vi-VN')}đ
                                                    </span>
                                                    <span className={cx('discount')}>
                                                        {Math.round(discountedPrice).toLocaleString('vi-VN')}đ
                                                    </span>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                                <button onClick={openModalProduct}>Thêm sản phẩm</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Product modalProduct={modalProduct} onClose={closeModalProduct}/>
        </>
    )
}

export default Home;