import React, { useState } from 'react';
import { Table, Button, Space, Modal, Form, Input, Select } from 'antd';

const UserAdmin = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false); // Kiểm tra là thêm hay sửa
  const [editingUser, setEditingUser] = useState(null); // Dữ liệu người dùng đang sửa
  const [form] = Form.useForm();

  // Dữ liệu mẫu
  const dataSource = [
    {
      key: '1',
      name: 'Nguyễn Văn A',
      email: 'a@example.com',
      phone: '0123456789',
      gender: 'Nam',
      role: 'Admin',
    },
    {
      key: '2',
      name: 'Trần Thị B',
      email: 'b@example.com',
      phone: '0987654321',
      gender: 'Nữ',
      role: 'User',
    },
  ];

  // Cấu hình các cột của bảng
  const columns = [
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Giới tính',
      dataIndex: 'gender',
      key: 'gender',
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => editUser(record)}>Sửa</Button>
          <Button type="link" danger>Xóa</Button>
        </Space>
      ),
    },
  ];

  // Mở Modal
  const showModal = () => {
    setIsModalVisible(true);
  };

  // Đóng Modal
  const handleCancel = () => {
    setIsModalVisible(false);
    setIsEdit(false);
    form.resetFields();
  };

  // Mở modal sửa người dùng
  const editUser = (user) => {
    setIsEdit(true); // Đánh dấu là sửa
    setEditingUser(user); // Lưu thông tin người dùng đang sửa
    form.setFieldsValue(user); // Điền sẵn dữ liệu vào Form
    setIsModalVisible(true);
  };

  // Xử lý khi thêm hoặc sửa người dùng
  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        if (isEdit) {
          console.log('Sửa người dùng: ', values);
        } else {
          console.log('Thêm người dùng: ', values);
        }
        form.resetFields();
        setIsModalVisible(false);
      })
      .catch((info) => {
        console.log('Validate failed:', info);
      });
  };

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <h2>Danh sách người dùng</h2>
        <Button type="primary" onClick={showModal}>Thêm người dùng</Button>
      </div>

      <Table dataSource={dataSource} columns={columns} />

      {/* Modal Thêm hoặc Sửa người dùng */}
      <Modal
        title={isEdit ? "Sửa người dùng" : "Thêm người dùng"}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={isEdit ? "Cập nhật" : "Thêm"}
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Tên"
            name="name"
            rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Số điện thoại"
            name="phone"
            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Giới tính"
            name="gender"
            rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
          >
            <Select>
              <Select.Option value="Nam">Nam</Select.Option>
              <Select.Option value="Nữ">Nữ</Select.Option>
              <Select.Option value="Khác">Khác</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Vai trò"
            name="role"
            rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
          >
            <Select>
              <Select.Option value="Admin">Admin</Select.Option>
              <Select.Option value="User">User</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserAdmin;
