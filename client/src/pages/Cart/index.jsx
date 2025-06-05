import Header from "../../components/Header";
import classNames from 'classnames/bind';
import styles from './Cart.module.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect, useCallback } from "react";
import { getAllCart, createOrder } from "../../util/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const cx = classNames.bind(styles);

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState({});
    const [quantities, setQuantities] = useState({});
    const navigate = useNavigate();
    const IMAGE_BASE_URL = "http://localhost:8080";

    const isAllSelected = cartItems.length > 0 && Object.keys(selectedItems).length === cartItems.length;

    const handleToggleAll = () => {
        if (isAllSelected) {
            setSelectedItems({});
        } else {
            const newSelected = {};
            cartItems.forEach(item => {
                newSelected[item.maChiTietGioHang] = true;
            });
            setSelectedItems(newSelected);
        }
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
            console.log(response)
            if (response.EC === 0) {
                setCartItems(response.DT);
                const initialQuantities = {};
                response.DT.forEach(item => {
                    initialQuantities[item.maChiTietGioHang] = item.soLuong || 1;
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
        const cartItem = cartItems.find(item => item.maChiTietGioHang === id);
        const maxStock = cartItem?.soLuongTon || 1;
        
        setQuantities(prev => {
            const newQty = (prev[id] || 1) + 1;
            if (newQty > maxStock) {
                toast.warning(`Chỉ còn lại ${maxStock} sản phẩm cho màu ${cartItem?.mau}`);
                return prev;
            }
            return {
                ...prev,
                [id]: newQty
            };
        });
    };

    const handleDecrease = (id) => {
        setQuantities(prev => ({
            ...prev,
            [id]: prev[id] > 1 ? prev[id] - 1 : 1
        }));
    };

    const handleQuantityChange = (id, e) => {
        const value = parseInt(e.target.value);
        if (isNaN(value) || value < 1) return;

        const cartItem = cartItems.find(item => item.maChiTietGioHang === id);
        const maxStock = cartItem?.sanPham?.mauSacSanPhams?.[0]?.soLuong || 1;

        if (value > maxStock) {
            toast.warning(`Chỉ còn lại ${maxStock} sản phẩm cho màu ${cartItem?.mau}`);
            return;
        }

        setQuantities(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const totalPrice = cartItems.reduce((total, item) => {
        const id = item.maChiTietGioHang;
        if (selectedItems[id]) {
            const qty = quantities[id] || item.soLuong || 1;
            return total + qty * item.giaDaGiam;
        }
        return total;
    }, 0);

    const totalQuantity = cartItems.reduce((total, item) => {
        const id = item.maChiTietGioHang;
        if (selectedItems[id]) {
            const qty = quantities[id] || item.soLuong || 1;
            return total + qty;
        }
        return total;
    }, 0);

    const handleCreateOrder = async () => {
        const orderData = prepareOrderData();

        if (orderData.sanPhams.length === 0) {
            toast.error("Vui lòng chọn ít nhất một sản phẩm.");
            return;
        }

        navigate('/checkout', { state: orderData });
    };

    const prepareOrderData = () => {
        const selectedProducts = cartItems
            .filter(item => selectedItems[item.maChiTietGioHang])
            .map(item => ({
                maSanPham: item.sanPham?.maSanPham || item.maSanPham,
                tenSanPham: item.sanPham?.tenSanPham,
                anh: item.sanPham?.anh,
                soLuong: quantities[item.maChiTietGioHang] || item.soLuong || 1,
                gia: item.giaDaGiam,
                mau: item.mau
            }));
        
        return {
            sanPhams: selectedProducts,
            tongTien: totalPrice
        };
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('de-DE').format(Math.round(Number(price))) + 'đ';
    };

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
                                            checked={isAllSelected}
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
                            <div className={cx("container-content")} key={item.maChiTietGioHang}>
                                <div className={cx("cart-product")}>
                                    <div className={cx("checkbox")}>
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={!!selectedItems[item.maChiTietGioHang]}
                                                onChange={() => handleToggleItem(item.maChiTietGioHang)}
                                            />
                                        </label>
                                    </div>
                                    <div className={cx("element", "first-element")}>
                                        <img alt="Ảnh" src={item.sanPham?.anh ? `${IMAGE_BASE_URL}${item.sanPham.anh}` : ""} />
                                        <div>
                                            <div>{item.sanPham?.tenSanPham}</div>
                                            {item.mau && (
                                                <div className={cx("color-info")}>
                                                    Màu: <span>{item.mau}</span>
                                                </div>
                                            )}
                                        </div>
                                        
                                    </div>
                                    <div className={cx("element")}>{formatPrice(item.giaDaGiam)}</div>
                                    <div className={cx("element", "input-quantity")}>
                                        <button onClick={() => handleDecrease(item.maChiTietGioHang)}>
                                            <FontAwesomeIcon icon={faMinus} />
                                        </button>
                                        <input
                                            value={quantities[item.maChiTietGioHang] || item.soLuong || 1}
                                            type="text"
                                            onChange={(e) => handleQuantityChange(item.maChiTietGioHang, e)}
                                        />
                                        <button onClick={() => handleIncrease(item.maChiTietGioHang)}>
                                            <FontAwesomeIcon icon={faPlus} />
                                        </button>
                                    </div>
                                    <div className={cx("element", "color-red")}>
                                        {( (quantities[item.maChiTietGioHang] || item.soLuong || 1) * item.giaDaGiam ).toLocaleString('vi-VN')}đ
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
                                            checked={isAllSelected}
                                            onChange={handleToggleAll}
                                        />
                                    </label>
                                </div>
                                <div className={cx("element")}>Xóa</div>
                                <div className={cx("quantity")}>Tổng cộng ({totalQuantity}) sản phẩm:</div>
                                <div className={cx("price")}>{totalPrice.toLocaleString('vi-VN')}đ</div>
                                <div
                                    className={cx("buy", { disabled: totalQuantity === 0 })}
                                    onClick={handleCreateOrder}
                                >
                                    Mua hàng
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Cart;
