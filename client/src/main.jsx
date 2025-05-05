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
import Admin from './admin/index.jsx';
import UserAdmin from './admin/pages/UserAdmin/index.jsx';

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
        element: <Admin />
      },
      {
        path: "admin/user",
        element: <UserAdmin />
      }
    ]
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
