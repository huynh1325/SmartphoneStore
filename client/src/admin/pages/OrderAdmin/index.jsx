import { useState, useEffect, useCallback } from "react";
import { Table, Button, Space, Modal, Select } from "antd";
import { toast } from "react-toastify";
import { fetchAllOrder, updateOrderStatus } from "../../../util/api";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro'

const { Option } = Select;

const OrderAdmin = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchAllOrder();
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
      const res = await updateOrderStatus(selectedOrder.maDonHang, newStatus);
      console.log(selectedOrder.maDonHang, newStatus)
      if (+res.EC === 0) {
        toast.success("Cập nhật trạng thái thành công");
        fetchOrders();
      } else {
        toast.error(res.EM || "Cập nhật thất bại");
      }
    } catch (error) {
      toast.error("Lỗi cập nhật trạng thái");
      console.error(error);
    }
    setIsStatusModalVisible(false);
    setSelectedOrder(null);
  };

  const handleDeleteOrder = async (order) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: `Bạn có chắc chắn muốn xóa đơn hàng ${order.maDonHang}?`,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          const res = await deleteOrder(order.maDonHang);
          if (+res.EC === 0) {
            toast.success("Xóa đơn hàng thành công");
            fetchOrders();
          } else {
            toast.error(res.EM || "Xóa thất bại");
          }
        } catch (error) {
          toast.error("Lỗi xóa đơn hàng");
          console.error(error);
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
          case "Cho_Thanh_Toan":
            return "Chờ thanh toán";
          case "Da_Thanh_Toan":
            return "Đã thanh toán";
          case "Dang_Giao_Hang":
            return "Đang giao hàng";
          case "Da_Giao":
            return "Giao hàng thành công";
          case "Da_Huy":
            return "Đã hủy";
          default:
            return text;
        }
      },
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => showStatusModal(record)}>
            Cập nhật trạng thái
          </Button>
          <Button type="link" danger onClick={() => handleDeleteOrder(record)}>
            Xóa
          </Button>
          {record.trangThaiThanhToan === "Da_Thanh_Toan" && (
            <Button type="link" onClick={() => handleExportReceipt(record)}>
              Xuất phiếu thu
            </Button>
          )}
        </Space>
      ),
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

      const container = document.getElementById("receipt-pdf-container");
      if (!container) return;

      container.innerHTML = `
        <div style="padding: 20px; font-family: Arial; width: 800px; color: #000; font-size: 20px">
          <h2 style="text-align:center; font-weight: bold; font-size: 24px">PHIẾU THU</h2>
          <p><strong>Mã phiếu thu:</strong> ${hoaDon.maHoaDon}</p>
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
          <p><strong>Tổng tiền hàng:</strong> ${Number(hoaDon.tongTienHang).toLocaleString("vi-VN")} ₫</p>
          <p><strong>Giảm giá:</strong> ${Number(hoaDon.tongTienGiam).toLocaleString("vi-VN")} ₫</p>
          <p><strong>Thành tiền:</strong> ${Number(hoaDon.tongThanhToan).toLocaleString("vi-VN")} ₫</p>
        </div>
      `;

      await new Promise(resolve => setTimeout(resolve, 100));

      const canvas = await html2canvas(container, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfHeight = (imgProps.height * pageWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 10, 10, pageWidth - 20, pdfHeight * 0.95);
      pdf.save(`phieu-thu-${hoaDon.maHoaDon}.pdf`);
      toast.success("Xuất phiếu thu thành công");
    } catch (err) {
      console.error("Lỗi xuất phiếu thu:", err);
      toast.error("Đã xảy ra lỗi khi xuất phiếu thu.");
    }
  };

  return (
    <div>
      <h2>Quản lý đơn hàng</h2>
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
        }}
      ></div>
      <Table
        dataSource={Array.isArray(orders) ? orders : []}
        columns={columns}
        rowKey="maDonHang"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

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
          <Option value="Cho_Xac_Nhan">Chờ xác nhận</Option>
          <Option value="Cho_Thanh_Toan">Chờ thanh toán</Option>
          <Option value="Da_Thanh_Toan">Đã thanh toán</Option>
          <Option value="Dang_Giao_Hang">Đang giao hàng</Option>
          <Option value="Da_Giao">Giao hàng thành công</Option>
          <Option value="Da_Huy">Đã hủy</Option>
        </Select>
      </Modal>
    </div>
  );
};

export default OrderAdmin;
