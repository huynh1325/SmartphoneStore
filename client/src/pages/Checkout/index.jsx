import Header from "../../components/Header"
import classNames from 'classnames/bind';
import styles from './Checkout.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from "react";
import { getOrderById, createOrder, createPaymentUrl } from "../../util/api";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const cx = classNames.bind(styles);

const Checkout = () => {
    const [selected, setSelected] = useState("option1");
    const [selectedPayment, setSelectedPayment] = useState("option1");
    const [orders, setOrders] = useState(null);
    const IMAGE_BASE_URL = "http://localhost:8080";
    const location = useLocation();
    const selectedProducts = location.state?.sanPhams || [];
    const navigate = useNavigate();

    const TickSvg = () => (
        <span className={cx("tick-wrapper")}>
            <svg
                enableBackground="new 0 0 12 12"
                viewBox="0 0 12 12"
                x="0"
                y="0"
                className={cx("tick-icon")}
                width="16"
                height="16"
                style={{ marginLeft: 8 }}
            >
                <g>
                    <path d="m5.2 10.9c-.2 0-.5-.1-.7-.2l-4.2-3.7c-.4-.4-.5-1-.1-1.4s1-.5 1.4-.1l3.4 3 5.1-7c.3-.4 1-.5 1.4-.2s.5 1 .2 1.4l-5.7 7.9c-.2.2-.4.4-.7.4 0-.1 0-.1-.1-.1z"></path>
                </g>
            </svg>
        </span>
    );

    // useEffect(() => {
    //     const fetchOrders = async () => {
    //         try {
    //             const res = await getOrderById(id);
    //             setOrders(res);
    //             console.log(orders.chiTietDonHang)
    //         } catch (error) {
    //             console.error("Lỗi khi lấy đơn hàng:", error);
    //         }
    //     };
    //     if (id) fetchOrders();
    // }, [id]);

    // try {
    //         const response = await createOrder(orderData);
    //         const id = response.DT.maDonHang;
    //         if (response.EC === 0) {
    //             navigate(/checkout/${id});
    //         } else {
    //             console.error("Tạo đơn hàng thất bại:", response.EM);
    //             toast.error("Không thể tạo đơn hàng!");
    //         }
    //     } catch (err) {
    //         console.error("Lỗi khi gọi API:", err);
    //         toast.error("Có lỗi xảy ra khi tạo đơn hàng.");
    //     }

    const handleCheckout = async () => {
        try {
            const orderData = {
                hoTen: "Huynh",
                diaChi: "5 Nguyễn Xí, phường Hòa Minh, Liên Chiểu, Đà Nẵng",
                soDienThoai: "0376675020",
                tongTien: selectedProducts.reduce((sum, item) => sum + item.soLuong * item.gia, 0),
                sanPhams: selectedProducts,
            };

            const response = await createOrder(orderData);
            if (response.EC === 0) {
                const id = response.DT.maDonHang;

                if (selectedPayment === "option2") {
                    const paymentRes = await createPaymentUrl({ maDonHang: id });
                    console.log(paymentRes)
                    if (paymentRes.EC === 0) {
                        window.location.href = paymentRes.DT;
                    } else {
                        toast.error("Không thể tạo URL thanh toán.");
                    }
                } else {
                    // navigate(`/checkout/${id}`);
                }
            } else {
                console.error("Tạo đơn hàng thất bại:", response.EM);
                toast.error("Không thể tạo đơn hàng!");
            }
        } catch (err) {
            console.error("Lỗi khi gọi API:", err);
            toast.error("Có lỗi xảy ra khi tạo đơn hàng.");
        }
    };

    const calculateTotal = () => {
        if (!selectedProducts || selectedProducts.length === 0) return 0;
        const total = selectedProducts.reduce((sum, item) => sum + item.soLuong * item.gia, 0);
        return total.toLocaleString('vi-VN');
    };

    const formatCurrency = (num) => {
        return num.toLocaleString('vi-VN') + 'đ';
    };

    return (
        <>
            <Header />
            <div className={cx("main")}>
                <div className={cx("wrapper")}>
                    <div className={cx("container")}>
                        <div className={cx("container-content")}>
                            <div className={cx("header-title")}>
                                <h2>Thanh toán đơn hàng</h2>
                            </div>
                            <div className={cx("address-title")}>
                                <FontAwesomeIcon icon={faLocationDot} className={cx("icon")} />
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
                            {selectedProducts.map((ct) => (
                                <div key={ct.maChiTietDonHang} className={cx("checkout-product")}>
                                    <div className={cx("element", "first-element")}>
                                        <img alt="Ảnh" src={ct.anh ? `${IMAGE_BASE_URL}${ct.anh}` : ""} />
                                        <div>{ct.tenSanPham}</div>
                                    </div>
                                    <div className={cx("element")}>{formatCurrency(ct.gia)}</div>
                                    <div className={cx("element", "input-quantity")}>{ct.soLuong}</div>
                                    <div className={cx("element", "color-red")}>{formatCurrency(ct.soLuong * ct.gia)}</div>
                                </div>
                            ))}
                        </div>

                        <div className={cx("container-content")}>
                            <div className={cx("checkout-container")}>
                                <div className={cx("voucher")}>
                                    <div className={cx("voucher-heaeder")}>Sử dụng mã giảm giá:</div>
                                    <input />
                                    <div className={cx("voucher-btn")}>Áp dụng</div>
                                </div>

                                <div className={cx("checkout")}>
                                    <div className={cx("checkout-option")}>
                                        <button
                                            className={cx({ active: selectedPayment === 'option1' })}
                                            onClick={() => setSelectedPayment("option1")}
                                        >
                                            Thanh toán khi nhận hàng
                                            {selectedPayment === "option1" && <TickSvg />}
                                        </button>
                                        <button
                                            className={cx({ active: selectedPayment === 'option2' })}
                                            onClick={() => setSelectedPayment("option2")}
                                        >
                                            Thanh toán qua VNPAY
                                            {selectedPayment === "option2" && <TickSvg />}
                                        </button>
                                    </div>

                                    <div className={cx("shipping")}>
                                        <div className={cx("shipping-header")}>
                                            Tiền phí vận chuyển
                                        </div>
                                        <div>Miễn phí</div>
                                    </div>

                                    {/* <div className={cx("payment")}>
                                        <div className={cx("payment-header")}>Chọn số tiền thanh toán trước</div>
                                        <div className={cx("payment-select")}>
                                            <button
                                                className={cx('button', { active: selected === 'option1' })}
                                                onClick={() => setSelected("option1")}
                                            >
                                                1.000.000đ
                                                {selected === "option1" && <TickSvg />}
                                            </button>
                                            <button
                                                className={cx('button', { active: selected === 'option2' })}
                                                onClick={() => setSelected("option2")}
                                            >
                                                20.000.000đ
                                                {selected === "option2" && <TickSvg />}
                                            </button>
                                        </div>
                                    </div> */}

                                    <div className={cx("buy")}>
                                        <div>Tổng thanh toán: {calculateTotal()}đ</div>
                                        <button className={cx("checkout-btn")} onClick={handleCheckout}>Đặt hàng</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Checkout;
