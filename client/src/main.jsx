import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css'
import ProductDetail from './pages/ProductDetail/index.jsx';
import Cart from './pages/Cart/index.jsx'
import Checkout from './pages/Checkout/index.jsx'
import Home from './pages/Home'
import App from './App.jsx'
import UserAdmin from './admin/pages/UserAdmin/index.jsx';
import LayoutAdmin from './admin/layout.admin.jsx';
import DashboardAdmin from './admin/pages/DashboardAdmin/index.jsx';
import ProductAdmin from './admin/pages/ProductAdmin/index.jsx';
import { AuthWrapper } from './components/Context/AuthContext.jsx';
import OrderAdmin from './admin/pages/OrderAdmin/index.jsx';
import NotFoundPage from './pages/NotFoundPage'
import VoucherAdmin from './admin/pages/VoucherAdmin/index.jsx';
import StockInAdmin from './admin/pages/StockInAdmin/index.jsx';
import SupplierAdmin from './admin/pages/SupplierAdmin/index.jsx';
import { CartProvider } from './components/Context/CartContext.jsx';
import Purchase from './pages/Purchase/index.jsx';
import Search from './pages/Search/index.jsx';
import Filter from './pages/Filter/index.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: "products/:id",
        element: <ProductDetail />
      },
      {
        path: "cart",
        element: <Cart />
      },
      {
        path: "checkout",
        element: <Checkout />
      },
      {
        path: "purchase",
        element: <Purchase />
      },
      {
        path: "search",
        element: <Search />
      },
      {
        path: "filter",
        element: <Filter />
      },
      {
        path: "admin",
        element: <LayoutAdmin />,
        children: [
          {
            path: "dashboard",
            element: <DashboardAdmin />
          },
          {
            path: "user",
            element: <UserAdmin />
          },
          {
            path: "product",
            element: <ProductAdmin />
          },
          {
            path: "supplier",
            element: <SupplierAdmin />
          },
          {
            path: "stockin",
            element: <StockInAdmin />
          },
          {
            path: "order",
            element: <OrderAdmin />
          },
          {
            path: "voucher",
            element: <VoucherAdmin />
          },
        ]
      },
    ]
  },
  {
    path: "*",
    element: <NotFoundPage />
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthWrapper>
      <CartProvider>
        <RouterProvider router={router}/>
      </CartProvider>
    </AuthWrapper>
  </StrictMode>,
)
