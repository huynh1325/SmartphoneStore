import React, { useState } from 'react';
import { Table, Button, Space, Modal, Form, Input, Upload, InputNumber, message, Row, Col } from 'antd';
import { toast } from "react-toastify";
import { UploadOutlined } from '@ant-design/icons';
import { useCallback, useEffect } from 'react';

const ProductAdmin = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [form] = Form.useForm();
    const [products, setProducts] = useState([]);
    const [deletingProduct, setDeletingProduct] = useState(null);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

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

    const confirmDelete = (product) => {
      setDeletingProduct(product);
      setIsDeleteModalVisible(true);
    };

    const handleDeleteProduct = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/v1/product/${deletingProduct.maSanPham}`, {
          method: "DELETE",
        });
        const data = await res.json();
    
        if (data.EC === 0) {
          toast.success("Xóa sản phẩm thành công!");
          fetchProducts();
        } else {
          toast.error(data.EM || "Xóa thất bại!");
        }
      } catch (err) {
        console.error("Lỗi xóa sản phẩm:", err);
        toast.error("Lỗi khi xóa sản phẩm!");
      } finally {
        setIsDeleteModalVisible(false);
        setDeletingProduct(null);
      }
    };

    const handleCreateProduct = async () => {
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
            toast.success("Thêm sản phẩm thành công!");
            setIsModalVisible(false);
            form.resetFields();
            fetchProducts();
          } else {
            toast.error(data.EM || "Có lỗi xảy ra!");
          }
      } catch (err) {
          console.error("Lỗi thêm sản phẩm:", err);
          toast.error("Lỗi thêm sản phẩm!");
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
          <Button type="link" danger onClick={() => confirmDelete(record)}>Xóa</Button>
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
          url: `http://localhost:8080${product.anh}`,
        },
      ]
    : [];

  form.setFieldsValue({
    ...product,
    anh: fileList,
  });

  setIsModalVisible(true);
  };

  const handleUpdateProduct = async () => {
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

      if (values.anh && values.anh.length > 0 && values.anh[0].originFileObj) {
        formData.append("anh", values.anh[0].originFileObj);
      }
  
      const res = await fetch(`http://localhost:8080/api/v1/product/${editingProduct.maSanPham}`, {
        method: "PUT",
        body: formData,
      });
  

      const data = await res.json();

      console.log(data)
  
      if (data.EC === 0) {
        toast.success(data.EM);
        setIsModalVisible(false);
        setIsEdit(false);
        form.resetFields();
        fetchProducts();
      } else {
        toast.error(data.EM || "Cập nhật thất bại!");
      }
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      toast.error("Cập nhật thất bại!");
    }
  };
  

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <h2>Danh sách sản phẩm</h2>
        <Button type="primary" onClick={showModal}>Thêm sản phẩm</Button>
      </div>

      <Table dataSource={products} columns={columns} rowKey='maSanPham'/>

      <Modal
        title="Xác nhận xóa"
        open={isDeleteModalVisible}
        onOk={handleDeleteProduct}
        onCancel={() => {
          setIsDeleteModalVisible(false);
          setDeletingProduct(null);
        }}
        okText="Xác nhận"
        cancelText="Hủy"
      >
        <p>Bạn có chắc chắn muốn xóa sản phẩm <strong>{deletingProduct?.tenSanPham}</strong> không?</p>
      </Modal>

      <Modal
        title={isEdit ? "Sửa sản phẩm" : "Thêm sản phẩm"}
        open={isModalVisible}
        onOk={isEdit ? handleUpdateProduct : handleCreateProduct}
        onCancel={handleCancel}
        okText={isEdit ? "Cập nhật" : "Thêm"}
        cancelText="Hủy"
        width={1000}
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
              beforeUpload={() => false}
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
