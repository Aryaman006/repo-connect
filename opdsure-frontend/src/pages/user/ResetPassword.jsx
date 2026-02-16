import { Card,Button,  Form, Input, notification } from 'antd'
import { Axios } from '../../axios/axiosFunctions';
import { useNavigate } from 'react-router-dom';
import config from '../../config/config';
const ResetPassword = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const onFinish = async (values) => {
        try {
            await Axios.postAxiosData(config.ResetUserPass,values);
            notification.success({
                message: "Password reset successfully.Login Again"
              });
            navigate("/user/login");
           
        } catch (error) {
            notification.error({
                message:"Failed to reset password"
              });            
        }
      };
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f0f2f5',
      }}
    >
   <Card  style={{
          width: '400px',
        }}>
    <Form
     form={form}
      name="login"
      initialValues={{
        remember: true,
      }}
      style={{
        maxWidth: 360,
      }}
      onFinish={onFinish}
      layout="vertical"
    >   
     <p style={{ marginBottom: '20px', textAlign: 'center' }}>
            Please enter your new password.
          </p>
      <Form.Item
        label="Password"
        name="password"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item
        label="Confirm Password"
        name="confirm_password"
        dependencies={['password']}
        rules={[
          {
            required: true,
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('Confirm password that you entered do not match!'));
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item>
        <Button block type="primary" htmlType="submit">
          Reset
        </Button>
      </Form.Item>
    </Form>
   </Card>
   </div>
  )
}

export default ResetPassword