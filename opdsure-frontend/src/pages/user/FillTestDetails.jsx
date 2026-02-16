import React from 'react';
import { Form, Input, Button, DatePicker, Select, Card, Row, Col, InputNumber,notification } from 'antd';
import dayjs from 'dayjs';
import axios from 'axios';
import config from '../../config/config';
import { useNavigate,useLocation } from 'react-router-dom';
const { Option } = Select;
const { TextArea } = Input;
const FillTestDetails = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = location.state || {};
    console.log("id",id)
  const [form] = Form.useForm();
  const token = localStorage.getItem("token");

  // Calculate the minimum date (72 hours from now)
  const minDate = dayjs().add(72, 'hour');

  const onFinish = async (values) => {
    console.log('Received values:', values);
    console.log("token", token);
    
    try {
     console.log("id before api",id)
      const response = await axios.post(
        id == undefined ? config.SendTestCollectionDetails : config.SendTestCollectionDetails+`/${id}`,
         values, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Response", response);
      console.log("Response.data.success:", response.data.success);
     
      if(response.data.success){
        notification.success({
            message: 'Success',
            description: 'Test details submitted successfully!',
          });
        console.log("response",response)
        navigate("/user/dashboard", { replace: true });
      }
    } catch (error) {
      notification.error({
        message:error.response.data.message,
      });
    }
  };

  return (
  
  
    <div style={{ backgroundColor: '#f0f2f5', height: '120vh' }}>
      <Row justify="center" align="middle" style={{ height: '100%' }}>
        <Col xs={24} sm={16} md={12} lg={8}>
          <Card title="Patient Details" bordered headStyle={{ textAlign: 'center' }}>
            <Form form={form} layout="vertical" onFinish={onFinish}>
              <Form.Item
                name="patient_name"
                label="Patient Name"
                rules={[{ required: true, message: 'Please input the patient name!' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="age"
                label="Age"
                rules={[
                  { required: true, message: 'Please input your age!' },
                  { type: "number", min: 1, message: "Age cannot be less than 1" },
                  { type: "number", max: 99, message: "Age cannot be greater than 99" }
                ]}
              >
                <InputNumber step={1} />
              </Form.Item>

              <Form.Item
                name="address"
                label="Address"
                rules={[{ required: true, message: 'Please input your address!' }]}
              >
                <TextArea rows={4} />
              </Form.Item>

              <Form.Item
                name="pincode"
                label="Pincode"
                rules={[
                  { required: true, message: 'Please input your pincode!' },
                  {
                    validator: (_, value) => {
                      if (!value) {
                        return Promise.reject(new Error('Please input your pincode!'));
                      }
                      if (value < 110001 || value > 999999) {
                        return Promise.reject(new Error('Enter valid pincode'));
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Input style={{ maxWidth: "50%" }} />
              </Form.Item>

              <Form.Item
                name="gender"
                label="Gender"
                rules={[{ required: true, message: 'Please select your gender!' }]}
              >
                <Select placeholder="Select gender" style={{ maxWidth: "50%" }}>
                  <Select.Option value={1}>Male</Select.Option>
                  <Select.Option value={2}>Female</Select.Option>
                  <Select.Option value={3}>Others</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="appointment"
                label="Appointment"
                rules={[{ required: true, message: 'Please select a date and time for the appointment!' }]}
              >
                <DatePicker
                  showTime={{
                    format: 'hh:mm A',
                    hideDisabledOptions: true,
                  }}
                  disabledDate={(current) => current.isBefore(minDate, 'minute')}
                  format="DD-MM-YYYY hh:mm A"
                  disabledTime={() => ({
                    disabledHours: () => [],
                    disabledMinutes: () => [],
                    disabledSeconds: () => [],
                  })}
                />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" block>
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default FillTestDetails;