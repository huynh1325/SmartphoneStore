import { useState, useCallback, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Input, Upload, InputNumber, Row, Col, Select } from 'antd';
import { toast } from "react-toastify";
import { UploadOutlined } from '@ant-design/icons';
import { createProduct, updateProduct, fetchAllProduct, deleteProduct } from '../../../util/api';

const { Option } = Select;

const colorOptions = ['Đỏ', 'Đen', 'Trắng', 'Vàng', 'Tím', 'Hồng', 'Xám', 'Bạc', 'Xanh dương', 'Xanh lá'];

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
      const res = await fetchAllProduct();
      if (+res.EC === 0) {
        setProducts(res.DT);
      } else {
        toast.error("không lấy được danh sách sản phẩm");
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
      const res = await deleteProduct(deletingProduct.maSanPham);
      if (+res.EC === 0) {
        toast.success("Xóa sản phẩm thành công!");
        fetchProducts();
      } else {
        toast.error(res.EM || "Xóa thất bại!");
      }
    } catch (err) {
      toast.error("Lỗi khi xóa sản phẩm!");
    } finally {
      setIsDeleteModalVisible(false);
      setDeletingProduct(null);
    }
  };

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

    let colors = [];
    try {
      const parsed = typeof product.mau === 'string' ? JSON.parse(product.mau) : product.mau;
      colors = Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      colors = [];
    }

    form.setFieldsValue({
      ...product,
      anh: fileList,
      mau: colors
    });

    setIsModalVisible(true);
  };

  const handleCreateProduct = async () => {
    try {
      const values = await form.validateFields();

      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (key !== 'anh' && key !== 'mau') {
          formData.append(key, value);
        }
      });

      formData.append("mau", JSON.stringify(values.mau));
      if (values.anh && values.anh.length > 0) {
        formData.append("anh", values.anh[0].originFileObj);
      }

      const res = await createProduct(formData);
      if (+res.EC === 0) {
        toast.success(res.EM);
        setIsModalVisible(false);
        form.resetFields();
        fetchProducts();
      } else {
        toast.error(res.EM);
      }
    } catch (err) {
      console.error("Lỗi thêm sản phẩm:", err);
      toast.error("Lỗi thêm sản phẩm!");
    }
  };

  const handleUpdateProduct = async () => {
    try {
      const values = await form.validateFields();

      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (key !== 'anh' && key !== 'mau') {
          formData.append(key, value);
        }
      });

      formData.append("mau", JSON.stringify(values.mau));
      if (values.anh && values.anh.length > 0 && values.anh[0].originFileObj) {
        formData.append("anh", values.anh[0].originFileObj);
      }

      const res = await updateProduct(editingProduct.maSanPham, formData);
      if (+res.EC === 0) {
        toast.success(res.EM);
        setIsModalVisible(false);
        setIsEdit(false);
        form.resetFields();
        fetchProducts();
      } else {
        toast.error(res.EM || "Cập nhật thất bại!");
      }
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      toast.error("Cập nhật thất bại!");
    }
  };

  const columns = [
    {
      title: 'Mã sản phẩm',
      dataIndex: 'maSanPham',
      key: 'maSanPham',
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
      title: 'Giá',
      dataIndex: 'gia',
      key: 'price',
    },
    {
      title: 'Nhà cung cấp',
      key: 'nhaCungCap',
      render: (_, record) => {
        const ncc = record.nhaCungCap;
        if (Array.isArray(ncc) && ncc.length > 0) {
          const uniqueNCC = [...new Set(ncc)];
          return uniqueNCC.join(', ');
        }
        return 'Chưa có';
      },
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
              <Form.Item label="Mã sản phẩm" name="maSanPham" rules={[{ required: true, message: 'Vui lòng nhập mã sản phẩm!' }]}>
                <Input disabled={isEdit} />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Tên sản phẩm" name="tenSanPham" rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}>
                <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Hệ điều hành" name="heDieuHanh" rules={[{ required: true, message: 'Vui lòng nhập hệ điều hành!' }]}>
                <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="CPU" name="cpu" rules={[{ required: true, message: 'Vui lòng nhập thông tin CPU!' }]}>
                <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Chip đồ họa" name="chipDoHoa" rules={[{ required: true, message: 'Vui lòng nhập chip đồ họa!' }]}>
                <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Nhãn hiệu" name="nhanHieu" rules={[{ required: true, message: 'Vui lòng nhập nhãn hiệu!' }]}>
                <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Giá" name="gia" rules={[{ required: true, message: 'Vui lòng nhập giá sản phẩm!' }]}>
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Inch" name="inch" rules={[{ required: true, message: 'Vui lòng nhập kích thước màn hình!' }]}>
                <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Giảm giá (%)" name="phanTramGiam" rules={[{ required: true, message: 'Vui lòng nhập giảm giá!' }]}>
                <InputNumber style={{ width: '100%' }} min={0} max={100} />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="RAM" name="ram" rules={[{ required: true, message: 'Vui lòng nhập dung lượng RAM!' }]}>
                <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Màu sắc" name="mau" rules={[{ required: true, message: 'Vui lòng chọn màu sắc!' }]}>
                <Select mode="multiple" placeholder="Chọn màu">
                  {colorOptions.map((color) => (
                    <Option key={color} value={color}>
                      {color}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Dung lượng lưu trữ" name="dungLuongLuuTru" rules={[{ required: true, message: 'Vui lòng nhập dung lượng lưu trữ!' }]}>
                <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Thẻ nhớ" name="theNho" rules={[{ required: true, message: 'Vui lòng nhập thẻ nhớ!' }]}>
                <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Ảnh sản phẩm"
                name="anh"
                valuePropName="fileList"
                getValueFromEvent={e => e && e.fileList}
                rules={[{ required: true, message: 'Vui lòng tải ảnh sản phẩm!' }]}
              >
                <Upload listType="picture" beforeUpload={() => false} maxCount={1}>
                  <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductAdmin;
