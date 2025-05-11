import Header from "../../components/Header"
import classNames from 'classnames/bind';
import styles from './ProductDetail.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useParams } from 'react-router-dom';
import { faCartShopping, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from "react";

const cx = classNames.bind(styles);

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
        try {
            const res = await fetch(`http://localhost:8080/api/v1/products/${id}`);
            const data = await res.json();
            if (data.EC === 0) {
            setProduct(data.DT);
            } else {
            console.error('Không tìm thấy sản phẩm:', data.EM);
            }
        } catch (error) {
            console.error('Lỗi fetch:', error);
        }
        };

        fetchProduct();
    }, [id]);

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
                            <div className={cx("address")}>
                                <FontAwesomeIcon icon={faLocationDot} className={cx("location-icon")} />
                                <span>36 Cao Thắng, Thanh Bình, Hải Châu, Đà Nẵng</span>
                            </div>
                            <div className={cx('price')}>
                                <div className={cx('discount')}>
                                    {(parseFloat(product.gia) * (1 - (product.phanTramGiam || 0) / 100)).toLocaleString('vi-VN')}₫
                                </div>
                                <div className={cx('origin-price')}>{parseFloat(product.gia).toLocaleString('vi-VN')}₫</div>
                            </div>
                            <div className={cx("btn")}>
                                <button className={cx("btn-cart")}>
                                    <FontAwesomeIcon icon={faCartShopping} className={cx('cart-icon')}/>
                                    <span>Thêm vào giỏ hàng</span>
                                </button>
                                <button className={cx("btn-buy")}>Mua ngay</button>
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
                                <span className={cx("label")}>Ram:</span>
                                <span>{product.ram}</span>
                            </div>
                            <div className={cx("info-row")}>
                                <span className={cx("label")}>Dung lượng lưu trữ:</span>
                                <span>{product.dungLuongLuuTru}</span>
                            </div>
                        </div>
                        {/* <div className={cx("container-content")}>
                            <div>Đánh giá khách hàng</div>
                        </div> */}
                    </div>
                </div>
                ) : (
                    <div>hello</div>
                )}
            </div>
        </>
    )
}

export default ProductDetail;