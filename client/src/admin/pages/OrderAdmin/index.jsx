import { useState, useEffect, useCallback } from "react";
import { Table, Button, Space, Modal, Select } from "antd";
import { toast } from "react-toastify";
import { fetchAllOrder, updateOrderStatus, fetchAllOrderAdmin } from "../../../util/api";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro'

const { Option } = Select;

const OrderAdmin = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [receiptContent, setReceiptContent] = useState(null);
  const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [showReceipt, setShowReceipt] = useState(false);

  const [expandedGroups, setExpandedGroups] = useState({
    Cho_Xac_Nhan: true,
    Dang_Van_Chuyen: false,
    Hoan_Thanh: false,
    Da_Huy: false,
  });

  const toggleGroup = (status) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [status]: !prev[status],
    }));
  };

  const statusOrder = [
    "Cho_Xac_Nhan",
    "Tra_Hang",
    "Dang_Van_Chuyen",
    "Hoan_Thanh",
    "Da_Huy",
  ];

  const statusLabels = {
    Cho_Xac_Nhan: "Chờ xác nhận",
    Tra_Hang: "Trả hàng",
    Dang_Van_Chuyen: "Đang vận chuyển",
    Hoan_Thanh: "Hoàn thành",
    Da_Nhan_Hang: "Đã nhận hàng",
    Da_Huy: "Đã hủy",
  };

  const groupedOrders = statusOrder.reduce((acc, status) => {
    acc[status] = orders.filter((order) => order.trangThaiXuLy === status);
    return acc;
  }, {});

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchAllOrderAdmin();
      if (res) {
        setOrders(res.DT);
      } else {
        toast.error("Không lấy được danh sách đơn hàng");
      }
    } catch (error) {
      toast.error("Lỗi khi lấy đơn hàng");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
  }, [orders]);

  const showStatusModal = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.trangThaiXuLy);
    setIsStatusModalVisible(true);
  };

  const handleUpdateStatus = async () => {
    try {
      let trangThaiThanhToan = selectedOrder.trangThaiThanhToan;

      if (newStatus === "Hoan_Thanh") {
        trangThaiThanhToan = "Da_Thanh_Toan";
      }

      const res = await updateOrderStatus(
        selectedOrder.maDonHang,
        newStatus,
        trangThaiThanhToan
      );

      if (+res.EC === 0) {
        toast.success("Cập nhật trạng thái thành công");
        fetchOrders();
      } else {
        toast.error(res.EM || "Cập nhật thất bại");
      }
    } catch (error) {
      toast.error("Lỗi cập nhật trạng thái");
      console.error(error);
    } finally {
      setIsStatusModalVisible(false);
      setSelectedOrder(null);
    }
  };

  const handleReturnConfirmation = async (order) => {
    Modal.confirm({
      title: "Xác nhận trả hàng",
      content: `Bạn có chắc chắn muốn đồng ý yêu cầu trả hàng cho đơn ${order.maDonHang}?`,
      okText: "Đồng ý",
      cancelText: "Không đồng ý",
      onOk: async () => {
        try {
          const res = await updateOrderStatus(
            order.maDonHang,
            "Da_Huy",
            order.trangThaiThanhToan
          );
          if (+res.EC === 0) {
            toast.success("Đã xác nhận yêu cầu trả hàng (Đơn đã hủy)");
            fetchOrders();
          } else {
            toast.error(res.EM || "Xác nhận thất bại");
          }
        } catch (error) {
          console.error("Lỗi khi xác nhận trả hàng:", error);
          toast.error("Đã xảy ra lỗi");
        }
      },
      onCancel: async () => {
        try {
          const res = await updateOrderStatus(
            order.maDonHang,
            "Tu_Choi",
            order.trangThaiThanhToan
          );
          if (+res.EC === 0) {
            toast.success("Đã từ chối yêu cầu trả hàng");
            fetchOrders();
          } else {
            toast.error(res.EM || "Thao tác thất bại");
          }
        } catch (error) {
          console.error("Lỗi khi từ chối trả hàng:", error);
          toast.error("Đã xảy ra lỗi");
        }
      },
    });
  };

  const columns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "maDonHang",
      key: "maDonHang",
    },
    {
      title: "Mã người dùng",
      dataIndex: "maNguoiDung",
      key: "maNguoiDung",
    },
    {
      title: "Phương thức thanh toán",
      dataIndex: "phuongThucThanhToan",
      key: "phuongThucThanhToan",
      render: (text) => {
        if (text === "COD") return "Thanh toán khi nhận hàng";
        if (text === "VNPAY") return "VNPAY";
        return text;
      },
    },
    {
      title: "Thanh toán",
      dataIndex: "trangThaiThanhToan",
      key: "trangThaiThanhToan",
      render: (text) => {
        if (text === "Da_Thanh_Toan") return "Đã thanh toán";
        if (text === "Chua_Thanh_Toan") return "Chưa thanh toán";
        return text;
      }
    },
    {
      title: "Trạng thái",
      dataIndex: "trangThaiXuLy",
      key: "trangThaiXuLy",
      render: (text) => {
        switch (text) {
          case "Cho_Xac_Nhan":
            return "Chờ xác nhận";;
          case "Tra_Hang":
            return "Trả hàng";
          case "Dang_Van_Chuyen":
            return "Đang vận chuyển";
          case "Hoan_Thanh":
            return "Hoàn thành";
          case "Da_Huy":
            return "Đã hủy";
          default:
            return text;
        }
      },
    },{
        title: "Thao tác",
        key: "action",
        render: (_, record) => {
          if (record.trangThaiXuLy === "Da_Huy") {
            return record.trangThaiThanhToan === "Da_Thanh_Toan" ? (
              <Button type="primary" onClick={() => handleRefund(record)}>
                Hoàn tiền
              </Button>
            ) : null;
          }

          if (record.trangThaiXuLy === "Tra_Hang") {
            return (
              <Button type="primary" onClick={() => handleReturnConfirmation(record)}>
                Xác nhận yêu cầu trả hàng
              </Button>
            );
          }

          return (
            <Space>
              <Button type="primary" onClick={() => showStatusModal(record)}>
                Cập nhật trạng thái
              </Button>

              {record.trangThaiThanhToan === "Da_Thanh_Toan" && (
                <Button type="primary" onClick={() => handleExportReceipt(record)}>
                  Xuất phiếu thu
                </Button>
              )}
            </Space>
          );
        },
      },

  ];

