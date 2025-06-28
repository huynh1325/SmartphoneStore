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
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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
    } catch {
      toast.error('Không thể lấy dữ liệu phiếu nhập!');
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/products');
      const result = await response.json();
      if (result.EC === 0) {
        setProducts(result.DT);
        const fetchColors = async () => {
          const colorMap = {};
          for (const p of result.DT) {
            try {
              const res = await fetch(`http://localhost:8080/api/v1/productcolor/${p.maSanPham}`);
              const resJson = await res.json();
              colorMap[p.maSanPham] = resJson.DT || [];
            } catch {
              colorMap[p.maSanPham] = [];
            }
          }
          setProductColorMap(colorMap);
        };
        fetchColors();
      }
    } catch {
      toast.error('Lỗi khi lấy danh sách sản phẩm!');
    }
  };

  const fetchSuppliers = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/suppliers');
      const result = await response.json();
      if (result.EC === 0) setSuppliers(result.DT);
    } catch {
      toast.error('Lỗi khi lấy danh sách nhà cung cấp!');
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

      const payload = {
        maNhaCungCap: values.maNhaCungCap,
        donGia: values.donGia,
        sanPhamNhap: values.sanPhams.flatMap((sp) =>
          (sp.chiTietMau || []).map((ct) => ({
            maSanPham: sp.maSanPham,
            mauSanPham: ct.mau,
            soLuong: ct.soLuong,
          }))
        ),
      };

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
      console.error('Lỗi gửi dữ liệu:', error);
      toast.error('Lỗi gửi dữ liệu!');
    }
  };

  const columns = [
    {
      title: 'Nhà cung cấp',
      dataIndex: 'tenNhaCungCap',
      key: 'tenNhaCungCap',
      render: (_, record) => record.tenNhaCungCap || 'Không xác định',
    },
    {
      title: 'Đơn giá',
      dataIndex: 'donGia',
      key: 'donGia',
      render: (value) => `${(value ?? 0).toLocaleString()} ₫`,
    },
    {
      title: 'Sản phẩm nhập',
      dataIndex: 'sanPhamNhap',
      key: 'sanPhamNhap',
      render: (items) => (
        <ul style={{ paddingLeft: 16 }}>
          {items?.map((item, idx) => (
            <li key={idx}>
              <strong>{item.sanPham}</strong> - Màu: {item.mau}, Số Lượng: {item.soLuong}
            </li>
          ))}
        </ul>
      ),
    }
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
            <Col span={12}>
              <Form.Item label="Nhà cung cấp" name="maNhaCungCap">
                <Select allowClear placeholder="Chọn nhà cung cấp">
                  {suppliers.map((s) => (
                    <Select.Option key={s.maNhaCungCap} value={s.maNhaCungCap}>
                      {s.tenNhaCungCap}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Đơn giá"
                name="donGia"
                rules={[{ required: true, message: 'Nhập đơn giá!' }]}
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.List name="sanPhams">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <div key={key} style={{ border: '1px solid #eee', padding: 16, marginBottom: 16 }}>
                    <Row gutter={16}>
                      <Col span={20}>
                        <Form.Item
                          {...restField}
                          label="Sản phẩm"
                          name={[name, 'maSanPham']}
                          rules={[{ required: true, message: 'Chọn sản phẩm!' }]}
                        >
                          <Select placeholder="Chọn sản phẩm">
                            {products.map((p) => (
                              <Select.Option key={p.maSanPham} value={p.maSanPham}>
                                {p.tenSanPham}
                              </Select.Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>

                      <Col span={4}>
                        <Button danger onClick={() => remove(name)} style={{ marginTop: 30 }}>
                          Xóa
                        </Button>
                      </Col>
                    </Row>

                    <Form.List name={[name, 'chiTietMau']}>
                      {(colorFields, { add: addColor, remove: removeColor }) => (
                        <>
                          {colorFields.map(({ key: colorKey, name: colorName, ...colorRest }) => {
                            const selectedProduct = form.getFieldValue(['sanPhams', name, 'maSanPham']);
                            const colorOptions = productColorMap[selectedProduct] || [];
                            const allColors = form.getFieldValue(['sanPhams', name, 'chiTietMau']) || [];
                            const selectedColors = allColors.map((c, i) =>
                              i === colorName ? null : c?.mau
                            );

                            return (
                              <Row key={colorKey} gutter={16} style={{ marginBottom: 8 }}>
                                <Col span={8}>
                                  <Form.Item
                                    {...colorRest}
                                    label="Màu"
                                    name={[colorName, 'mau']}
                                    rules={[{ required: true, message: 'Chọn màu!' }]}
                                  >
                                    <Select placeholder="Chọn màu">
                                      {colorOptions
                                        .filter((colorObj) => !selectedColors.includes(colorObj.mau))
                                        .map((colorObj) => (
                                          <Select.Option key={colorObj.id} value={colorObj.mau}>
                                            {colorObj.mau}
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
                                    Xóa
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
