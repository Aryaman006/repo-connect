import { Outlet } from "react-router-dom";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  AppstoreOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Button } from "antd";
const { Content, Footer, Sider } = Layout;

const items = [
  {
    key: "masters",
    label: "Masters",
    icon: <AppstoreOutlined />,
    children: [
      {
        key: "3",
        // icon: <AppstoreOutlined />,
        label: (
          <NavLink
            to="/admin/master/designation"
            className="navlink-no-underline"
          >
            Designation
          </NavLink>
        ),
      },
      {
        key: "9",
        // icon: <AppstoreOutlined />,
        label: (
          <NavLink to="/admin/master/users" className="navlink-no-underline">
            Management Users
          </NavLink>
        ),
      },
      {
        key: "4",
        // icon: <AppstoreOutlined />,
        label: (
          <NavLink
            to="/admin/master/corporate"
            className="navlink-no-underline"
          >
            Corporate
          </NavLink>
        ),
      },
         
      {
        key: "10",
        // icon: <AppstoreOutlined />,
        label: (
          <NavLink to="/admin/master/corpoEmp" className="navlink-no-underline">
            Corporate Employees
          </NavLink>
        ),
      },
      {
        key: "5",
        // icon: <AppstoreOutlined />,
        label: (
          <NavLink to="/admin/master/plan" className="navlink-no-underline">
            Plans
          </NavLink>
        ),
      },
      {
        key: "6",
        // icon: <AppstoreOutlined />,
        label: (
          <NavLink to="/admin/master/test" className="navlink-no-underline">
            Health Tests
          </NavLink>
        ),
      },
      {
        key: "doctor",
        // icon: <AppstoreOutlined />,
        label: (
          <NavLink to="/admin/master/doctor" className="navlink-no-underline">
            Doctors
          </NavLink>
        ),
      },
      {
        key: "12",
        // icon: <AppstoreOutlined />,
        label: (
          <NavLink to="/admin/master/coupon" className="navlink-no-underline">
            Coupons
          </NavLink>
        ),
      },
      {
        key: "7",
        // icon: <AppstoreOutlined />,
        label: (
          <NavLink
            to="/admin/master/conditions"
            className="navlink-no-underline"
          >
           Terms & Conditions
          </NavLink>
        ),
      },
      {
        key: "8",
        // icon: <AppstoreOutlined />,
        label: (
          <NavLink to="/admin/master/settings" className="navlink-no-underline">
            System Settings
          </NavLink>
        ),
      },     
      {
        key: "18",
        // icon: <AppstoreOutlined />,
        label: (
          <NavLink to="/admin/master/privilege" className="navlink-no-underline">
            Privileges
          </NavLink>
        ),
      },
      
      {
        key: "57",
        label: (
          <NavLink to="/admin/master/faqs" className="navlink-no-underline">
            FAQ
          </NavLink>
        ),
      },  
     
    ],
  },
  {
    key: "logs",
    label: "Logs",
    icon: <AppstoreOutlined />,
    children: [
      {
        key: "50",
        // icon: <AppstoreOutlined />,
        label: (
          <NavLink to="/admin/audit/logs" className="navlink-no-underline">
            Audit Logs
          </NavLink>
        ),
      },     
    ],
  },

  {
    key: "logout",
    icon: <LogoutOutlined />,
    label: (
      <NavLink to="/logout/?userType=admin" replace={true} className="navlink-no-underline">
        Logout
      </NavLink>
    ),
  },
];
const AdminLayoutWrapper = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout
      style={{
        minHeight: "100vh",
      }}
    >
      <Sider
        theme="light"
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        
        <Menu
          theme="light"
          defaultOpenKeys={["masters"]}
          mode="inline"
          items={items}
          style={{
            minHeight: "100vh",
          }}
        />
      </Sider>
      <Layout>
        <Content
          style={{
            margin: "0 16px",
          }}
        >
          <Outlet />
        </Content>
        <Footer
          style={{
            textAlign: "center",
          }}
        ></Footer>
      </Layout>
    </Layout>
  );
};
export default AdminLayoutWrapper;
