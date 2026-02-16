import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Input, Button, notification } from "antd";
import axios from "axios";
import config from "../../config/config";
import { noop } from "antd/es/_util/warning";

export default function AdminSignup() {
  const navigate = useNavigate();
  const [reload, setReload] = useState(false);

  const handleSubmitSignup = async (values) => {
    console.log("i ran");
    try {
      const result = await axios.post(config.AdminSignup, values);

      if (result.status === 200) {
        console.log("signup successful");
        notification.success({
          message: "Signup Successful"     
        });

       
        navigate("/admin/login");
        console.log("navigated successfully");
       
      } 
    } catch (error) {
      notification.error({
        message: error.response.data.message,
      });
    }
  };

  return (
    <div className="container-fluid" style={{ height: "100vh" }}>
      <div className="row h-100">
        <div className="col-lg-6 form-container col-xl-4 col-12 col-md-8 p-5 rounded-4 mx-auto my-auto">
          <Form
            layout="vertical"
            name="signupForm"
            initialValues={{ email: "", password: "", confirm_password: "" }}
            onFinish={handleSubmitSignup}
            validateMessages={{ required: "${label} is required!" }}
            // validateTrigger="onBlur"
          >
            <Form.Item
              name="name"
              label="Name"
              rules={[
                {
                  required: true,
                  message: " Name is required",
                },
                {
                  pattern: /^[&,.\-_\w\s]{1,20}$/,
                  message:
                    "Please enter a valid Name (up to 20 characters, only &, , ., -, _ special characters are allowed)",
                },
              ]}
              style={{ marginBottom: "10px" }}
            >
              <Input placeholder="Enter name" />
            </Form.Item>

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
              style={{ marginBottom: "10px" }}
            >
              <Input placeholder="you@opdsure.com" />
            </Form.Item>
            <span className="d-flex">           
            <Form.Item
              name="country_code"
              label="Country Code"
              rules={[
                { required: true },
                {
                  pattern: /^[0-9]+$/,
                  message: "Mobile number must contain only digits",
                },
          
              ]}
              style={{ marginBottom: "10px" }}
            >
              <Input
                type="number"
                style={{
                  width: "40%",
                }}
                placeholder=""
                maxLength={4} // Adjust maxLength if needed
              />
            </Form.Item>
            <Form.Item
              name="phone"
              label={<span className="text-black">Mobile No.</span>}
              rules={[
                { required: true, message: "Mobile is required" },
                {
                  pattern: /^[0-9]+$/,
                  message: "Mobile number must contain only digits",
                },
                {
                  len: 10,
                  message: "Mobile number must be exactly 10 digits",
                },
              ]}
              style={{ marginBottom: "10px" }}
            >
              <Input type="number"  style={{
                  width: "100%",
                }} placeholder="mobile no." maxLength={10} />
            </Form.Item>
            </span>
            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: "Please input your password!" },
                {
                  validator: (_, value) => {
                    if (
                      !value ||
                      /^(?=.*\d)(?=.*[a-z])(?=.*[\W_]).{8,15}$/.test(value)
                    ) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(
                        "Password must contain at least one number, one alphabet, one special character, and be 8 to 15 characters long!"
                      )
                    );
                  },
                },
              ]}
              style={{ marginBottom: "10px" }}
            >
              <Input.Password placeholder="password" />
            </Form.Item>
            <Form.Item
              name="confirm_password"
              label="Confirm Password"
              rules={[
                {
                  required: true,
                  message: "Please confirm your password!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("passwords do not match!"));
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
}
