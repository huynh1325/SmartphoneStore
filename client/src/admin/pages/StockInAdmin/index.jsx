import { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  InputNumber,
  Row,
  Col,
  Select,
  Space
} from 'antd';
import { toast } from 'react-toastify';

const StockInAdmin = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [stockInData, setStockInData] = useState([]);
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [productColorMap, setProductColorMap] = useState({});

  const fetchStockInData = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/stockin');
      const result = await response.json();
      if (result.EC === 0) setStockInData(result.DT);
      else toast.error(result.EM);
    } catch (error) {
      toast.error('Không thể lấy dữ liệu phiếu nhập!');
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/products');
      const result = await response.json();
      if (result.EC === 0) {
        setProducts(result.DT);
        const map = {};
        result.DT.forEach((p) => {
          try {
            map[p.maSanPham] = JSON.parse(p.mau);
          } catch {
            map[p.maSanPham] = [];
          }
        });
        setProductColorMap(map);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/suppliers');
      const result = await response.json();
      if (result.EC === 0) setSuppliers(result.DT);
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
      if (!values.sanPhams || values.sanPhams.length === 0) {
        toast.error('Vui lòng thêm ít nhất một sản phẩm!');
        return;
      }

      for (const sp of values.sanPhams) {
        if (!sp.chiTietMau || sp.chiTietMau.length === 0) {
          toast.error('Mỗi sản phẩm phải có ít nhất một màu!');
          return;
        }
      }

      const payload = [];

      values.sanPhams.forEach((sp) => {
        sp.chiTietMau.forEach((ct) => {
          payload.push({
            maSanPham: sp.maSanPham,
            donGia: sp.donGia,
            mau: ct.mau,
            soLuong: ct.soLuong,
            maNhaCungCap: values.maNhaCungCap || null,
          });
        });
      });

      const response = await fetch('http://localhost:8080/api/v1/stockin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (result.EC === 0) {
        toast.success('Nhập hàng thành công!');
        fetchStockInData();
        setIsModalVisible(false);
      } else {
        toast.error(result.EM || 'Lỗi khi nhập hàng!');
      }
    } catch (error) {
      toast.error('Lỗi gửi dữ liệu!');
    }
  };


  const columns = [
    { title: 'Mã phiếu nhập', dataIndex: 'maPhieuNhap', key: 'maPhieuNhap' },
    { title: 'Tên nhà cung cấp', dataIndex: 'tenNhaCungCap', key: 'tenNhaCungCap' },
    { title: 'Tên sản phẩm', dataIndex: 'tenSanPham', key: 'tenSanPham' },
    { title: 'Màu', dataIndex: 'mau', key: 'mau' },
    { title: 'Số lượng', dataIndex: 'soLuong', key: 'soLuong' },
    { title: 'Đơn giá', dataIndex: 'donGia', key: 'donGia' },
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
        width={900}
      >
        <Form form={form} layout="vertical" onFinish={handleAddStockIn}>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label="Nhà cung cấp (không bắt buộc)" name="maNhaCungCap">
                <Select allowClear placeholder="Chọn nhà cung cấp (nếu có)">
                  {suppliers.map((s) => (
                    <Select.Option key={s.maNhaCungCap} value={s.maNhaCungCap}>
                      {s.tenNhaCungCap}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.List name="sanPhams">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <div key={key} style={{ border: '1px solid #eee', padding: 16, marginBottom: 16 }}>
                    <Row gutter={16}>
                      <Col span={10}>
                        <Form.Item
                          {...restField}
                          label="Sản phẩm"
                          name={[name, 'maSanPham']}
                          rules={[{ required: true, message: 'Chọn sản phẩm!' }]}
                        >
                          <Select
                            onChange={() => {
                              form.validateFields();
                            }}
                          >
                            {products.map((p) => (
                              <Select.Option key={p.maSanPham} value={p.maSanPham}>
                                {p.tenSanPham}
                              </Select.Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>

                      <Col span={6}>
                        <Form.Item
                          {...restField}
                          label="Đơn giá"
                          name={[name, 'donGia']}
                          rules={[{ required: true, message: 'Nhập đơn giá!' }]}
                        >
                          <InputNumber min={0} style={{ width: '100%' }} />
                        </Form.Item>
                      </Col>

                      <Col span={4}>
                        <Button danger onClick={() => remove(name)} style={{ marginTop: 30 }}>
                          Xóa sản phẩm
                        </Button>
                      </Col>
                    </Row>

                    {/* Danh sách màu cho sản phẩm */}
                    <Form.List name={[name, 'chiTietMau']}>
                      {(colorFields, { add: addColor, remove: removeColor }) => (
                        <>
                          {colorFields.map(({ key: colorKey, name: colorName, ...colorRest }) => {
                            const selectedProduct = form.getFieldValue(['sanPhams', name, 'maSanPham']);
                            const colorOptions = productColorMap[selectedProduct] || [];

                            return (
                              <Row key={colorKey} gutter={16} style={{ marginBottom: 8 }}>
                                <Col span={8}>
                                  <Form.Item
                                    {...colorRest}
                                    label="Màu"
                                    name={[colorName, 'mau']}
                                    rules={[{ required: true, message: 'Chọn màu!' }]}
                                  >
                                    <Select>
                                      {colorOptions.map((color) => (
                                        <Select.Option key={color} value={color}>
                                          {color}
                                        </Select.Option>
                                      ))}
                                    </Select>
                                  </Form.Item>
                                </Col>

                                <Col span={8}>
                                  <Form.Item
                                    {...colorRest}
                                    label="Số lượng"
                                    name={[colorName, 'soLuong']}
                                    rules={[{ required: true, message: 'Nhập số lượng!' }]}
                                  >
                                    <InputNumber min={1} style={{ width: '100%' }} />
                                  </Form.Item>
                                </Col>

                                <Col span={4}>
                                  <Button danger onClick={() => removeColor(colorName)} style={{ marginTop: 30 }}>
                                    Xóa màu
                                  </Button>
                                </Col>
                              </Row>
                            );
                          })}
                          <Form.Item>
                            <Button type="dashed" onClick={() => addColor()} block>
                              Thêm màu
                            </Button>
                          </Form.Item>
                        </>
                      )}
                    </Form.List>
                  </div>
                ))}

                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block>
                    Thêm sản phẩm
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <div style={{ textAlign: 'right', marginTop: 16 }}>
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
