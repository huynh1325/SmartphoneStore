import Header from "../../components/Header"
import classNames from 'classnames/bind';
import styles from './Checkout.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { useState } from "react";

const cx = classNames.bind(styles);

const Checkout = () => {

    const [selected, setSelected] = useState("option1");

    return (
        <>
            <Header />
            <div className={cx("main")}>
                <div className={cx("wrapper")}>
                    <div className={cx("container")}>
                        <div className={cx("container-content")}>
                            <div className={cx("address-title")}>
                                <FontAwesomeIcon icon={faLocationDot} className={cx("icon")}/>
                                <h2>Địa chỉ nhận hàng</h2>
                            </div>
                            <div className={cx("address-detail")}>
                                <div className={cx("name-user")}>Huynh</div>
                                <div className={cx("phone")}>0376675020</div>
                                <div className={cx("address")}>5 Nguyễn Xí, phường Hòa Minh, Liên Chiểu, Đà Nẵng</div>
                                <div className={cx("change-address")}>Thay đổi</div>
                            </div>
                        </div>
                        <div className={cx("container-content")}>
                            <div className={cx("checkout-header")}>
                                <div className={cx("element", "first-element")}>Sản phẩm</div>
                                <div className={cx("element")}>Đơn giá</div>
                                <div className={cx("element")}>Số lượng</div>
                                <div className={cx("element")}>Thành tiền</div>
                            </div>
                            <div className={cx("checkout-product")}>
                                <div className={cx("element", "first-element")}>
                                    <img alt="Ảnh" src=""/>
                                    <div>Tên sản phẩm</div>
                                </div>
                                <div className={cx("element")}>400000</div>
                                <div className={cx("element", "input-quantity")}>
                                    2
                                </div>
                                <div className={cx("element", "color-red")}>
                                    400000đ
                                </div>
                            </div>
                            <div className={cx("checkout-product")}>
                                <div className={cx("element", "first-element")}>
                                    <img alt="Ảnh" src=""/>
                                    <div>Tên sản phẩm</div>
                                </div>
                                <div className={cx("element")}>400000</div>
                                <div className={cx("element", "input-quantity")}>
                                    2
                                </div>
                                <div className={cx("element", "color-red")}>
                                    400000đ
                                </div>
                            </div>
                            <div className={cx("checkout-product")}>
                                <div className={cx("element", "first-element")}>
                                    <img alt="Ảnh" src=""/>
                                    <div>Tên sản phẩm</div>
                                </div>
                                <div className={cx("element")}>400000</div>
                                <div className={cx("element", "input-quantity")}>
                                    2
                                </div>
                                <div className={cx("element", "color-red")}>
                                    400000đ
                                </div>
                            </div>
                        </div>
                        <div className={cx("container-content")}>
                            <div className={cx("checkout-container")}>
                            <div className={cx("voucher")}>
                                <div className={cx("voucher-heaeder")}>Sử dụng mã giảm giá:</div>
                                <input />
                                <div className={cx("voucher-btn")}>Áp dụng</div>
                            </div>
                            <div className={cx("checkout")}>
                                <div className={cx("shipping")}>
                                    <div className={cx("shipping-header")}>
                                        Tiền phí vận chuyển
                                    </div>
                                    <div>
                                        Miễn phí
                                    </div>
                                </div>
                                <div className={cx("payment")}>
                                    <div className={cx("payment-header")}>Chọn số tiền thanh toán trước</div>
                                    <div className={cx("payment-select")}>
                                        <button
                                            className={cx('button', { active: selected === 'option1' })}
                                            onClick={() => setSelected("option1")}
                                        >
                                            1000000
                                        </button>
                                        <button
                                            className={cx('button', { active: selected === 'option2' })}
                                            onClick={() => setSelected("option2")}
                                        >
                                            20000000
                                        </button>
                                    </div>
                                </div>
                                <div className={cx("buy")}>
                                    <div>Tổng thanh toán: 1000000</div>
                                    <button className={cx("checkout-btn")}>Đặt hàng</button>
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

export default Checkout;