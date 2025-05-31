import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import Header from '../../components/Header';
import { useState, useEffect, useCallback } from 'react';
import Footer from '../../components/Footer';
import { Link } from 'react-router-dom';
import { fetchAllProduct } from '../../util/api';

const cx = classNames.bind(styles);

const Home = () => {
    
    const [products, setProducts] = useState([]);

    const imagesBanner = [
        "/image/banner1.jpg",
        "/image/banner2.jpg",
        "/image/banner3.jpg",
        "/image/banner4.jpg",
        "/image/banner5.png",
        "/image/banner6.jpg",
        "/image/banner7.jpg"
    ];

    const categories = [
        { name: 'samsung', img: 'https://cdnv2.tgdd.vn/mwg-static/common/Category/3f/68/3f68e22880dd800e9e34d55245048a0f.png' },
        { name: 'iphone', img: 'https://cdnv2.tgdd.vn/mwg-static/common/Category/57/03/5703d996359650c57421b72f3f7ff5cd.png' },
        { name: 'oppo', img: 'https://cdnv2.tgdd.vn/mwg-static/common/Category/2c/ea/2cea467041fb9effb3a6d3dcc88f38f8.png' },
        { name: 'xiaomi', img: 'https://cdnv2.tgdd.vn/mwg-static/common/Category/e9/df/e9df3ae9fb60a1460e9030975d0e024a.png' },
        { name: 'realme', img: 'https://cdnv2.tgdd.vn/mwg-static/common/Category/54/2a/542a235b0e366a11fd855108dd9c499c.png' },
        { name: 'vivo', img: 'https://cdnv2.tgdd.vn/mwg-static/common/Category/78/38/783870ef310908b123c50cb43b8f6f92.png' },
        { name: 'honor', img: 'https://cdnv2.tgdd.vn/mwg-static/common/Category/00/e8/00e815b2c60b6f494ec1e19560976fcc.png' }
    ];
    
    const [currentBanner, setCurrentBanner] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
        setCurrentBanner((prev) => {
            const next = (prev + 1) % imagesBanner.length;
            return next;
        });
        }, 5000);
    
        return () => clearInterval(interval);
    }, []);

    const fetchProducts = useCallback(async () => {
        try {
            const res = await fetchAllProduct();
            console.log(res)
            if (+res.EC === 0) {
                setProducts(res.DT);
            } else {
                console.error('Lỗi API:', res.EM);
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
                            {categories.map((category) => (
                                <a key={category.name}>
                                    <img src={category.img} alt={category.name} />
                                </a>
                            ))}
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
                                    {products
                                        .filter((product) => product.soLuong > 0)
                                        .map((product) => {
                                        const originalPrice = parseFloat(product.gia);
                                        const discountedPrice = originalPrice * (1 - product.phanTramGiam / 100);
                                        return (
                                            <div key={product.maSanPham} className={cx('product')}>
                                                <Link to={`/products/${product.maSanPham}`}>
                                                    <img 
                                                        src={`http://localhost:8080${product.anh}`}
                                                        alt='Ảnh sản phẩm'
                                                    />
                                                    <div className={cx('product-name')}>
                                                        {product.tenSanPham}
                                                    </div>
                                                    <div className={cx('info')}>
                                                        <span className={cx('ram-rom')}>{product.ram} - {product.dungLuongLuuTru}</span>
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
                                                </Link>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default Home;