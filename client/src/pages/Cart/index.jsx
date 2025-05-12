import Header from "../../components/Header"
import classNames from 'classnames/bind';
import styles from './Cart.module.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect, useCallback } from "react";
import { getAllCart } from "../../util/api";

const cx = classNames.bind(styles);

const Cart = () => {
    const [quantity, setQuantity] = useState(1);
    const pricePerItem = 24000;
    const [cartItems, setCartItems] = useState([]);

    const handleIncrease = () => {
        setQuantity(prev => prev + 1);
    };

    const handleDecrease = () => {
        if (quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    const handleQuantityChange = (e) => {
        const value = e.target.value;
        if (!isNaN(value) && value >= 0) {
            setQuantity(parseInt(value));
        }
    };

    const fetchCarts = useCallback(async () => {
            try {
                const response = await getAllCart();
                if (response.EC === 0) {
                    setCartItems(response.DT);
                } else {
                    console.error('Lỗi API:', response.EM);
                }
            } catch (error) {
                console.error('Lỗi fetch:', error);
            }
        }, []);
    
        useEffect(() => {
            fetchCarts();
    }, [fetchCarts]);

    const totalPrice = quantity * pricePerItem;

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
                        {cartItems.map(item => (
                            <div className={cx("container-content")}  key={item.maChiTietGioHang}>
                                <div className={cx("cart-product")}>
                                    <div className={cx("checkbox")}>
                                        <label>
                                            <input type="checkbox"></input>
                                        </label>
                                    </div>
                                    <div className={cx("element", "first-element")}>
                                        <img alt="Ảnh" src={item.sanPham?.anh || ""}/>
                                        <div>{item.sanPham?.tenSanPham}</div>
                                    </div>
                                    <div className={cx("element")}>{item.gia.toLocaleString()}đ</div>
                                    <div className={cx("element", "input-quantity")}>
                                        <button onClick={handleDecrease}>
                                            <FontAwesomeIcon icon={faMinus} />
                                        </button>
                                        <input
                                            value={quantity}
                                            type="text"
                                            onChange={handleQuantityChange}
                                        />
                                        <button onClick={handleIncrease}>
                                            <FontAwesomeIcon icon={faPlus} />
                                        </button>
                                    </div>
                                    <div className={cx("element", "color-red")}> {(item.soLuong * item.gia).toLocaleString()}đ</div>
                                    <div className={cx("element")}>Xóa</div>
                                </div>
                            </div>
                        ))}
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