import Header from "../../components/Header"
import classNames from 'classnames/bind';
import styles from './ProductDetail.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faLocationDot } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

const ProductDetail = () => {
    return (
        <>
            <Header />
            <div className={cx('main')}>
                <div className={cx('wrapper')}>
                    <div className={cx('title')}>Điện thoại Realme51</div>
                    <div className={cx("container")}>
                        <div className={cx("container-content")}>
                            <div className={cx("image")}>
                                <img src="https://cdn.tgdd.vn/Products/Images/42/332236/Slider/realme-c75-8gb-512gb638708891479476030.jpg"/>
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
                                <div className={cx('discount')}>3.000.000₫</div>
                                <div className={cx('origin-price')}>3.200.000₫</div>
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
                                <span>Điện thoại OPPO A5 Pro</span>
                            </div>
                            <div className={cx("info-row")}>
                                <span className={cx("label")}>Hệ điều hành:</span>
                                <span>Android 15</span>
                            </div>
                            <div className={cx("info-row")}>
                                <span className={cx("label")}>Chip xử lý (CPU):</span>
                                <span>Snapdragon 6s Gen 1 8 nhân</span>
                            </div>
                            <div className={cx("info-row")}>
                                <span className={cx("label")}>Màn hình rộng:</span>
                                <span>6.67"</span>
                            </div>
                            <div className={cx("info-row")}>
                                <span className={cx("label")}>Ram:</span>
                                <span>8 GB</span>
                            </div>
                            <div className={cx("info-row")}>
                                <span className={cx("label")}>Dung lượng lưu trữ:</span>
                                <span>256 GB</span>
                            </div>
                        </div>
                        {/* <div className={cx("container-content")}>
                            <div>Đánh giá khách hàng</div>
                        </div> */}
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProductDetail;