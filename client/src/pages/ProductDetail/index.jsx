import Header from "../../components/Header"
import Footer from "../../components/Footer"
import classNames from 'classnames/bind';
import styles from './ProductDetail.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useParams } from 'react-router-dom';
import { faCartShopping, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect, useContext } from "react";
import { AuthContext } from '../../components/Context/AuthContext';
import { addToCart, fetctColorProduct, getAllCart } from "../../util/api";
import { toast } from "react-toastify";
import { useCart } from "../../components/Context/CartContext";
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

const ProductDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [colors, setColors] = useState([]);
    const [selectedColor, setSelectedColor] = useState(null);
    const { fetchCart } = useCart();
    
    const { auth, setAuth } = useContext(AuthContext);

    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await fetch(`http://localhost:8080/api/v1/review/${id}`);
                const data = await res.json();
                if (data.EC === 0) {
                    setReviews(data.DT);
                } else {
                    console.error("Lỗi lấy đánh giá:", data.EM);
                }
            } catch (err) {
                console.error("Lỗi fetch đánh giá:", err);
            }
        };

        fetchReviews();
    }, [id]);

    const cartRedirect = () => {
        if (!auth.isAuthenticated) {
            toast.warn("Vui lòng đăng nhập để xem giỏ hàng!");
            return;
        }
        navigate("/cart");
    }

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`http://localhost:8080/api/v1/products/${id}`);
                const data = await res.json();
                console.log(data)
                if (data.EC === 0) {
                    setProduct(data.DT);
                } else {
                console.error('Không tìm thấy sản phẩm:', data.EM);
                }
            } catch (error) {
                console.error('Lỗi fetch:', error);
            }
        };

        const fetchColors = async () => {
            try {
                const res = await fetctColorProduct(id);
                if (res.EC === 0) {
                    setColors(res.DT);
                } else {
                    toast.error(res.EM)
                }
            } catch (error) {
                console.error("Lỗi gọi API màu:", error);
            }
        };

        fetchProduct();
        fetchColors();
    }, [id]);

    useEffect(() => {
        if (colors.length > 0 && !selectedColor) {
            setSelectedColor(colors[0].mau);
        }
    }, [colors, selectedColor]);

    const handleAddToCart = async () => {

        const token = localStorage.getItem("access_token");
        if (!token) {
            toast.error("Bạn chưa đăng nhập!");
        }

        try {
            const res = await addToCart({ ...product, mau: selectedColor })
            if (res.EC === 1) {
                toast.error(res.EM);
            }
            if (res.EC === 0) {
                toast.success(res.EM);
                await fetchCart();
            }
        } catch (error) {
            toast.error("Lỗi thêm sản phẩm")
        }
    }

    return (
        <>
            <Header />
            <div className={cx('main')}>
                {product ? (
                <div className={cx('wrapper')}>
                    <div className={cx('title')}>{product.tenSanPham}</div>
                    <div className={cx("container")}>
                        <div className={cx("container-content")}>
                            <div className={cx("image")}>
                                <img src={`http://localhost:8080${product.anh}`}/>
                                <p></p>
                            </div>
                        </div>
                        <div className={cx("container-content")}>
                            <img className={cx("banner-discount")} src="https://cdnv2.tgdd.vn/mwg-static/tgdd/Banner/d5/ae/d5ae30d89b08a2e22b67099889159698.jpg" />
                            <img className={cx("banner-discount")} src="https://cdnv2.tgdd.vn/mwg-static/tgdd/Banner/b4/40/b44002892156fc70b5ce6cdc68efd2c5.png" />
                            {/* <div className={cx("address")}>
                                <FontAwesomeIcon icon={faLocationDot} className={cx("location-icon")} />
                                <span>36 Cao Thắng, Thanh Bình, Hải Châu, Đà Nẵng</span>
                            </div> */}
                            <div className={cx("color-list")}>
                                {colors.length > 0 ? (
                                    colors.map((color) => (
                                        <li
                                            key={color.id}
                                            className={cx("color-item", {
                                                active: selectedColor === color.mau,
                                                disabled: color.soLuong == null || color.soLuong <= 0
                                            })}
                                            onClick={() => setSelectedColor(color.mau)}
                                        >
                                            {color.mau}
                                        </li>
                                    ))
                                ) : (
                                    <span>Không có màu</span>
                                )}
                            </div>
                            <div className={cx('price')}>
                                <div className={cx('discount')}>
                                    {(parseFloat(product.gia) * (1 - (product.phanTramGiam || 0) / 100)).toLocaleString('vi-VN')}₫
                                </div>
                                <div className={cx('origin-price')}>{parseFloat(product.gia).toLocaleString('vi-VN')}₫</div>
                            </div>
                            <div className={cx("btn")}>
                                <button className={cx("btn-cart")} onClick={handleAddToCart}>
                                    <FontAwesomeIcon icon={faCartShopping} className={cx('cart-icon')}/>
                                    <span>Thêm vào giỏ hàng</span>
                                </button>
                                <button className={cx("btn-buy")} onClick={cartRedirect}>Mua ngay</button>
                            </div>
                        </div>
                        <div className={cx("container-content")}>
                            <div className={cx("info")}>Thông tin</div>
                            <div className={cx("info-row")}>
                                <span className={cx("label")}>Tên sản phẩm:</span>
                                <span>{product.tenSanPham}</span>
                            </div>
                            <div className={cx("info-row")}>
                                <span className={cx("label")}>Hệ điều hành:</span>
                                <span>{product.heDieuHanh}</span>
                            </div>
                            <div className={cx("info-row")}>
                                <span className={cx("label")}>Chip xử lý (CPU):</span>
                                <span>{product.cpu}</span>
                            </div>
                            <div className={cx("info-row")}>
                                <span className={cx("label")}>Màn hình rộng:</span>
                                <span>{product.inch}</span>
                            </div>
                            <div className={cx("info-row")}>
                                <span className={cx("label")}>Chip đồ họa:</span>
                                <span>{product.chipDoHoa}</span>
                            </div>
                            <div className={cx("info-row")}>
                                <span className={cx("label")}>Ram:</span>
                                <span>{product.ram}</span>
                            </div>
                            <div className={cx("info-row")}>
                                <span className={cx("label")}>Thẻ nhớ:</span>
                                <span>{product.theNho}</span>
                            </div>
                            <div className={cx("info-row")}>
                                <span className={cx("label")}>Dung lượng lưu trữ:</span>
                                <span>{product.dungLuongLuuTru}</span>
                            </div>
                        </div>
                        <div className={cx("container-content")}>
                            <div className={cx("container-content")}>
                                <div className={cx("review-title")}>Đánh giá khách hàng</div>
                                {reviews.length === 0 ? (
                                    <p>Chưa có đánh giá nào cho sản phẩm này.</p>
                                ) : (
                                    reviews.map((review) => (
                                        <div key={review.maDanhGia} className={cx("review-item")}>
                                            <div className={cx("review-header")}>
                                                <strong>{review.nguoiDung.tenNguoiDung}</strong>
                                                <span style={{ marginLeft: '12px', color: '#faad14' }}>
                                                    {'★'.repeat(parseInt(review.xepHang)) + '☆'.repeat(5 - parseInt(review.xepHang))}
                                                </span>
                                            </div>
                                            <p className={cx("review-content")}>{review.noiDung}</p>
                                            <div className={cx("review-time")}>
                                                {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                ) : (
                    <div>hello</div>
                )}
            </div>
            <Footer />
        </>
    )
}

export default ProductDetail;