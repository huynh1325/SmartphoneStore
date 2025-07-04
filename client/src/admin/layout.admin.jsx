import { useState, useEffect, useContext } from 'react';
import { Layout, Menu, Avatar, Dropdown, Button, Space } from 'antd';
import {
  UserOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  DashboardOutlined,
  AppstoreOutlined,
  TagOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined
} from '@ant-design/icons';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { AuthContext } from '../components/Context/AuthContext';
import NotFoundPage from '../pages/NotFoundPage'

const { Header, Sider, Content } = Layout;

const LayoutAdmin = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState('/admin/dashboard');
  const [unauthorized, setUnauthorized] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const location = useLocation();
  const { auth } = useContext(AuthContext);

  const menuItems = [
    {
      key: '/admin/dashboard',
      icon: <DashboardOutlined />,
      label: <Link to="/admin/dashboard">Bảng điều khiển</Link>,
    },
    {
      key: '/admin/user',
      icon: <UserOutlined />,
      label: <Link to="/admin/user">Tài khoản</Link>,
    },
    {
      key: '/admin/product',
      icon: <AppstoreOutlined />,
      label: <Link to="/admin/product">Sản phẩm</Link>,
    },
    {
      key: '/admin/supplier',
      icon: <ShopOutlined /> ,
      label: <Link to="/admin/supplier">Nhà cung cấp</Link>,
    },
    {
      key: '/admin/stockin',
      icon: <ShoppingCartOutlined /> ,
      label: <Link to="/admin/stockin">Nhập hàng</Link>,
    },
    {
      key: '/admin/order',
      icon: <ShoppingOutlined />,
      label: <Link to="/admin/order">Đơn hàng</Link>,
    },
    {
      key: '/admin/voucher',
      icon: <TagOutlined />,
      label: <Link to="/admin/voucher">Khuyến mãi</Link>,
    },
  ];

  const userDropdown = {
    items: [
      {
        key: 'logout',
        label: <span>Đăng xuất</span>,
      },
    ],
  };

  useEffect(() => {
    setActiveMenu(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    if (!auth || !auth.user || !auth.user.role) return;

    if (!auth.isAuthenticated || auth.user.role !== 'Quản trị viên') {
      setUnauthorized(true); 
    } 
    setIsCheckingAuth(false)
  }, [auth]);

  useEffect(() => {
      setActiveMenu(location.pathname);
    }, [location.pathname]);
  if (isCheckingAuth) return null;
  if (unauthorized) return <NotFoundPage />;

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div style={{ color: '#fff', padding: 20, textAlign: 'center' }}>
          Admin
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[activeMenu]}
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: '0 20px', display: 'flex', justifyContent: 'space-between' }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
          />
          <Dropdown menu={userDropdown}>
            <Space style={{ cursor: 'pointer' }}>
              <Avatar icon={<UserOutlined />} />
              Admin
            </Space>
          </Dropdown>
        </Header>
        <Content style={{ margin: '16px' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default LayoutAdmin;
