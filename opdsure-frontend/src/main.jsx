import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import AuthProvider from "./context/authProvider.jsx";
import ManagementUserProvider from "./context/managementUserProvider.jsx";
import GeneralUserProvider from "./context/generalUserProvider.jsx";
import { RouterProvider } from "react-router-dom";
import router from "./routes.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import AdminUserProvider from "./context/adminUserProvider.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";

axios.defaults.headers.common = {
  Authorization: `Bearer ${localStorage.getItem("token")}`,
  'Accept': 'application/json',
  'Content-Type': 'application/json',
}

// import router from "./routes.js";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <GeneralUserProvider>
       <ManagementUserProvider>
       <AdminUserProvider>
          <RouterProvider router={router}>
            <App />
            <ToastContainer/>
          </RouterProvider>
        </AdminUserProvider>
        </ManagementUserProvider>
      </GeneralUserProvider>
    </AuthProvider>
  </React.StrictMode>
);
