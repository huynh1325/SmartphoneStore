import { Card, Row, Col } from 'antd';
import {
  ShoppingOutlined,
  UserOutlined,
  ShopOutlined,
  TagOutlined,
} from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const DashboardAdmin = () => {
  const [topSellingProducts, setTopSellingProducts] = useState([]);
  const [revenueLast10Days, setRevenueLast10Days] = useState([]);

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


   return (
    <div>
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
          <Card title="Top 10 sản phẩm bán chạy nhất">
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
          <Card title="Doanh thu 10 ngày gần nhất">
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
