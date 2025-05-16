import Header from "../../components/Header"
import classNames from 'classnames/bind';
import styles from './Cart.module.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect, useCallback } from "react";
import { getAllCart } from "../../util/api";

const cx = classNames.bind(styles);


const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const IMAGE_BASE_URL = "http://localhost:8080";
    const [selectedItems, setSelectedItems] = useState({});

    const [quantities, setQuantities] = useState({});

    const handleToggleAll = () => {
        const allSelected = Object.keys(selectedItems).length === cartItems.length;
        const newSelected = {};
        if (!allSelected) {
            cartItems.forEach(item => {
                newSelected[item.maChiTietDonHang] = true;
            });
        }
        setSelectedItems(newSelected);
    };

    const handleToggleItem = (id) => {
        setSelectedItems(prev => {
            const newSelected = { ...prev };
            if (newSelected[id]) {
                delete newSelected[id];
            } else {
                newSelected[id] = true;
            }
            return newSelected;
        });
    };

    const fetchCarts = useCallback(async () => {
        try {
            const response = await getAllCart();
            if (response.EC === 0) {
                setCartItems(response.DT);
                const initialQuantities = {};
                response.DT.forEach(item => {
                    initialQuantities[item.maChiTietDonHang] = item.soLuong || 1;
                });
                setQuantities(initialQuantities);
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

    const handleIncrease = (id) => {
        setQuantities(prev => ({
            ...prev,
            [id]: (prev[id] || 1) + 1
        }));
    };

    const handleDecrease = (id) => {
        setQuantities(prev => ({
            ...prev,
            [id]: prev[id] > 1 ? prev[id] - 1 : 1
        }));
    };

    const handleQuantityChange = (id, e) => {
        const value = e.target.value;
        if (!isNaN(value) && value >= 1) {
            setQuantities(prev => ({
                ...prev,
                [id]: parseInt(value)
            }));
        }
    };

    const totalPrice = cartItems.reduce((total, item) => {
        const id = item.maChiTietDonHang;
        if (selectedItems[id]) {
            const qty = quantities[id] || item.soLuong || 1;
            return total + qty * item.gia;
        }
        return total;
    }, 0);

    const totalQuantity = cartItems.reduce((total, item) => {
        const id = item.maChiTietDonHang;
        if (selectedItems[id]) {
            const qty = quantities[id] || item.soLuong || 1;
            return total + qty;
        }
        return total;
    }, 0);

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
                                        <input
                                            type="checkbox"
                                            checked={Object.keys(selectedItems).length === cartItems.length && cartItems.length > 0}
                                            onChange={handleToggleAll}
                                        />
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
                            <div className={cx("container-content")} key={item.maChiTietDonHang}>
                                <div className={cx("cart-product")}>
                                    <div className={cx("checkbox")}>
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={!!selectedItems[item.maChiTietDonHang]}
                                                onChange={() => handleToggleItem(item.maChiTietDonHang)}
                                            />
                                        </label>
                                    </div>
                                    <div className={cx("element", "first-element")}>
                                        <img alt="Ảnh" src={item.sanPham?.anh ? `${IMAGE_BASE_URL}${item.sanPham.anh}` : ""}/>
                                        <div>{item.sanPham?.tenSanPham}</div>
                                    </div>
                                    <div className={cx("element")}>{item.gia.toLocaleString()}đ</div>
                                    <div className={cx("element", "input-quantity")}>
                                        <button onClick={() => handleDecrease(item.maChiTietDonHang)}>
                                            <FontAwesomeIcon icon={faMinus} />
                                        </button>
                                        <input
                                            value={quantities[item.maChiTietDonHang] || item.soLuong || 1}
                                            type="text"
                                            onChange={(e) => handleQuantityChange(item.maChiTietDonHang, e)}
                                        />
                                        <button onClick={() => handleIncrease(item.maChiTietDonHang)}>
                                            <FontAwesomeIcon icon={faPlus} />
                                        </button>
                                    </div>
                                    <div className={cx("element", "color-red")}>
                                        {( (quantities[item.maChiTietDonHang] || item.soLuong || 1) * item.gia ).toLocaleString()}đ
                                    </div>
                                    <div className={cx("element")}>Xóa</div>
                                </div>
                            </div>
                        ))}
                        <div className={cx("container-content")}>
                            <div className={cx("cart-payment")}>
                                <div className={cx("checkbox")}>
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={Object.keys(selectedItems).length === cartItems.length && cartItems.length > 0}
                                            onChange={handleToggleAll}
                                        />
                                    </label>
                                </div>
                                <div className={cx("element")}>Xóa</div>
                                <div className={cx("quantity")}>Tổng cộng ({totalQuantity}) sản phẩm:</div>
                                <div className={cx("price")}>{totalPrice.toLocaleString()}đ</div>
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
