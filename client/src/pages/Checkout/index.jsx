import Header from "../../components/Header"
import classNames from 'classnames/bind';
import styles from './Checkout.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect, useContext } from "react";
import { createOrder, createPaymentUrl, getVoucherByCode } from "../../util/api";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../../components/Context/AuthContext";
import AddressModal from "../../components/Address";
import axios from "axios";

const cx = classNames.bind(styles);

const Checkout = () => {
    const [selectedPayment, setSelectedPayment] = useState("option1");
    const IMAGE_BASE_URL = "http://localhost:8080";
    const location = useLocation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState('address_id_1');
    const selectedProducts = location.state?.sanPhams || [];
    const [voucherCode, setVoucherCode] = useState('');
    const [appliedVouchers, setAppliedVouchers] = useState([]);
    const [selectedVoucher, setSelectedVoucher] = useState(null);

    const [addresses, setAddresses] = useState([]);
    const [currentAddress, setCurrentAddress] = useState(null);

    const navigate = useNavigate();

    const { auth } = useContext(AuthContext);
    const fullName = auth.user.name || "";
    const phone = auth.user.phone || "";
    const lastName = fullName.trim().split(" ").slice(-1)[0];

    useEffect(() => {
        console.log("currentAddress vừa cập nhật:", currentAddress);
    }, [currentAddress]);

    const TickSvg = () => (
        <span className={cx("tick-wrapper")}> 
            <svg enableBackground="new 0 0 12 12" viewBox="0 0 12 12" x="0" y="0" className={cx("tick-icon")} width="16" height="16" style={{ marginLeft: 8 }}>
                <g>
                    <path d="m5.2 10.9c-.2 0-.5-.1-.7-.2l-4.2-3.7c-.4-.4-.5-1-.1-1.4s1-.5 1.4-.1l3.4 3 5.1-7c.3-.4 1-.5 1.4-.2s.5 1 .2 1.4l-5.7 7.9c-.2.2-.4.4-.7.4 0-.1 0-.1-.1-.1z"></path>
                </g>
            </svg>
        </span>
    );
    
    const fetchAddresses = async () => {
        try {
            const token = localStorage.getItem('access_token');
            const res = await axios.get('http://localhost:8080/api/v1/address', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const list = res.data || [];
            setAddresses(list);

            const defaultAddr = list.find(addr => addr.isDefault);
            setCurrentAddress(defaultAddr || list[0]);

            return list;
        } catch (err) {
            console.error("Lỗi khi lấy địa chỉ:", err);
        }
    };

    useEffect(() => {
        fetchAddresses();
    }, []);

    const handleNewAddressAdded = async (newAddr) => {
        const updated = await fetchAddresses();
        const matchedAddr = updated.find(addr => addr.maDiaChi === newAddr.maDiaChi);

        setSelectedAddress(matchedAddr?.maDiaChi || null);
        setCurrentAddress(matchedAddr || null);
    };

    const handleApplyVoucher = async () => {
        if (!voucherCode) {
            toast.warning("Vui lòng nhập mã giảm giá!");
            return;
        }

        if (appliedVouchers.some(v => v.maNhap === voucherCode)) {
            toast.info("Mã đã được áp dụng trước đó!");
            return;
        }

        const res = await getVoucherByCode(voucherCode.trim());

        if (res.EC === 0 && res.DT) {
            toast.success(`Thêm mã thành công: ${voucherCode}`);
            setAppliedVouchers(prev => [...prev, res.DT]);
            setSelectedVoucher(res.DT);
            setVoucherCode('');
        } else {
            toast.error("Mã giảm giá không hợp lệ hoặc đã hết hạn!");
        }
    };

    const calculateDiscount = () => {
        const total = selectedProducts.reduce((sum, item) => sum + item.soLuong * item.gia, 0);
        let discount = 0;

        if (!selectedVoucher) return 0;

        if (selectedVoucher.kieuGiamGia === "giamThang") {
            discount = parseFloat(selectedVoucher.giaTriGiam);
        } else if (selectedVoucher.kieuGiamGia === "phanTram") {
            discount = (total * parseFloat(selectedVoucher.giaTriGiam)) / 100;

            if (selectedVoucher.giaTriGiamToiDa != null) {
                discount = Math.min(discount, parseFloat(selectedVoucher.giaTriGiamToiDa));
            }
        }

        return Math.min(discount, total);
    };


    const handleCheckout = async () => {
        const tongTienHang = selectedProducts.reduce(
            (sum, item) => sum + item.soLuong * item.gia,
            0
        );

        const tongTienGiam = calculateDiscount();
        const tongThanhToan = tongTienHang - tongTienGiam;

        if (!currentAddress) {
            toast.warn("Vui lòng chọn địa chỉ giao hàng!");
            return;
        }

        try {
            const orderData = {
                hoTen: auth.user.lastName,
                diaChi: `${currentAddress.diaChiChiTiet}, ${currentAddress.phuongXa}, ${currentAddress.quanHuyen}, ${currentAddress.tinhThanh}`,
                soDienThoai: auth.user.phone,
                tongTienHang,
                tongTienGiam,
                tongThanhToan,
                sanPhams: selectedProducts,
                phuongThucThanhToan: selectedPayment === "option1" ? "COD" : "VNPAY",
                maKhuyenMai: selectedVoucher?.maKhuyenMai ?? null
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
        const discount = calculateDiscount();
        return total - discount;
    };

    const formatCurrency = (num) => {
        return num.toLocaleString('vi-VN') + 'đ';
    };

    return (
        <>
            <Header />
            <AddressModal
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                setAddresses={setAddresses}
                addresses={addresses}
                selectedAddress={selectedAddress}
                setSelectedAddress={setSelectedAddress}
                setCurrentAddress={setCurrentAddress}
                onNewAddressAdded={handleNewAddressAdded}
            />
            <div className={cx("main")}> 
                <div className={cx("wrapper")}> 
                    <div className={cx("container")}> 
                        <div className={cx("container-content")}> 
                            <div className={cx("header-title")}><h2>Thanh Toán Đơn Hàng</h2></div>
                            <div className={cx("address-title")}> 
                                <FontAwesomeIcon icon={faLocationDot} className={cx("icon")} />
                                <h2>Địa chỉ nhận hàng</h2>
                            </div>
                            <div className={cx("address-detail")}> 
                                <div className={cx("name-user")}>{lastName}</div>
                                <div className={cx("phone")}>{phone}</div>

                                {currentAddress ? (
                                    <>
                                        <div className={cx("address")}>
                                            {currentAddress.diaChiChiTiet}, {currentAddress.phuongXa}, {currentAddress.quanHuyen}, {currentAddress.tinhThanh}
                                        </div>
                                        <div className={cx("change-address")}>
                                        <span
                                            style={{ color: 'blue', cursor: 'pointer' }}
                                            onClick={() => setIsModalOpen(true)}
                                        >
                                            Thay đổi
                                        </span>
                                        </div>
                                    </>
                                    ) : (
                                    <div className={cx("change-address")}>
                                        <span
                                        style={{ color: 'blue', cursor: 'pointer' }}
                                        onClick={() => setIsModalOpen(true)}
                                        >
                                        Thêm địa chỉ
                                        </span>
                                    </div>
                                    )}
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
                                    <div className={cx("voucher-list")}>
                                        {appliedVouchers.map((voucher, index) => (
                                            <div
                                                key={index}
                                                className={cx("applied-voucher", {
                                                    active: selectedVoucher?.maNhap === voucher.maNhap
                                                })}
                                                onClick={() => setSelectedVoucher(voucher)}
                                            >
                                                {voucher.maNhap} {selectedVoucher?.maNhap === voucher.maNhap && <TickSvg />}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className={cx("checkout")}> 
                                    <div className={cx("checkout-option")}> 
                                        <button className={cx({ active: selectedPayment === 'option1' })} onClick={() => setSelectedPayment("option1")}>Thanh toán khi nhận hàng {selectedPayment === "option1" && <TickSvg />}</button>
                                        <button className={cx({ active: selectedPayment === 'option2' })} onClick={() => setSelectedPayment("option2")}>Thanh toán qua VNPAY {selectedPayment === "option2" && <TickSvg />}</button>
                                    </div>
                                    <div className={cx("price")}>
                                        <div className={cx("shipping")}>
                                            <div className={cx("shipping-header")}>Tiền phí vận chuyển</div>
                                            <div>Miễn phí</div>
                                        </div>
                                        <div className={cx("price-original")}>
                                            <div className={cx("price-original-header")}>
                                                Tổng tiền hàng
                                            </div>
                                            <div>
                                                {formatCurrency(selectedProducts.reduce((sum, item) => sum + item.soLuong * item.gia, 0))}
                                            </div>
                                        </div>
                                        <div className={cx("discount")}>
                                            <div className={cx("discount-header")}>Tổng tiền giảm giá</div>
                                            <div>-{formatCurrency(calculateDiscount())}</div>
                                        </div>
                                        
                                        <div className={cx("price-total")}>
                                            <div className={cx("price-total-header")}>Tổng thanh toán</div>
                                            <div>{formatCurrency(calculateTotal())}</div>
                                        </div>
                                    </div>
                                    <div className={cx("buy")}>
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
