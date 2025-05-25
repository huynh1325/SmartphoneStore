import { useState, useEffect, useCallback } from "react";
import { Table, Button, Space, Modal, Select } from "antd";
import { toast } from "react-toastify";
import { fetchAllOrder } from "../../../util/api";

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
  console.log("Dữ liệu orders đã set:", orders);
}, [orders]);

  const showStatusModal = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.trangThai);
    setIsStatusModalVisible(true);
  };

  const handleUpdateStatus = async () => {
    try {
      const res = await updateOrderStatus(selectedOrder.maDonHang, newStatus);
      if (+res === 0) {
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
      title: "Trạng thái",
      dataIndex: "trangThai",
      key: "trangThai",
      render: (text) => {
        switch (text) {
          case "Cho_Xac_Nhan":
            return "Chờ xác nhận";;
          case "Cho_Thanh_Toan":
            return "Chờ thanh toán";
          case "Da_Thanh_Toan":
            return "Đã thanh toán";
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
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2>Quản lý đơn hàng</h2>
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
          <Option value="Da_Thanh_Toan">Đã thanh toán</Option>
          <Option value="Da_Huy">Đã hủy</Option>
        </Select>
      </Modal>
    </div>
  );
};

export default OrderAdmin;
