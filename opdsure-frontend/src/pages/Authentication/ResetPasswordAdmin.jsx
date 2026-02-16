import { Card,Button,  Form, Input, notification } from 'antd'
import { Axios } from '../../axios/axiosFunctions';
import { useNavigate, useLocation } from 'react-router-dom';
import config from '../../config/config';
const ResetPasswordAdmin = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get("email");
  const key = queryParams.get("key");

    const [form] = Form.useForm();
    const navigate = useNavigate();
    const onFinish = async (values) => {
      values.email = email;
      values.key = key;
        try {
            const resp = await Axios.postAxiosData(config.ForgotPasswordAdminDetails,values);
            if(resp.success===true){
              notification.success({
                message: "Password reset successfully."
              });
            navigate("/admin/login");
            }else{
              notification.error({message:resp.message});
            }
           
           
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

export default ResetPasswordAdmin