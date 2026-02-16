import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Input, Button, notification } from "antd";
import { UserAddOutlined, LoginOutlined } from "@ant-design/icons";
import {Axios} from "../../axios/axiosFunctions";
import config from "../../config/config";
import loginimg from "../../assets/loginimg.png";
import threeline from "../../assets/threeline.png";
import opdlogo from "../../assets/opdlogo.png";
import { useAuth } from "../../context/authProvider";

export default function UserSignin() {
  const {setToken,setUserid, setUserType} = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    try {
      const result = await Axios.postAxiosData(config.UserLogin, values);

      if (result.success === true) {
        const token = result.data.token;
        const user_id = result.data.user_id;
        const user_type = 3;
        setToken(token);
        setUserid(user_id);
        setUserType(user_type);
        notification.success({
          message: "Login Successful"
        });

        sessionStorage.setItem("token", result.data.token);

        navigate("/user/dashboard");
        setTimeout(() => {
          window.location.reload();
        }, 3000); 
      } 
      else{
        notification.error({
          message:result.message
        })
      }
    } catch (error) {
     
        notification.error({
          message:error.response.data.message

        })
    }
  };

  return (
    <>
      <div className="container-fluid bggrey py-3" style={{ height: "100vh" }}>
        <div className="row rounded-4 h-20 d-flex justify-content-around align-items-center mb-5 bg-white shadow-sm py-2 mx-5 mb-5">
        <div className="col-5">
          <img src={opdlogo} width={100} height={30} alt="logo" />
        </div>
          <div className="col-6 d-flex gap-3">
            <Link to="/user/signup" className="text-decoration-none">
              <p className="text-center">
                <UserAddOutlined className="text-secondary me-2" />
                Sign Up
              </p>
            </Link>
            <Link to="/user/login" className="text-decoration-none">
              <p className="text-center">
                <LoginOutlined className="text-secondary me-2" />
                Sign In
              </p>
            </Link>
          </div>
          <div className="col-1">
            <Button type="primary">Go Back</Button>
          </div>
        </div>
        <div className="row h-80 d-flex justify-content-center align-items-center mt-5">
          {/* for image section */}
          <div className="col-lg-6 col-xl-4 col-12 col-md-8 pt-4 px-4 my-auto bglightblue">
            <span className="d-flex gap-0">
              <h1 className="text-center mb-5 text-white">
                Effortless OPD Claims
              </h1>
              <img
                src={threeline}
                alt="sound icon"
                className=""
                width={40}
                height={40}
              />
            </span>
            <span className="d-flex justify-content-center">
              <img src={loginimg} alt="login img" width="62%" height="60%" />
            </span>
          </div>
          {/* for login form */}
          <div className="col-lg-6 form-container col-xl-4 col-12 col-md-8 p-5 my-auto bg-white">
            <h1 className="text-center mb-4">Login</h1>
            <Form
              layout="vertical"
              name="loginForm"
              initialValues={{ email: "", password: "" }}
              onFinish={handleSubmit}
              validateMessages={{ required: "${label} is required!" }}
            >
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  {
                    required: true,
                    type: "email",
                    message: "Please enter a valid email",
                  },
                ]}
              >
                <Input placeholder="you@opdsure.com" />
              </Form.Item>
              <Form.Item
                name="password"
                label="Password"
                rules={[
                  { required: true, message: "Please input your password!" },
                ]}
              >
                <Input.Password placeholder="password" className=""/>
              </Form.Item>

              <div className="d-flex justify-content-end">
                <Link
                  to="/forgot"
                  className="text-dark text-end text-decoration-underline mb-3"
                >
                  Forgot Password ?
                </Link>
              </div>
              <Form.Item>
                <Button type="primary" htmlType="submit" block>
                  Login
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
        {/* </div> */}
      </div>
    </>
  );
}
