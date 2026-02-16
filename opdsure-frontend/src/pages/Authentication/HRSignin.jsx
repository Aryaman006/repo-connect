import {  useNavigate } from "react-router-dom";
import { Form, Input, Button, notification } from "antd";
import {Axios} from "../../axios/axiosFunctions";
import config from "../../config/config";
import loginimg from "../../assets/loginimg.png";
import threeline from "../../assets/threeline.png";
import { useAuth } from "../../context/authProvider";

export default function HrSignin() {
  const {setToken,setUserid, setUserType, setRole} = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    try {
      const result = await Axios.postAxiosData(config.HrLogin, values);

      if (result.success === true) {
        const token = result.data.token;
        const user_id = result.data.user_id;
        const user_type = 4;
        const role = result.data.role;
        setToken(token);
        setUserid(user_id);
        setUserType(user_type);
        setRole(role);
        notification.success({
          message: "Login Successful"
        });

        navigate("/hr/master/employees");
        
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
      <div className="container-fluid bg-light-blue py-3" style={{ height: "100vh" }}>
        <div className="row h-100 d-flex justify-content-center align-items-center">
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
