import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Input, Button, notification, Switch } from "antd";
import { UserAddOutlined, LoginOutlined } from "@ant-design/icons";
import axios from "axios";
import config from "../../config/config";
import loginimg from "../../assets/loginimg.png";
import threeline from "../../assets/threeline.png";
import opdlogo from "../../assets/OPD-Logo.svg";
import { useAuth } from "../../context/authProvider";
import CONSTANTS from "../../constant/Constants";
import { useManagementUser } from "../../context/managementUserProvider";
import { useAdminUser } from "../../context/adminUserProvider";
export default function AdminSignin() {
  const navigate = useNavigate();
  const { setToken, setUserid , setUserType, setRole} = useAuth();
  const {setManUserDesignation,setManUserName,setManUserEmail,setManUserMobile} = useManagementUser();
  const {setAdminUserEmail, setAdminUserMobile, setAdminUserName} = useAdminUser();
  const [user_type, setUser_type] = useState(CONSTANTS.MAN_USER_TYPES.GENERAL);
  const handleSubmit = async (values) => {
    try { 
      const result = await axios.post(
        user_type === CONSTANTS.MAN_USER_TYPES.GENERAL
          ? config.ManagementUserLogin
          : config.AdminLogin,
        values
      );

      if (result.status === 200) {
        const token = result.headers.authorization.split(" ")[1];
        const userid = result.headers.user_id;
        const designation = result.headers.designation;
        setToken(token);
        setUserid(userid);
        const role = result.data.data.role;
        setRole(role);
        localStorage.setItem("designation",designation);
        setUserType(user_type);
        try {
          let userProfile;
          if(user_type === CONSTANTS.MAN_USER_TYPES.GENERAL)
            userProfile  = await axios.get(            
            `${config.ApiBaseUrl}${config.GetManagentUserProfile}`
            ,{
              headers: {
              'Authorization': 'Bearer ' + token
            }}
          )
          else if(user_type === CONSTANTS.MAN_USER_TYPES.ADMIN)
            userProfile  = await axios.get(            
            `${config.ApiBaseUrl}${config.GetAdminUserProfile}`
            ,{
              headers: {
              'Authorization': 'Bearer ' + token
            }}
          )
          const profileData = userProfile.data.data;
          if(user_type ===  CONSTANTS.MAN_USER_TYPES.ADMIN ){    
            setAdminUserEmail(profileData.email);
            setAdminUserMobile( profileData.country_code + profileData.phone );
            setAdminUserName(profileData.name);
          }else if(user_type ===  CONSTANTS.MAN_USER_TYPES.GENERAL){
            setManUserDesignation(profileData.designation.internal_id);
            setManUserEmail(profileData.email);
            setManUserMobile( profileData.country_code + profileData.mobile );
            setManUserName(profileData.name);
          }          
        } catch (error) {
          navigate("/admin/login") 
        }       
        notification.success({
          message: "Login Successful",
        });
        user_type === CONSTANTS.MAN_USER_TYPES.GENERAL
          ? navigate("/management/dashboard") 
          : user_type === CONSTANTS.MAN_USER_TYPES.ADMIN ? navigate("/admin/master/designation") : "" ;
      }
    } catch (error) {
      notification.error({
        message: error.response.data.message,
      });
    }
  };
  const handleUserTypeChange = (checked) => {
    setUser_type(
      checked
        ? CONSTANTS.MAN_USER_TYPES.ADMIN
        : CONSTANTS.MAN_USER_TYPES.GENERAL
    )
    setUserType(user_type);
  };


  return (
    <>
      <div className="container-fluid bg-light-blue py-3" style={{ height: "100vh" }}>
        {/* <div className="row rounded-4 h-20 d-flex justify-content-around align-items-center mb-5 bg-white shadow-sm py-2 mx-5 mb-5">
        <div className="col-5">
          <img src={opdlogo} width={100} height={30} alt="logo" />
        </div>
          <div className="col-6 d-flex gap-3">
            <Link to="/admin/signup" className="text-decoration-none">
              <p className="text-center">
                <UserAddOutlined className="text-secondary me-2" />
                Sign Up
              </p>
            </Link>
            <Link to="/admin/login" className="text-decoration-none">
              <p className="text-center">
                <LoginOutlined className="text-secondary me-2" />
                Sign In
              </p>
            </Link>
          </div>
          <div className="col-1">
            <Button type="primary">Go Back</Button>
          </div>
        </div> */}
        <a href="/">Go to Website</a>
        <div className="row mt-4 d-flex justify-content-center align-items-center">
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
          <div className="col-lg-6 form-container col-xl-4 col-12 col-md-8 p-5 my-auto">
            <h1 className="text-center mb-4">Login</h1>
            <Form
              layout="vertical"
              name="loginForm"
              initialValues={{ email: "", password: "" }}
              onFinish={handleSubmit}
              validateMessages={{ required: "${label} is required!" }}
              // validateTrigger="onBlur"
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
                  { required: true, message: "Please enter your password!" },
                ]}
              >
                <Input.Password placeholder="password" />
              </Form.Item>

              <div className="d-flex justify-content-between">
                <Switch
                  checkedChildren="Admin"
                  unCheckedChildren=""
                  onChange={handleUserTypeChange}
                />
                <Link to="/admin/forgot" className="text-dark text-end mb-3">
                  Forgot Password?
                </Link>
              </div>
              <Form.Item>
                <Button type="primary" htmlType="submit" block>
                  Login
                </Button>
              </Form.Item>
            </Form>
            {/* <p className="text-center mt-4 text-body-tertiary">
            Don't have an account?{" "}
            <Link to="/admin/signup" className="text-decoration-none">
              Sign Up
            </Link>
          </p> */}
          </div>
        </div>
        {/* </div> */}
      </div>
    </>
  );
}
