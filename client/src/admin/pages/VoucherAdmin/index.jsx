import React, { useState, useCallback, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Input, InputNumber, DatePicker, Row, Col, Select } from 'antd';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

const VoucherAdmin = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState(null);
  const [form] = Form.useForm();
  const [vouchers, setVouchers] = useState([]);
  const [deletingVoucher, setDeletingVoucher] = useState(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const kieuGiamGia = Form.useWatch('kieuGiamGia', form);

  const fetchVouchers = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/vouchers');
      const result = await response.json();
      if (result.EC === 0) {
        setVouchers(result.DT);
      } else {
        toast.error('Lỗi API:', result.EM);
      }
    } catch (error) {
      toast.error('Lỗi fetch:', error);
    }
  }, []);

    useEffect(() => {
      fetchVouchers();
  }, [fetchVouchers]);

  const columns = [
  {
    title: 'Mã nhập',
    dataIndex: 'maNhap',
    key: 'maNhap',
  },
  {
    title: 'Tên khuyến mãi',
    dataIndex: 'tenKhuyenMai',
    key: 'tenKhuyenMai',
  },
  {
    title: 'Giá trị giảm',
    dataIndex: 'giaTriGiam',
    key: 'giaTriGiam',
    render: (_, record) => {
      if (record.kieuGiamGia === 'phanTram') {
        const maxDiscount = record.giaTriGiamToiDa;
        return maxDiscount
          ? `${record.giaTriGiam}% (tối đa ${maxDiscount}đ)`
          : `${record.giaTriGiam}%`;
      } else {
        return `${record.giaTriGiam}đ`;
      }
    }
  },
  {
    title: 'Số lượng',
    dataIndex: 'soLuong',
    key: 'soLuong',
  },
  {
    title: 'Số lượng đã dùng',
    dataIndex: 'soLuongDaDung',
    key: 'soLuongDaDung',
    render: (value) => value ?? 0,
  },
  {
    title: 'Ngày bắt đầu',
    dataIndex: 'ngayBatDau',
    key: 'ngayBatDau',
    render: (text) => new Date(text).toLocaleDateString(),
  },
  {
    title: 'Ngày kết thúc',
    dataIndex: 'ngayKetThuc',
    key: 'ngayKetThuc',
    render: (text) => new Date(text).toLocaleDateString(),
  },
  {
    title: 'Trạng thái',
    dataIndex: 'trangThai',
    key: 'trangThai',
    render: (text) => text === 'active' ? 'Hoạt động' : text === 'expired' ? 'Hết hạn' : 'Không rõ'
  },
  {
    title: 'Thao tác',
    key: 'action',
    render: (_, record) => (
      <Space>
        <Button type="link" onClick={() => editVoucher(record)}>Sửa</Button>
        <Button type="link" danger onClick={() => confirmDeleteVoucher(record)}>Xóa</Button>
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
    form.setFieldsValue({
      ...voucher,
      ngayBatDau: voucher.ngayBatDau ? dayjs(voucher.ngayBatDau) : null,
      ngayKetThuc: voucher.ngayKetThuc ? dayjs(voucher.ngayKetThuc) : null,
    });
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then(async (values) => {
        const body = {
          ...values,
          ngayBatDau: values.ngayBatDau.toISOString(),
          ngayKetThuc: values.ngayKetThuc.toISOString(),
          trangThai: 'active'
        };

        try {
        let url = 'http://localhost:8080/api/v1/vouchers';
        let method = 'POST';

        if (isEdit && editingVoucher) {
          url = `http://localhost:8080/api/v1/vouchers/${editingVoucher.maKhuyenMai}`;
          method = 'PUT';
        } else {
          body.trangThai = 'active';
        }

        const res = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        });

        const result = await res.json();

        if (result.EC === 0) {
          fetchVouchers();
          form.resetFields();
          setIsModalVisible(false);
          setIsEdit(false);
          toast.success(isEdit ? 'Cập nhật thành công' : 'Thêm mới thành công');
        } else {
          toast.error(result.EM || 'Có lỗi xảy ra');
        }
      } catch (err) {
        console.error('Lỗi gửi API:', err);
        toast.error('Lỗi gửi API');
      }
    })
    .catch((info) => {
      console.log('Validate failed:', info);
    });
  };

  const confirmDeleteVoucher = (voucher) => {
    setDeletingVoucher(voucher);
    setIsDeleteModalVisible(true);
  };

  const handleDeleteVoucher = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/v1/vouchers/${deletingVoucher.maKhuyenMai}`, {
        method: 'DELETE',
      });
      const result = await res.json();
      if (result.EC === 0) {
        toast.success("Xóa voucher thành công!");
        fetchVouchers();
      } else {
        toast.error(result.EM || "Xóa thất bại!");
      }
    } catch (err) {
      toast.error("Lỗi khi xóa voucher!");
    } finally {
      setIsDeleteModalVisible(false);
      setDeletingVoucher(null);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <h2>Danh sách khuyến mãi</h2>
        <Button type="primary" onClick={showModal}>Thêm voucher</Button>
      </div>

      <Table dataSource={vouchers} columns={columns} rowKey='maKhuyenMai' />

      <Modal
        title="Xác nhận xóa"
        open={isDeleteModalVisible}
        onOk={handleDeleteVoucher}
        onCancel={() => {
          setIsDeleteModalVisible(false);
          setDeletingVoucher(null);
        }}
        okText="Xóa"
        cancelText="Hủy"
      >
        <p>
          Bạn có chắc chắn muốn xóa voucher{" "}
          <strong>{deletingVoucher?.tenKhuyenMai}</strong> không?
        </p>
      </Modal>
      <Modal
        title={isEdit ? "Sửa voucher" : "Thêm voucher"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={isEdit ? "Cập nhật" : "Thêm"}
        cancelText="Hủy"
        width={1000}
      >
        <Form form={form} layout="vertical"
          initialValues={{
            trangThai: 'active'
          }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Mã nhập" name="maNhap" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Tên khuyến mãi" name="tenKhuyenMai" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Mô tả" name="moTa">
            <Input.TextArea />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Kiểu giảm giá"
                name="kieuGiamGia"
                rules={[{ required: true, message: 'Vui lòng chọn kiểu giảm giá' }]}
              >
                <Select placeholder="Chọn kiểu giảm giá">
                  <Select.Option value="giamThang">Giảm thẳng</Select.Option>
                  <Select.Option value="phanTram">Giảm theo phần trăm</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Giá trị giảm"
                name="giaTriGiam"
                rules={[{ required: true, message: 'Vui lòng nhập giá trị giảm' }]}
              >
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Giảm tối đa"  name="giaTriGiamToiDa">
                <InputNumber
                  style={{ width: '100%' }}
                  disabled={kieuGiamGia !== 'phanTram'}
                  placeholder={'Chỉ dành cho giảm %'}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Số lượng" name="soLuong" rules={[{ required: true }]}>
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Ngày bắt đầu" name="ngayBatDau" rules={[{ required: true }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Ngày kết thúc"
                name="ngayKetThuc"
                dependencies={['ngayBatDau']}
                rules={[
                  { required: true, message: 'Vui lòng chọn ngày kết thúc' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      const startDate = getFieldValue('ngayBatDau');
                      if (!value || !startDate || value.isAfter(startDate)) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Ngày kết thúc phải sau ngày bắt đầu'));
                    }
                  })
                ]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Trạng thái" name="trangThai" rules={[{ required: true }]}>
                <Select placeholder="Chọn trạng thái">
                  <Select.Option value="active">Hoạt động</Select.Option>
                  <Select.Option value="hide">Tạm ẩn</Select.Option>
                  <Select.Option value="expired">Hết hạn</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>

      </Modal>
    </div>
  );
};

export default VoucherAdmin;
