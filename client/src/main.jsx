import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css'
import ProductDetail from './pages/ProductDetail/index.jsx';
import Home from './pages/Home'
import App from './App.jsx'
import UserAdmin from './admin/pages/UserAdmin/index.jsx';
import LayoutAdmin from './admin/layout.admin.jsx';
import DashboardAdmin from './admin/pages/DashboardAdmin/index.jsx';
import ProductAdmin from './admin/pages/ProductAdmin/index.jsx';
import { AuthWrapper } from './components/Context/auth.context.jsx';

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
        path: "productdetail",
        element: <ProductDetail />
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
        ]
      },
    ]
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthWrapper>
      <RouterProvider router={router}/>
    </AuthWrapper>
  </StrictMode>,
)
