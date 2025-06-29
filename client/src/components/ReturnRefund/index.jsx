import classNames from 'classnames/bind';
import styles from './ReturnRefund.module.scss';
import { useEffect, useState } from 'react';
import { getOrderByUser, updateOrderStatus } from '../../util/api';
import { toast } from "react-toastify";
import { Modal } from 'antd';

const cx = classNames.bind(styles);

const ReturnRefund = () => {
    const [orders, setOrders] = useState([]);
    const IMAGE_BASE_URL = "http://localhost:8080";

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await getOrderByUser();
                if (+res.EC === 0) {
                    const filtered = res.DT
                        .filter(order => order.trangThaiXuLy === "Tra_Hang")
                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    setOrders(filtered);
                } else {
                    toast.error(res.EM);
                }
            } catch (err) {
                toast.error("Lỗi khi gọi API", err);
            }
        };

        fetchOrders();
    }, []);

    const formatTrangThaiXuLy = (status) => {
        switch (status) {
            case "Tra_Hang":
                return "Chờ duyệt";
            default:
                return status;
        }
    };

    const handleReturnRequest = (order) => {
        Modal.confirm({
            title: 'Xác nhận trả hàng',
            content: `Bạn có chắc chắn muốn hủy yêu cầu trả hàng không?`,
            okText: 'Đồng ý',
            cancelText: 'Hủy',
            onOk: async () => {
            try {
                const res = await updateOrderStatus(order.maDonHang, "Hoan_Thanh", order.trangThaiThanhToan);

                if (+res.EC === 0) {
                toast.success("Hủy yêu cầu trả hàng thành công");
                const response = await getOrderByUser();
                if (+response.EC === 0) {
                    const filtered = response.DT
                    .filter(order => order.trangThaiXuLy === "Tra_Hang")
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    setOrders(filtered);
                }
                } else {
                toast.error(res.EM || "Không thể hoàn yêu cầu trả hàng.");
                }
            } catch (error) {
                toast.error("Lỗi khi hoàn yêu cầu trả hàng.");
                console.error(error);
            }
            }
        });
    };

    return (
        <>
            <div className={cx('order-wrapper')}>
                {orders.length === 0 ? (
                    <p className={cx('no-orders')}>Không có đơn hàng yêu cầu trả hàng.</p>
                ) : (
                    orders.map(order => (
                        <div key={order.maDonHang} className={cx('order-item')}>
                            <div className={cx('order-header')}>
                                <span className={cx('order-id')}>Đơn hàng: <strong>#{order.maDonHang}</strong></span>
                                <span className={cx('order-status')}>{formatTrangThaiXuLy(order.trangThaiXuLy)}</span>
                            </div>

                            <div className={cx('order-content')}>
                                <div className={cx('product-list')}>
                                    {order.chiTietDonHang?.map(sp => (
                                        <div key={sp.id} className={cx('order-body')}>
                                            <div className={cx('product-info')}>
                                                <img
                                                    src={sp.sanPham.anh ? `${IMAGE_BASE_URL}${sp.sanPham.anh}` : ""}
                                                    alt="ảnh sản phẩm"
                                                    className={cx('product-image')}
                                                />
                                                <div className={cx('product-name')}>
                                                    {sp.sanPham.tenSanPham}
                                                    <div className={cx('product-quantity')}>Số lượng: {sp.soLuong}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className={cx('order-summary')}>
                                    <div className={cx('total-price')}>
                                        Tổng tiền: <strong>{Number(order.tongTienHang).toLocaleString('vi-VN')}₫</strong>
                                    </div>
                                    <div className={cx('button-group')}>
                                        <button
                                            className={cx('detail-btn')}
                                            onClick={() => handleExportReceipt(order)}
                                        >
                                            Xuất hóa đơn
                                        </button>
                                        <button
                                            className={cx('detail-btn')}
                                            onClick={() => handleReturnRequest(order)}
                                        >
                                            Hủy trả hàng
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </>
    );
};

export default ReturnRefund;
