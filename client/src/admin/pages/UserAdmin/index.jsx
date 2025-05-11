import React, { useState, useCallback, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Input, Select } from 'antd';

const UserAdmin = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();
  const [users, setUsers] = useState([]);

  const fetchUsers = useCallback(async () => {
      try {
          const response = await fetch('http://localhost:8080/api/v1/users');
          const result = await response.json();
          if (result.EC === 0) {
              setUsers(result.DT);
          } else {
              console.error('Lỗi API:', result.EM);
          }
      } catch (error) {
          console.error('Lỗi fetch:', error);
      }
  }, []);

  
  useEffect(() => {
      fetchUsers();
  }, [fetchUsers]);

  const columns = [
    {
      title: 'Tên',
      dataIndex: 'tenNguoiDung',
      key: 'tenNguoiDung',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'soDienThoai',
      key: 'soDienThoai',
    },
    {
      title: 'Giới tính',
      dataIndex: 'gioiTinh',
      key: 'gioiTinh',
    },
    {
      title: 'Vai trò',
      dataIndex: 'vaiTro',
      key: 'vaiTro',
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

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setIsEdit(false);
    form.resetFields();
  };

  const editUser = (user) => {
    setIsEdit(true);
    setEditingUser(user);
    form.setFieldsValue(user);
    setIsModalVisible(true);
  };

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

      <Table dataSource={users} columns={columns} rowKey='maNguoiDung' />

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
            </Select>
          </Form.Item>

          <Form.Item
            label="Vai trò"
            name="role"
            rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
          >
            <Select>
              <Select.Option value="Admin">Khách Hàng</Select.Option>
              <Select.Option value="User">Admin</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserAdmin;
