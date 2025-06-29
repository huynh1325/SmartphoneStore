import classNames from 'classnames/bind';
import styles from './Completed.module.scss';
import { useEffect, useState } from 'react';
import { getOrderByUser, updateOrderStatus } from '../../util/api';
import { toast } from "react-toastify";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';
import { Modal } from 'antd';

const cx = classNames.bind(styles);

const Completed = () => {
    const [orders, setOrders] = useState([]);
    const IMAGE_BASE_URL = "http://localhost:8080";

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await getOrderByUser();
                if (+res.EC === 0) {
                    const filtered = res.DT
                        .filter(order => order.trangThaiXuLy === "Hoan_Thanh" || order.trangThaiXuLy === "Tu_Choi_Tra_Hang")
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
            case "Hoan_Thanh":
                return "Hoàn Thành";
            case "Tu_Choi_Tra_Hang":
                return "Yêu cầu trả hàng bị từ chối";
            default:
                return status;
        }
    };

    const handleExportReceipt = async (order) => {
        try {
            const res = await fetch(`http://localhost:8080/api/v1/invoice/${order.maDonHang}`);
            const data = await res.json();

            if (data.EC !== 0) {
                toast.error("Không tìm thấy dữ liệu hóa đơn.");
                return;
            }

            const { hoaDon, nguoiDung, chiTietItems } = data.DT;

            const container = document.getElementById("receipt-pdf-container");
            if (!container) return;

            container.innerHTML = `
            <div style="padding: 20px; font-family: Arial; width: 800px; color: #000; font-size: 20px">
                <h2 style="text-align:center; font-weight: bold; font-size: 24px">HÓA ĐƠN</h2>
                <p><strong>Mã hóa đơn:</strong> ${hoaDon.maHoaDon}</p>
                <p><strong>Ngày:</strong> ${new Date(hoaDon.ngayTao).toLocaleDateString("vi-VN")}</p>
                <p><strong>Khách hàng:</strong> ${nguoiDung.tenNguoiDung}</p>
                <p><strong>Điện thoại:</strong> ${nguoiDung.soDienThoai}</p>
                <p><strong>Địa chỉ giao:</strong> ${hoaDon.diaChiGiaoHang}</p>
                <br />
                <table style="width:100%; border-collapse:collapse; border: 1px solid #000;">
                <thead>
                    <tr>
                    <th style="padding: 8px; border: 1px solid #000;">Tên sản phẩm</th>
                    <th style="padding: 8px; border: 1px solid #000;">Màu</th>
                    <th style="padding: 8px; border: 1px solid #000;">Số lượng</th>
                    <th style="padding: 8px; border: 1px solid #000;">Giá</th>
                    <th style="padding: 8px; border: 1px solid #000;">Thành tiền</th>
                    </tr>
                </thead>
                <tbody>
                    ${chiTietItems.map(item => `
                    <tr>
                        <td style="padding: 8px; border: 1px solid #000;">${item.tenSanPham}</td>
                        <td style="padding: 8px; border: 1px solid #000;">${item.mau}</td>
                        <td style="padding: 8px; border: 1px solid #000;">${item.soLuong}</td>
                        <td style="padding: 8px; border: 1px solid #000;">${Number(item.gia).toLocaleString("vi-VN")}</td>
                        <td style="padding: 8px; border: 1px solid #000;">${(item.soLuong * item.gia).toLocaleString("vi-VN")}</td>
                    </tr>
                    `).join("")}
                </tbody>
                </table>
                <br />
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <strong>Thuế (10%):</strong>
                    <span>${Math.round(hoaDon.tongThanhToan - hoaDon.tongThanhToan / 1.1).toLocaleString("vi-VN")} ₫</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <strong>Giảm giá:</strong>
                    <span>${Number(hoaDon.tongTienGiam).toLocaleString("vi-VN")} ₫</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                    <strong>Thành tiền (đã gồm thuế):</strong>
                    <span>${Number(hoaDon.tongThanhToan).toLocaleString("vi-VN")} ₫</span>
                </div>
            </div>
            `;

            await new Promise(resolve => setTimeout(resolve, 1000));

            const canvas = await html2canvas(container, { scale: 2 });
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");
            const pageWidth = pdf.internal.pageSize.getWidth();
            const imgProps = pdf.getImageProperties(imgData);
            const pdfHeight = (imgProps.height * pageWidth) / imgProps.width;

            pdf.addImage(imgData, 'PNG', 10, 10, pageWidth - 20, pdfHeight * 0.95);
            pdf.save(`hoa-don-${hoaDon.maHoaDon}.pdf`);
            toast.success("Xuất phiếu thu thành công!");

        } catch (err) {
            console.error("Lỗi xuất phiếu thu:", err);
            toast.error("Đã xảy ra lỗi khi xuất phiếu thu.");
        }
    };

    const handleReturnRequest = (order) => {
        Modal.confirm({
            title: 'Xác nhận trả hàng',
            content: `Bạn có chắc chắn muốn gửi yêu cầu trả hàng không?`,
            okText: 'Đồng ý',
            cancelText: 'Hủy',
            onOk: async () => {
            try {
                const res = await updateOrderStatus(order.maDonHang, "Tra_Hang", order.trangThaiThanhToan);

                if (+res.EC === 0) {
                toast.success("Yêu cầu trả hàng đã được gửi.");
                const response = await getOrderByUser();
                if (+response.EC === 0) {
                    const filtered = response.DT
                    .filter(order => order.trangThaiXuLy === "Hoan_Thanh")
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    setOrders(filtered);
                }
                } else {
                toast.error(res.EM || "Không thể gửi yêu cầu trả hàng.");
                }
            } catch (error) {
                toast.error("Lỗi khi gửi yêu cầu trả hàng.");
                console.error(error);
            }
            }
        });
    };

    return (
        <>
            <div className={cx('order-wrapper')}>
                <div
                    id="receipt-pdf-container"
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "1000px",
                        minHeight: "600px",
                        zIndex: -1,
                        background: "#fff",
                        opacity: 0,
                        pointerEvents: "none",
                    }}
                ></div>
                {orders.length === 0 ? (
                    <p className={cx('no-orders')}>Không có đơn hàng hoàn thành.</p>
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
                                        {order.trangThaiXuLy !== "Tu_Choi_Tra_Hang" && (
                                            <button
                                                className={cx('detail-btn')}
                                                onClick={() => handleReturnRequest(order)}
                                            >
                                                Yêu cầu trả hàng
                                            </button>
                                        )}
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

export default Completed;
