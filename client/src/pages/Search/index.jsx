import classNames from 'classnames/bind';
import styles from './Search.module.scss';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { fetchProductByBrand } from '../../util/api';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

const Search = () => {
    
    const location = useLocation();
    const products = location.state?.products || [];
    const searchKeyword = location.state?.searchText || "Điện thoại";
    const navigate = useNavigate();

    const categories = [
        { name: 'samsung', img: 'https://cdnv2.tgdd.vn/mwg-static/common/Category/3f/68/3f68e22880dd800e9e34d55245048a0f.png' },
        { name: 'iphone', img: 'https://cdnv2.tgdd.vn/mwg-static/common/Category/57/03/5703d996359650c57421b72f3f7ff5cd.png' },
        { name: 'oppo', img: 'https://cdnv2.tgdd.vn/mwg-static/common/Category/2c/ea/2cea467041fb9effb3a6d3dcc88f38f8.png' },
        { name: 'xiaomi', img: 'https://cdnv2.tgdd.vn/mwg-static/common/Category/e9/df/e9df3ae9fb60a1460e9030975d0e024a.png' },
        { name: 'realme', img: 'https://cdnv2.tgdd.vn/mwg-static/common/Category/54/2a/542a235b0e366a11fd855108dd9c499c.png' },
        { name: 'vivo', img: 'https://cdnv2.tgdd.vn/mwg-static/common/Category/78/38/783870ef310908b123c50cb43b8f6f92.png' },
        { name: 'honor', img: 'https://cdnv2.tgdd.vn/mwg-static/common/Category/00/e8/00e815b2c60b6f494ec1e19560976fcc.png' }
    ];

    const handleCategoryClick = async (nhanHieu) => {
        try {
            const res = await fetchProductByBrand(nhanHieu);
            if (res && res.DT) {
                navigate('/filter', {
                    state: {
                        products: res.DT,
                        searchText: nhanHieu
                    }
                });
            }
        } catch (error) {
            console.error("Lỗi khi lọc sản phẩm theo brand:", error);
        }
    };

    return ( 
        <>
            <Header />
            <div className={cx('main')}>
                <div className={cx('wrapper')}>
                    <div className={cx('side-bar')}>
                        <h2>Danh mục</h2>
                        <div className={cx('list')}>
                            {categories.map((category) => (
                                <a key={category.name} onClick={() => handleCategoryClick(category.name)}>
                                    <img src={category.img} alt={category.name} />
                                </a>
                            ))}
                        </div>
                    </div>
                    <div className={cx('container')}>
                        <div>
                            Trang chủ 
                            <FontAwesomeIcon icon={faChevronRight} className={cx('chevron-right-icon')} />
                            Kết quả tìm kiếm "{searchKeyword}"
                        </div>
                        <div className={cx('container-content')}>
                            <div className={cx('content')}>
                                {products.filter((product) => product.soLuong > 0).length === 0 ? (
                                    <div className={cx('not-found')}>
                                        😥 Rất tiếc, không tìm thấy sản phẩm phù hợp với từ khóa "<strong>{searchKeyword}</strong>"
                                    </div>
                                    ) : (
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
                                                    <span className={cx('inch')}>{product.inch}</span>
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
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default Search