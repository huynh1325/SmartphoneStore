import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import Header from '../../components/Header';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Product from '../../models/Product';
import Footer from '../../components/Footer';

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

    const imagesBanner = [
        "/image/banner1.jpg",
        "/image/banner2.jpg",
        "/image/banner3.jpg",
        "/image/banner4.jpg",
        "/image/banner5.png",
        "/image/banner6.jpg",
        "/image/banner7.jpg"
      ];
    
    const [currentBanner, setCurrentBanner] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
        setCurrentBanner((prev) => {
            const next = (prev + 1) % imagesBanner.length;
            return next;
        });
        }, 10000);
    
        return () => clearInterval(interval);
    }, []);

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
                    <div className={cx('side-bar')}>
                        <h2>Danh mục</h2>
                        <div className={cx('list')}>
                            <a>
                                <img src='https://cdnv2.tgdd.vn/mwg-static/common/Category/3f/68/3f68e22880dd800e9e34d55245048a0f.png' alt='samsung'/>
                            </a>
                            <a>
                                <img src='https://cdnv2.tgdd.vn/mwg-static/common/Category/57/03/5703d996359650c57421b72f3f7ff5cd.png' alt='iphone'/>
                            </a>
                            <a>
                                <img src='https://cdnv2.tgdd.vn/mwg-static/common/Category/2c/ea/2cea467041fb9effb3a6d3dcc88f38f8.png' alt='oppo'/>
                            </a>
                            <a>
                                <img src='https://cdnv2.tgdd.vn/mwg-static/common/Category/e9/df/e9df3ae9fb60a1460e9030975d0e024a.png' alt='xiaomi'/>
                            </a>
                            <a>
                                <img src='https://cdnv2.tgdd.vn/mwg-static/common/Category/54/2a/542a235b0e366a11fd855108dd9c499c.png' alt='realme'/>
                            </a>
                            <a>
                                <img src='https://cdnv2.tgdd.vn/mwg-static/common/Category/78/38/783870ef310908b123c50cb43b8f6f92.png' alt='vivo'/>
                            </a>
                            <a>
                                <img src='https://cdnv2.tgdd.vn/mwg-static/common/Category/00/e8/00e815b2c60b6f494ec1e19560976fcc.png' alt='honor'/>
                            </a>
                        </div>
                    </div>
                    <div className={cx('container')}>
                        <div className={cx('container-content')}>
                            <div className={cx('banner')}>
                                {imagesBanner.map((img, idx) => (
                                    <img
                                        key={idx}
                                        src={img}
                                        alt={`Banner ${idx + 1}`}
                                        className={cx({ active: idx === currentBanner })}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className={cx('container-content')}>
                            <div className={cx('container-header')}>
                                <div className={cx('header-title')}>Gợi ý cho bạn</div>
                                <div className={cx('header-right')}>Xem tất cả</div>
                            </div>
                            <div className={cx('content')}>
                                <div className={cx('list-product')}>
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
            <Footer />
            <Product modalProduct={modalProduct} onClose={closeModalProduct}/>
        </>
    )
}

export default Home;