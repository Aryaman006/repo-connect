import React, { useState } from "react";
import axios from "axios";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
  LogoutOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import { useNavigate, createSearchParams } from "react-router-dom";
import { faStethoscope } from "@fortawesome/free-solid-svg-icons";
import { faUser, faFile } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Layout, Menu, notification, theme } from "antd";
import config, { CONFIG_OBJ } from "../config/config";
import opdlogo from "../assets/OPD-Logo.png";
const { Header, Sider, Content } = Layout;
const Navbar = ({ children }) => {
  const [selectedKey, setSelectedKey] = useState("1");
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const navigate = useNavigate();
  const logout = async () => {
    navigate({
      pathname: "/logout/",
      search: createSearchParams({ userType: "managmentUser" }).toString(),
    });
    // try {
    //   const response = await axios.post(config.UserLogout,{}, CONFIG_OBJ);
    //   console.log(response, "response logout function");
    //   if(response.status === 200) {
    //     notification.success({message: "Logout Successful"});
    //   }
    // } catch (error) {
    //   // notification.error({message: error.response.message});
    // }
  };

  const handleMenuClick = (key) => {
    setSelectedKey(key);
    switch (key) {
      case "1":
        navigate("/management/claims");
        break;
      case "2":
        logout();
        break;
      default:
        break;
    }
  };

  return (
    <Layout hasSider>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={200}
        style={{
          overflow: "auto",
          height: "100vh",
          //   position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
        }}
        className="bg-palelilac"
      >
        <div className="demo-logo-vertical text-center bg-palelilac d-flex justify-content-center align-items-center">
          <img
            src={opdlogo}
            width={80}
            height={40}
            alt="logo"
            className="my-3"
          />
        </div>
        <Menu
          style={{
            height: "90.2%",
          }}
          className="bg-palelilac"
          theme="light"
          mode="inline"
          // defaultSelectedKeys={['1']}
          selectedKeys={[selectedKey]}
          onClick={({ key }) => handleMenuClick(key)}
          items={[
            // {
            //   key: '1',
            //   icon: <DashboardOutlined />,
            //   label: 'Dashboard',
            // },
            {
              key: "1",
              icon: <FontAwesomeIcon icon={faFile} />,
              label: "OPD Claims",
            },
            // {
            //   key: '3',
            //   icon: <FontAwesomeIcon icon={faStethoscope} />,
            //   label: 'Free Health Check Up',
            // },
            // {
            //     key: '4',
            //     icon: <FontAwesomeIcon icon={faUser} />,
            //     label: 'Profile',
            //   },
            {
              key: "2",
              icon: <LogoutOutlined />,
              label: "Logout",
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
          // className='bg-palelilac'
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              //   height: 64,
            }}
          />
          <h1>Profile</h1>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            // minHeight: 280,
            background: colorBgContainer,
            // background: '#e6e9f9',
            borderRadius: borderRadiusLG,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};
export default Navbar;
