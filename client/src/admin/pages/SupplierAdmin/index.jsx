import { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Space, Popconfirm } from 'antd';
import { toast } from 'react-toastify';

const SupplierAdmin = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingSupplier, setEditingSupplier] = useState(null);

  const fetchSuppliers = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/suppliers');
      const result = await response.json();
      if (result.EC === 0) {
        setSuppliers(result.DT);
      } else {
        toast.error(result.EM || 'Lỗi khi lấy dữ liệu nhà cung cấp');
      }
    } catch (error) {
      console.error(error);
      toast.error('Không thể lấy danh sách nhà cung cấp!');
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const showModal = (supplier = null) => {
    if (supplier) {
      form.setFieldsValue({ tenNhaCungCap: supplier.tenNhaCungCap });
      setEditingSupplier(supplier);
    } else {
      form.resetFields();
      setEditingSupplier(null);
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingSupplier(null);
  };

  const handleSubmitSupplier = async () => {
    try {
      const values = await form.validateFields();

      let url = 'http://localhost:8080/api/v1/suppliers';
      let method = 'POST';

      if (editingSupplier) {
        url = `http://localhost:8080/api/v1/suppliers/${editingSupplier.maNhaCungCap}`;
        method = 'PUT';
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const result = await response.json();
      if (result.EC === 0) {
        toast.success(result.EM || (editingSupplier ? 'Cập nhật thành công!' : 'Thêm thành công!'));
        fetchSuppliers();
        setIsModalVisible(false);
        setEditingSupplier(null);
      } else {
        toast.error(result.EM || 'Thao tác thất bại!');
      }
    } catch (error) {
      toast.error('Vui lòng nhập đầy đủ thông tin!');
    }
  };

  const handleDeleteSupplier = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/suppliers/${id}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      if (result.EC === 0) {
        toast.success('Xóa thành công!');
        fetchSuppliers();
      } else {
        toast.error(result.EM || 'Xóa thất bại!');
      }
    } catch (error) {
      toast.error('Lỗi khi xóa nhà cung cấp!');
    }
  };

  const columns = [
    {
      title: 'Mã nhà cung cấp',
      dataIndex: 'maNhaCungCap',
      key: 'maNhaCungCap',
    },
    {
      title: 'Tên nhà cung cấp',
      dataIndex: 'tenNhaCungCap',
      key: 'tenNhaCungCap',
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => showModal(record)}>Sửa</Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa nhà cung cấp này không?"
            onConfirm={() => handleDeleteSupplier(record.maNhaCungCap)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button type="link" danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <h2>Danh sách nhà cung cấp</h2>
        <Button type="primary" onClick={() => showModal()}>Thêm nhà cung cấp</Button>
      </div>

      <Table dataSource={suppliers} columns={columns} rowKey="maNhaCungCap" />

      <Modal
        title={editingSupplier ? 'Cập nhật nhà cung cấp' : 'Thêm nhà cung cấp'}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmitSupplier}>
          <Form.Item
            label="Tên nhà cung cấp"
            name="tenNhaCungCap"
            rules={[{ required: true, message: 'Vui lòng nhập tên nhà cung cấp!' }]}
          >
            <Input />
          </Form.Item>

          <div style={{ textAlign: 'right' }}>
            <Space>
              <Button onClick={handleCancel}>Hủy</Button>
              <Button type="primary" htmlType="submit">
                {editingSupplier ? 'Cập nhật' : 'Thêm'}
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default SupplierAdmin;
