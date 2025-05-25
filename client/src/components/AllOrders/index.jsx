import classNames from 'classnames/bind';
import styles from './AllOrders.module.scss';
import { useEffect, useState } from 'react';
import { getOrderByUser } from '../../util/api';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";

const cx = classNames.bind(styles);

const AllOrders = () => {
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();
    const IMAGE_BASE_URL = "http://localhost:8080";

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await getOrderByUser();
                if (+res.EC === 0) {
                    setOrders(res.DT);
                } else {
                    toast.error(res.EM);
                }
            } catch (err) {
                toast.error("Lỗi khi gọi API", err)
            }
        };

        fetchOrders();
    }, []);

    const formatTrangThai = (status) => {
        switch (status) {
            case "Cho_Thanh_Toan":
                return "Chờ Thanh Toán";
            case "Da_Thanh_Toan":
                return "Đã Thanh Toán";
            case "Dang_Giao":
                return "Đang Giao";
            case "Da_Nhan":
                return "Đã Nhận Hàng";
            case "Da_Huy":
                return "Đã Hủy";
            default:
                return status;
        }
    };

    return (
        <div className={cx('order-wrapper')}>
            {orders.map(order => (
                <div key={order.maDonHang} className={cx('order-item')}>
                    <div className={cx('order-header')}>
                        <span className={cx('order-id')}>Đơn hàng: <strong>{order.maDonHang}</strong></span>
                        <span className={cx('order-status')}>{formatTrangThai(order.trangThai)}</span>
                    </div>

                    {order.chiTietDonHang?.map(sp => (
                        <div className={cx('order-body')}>
                            <div className={cx('product-info')}>
                                <img
                                    src={sp.sanPham.anh ? `${IMAGE_BASE_URL}${sp.sanPham.anh}` : ""}
                                    alt="ảnh sản phẩm"
                                    className={cx('product-image')}
                                />
                                <div className={cx('product-name')}>{sp.sanPham.tenSanPham}</div>
                            </div>
                            <div className={cx('order-summary')}>
                                <div className={cx('total-price')}>Tổng tiền: <strong>{sp.gia}</strong></div>
                                <button className={cx('detail-btn')}>Xem chi tiết</button>
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    )
}

export default AllOrders