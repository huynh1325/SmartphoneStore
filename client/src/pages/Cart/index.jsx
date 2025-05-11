import Header from "../../components/Header"
import classNames from 'classnames/bind';
import styles from './Cart.module.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";

const cx = classNames.bind(styles);

const Cart = () => {
    return (
        <>
            <Header />
            <div className={cx("main")}>
                <div className={cx("wrapper")}>
                    <div className={cx("container")}>
                        <div className={cx("container-content")}>
                            <div className={cx("cart-header")}>
                                <div className={cx("checkbox")}>
                                    <label>
                                        <input type="checkbox"></input>
                                    </label>
                                </div>
                                <div className={cx("element", "first-element")}>Sản phẩm</div>
                                <div className={cx("element")}>Đơn giá</div>
                                <div className={cx("element")}>Số lượng</div>
                                <div className={cx("element")}>Thành tiền</div>
                                <div className={cx("element")}>Thao tác</div>
                            </div>
                        </div>
                        <div className={cx("container-content")}>
                            <div className={cx("cart-product")}>
                                <div className={cx("checkbox")}>
                                    <label>
                                        <input type="checkbox"></input>
                                    </label>
                                </div>
                                <div className={cx("element", "first-element")}>
                                    <img alt="Ảnh" src="https://cdn.tgdd.vn/Products/Images/42/327258/TimerThumb/honor-x6b-6gb-128gb-(36).jpg"/>
                                    <div>Điện thoại HONOR X6b 6GB/128GB Tím</div>
                                </div>
                                <div className={cx("element")}>24.000</div>
                                <div className={cx("element", "input-quantity")}>
                                    <button>
                                        <FontAwesomeIcon icon={faMinus} />
                                    </button>
                                    <input value={1} type="text"/>
                                    <button>
                                        <FontAwesomeIcon icon={faPlus} />
                                    </button>
                                </div>
                                <div className={cx("element", "color-red")}>24.000</div>
                                <div className={cx("element")}>Xóa</div>
                            </div>
                        </div>
                        <div className={cx("container-content")}>
                            <div className={cx("cart-payment")}>
                                <div className={cx("checkbox")}>
                                    <label>
                                        <input type="checkbox"></input>
                                    </label>
                                </div>
                                <div className={cx("element")}>Xóa</div>
                                <div className={cx("quantity")}>Tổng cộng (0) sản phẩm:</div>
                                <div className={cx("price")}>0đ</div>
                                <div className={cx("buy")}>Mua hàng</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Cart;