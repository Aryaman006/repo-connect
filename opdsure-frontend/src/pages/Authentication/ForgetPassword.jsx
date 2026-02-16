import React, { useState } from 'react'
// import '../App.css'
import axios from 'axios'
import { Button, Form, Input, Modal, notification, Typography, Switch, Row, Col } from 'antd';
const { Title } = Typography;
import { toast } from 'react-toastify';
// import {forgotPasswordVerify, forgotPassword } from '../Config';
import { Link, useNavigate } from 'react-router-dom';
import logoNtagline from '../../assets/logoNtagline.png';
import config from '../../config/config';
import CONSTANTS from '../../constant/Constants';

export default function ForgetPassword() {
  const [signupForm] = Form.useForm();
  const [email, setEmail] = useState("")
  const [newpassword, setNewpassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [currentpassword, setCurrentpassword] = useState("");
  const [user_type, setUser_type] = useState(CONSTANTS.MAN_USER_TYPES.GENERAL);

  let [modalVisible,SetModalVisible]=useState(false);
  let [loader,Setloader]=useState(false);

  let navigate=useNavigate();

  // send otp function
  const sendMail = (event) => {
    event.preventDefault();

    if(email!=null && email!=''){
      const requestData = {
        email,
      }
      //Setloader(true)
      
      axios.post(user_type === CONSTANTS.MAN_USER_TYPES.GENERAL
        ? config.ForgotPasswordManag
        : config.ForgotPasswordAdmin,
         requestData)
      .then((result) => {
        if (result.status === 200 ) {
          Setloader(false)
          navigate("/admin/login")
          notification.success({message: "Link to reset account password has been successfully sent to your email."});
        }else{
          notification.error({message: result.data.message,}); 
        }
      })
      .catch((error) => {
        notification.error({message: error.response.data.message,});
      })
    }else{
      notification.error({message: 'Please enter email',});
    }
  
  }
  const handleUserTypeChange = (checked) => {
    setUser_type(
      checked
        ? CONSTANTS.MAN_USER_TYPES.ADMIN
        : CONSTANTS.MAN_USER_TYPES.GENERAL
    )
  };
  return (
  <>
    <div className='d-flex bg-light-blue justify-content-center align-items-center' style={{ height: '100vh' }}>
      <div className='col-3 form-container text-center'>
      <img src={logoNtagline} alt="logo"width={"70%"} height={"70%"} className=' mb-3'/>
        <p className='text-center' style={{ fontSize: '30px', fontWeight: '700', lineHeight: '30px' }}><span className='textblue'>Recover your</span><br /><span className='text-dark'>Account</span></p>
        <p className='textgrey text-center fst-italic text-secondary'>Upon entering the email you will receive link to recover your account.</p>
        <div className="mb-3">
          {/* <label htmlFor="exampleInput" className="form-label text-left">Email</label> */}
          <Input value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" type="email" placeholder="email" id='exampleInput' aria-label="default input example" 
          // disabled={otpSent}
          />
        </div>
        <Row>
          <Col>
          <Switch
                  checkedChildren="Admin"
                  unCheckedChildren="Management"
                  onChange={handleUserTypeChange}
                  style={{marginBottom:"1rem"}}
                />
          </Col>
        </Row>
       
        <div className="d-grid">
         
          <Button type='primary' loading={loader} htmlType='button' onClick={(e) => { sendMail(e) }}>
          Send Mail
          </Button>
       <Link to="/admin/login" className='text-end mt-2'>Back to login</Link>
        </div>
        </div>
        </div>

        
   </>
  )
}