const handleExportReceipt = async (order) => {
  try {
    const res = await fetch(`http://localhost:8080/api/v1/invoice/${order.maDonHang}`);
    const data = await res.json();

    if (data.EC !== 0) {
      toast.error("Không tìm thấy dữ liệu hóa đơn.");
      return;
    }

    const { hoaDon, nguoiDung, chiTietItems } = data.DT;

    const cellStyle = { padding: 8, border: "1px solid #000" };
    const rowStyle = { display: "flex", justifyContent: "space-between", marginBottom: 5 };

    setReceiptContent(
      <div style={{ padding: 20, fontFamily: "Arial", width: 800, color: "#000", fontSize: 20 }}>
        <h2 style={{ textAlign: "center", fontWeight: "bold", fontSize: 24 }}>PHIẾU THU</h2>
        <p><strong>Mã phiếu thu:</strong> {hoaDon.maHoaDon}</p>
        <p><strong>Ngày:</strong> {new Date(hoaDon.ngayTao).toLocaleDateString("vi-VN")}</p>
        <p><strong>Khách hàng:</strong> {nguoiDung.tenNguoiDung}</p>
        <p><strong>Điện thoại:</strong> {nguoiDung.soDienThoai}</p>
        <p><strong>Địa chỉ giao:</strong> {hoaDon.diaChiGiaoHang}</p>
        <br />
        <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #000" }}>
          <thead>
            <tr>
              <th style={cellStyle}>Tên sản phẩm</th>
              <th style={cellStyle}>Màu</th>
              <th style={cellStyle}>Số lượng</th>
              <th style={cellStyle}>Giá</th>
              <th style={cellStyle}>Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {chiTietItems.map(item => (
              <tr key={item.maChiTietDonHang}>
                <td style={cellStyle}>{item.tenSanPham}</td>
                <td style={cellStyle}>{item.mau}</td>
                <td style={cellStyle}>{item.soLuong}</td>
                <td style={cellStyle}>{Number(item.gia).toLocaleString("vi-VN")}</td>
                <td style={cellStyle}>{(item.soLuong * item.gia).toLocaleString("vi-VN")}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <br />
        <div style={rowStyle}><strong>Thuế (10%):</strong><span>{Math.round(hoaDon.tongThanhToan - hoaDon.tongThanhToan / 1.1).toLocaleString("vi-VN")} ₫</span></div>
        <div style={rowStyle}><strong>Giảm giá:</strong><span>{Number(hoaDon.tongTienGiam).toLocaleString("vi-VN")} ₫</span></div>
        <div style={rowStyle}><strong>Thành tiền (đã gồm thuế):</strong><span>{Number(hoaDon.tongThanhToan).toLocaleString("vi-VN")} ₫</span></div>
      </div>
    );
    setShowReceipt(true);

  } catch (err) {
    console.error("Lỗi xuất phiếu thu:", err);
    toast.error("Đã xảy ra lỗi khi xuất phiếu thu.");
  }
};


useEffect(() => {
  const exportPDF = async () => {
    if (!receiptContent) return;
    await new Promise(resolve => setTimeout(resolve, 1000)); 
    const container = document.getElementById("receipt-pdf-container");
    if (!container) return;

    const canvas = await html2canvas(container, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfHeight = (imgProps.height * pageWidth) / imgProps.width;

    pdf.addImage(imgData, 'PNG', 10, 10, pageWidth - 20, pdfHeight * 0.95);
    pdf.save(`phieu-thu.pdf`);
    toast.success("Xuất phiếu thu thành công");

    setReceiptContent(null);
     setShowReceipt(false); 
  };

  exportPDF();
}, [receiptContent]);


return (
  <div>
    <h2>Quản lý đơn hàng</h2>

  <div
    id="receipt-pdf-container"
    style={{
      position: "absolute",
      top: 5000,
      left: 5000,
      width: "1000px",
      background: "#fff",
      zIndex: 9999,
      display: showReceipt ? "block" : "none",
    }}
  >
    {receiptContent}
  </div>

    {statusOrder.map((status) => (
      <div key={status} style={{ marginBottom: "24px", border: "1px solid #ddd", borderRadius: "8px" }}>
        <div
          onClick={() => toggleGroup(status)}
          style={{
            background: "#f5f5f5",
            padding: "10px 16px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {statusLabels[status]} ({groupedOrders[status]?.length || 0})
          <span>{expandedGroups[status] ? "▲" : "▼"}</span>
        </div>

        {expandedGroups[status] && (
          <Table
            dataSource={groupedOrders[status]}
            columns={columns}
            rowKey="maDonHang"
            pagination={false}
          />
        )}
      </div>
    ))}

    <Modal
      title={`Cập nhật trạng thái đơn hàng ${selectedOrder?.maDonHang}`}
      visible={isStatusModalVisible}
      onOk={handleUpdateStatus}
      onCancel={() => setIsStatusModalVisible(false)}
      okText="Cập nhật"
      cancelText="Hủy"
    >
      <Select
        value={newStatus}
        onChange={setNewStatus}
        style={{ width: "100%" }}
      >
        {Object.keys(statusLabels).map((key) => (
          <Option key={key} value={key}>
            {statusLabels[key]}
          </Option>
        ))}
      </Select>
    </Modal>
  </div>
);

};

export default OrderAdmin;
