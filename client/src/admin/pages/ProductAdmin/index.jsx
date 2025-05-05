import React, { useState } from 'react';
import { Table, Button, Space, Modal, Form, Input, Upload, InputNumber, message, Row, Col } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useCallback, useEffect } from 'react';

const ProductAdmin = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [form] = Form.useForm();
    const [products, setProducts] = useState([]);

    const fetchProducts = useCallback(async () => {
        try {
            const response = await fetch('http://localhost:8080/api/v1/products');
            const result = await response.json();
            if (result.EC === 0) {
                setProducts(result.DT);
            } else {
                console.error('Lỗi API:', result.EM);
            }
        } catch (error) {
            console.error('Lỗi fetch:', error);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleAddProduct = async () => {
      try {
          const values = await form.validateFields();
  
          const formData = new FormData();
          formData.append("tenSanPham", values.tenSanPham);
          formData.append("heDieuHanh", values.heDieuHanh);
          formData.append("cpu", values.cpu);
          formData.append("ram", values.ram);
          formData.append("dungLuongLuuTru", values.dungLuongLuuTru);
          formData.append("inch", values.inch);
          formData.append("gia", values.gia);
          formData.append("nuocSanXuat", values.nuocSanXuat);
          formData.append("nhanHieu", values.nhanHieu);
          formData.append("phanTramGiam", values.phanTramGiam);
        
          if (values.anh && values.anh.length > 0) {
            formData.append("anh", values.anh[0].originFileObj);
          }
  
          const res = await fetch("http://localhost:8080/api/v1/product", {
              method: "POST",
              body: formData,
          });
  
          const data = await res.json();
  
          if (data.EC === 0) {
              message.success("Thêm sản phẩm thành công!");
              setIsModalVisible(false);
              form.resetFields();
              fetchProducts();
          } else {
              message.error(data.EM || "Có lỗi xảy ra!");
          }
      } catch (err) {
          console.error("Lỗi thêm sản phẩm:", err);
          message.error("Lỗi thêm sản phẩm!");
      }
  };

  const columns = [
    {
      title: 'Tên sản phẩm',
      dataIndex: 'tenSanPham',
      key: 'tenSanPham',
    },
    {
      title: 'Hệ điều hành',
      dataIndex: 'heDieuHanh',
      key: 'heDieuHanh',
    },
    {
      title: 'CPU',
      dataIndex: 'cpu',
      key: 'cpu',
    },
    {
      title: 'Nhãn hiệu',
      dataIndex: 'nhanHieu',
      key: 'brand',
    },
    {
      title: 'Giá',
      dataIndex: 'gia',
      key: 'price',
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => editProduct(record)}>Sửa</Button>
          <Button type="link" danger>Xóa</Button>
        </Space>
      ),
    },
  ];

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setIsEdit(false);
    form.resetFields();
  };

  const editProduct = (product) => {
    setIsEdit(true);
    setEditingProduct(product);
    const fileList = product.anh
    ? [
        {
          uid: '-1',
          name: product.anh,
          status: 'done',
          url: `http://localhost:8080/images/${product.anh}`, // hoặc URL tùy theo server bạn lưu ảnh
        },
      ]
    : [];

  // Set lại toàn bộ form value, bao gồm fileList cho ảnh
  form.setFieldsValue({
    ...product,
    anh: fileList,
  });

  setIsModalVisible(true);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        if (isEdit) {
          console.log('Sửa sản phẩm: ', values);
        } else {
          console.log('Thêm sản phẩm: ', values);
        }
        form.resetFields();
        setIsModalVisible(false);
        message.success('Sản phẩm đã được ' + (isEdit ? 'cập nhật' : 'thêm') + ' thành công!');
      })
      .catch((info) => {
        console.log('Validate failed:', info);
      });
  };

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <h2>Danh sách sản phẩm</h2>
        <Button type="primary" onClick={showModal}>Thêm sản phẩm</Button>
      </div>

      <Table dataSource={products} columns={columns} />

      <Modal
        title={isEdit ? "Sửa sản phẩm" : "Thêm sản phẩm"}
        visible={isModalVisible}
        onOk={isEdit ? handleOk : handleAddProduct}
        onCancel={handleCancel}
        okText={isEdit ? "Cập nhật" : "Thêm"}
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Tên sản phẩm"
                name="tenSanPham"
                rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Hệ điều hành"
                name="heDieuHanh"
                rules={[{ required: true, message: 'Vui lòng nhập hệ điều hành!' }]}
                >
                <Input />
                </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="CPU"
                name="cpu"
                rules={[{ required: true, message: 'Vui lòng nhập thông tin CPU!' }]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
            <Form.Item
                    label="Nhãn hiệu"
                    name="nhanHieu"
                    rules={[{ required: true, message: 'Vui lòng nhập nhãn hiệu!' }]}
                    >
                    <Input />
                </Form.Item>

            </Col>

            <Col span={12}>
              <Form.Item
                label="Giá"
                name="gia"
                rules={[{ required: true, message: 'Vui lòng nhập giá sản phẩm!' }]}
              >
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </Col>

            <Col span={12}>
            <Form.Item
            label="Ảnh sản phẩm"
            name="anh"
            valuePropName="fileList"
            getValueFromEvent={e => e && e.fileList}
            rules={[{ required: true, message: 'Vui lòng tải lên ảnh sản phẩm!' }]} >
            <Upload
              listType="picture"
              beforeUpload={() => false} // Không upload tự động
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
            </Upload>
          </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Inch"
                name="inch"
                rules={[{ required: true, message: 'Vui lòng nhập kích thước màn hình!' }]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Giảm giá (%)"
                name="phanTramGiam"
                rules={[{ required: true, message: 'Vui lòng nhập giảm giá!' }]}
              >
                <InputNumber style={{ width: '100%' }} min={0} max={100} />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="RAM"
                name="ram"
                rules={[{ required: true, message: 'Vui lòng nhập dung lượng RAM!' }]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Dung lượng lưu trữ"
                name="dungLuongLuuTru"
                rules={[{ required: true, message: 'Vui lòng nhập dung lượng lưu trữ!' }]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Nước sản xuất"
                name="nuocSanXuat"
                rules={[{ required: true, message: 'Vui lòng nhập nước sản xuất!' }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductAdmin
