import { Card, Row, Col, Button } from 'antd';
import {
  ShoppingOutlined,
  UserOutlined,
  ShopOutlined,
  TagOutlined,
} from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro'

const DashboardAdmin = () => {
  const [topSellingProducts, setTopSellingProducts] = useState([]);
  const [revenueLast10Days, setRevenueLast10Days] = useState([]);
  const [exportingPDF, setExportingPDF] = useState(false);

  const [stats, setStats] = useState({
    totalOrders: 0,
    totalUsers: 0,
    totalSuppliers: 0,
    totalVouchers: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/v1/dashboard');
        const result = await res.json();
        if (result.EC === 0) {
          setStats(result.DT);
        } else {
          console.error('Lỗi API:', result.EM);
        }
      } catch (error) {
        console.error('Lỗi khi fetch thống kê:', error);
      }
    };

    const fetchTopProducts = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/v1/top-selling');
        const result = await res.json();
        if (result.EC === 0) {
          setTopSellingProducts(result.DT);
        } else {
          console.error('Lỗi API top-selling:', result.EM);
        }
      } catch (error) {
        console.error('Lỗi khi fetch top-selling:', error);
      }
    };

    const fetchRevenueLast10Days = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/v1/revenue-last-10-days');
        const result = await res.json();
        if (result.EC === 0) {
          setRevenueLast10Days(result.DT);
        } else {
          console.error('Lỗi API doanh thu:', result.EM);
        }
      } catch (error) {
        console.error('Lỗi khi fetch doanh thu:', error);
      }
    };

    fetchStats();
    fetchTopProducts();
    fetchRevenueLast10Days();
  }, []);

  const mergedTopProducts = Array.from({ length: 10 }, (_, i) => {

    const item = topSellingProducts[i];

    if (!item) {
      return {
        tenSanPham: "",
        soLuong: 0
      };
    }

    let name = item?.SanPham?.tenSanPham || `Sản phẩm ${i + 1}`;

    name = name.replace(/^Điện thoại\s+/i, '');

    name = name.replace(/\s+\d+GB(\/\d+GB)?$/i, '');

    return {
      tenSanPham: name,
      soLuong: item ? parseInt(item.totalSold) : 0
    };
  });

  const handleExportTopProducts = () => {
    setExportingPDF(true);

    setTimeout(() => {
      const original = document.getElementById('top-products-chart');
      if (!original) return;

      const clone = original.cloneNode(true);
      clone.id = 'top-products-chart-export';
      clone.style.backgroundColor = 'white';
      clone.style.color = 'black';
      clone.style.padding = '20px';
      clone.style.width = '800px';
      clone.style.border = '1px solid #ddd';
      clone.style.fontFamily = 'Arial';

      document.body.appendChild(clone);

      html2canvas(clone, { scale: 2, useCORS: true })
        .then((canvas) => {
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF('p', 'mm', 'a4');

          const pageWidth = pdf.internal.pageSize.getWidth();
          const imgProps = pdf.getImageProperties(imgData);
          const pdfHeight = (imgProps.height * pageWidth) / imgProps.width;

          pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, pdfHeight);
          pdf.save('top-10-san-pham-ban-chay.pdf');
        })
        .catch((error) => {
          console.error('Lỗi khi tạo PDF:', error);
        })
        .finally(() => {
          document.getElementById('top-products-chart-export')?.remove();
          setExportingPDF(false);
        });
    }, 100);
  };

  const handleExportRevenueChart = () => {
    setExportingPDF(true);

    setTimeout(() => {
      const original = document.getElementById('revenue-chart');
      if (!original) return;

      const clone = original.cloneNode(true);
      clone.id = 'revenue-chart-export';
      clone.style.backgroundColor = 'white';
      clone.style.color = 'black';
      clone.style.padding = '20px';
      clone.style.width = '800px';
      clone.style.border = '1px solid #ddd';
      clone.style.fontFamily = 'Arial';

      document.body.appendChild(clone);

      html2canvas(clone, { scale: 2, useCORS: true })
        .then((canvas) => {
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF('p', 'mm', 'a4');

          const pageWidth = pdf.internal.pageSize.getWidth();
          const imgProps = pdf.getImageProperties(imgData);
          const pdfHeight = (imgProps.height * pageWidth) / imgProps.width;

          pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, pdfHeight);
          pdf.save('doanh-thu-10-ngay-gan-nhat.pdf');
        })
        .catch((error) => {
          console.error('Lỗi khi tạo PDF doanh thu:', error);
        })
        .finally(() => {
          document.getElementById('revenue-chart-export')?.remove();
          setExportingPDF(false);
        });
    }, 100);
  };

   return (
    <div id="dashboard-content">
      <h2 style={{ marginBottom: 20 }}>Thống kê tổng quan</h2>
      <Row gutter={16}>
        <Col span={6}>
          <Card title="Đơn hàng" variant="filled">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 24 }}>{stats.totalOrders}</span>
              <ShoppingOutlined style={{ fontSize: 32, color: '#1890ff' }} />
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card title="Người dùng" variant="filled">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 24 }}>{stats.totalUsers}</span>
              <UserOutlined style={{ fontSize: 32, color: '#52c41a' }} />
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card title="Nhà cung cấp" variant="filled">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 24 }}>{stats.totalSuppliers}</span>
              <ShopOutlined style={{ fontSize: 32, color: '#fa8c16' }} />
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card title="Voucher" variant="filled">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 24 }}>{stats.totalVouchers}</span>
              <TagOutlined style={{ fontSize: 32, color: '#eb2f96' }} />
            </div>
          </Card>
        </Col>
      </Row>
      <h2 style={{ marginTop: 40 }}>Thống kê chi tiết</h2>
      <Row gutter={16}>
        <Col span={12}>
          <Card
            title={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Top 10 sản phẩm bán chạy nhất</span>
                <Button type="primary" onClick={handleExportTopProducts}>
                  Xuất PDF
                </Button>
              </div>
            }
            id="top-products-chart"
          >
            <ResponsiveContainer width="100%" height={350}>
              <BarChart
                data={mergedTopProducts}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="tenSanPham" angle={-45} textAnchor="end" interval={0} height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="soLuong" fill="#1890ff" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col span={12}>
          <Card
            title={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Doanh thu 10 ngày gần nhất</span>
                <Button type="primary" onClick={handleExportRevenueChart}>
                  Xuất PDF
                </Button>
              </div>
            }
            id="revenue-chart"
          >
            <ResponsiveContainer width="100%" height={350}>
              <BarChart
                data={revenueLast10Days.map(item => ({
                  date: item.date.split('-').reverse().join('/'),
                  totalRevenue: item.totalRevenue
                }))}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" angle={-45} textAnchor="end" interval={0} height={100} />
                <YAxis />
                <Tooltip
                  formatter={(value) => `${value.toLocaleString('vi-VN')} ₫`}
                  labelFormatter={(label) => `Ngày ${label}`}
                />
                <Bar dataKey="totalRevenue" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

    </div>
  );
};

export default DashboardAdmin;
