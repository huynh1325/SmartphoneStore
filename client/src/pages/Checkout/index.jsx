import Header from "../../components/Header"
import classNames from 'classnames/bind';
import styles from './Checkout.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { useState } from "react";
import { createOrder, createPaymentUrl } from "../../util/api";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Modal, Radio, Button } from 'antd';

const cx = classNames.bind(styles);

const Checkout = () => {
    const [selected, setSelected] = useState("option1");
    const [selectedPayment, setSelectedPayment] = useState("option1");
    const [orders, setOrders] = useState(null);
    const IMAGE_BASE_URL = "http://localhost:8080";
    const location = useLocation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState('address_id_1');
    const selectedProducts = location.state?.sanPhams || [];
    const [newAddress, setNewAddress] = useState({ name: '', phone: '', address: '' });
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [voucherCode, setVoucherCode] = useState();

    const [addresses, setAddresses] = useState([
        {
            id: 'address_id_1',
            name: 'Huynh Nguyễn',
            phone: '0376675020',
            address: '5 Nguyễn Xí, Phường Hòa Minh, Quận Liên Chiểu, Đà Nẵng',
            isDefault: true
        },
        {
            id: 'address_id_2',
            name: 'Kim Phượng',
            phone: '0985855377',
            address: 'Đối diện cây xăng số 10, Thị xã Tân Uyên, Bình Dương',
            isDefault: false
        },
    ]);
    
    const [currentAddress, setCurrentAddress] = useState(addresses.find(addr => addr.isDefault));
    const navigate = useNavigate();

    const TickSvg = () => (
        <span className={cx("tick-wrapper")}> 
            <svg enableBackground="new 0 0 12 12" viewBox="0 0 12 12" x="0" y="0" className={cx("tick-icon")} width="16" height="16" style={{ marginLeft: 8 }}>
                <g>
                    <path d="m5.2 10.9c-.2 0-.5-.1-.7-.2l-4.2-3.7c-.4-.4-.5-1-.1-1.4s1-.5 1.4-.1l3.4 3 5.1-7c.3-.4 1-.5 1.4-.2s.5 1 .2 1.4l-5.7 7.9c-.2.2-.4.4-.7.4 0-.1 0-.1-.1-.1z"></path>
                </g>
            </svg>
        </span>
    );

    const handleApplyVoucher = () => {
        if (!voucherCode) {
            toast.warning("Vui lòng nhập mã giảm giá!");
            return;
        }

        if (voucherCode === "GIAM10") {
            toast.success("Áp dụng mã giảm giá 10%!");
        } else {
            toast.error("Mã giảm giá không hợp lệ!");
        }
    };

    const handleCheckout = async () => {
        try {
            const orderData = {
                hoTen: currentAddress.name,
                diaChi: currentAddress.address,
                soDienThoai: currentAddress.phone,
                tongTien: selectedProducts.reduce((sum, item) => sum + item.soLuong * item.gia, 0),
                sanPhams: selectedProducts,
                phuongThucThanhToan: selectedPayment === "option1" ? "COD" : "VNPAY"
            };

            const response = await createOrder(orderData);
            if (response.EC === 0) {
                const id = response.DT.maDonHang;

                if (selectedPayment === "option1") {
                    toast.success("Đặt hàng thành công");
                    navigate('/purchase');
                } else if (selectedPayment === "option2") {
                    const paymentRes = await createPaymentUrl({ maDonHang: id });
                    if (paymentRes.EC === 0) {
                        window.location.href = paymentRes.DT;
                    } else {
                        toast.error("Không thể tạo URL thanh toán.");
                    }
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
                            <div className={cx("header-title")}><h2>Thanh Toán Đơn Hàng</h2></div>
                            <div className={cx("address-title")}> 
                                <FontAwesomeIcon icon={faLocationDot} className={cx("icon")} />
                                <h2>Địa chỉ nhận hàng</h2>
                            </div>
                            {currentAddress && (
                                <div className={cx("address-detail")}> 
                                    <div className={cx("name-user")}>{currentAddress.name}</div>
                                    <div className={cx("phone")}>{currentAddress.phone}</div>
                                    <div className={cx("address")}>{currentAddress.address}</div>
                                    <div className={cx("change-address")}> 
                                        <span style={{ color: 'blue', cursor: 'pointer' }} onClick={() => setIsModalOpen(true)}>Thay đổi</span>
                                    </div>
                                </div>
                            )}

                            <Modal
                            title="Địa Chỉ Của Tôi"
                            open={isModalOpen}
                            onCancel={() => {
                                setIsModalOpen(false);
                                setIsAddingNew(false);
                            }}
                            footer={[
                                <Button key="cancel" onClick={() => {
                                    setIsModalOpen(false);
                                    setIsAddingNew(false);
                                }}>
                                    Hủy
                                </Button>,
                                <Button
                                    key="ok"
                                    type="primary"
                                    onClick={() => {
                                        const selected = addresses.find(addr => addr.id === selectedAddress);
                                        setCurrentAddress(selected);
                                        setIsModalOpen(false);
                                    }}
                                >
                                    Xác nhận
                                </Button>
                            ]}
                        >
                            <Radio.Group
                                onChange={(e) => setSelectedAddress(e.target.value)}
                                value={selectedAddress}
                                style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
                            >
                                {addresses.map(addr => (
                                    <Radio value={addr.id} key={addr.id}>
                                        <div>
                                            <strong>{addr.name}</strong> ({addr.phone})<br />
                                            {addr.address} <br />
                                            {addr.isDefault && <span style={{ color: 'red' }}>Mặc định</span>}
                                        </div>
                                    </Radio>
                                ))}
                            </Radio.Group>

                            {isAddingNew ? (
                                <div style={{ marginTop: 16 }}>
                                    <input
                                        placeholder="Tên người nhận"
                                        value={newAddress.name}
                                        onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                                        style={{ width: '100%', marginBottom: 8 }}
                                    />
                                    <input
                                        placeholder="Số điện thoại"
                                        value={newAddress.phone}
                                        onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                                        style={{ width: '100%', marginBottom: 8 }}
                                    />
                                    <input
                                        placeholder="Địa chỉ"
                                        value={newAddress.address}
                                        onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                                        style={{ width: '100%' }}
                                    />
                                    <Button
                                        type="dashed"
                                        style={{ marginTop: 8 }}
                                        onClick={() => {
                                            const newId = `address_id_${Date.now()}`;
                                            const addr = {
                                                id: newId,
                                                ...newAddress,
                                                isDefault: false
                                            };
                                            setAddresses(prev => [...prev, addr]);
                                            setSelectedAddress(newId);
                                            setNewAddress({ name: '', phone: '', address: '' });
                                            setIsAddingNew(false);
                                        }}
                                    >
                                        Lưu địa chỉ mới
                                    </Button>
                                </div>
                            ) : (
                                <Button
                                    type="dashed"
                                    style={{ marginTop: 16 }}
                                    onClick={() => setIsAddingNew(true)}
                                >
                                    + Thêm Địa Chỉ Mới
                                </Button>
                            )}
                        </Modal>

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
                                        <div>
                                            <div>{ct.tenSanPham}</div>
                                            {ct.mau && (
                                                <div className={cx("color-info")}>
                                                    Màu: <span>{ct.mau}</span>
                                                </div>
                                            )}
                                        </div>
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
                                    <div className={cx("voucher-header")}>Sử dụng mã giảm giá:</div>
                                    <input
                                        value={voucherCode}
                                        onChange={(e) => setVoucherCode(e.target.value)}
                                    />
                                    <div className={cx("voucher-btn")} onClick={() => handleApplyVoucher()}>Áp dụng</div>
                                    {/* <div className={cx("voucher-apply")}>S</div> */}
                                </div>

                                <div className={cx("checkout")}> 
                                    <div className={cx("checkout-option")}> 
                                        <button className={cx({ active: selectedPayment === 'option1' })} onClick={() => setSelectedPayment("option1")}>Thanh toán khi nhận hàng {selectedPayment === "option1" && <TickSvg />}</button>
                                        <button className={cx({ active: selectedPayment === 'option2' })} onClick={() => setSelectedPayment("option2")}>Thanh toán qua VNPAY {selectedPayment === "option2" && <TickSvg />}</button>
                                    </div>
                                    <div className={cx("shipping")}> 
                                        <div className={cx("shipping-header")}>Tiền phí vận chuyển</div>
                                        <div>Miễn phí</div>
                                    </div>
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
