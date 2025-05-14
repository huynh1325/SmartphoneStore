import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, InputNumber, Row, Col, Select, Space } from 'antd';
import { toast } from 'react-toastify';

const StockInAdmin = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [stockInData, setStockInData] = useState([]);
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  const fetchStockInData = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/stockin');
      const result = await response.json();
      if (result.EC === 0) {
        setStockInData(result.DT);
      } else {
        console.error(result.EM);
        toast.error(result.EM);
      }
    } catch (error) {
      console.error(error);
      toast.error('Không thể lấy dữ liệu phiếu nhập!');
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/products');
      const result = await response.json();
      if (result.EC === 0) {
        setProducts(result.DT);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/suppliers');
      const result = await response.json();
      if (result.EC === 0) {
        setSuppliers(result.DT);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchStockInData();
    fetchProducts();
    fetchSuppliers();
  }, []);

  const showModal = () => {
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleAddStockIn = async (values) => {
  try {
    const response = await fetch('http://localhost:8080/api/v1/stockin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });

    const result = await response.json();
    if (result.EC === 0) {
      toast.success(result.EM || 'Nhập hàng thành công!');
      fetchStockInData();
      setIsModalVisible(false);
    } else {
      toast.error(result.EM || 'Đã có lỗi xảy ra!');
    }
  } catch (error) {
    toast.error('Đã có lỗi xảy ra trong quá trình gửi dữ liệu!');
    console.error(error);
  }
};

  const columns = [
    {
      title: 'Mã phiếu nhập',
      dataIndex: 'maPhieuNhap',
      key: 'maPhieuNhap',
    },
    {
      title: 'Tên nhà cung cấp',
      dataIndex: 'tenNhaCungCap',
      key: 'tenNhaCungCap',
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'tenSanPham',
      key: 'tenSanPham',
    },
    {
      title: 'Số lượng',
      dataIndex: 'soLuong',
      key: 'soLuong',
    },
    {
      title: 'Đơn giá',
      dataIndex: 'donGia',
      key: 'donGia',
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <h2>Danh sách phiếu nhập</h2>
        <Button type="primary" onClick={showModal}>Nhập hàng</Button>
      </div>

      <Table dataSource={stockInData} columns={columns} rowKey="maPhieuNhap" />

      <Modal
        title="Nhập hàng"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={800}
      >
        <Form form={form} layout="vertical" onFinish={handleAddStockIn}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Nhà cung cấp"
                name="maNhaCungCap"
                rules={[{ required: true, message: 'Vui lòng chọn nhà cung cấp!' }]}
              >
                <Select>
                  {suppliers.map((s) => (
                    <Select.Option key={s.maNhaCungCap} value={s.maNhaCungCap}>
                      {s.tenNhaCungCap}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Sản phẩm"
                name="maSanPham"
                rules={[{ required: true, message: 'Vui lòng chọn sản phẩm!' }]}
              >
                <Select>
                  {products.map((p) => (
                    <Select.Option key={p.maSanPham} value={p.maSanPham}>
                      {p.tenSanPham}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Số lượng"
                name="soLuong"
                rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}
              >
                <InputNumber style={{ width: '100%' }} min={1} />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Đơn giá"
                name="donGia"
                rules={[{ required: true, message: 'Vui lòng nhập đơn giá!' }]}
              >
                <InputNumber style={{ width: '100%' }} min={0} />
              </Form.Item>
            </Col>
          </Row>

          <div style={{ marginTop: 24, textAlign: 'right' }}>
            <Space>
              <Button onClick={handleCancel}>Hủy</Button>
              <Button type="primary" htmlType="submit">Nhập hàng</Button>
            </Space>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default StockInAdmin;
