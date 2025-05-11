import React, { useState, useCallback, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Input, InputNumber, DatePicker } from 'antd';

const VoucherAdmin = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState(null);
  const [form] = Form.useForm();
  const [vouchers, setVouchers] = useState([]);

  const fetchVouchers = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/vouchers');
      const result = await response.json();
      if (result.EC === 0) {
        setVouchers(result.DT);
      } else {
        console.error('Lỗi API:', result.EM);
      }
    } catch (error) {
      console.error('Lỗi fetch:', error);
    }
  }, []);

  useEffect(() => {
    fetchVouchers();
  }, [fetchVouchers]);

  const columns = [
    {
      title: 'Mã Voucher',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Giảm giá (%)',
      dataIndex: 'discount',
      key: 'discount',
    },
    {
      title: 'Hạn sử dụng',
      dataIndex: 'expiryDate',
      key: 'expiryDate',
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => editVoucher(record)}>Sửa</Button>
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

  const editVoucher = (voucher) => {
    setIsEdit(true);
    setEditingVoucher(voucher);
    form.setFieldsValue(voucher);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        if (isEdit) {
          console.log('Sửa voucher:', values);
        } else {
          console.log('Thêm voucher:', values);
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
        <h2>Danh sách voucher</h2>
        <Button type="primary" onClick={showModal}>Thêm voucher</Button>
      </div>

      <Table dataSource={vouchers} columns={columns} rowKey='maVoucher' />

      <Modal
        title={isEdit ? "Sửa voucher" : "Thêm voucher"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={isEdit ? "Cập nhật" : "Thêm"}
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Mã voucher"
            name="code"
            rules={[{ required: true, message: 'Vui lòng nhập mã voucher!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Giảm giá (%)"
            name="discount"
            rules={[{ required: true, message: 'Vui lòng nhập phần trăm giảm giá!' }]}
          >
            <InputNumber min={1} max={100} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="Hạn sử dụng"
            name="expiryDate"
            rules={[{ required: true, message: 'Vui lòng chọn hạn sử dụng!' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default VoucherAdmin;
