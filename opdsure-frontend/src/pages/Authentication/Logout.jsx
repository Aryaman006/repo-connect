import { Col, Row, Spin, notification } from "antd";
// import axios from "axios";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/authProvider";
import {Axios} from "../../axios/axiosFunctions";
import config from "../../config/config";
import { useManagementUser } from "../../context/managementUserProvider";
import { useGeneralUser } from "../../context/generalUserProvider";
import { useAdminUser } from "../../context/adminUserProvider";
const Logout = () => {
  const { setToken, token, clearAuthContext } = useAuth();
  const {clearUserContext} = useGeneralUser();
  const { clearManagementUserContext } = useManagementUser();
  const { clearAdminUserContext } = useAdminUser()
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const userType = searchParams.get("userType");
  useEffect(() => {
    const handleLogout = async () => {
      if (userType === "subscriber") {
        try {
         await Axios.postAxiosData(config.UserLogout);
         clearUserContext();  
        } catch (error) {
          notification.error({message: error.response.message});
        }finally{
          localStorage.clear();
          sessionStorage.clear();
        }
      }
      else if (userType === "admin") {
        try {
         await Axios.postAxiosData(config.AdminUserLogout);
         clearAdminUserContext();  
        } catch (error) {
          notification.error({message: error.response.message});
        }finally{
          localStorage.clear();
          sessionStorage.clear();
        }
      }
      else if (userType === "managmentUser") {
        try {
         await Axios.postAxiosData(config.ManagementUserLogout);
         clearManagementUserContext();  
        } catch (error) {
          notification.error({message: error.response.message});
        }finally{
          localStorage.clear();
          sessionStorage.clear();
        }
      }
      else if (userType === "hrUser") {
        try {
         await Axios.postAxiosData(config.HrLogout);
        } catch (error) {
          notification.error({message: error.response.message});
        }finally{
          localStorage.clear();
          sessionStorage.clear();
        }
      }
      setToken("");
      clearAuthContext();
      localStorage.clear();
      sessionStorage.clear();
      notification.success({
        message: "Logout Successful",
        description: "Close the window for security reasons.",
      });
     
      if (userType === "managmentUser") navigate("/admin/login");
      else if (userType === "admin") navigate("/admin/login");
      else if (userType === "subscriber") navigate("/user/login");
      else if (userType === "hrUser") navigate("/hr/login");
      else navigate("/user/login");
      
    };

    setTimeout(() => {
      handleLogout();
    }, 1 * 1000);
  }, [token, navigate]);

  return (
    <>
      <Row justify="center" align="middle" style={{ minHeight: "100vh" }}>
        <Col span={12}>
          <Spin tip="Loggin Out" size="large">
            <div className="content" />
          </Spin>
        </Col>
      </Row>
    </>
  );
};

export default Logout;
