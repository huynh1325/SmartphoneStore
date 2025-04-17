import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css'
import App from './App.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    // children: [
    //   {
    //     index: true,
    //     element: <HomePage />
    //   },
    //   {
    //     path: "/user",
    //     element: <UserPage />
    //   }
    // ]
  },
  // {
  //   path: "/register",
  //   element: <RegisterPage />
  // },
  // {
  //   path: "/login",
  //   element: <LoginPage />
  // }
]);


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
