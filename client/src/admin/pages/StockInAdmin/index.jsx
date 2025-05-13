import React, { useState } from 'react';
import { Table, Button, Space, Modal, Form, Input, InputNumber, Row, Col, Select } from 'antd';
import { toast } from "react-toastify";

const StockInAdmin = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [stockInData, setStockInData] = useState([
    {
      id: 1,
      maPhieuNhap: 'PN001',
      maNhaCungCap: 'NCC001',
      products: [
        { maSanPham: 'SP001', soLuong: 10, gia: 100000 },
        { maSanPham: 'SP002', soLuong: 5, gia: 150000 },
      ]
    },
    {
      id: 2,
      maPhieuNhap: 'PN002',
      maNhaCungCap: 'NCC002',
      products: [
        { maSanPham: 'SP003', soLuong: 20, gia: 200000 },
      ]
    },
  ]);

  const [availableProducts, setAvailableProducts] = useState([
    { maSanPham: 'SP001', tenSanPham: 'Sản phẩm 1' },
    { maSanPham: 'SP002', tenSanPham: 'Sản phẩm 2' },
    { maSanPham: 'SP003', tenSanPham: 'Sản phẩm 3' },
    { maSanPham: 'SP004', tenSanPham: 'Sản phẩm 4' },
  ]);

  const [availableSuppliers, setAvailableSuppliers] = useState([
    { maNhaCungCap: 'NCC001', tenNhaCungCap: 'Nhà cung cấp 1' },
    { maNhaCungCap: 'NCC002', tenNhaCungCap: 'Nhà cung cấp 2' },
  ]);

  const [productsInModal, setProductsInModal] = useState([]);

  const generateMaPhieuNhap = () => {
    const newId = stockInData.length + 1;
    return `PN${String(newId).padStart(3, '0')}`;
  };

  const columns = [
    {
      title: 'Mã phiếu nhập',
      dataIndex: 'maPhieuNhap',
      key: 'maPhieuNhap',
    },
    {
      title: 'Mã nhà cung cấp',
      dataIndex: 'maNhaCungCap',
      key: 'maNhaCungCap',
    },
    {
      title: 'Sản phẩm nhập',
      key: 'products',
      render: (text, record) => (
        <Table
          columns={[
            { title: 'Mã sản phẩm', dataIndex: 'maSanPham', key: 'maSanPham' },
            { title: 'Số lượng', dataIndex: 'soLuong', key: 'soLuong' },
            { title: 'Giá', dataIndex: 'gia', key: 'gia' },
          ]}
          dataSource={record.products}
          pagination={false}
          rowKey={(product) => product.maSanPham}
        />
      ),
    },
  ];

  const showModal = () => {
    form.resetFields();
    setProductsInModal([]);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleAddProduct = () => {
    // Nếu chưa có sản phẩm nào thì kiểm tra validate
    if (productsInModal.length === 0) {
      form.validateFields(['maSanPham', 'soLuong', 'gia']).then((values) => {
        setProductsInModal([...productsInModal, values]);
        form.resetFields(['maSanPham', 'soLuong', 'gia']);
      }).catch(() => {
        toast.error('Vui lòng nhập đầy đủ thông tin sản phẩm!');
      });
    } else {
      // Nếu đã có sản phẩm, thêm luôn vào danh sách mà không cần validate
      const values = form.getFieldsValue();
      setProductsInModal([...productsInModal, values]);
      form.resetFields(['maSanPham', 'soLuong', 'gia']);
    }
  };

  const handleAddStockIn = async () => {
    // Kiểm tra nếu chưa có sản phẩm nào thì yêu cầu thêm ít nhất 1 sản phẩm
    if (productsInModal.length === 0) {
      toast.error("Vui lòng thêm ít nhất một sản phẩm vào phiếu nhập!");
      return;
    }

    // Validate các trường trước khi thêm phiếu nhập mới
    const values = await form.validateFields();
    const newStockIn = {
      id: stockInData.length + 1,
      maPhieuNhap: generateMaPhieuNhap(),
      maNhaCungCap: values.maNhaCungCap,
      products: productsInModal,
    };
    setStockInData([...stockInData, newStockIn]);
    toast.success("Thêm phiếu nhập thành công!");
    setIsModalVisible(false);
  };

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <h2>Danh sách phiếu nhập</h2>
        <Button type="primary" onClick={showModal}>Nhập hàng</Button>
      </div>

      <Table dataSource={stockInData} columns={columns} rowKey="id" />

      <Modal
        title="Nhập hàng"
        open={isModalVisible}
        onOk={handleAddStockIn}
        onCancel={handleCancel}
        okText="Thêm"
        cancelText="Hủy"
        width={800}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Mã nhà cung cấp"
                name="maNhaCungCap"
                rules={[{ required: true, message: 'Vui lòng chọn mã nhà cung cấp!' }]}
              >
                <Select>
                  {availableSuppliers.map(supplier => (
                    <Select.Option key={supplier.maNhaCungCap} value={supplier.maNhaCungCap}>
                      {supplier.tenNhaCungCap}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Mã sản phẩm"
                name="maSanPham"
                rules={[{ required: true, message: 'Vui lòng chọn mã sản phẩm!' }]}
              >
                <Select>
                  {availableProducts.map(product => (
                    <Select.Option key={product.maSanPham} value={product.maSanPham}>
                      {product.tenSanPham}
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
                label="Giá"
                name="gia"
                rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}
              >
                <InputNumber style={{ width: '100%' }} min={0} />
              </Form.Item>
            </Col>
          </Row>

          <Button type="dashed" onClick={handleAddProduct} block>
            Thêm sản phẩm
          </Button>
          
          {productsInModal.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <h4>Sản phẩm đã chọn:</h4>
              <Table
                columns={[
                  { title: 'Mã sản phẩm', dataIndex: 'maSanPham', key: 'maSanPham' },
                  { title: 'Số lượng', dataIndex: 'soLuong', key: 'soLuong' },
                  { title: 'Giá', dataIndex: 'gia', key: 'gia' },
                ]}
                dataSource={productsInModal}
                pagination={false}
                rowKey={(product) => product.maSanPham}
              />
            </div>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default StockInAdmin;
