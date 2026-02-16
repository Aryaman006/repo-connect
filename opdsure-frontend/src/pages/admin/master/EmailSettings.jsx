import React, { useState , useEffect} from 'react';
import { Row, Col, Form, Input, Button, notification } from 'antd';
import config from "../../../config/config";
import CONSTANTS from "../../../constant/Constants";
import {Axios} from "../../../axios/axiosFunctions";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const toolbarOptions = {
  toolbar: [
    [{ 'header': '1' }, { 'header': '2' }, { 'header': '3' }, { 'header': '4' }, { 'header': '5' }, { 'header': '6' }, { 'font': [] }],
    [{ 'size': [] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{'list': 'ordered'}, {'list': 'bullet'},{'list' : 'roman'}, {'list': 'alphabet'}, {'indent': '-1'}, {'indent': '+1'}, {'align': []}],
    ['link', 'image', 'video'],
    ['align', 'clean'],
    ['code-block']
  ],
};
const EmailSettings = () => {

   const[ id, setId ] = useState();
   const [emailSettingsForm] = Form.useForm();

   const fetchEmailTemplate = async () => {
     const response = await Axios.fetchAxiosData(config.GetEmailTemplate);
     setId(response?.data?._id);
     if (response.success === true) {
       emailSettingsForm.setFieldsValue(response?.data);
     }   
   }

   useEffect(() => {
    fetchEmailTemplate();
   }, []);
   
    const handleSubmit = async() => {
      const values = emailSettingsForm.getFieldsValue();
      const response = await Axios.patchAxiosData(config.UpdateEmailTemplate + id, values);
      if(response.success === true) {
        notification.success({
          message: "Email template updated successfully."
        })
      }
      else {
        notification.error({
          message: response.message
        })
      }
    }  
    

  return (
    <>
    <div className="container">
      <div className="row">
        <div className="col-12">
        <Row justify={"start"}>
          <h4 style={{ fontWeight: "bold" }} className="textblue">Email Settings</h4>
        </Row>
        <Form 
        layout="vertical" 
        form={emailSettingsForm}
        onFinish={handleSubmit}
        >
            <Row gutter={32} className='mt-5 mb-5'>
              <Col span={12}>
                <Form.Item
                  name="registration"
                  label="Registration Mail"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your registration mail!",
                    },
                    {
                      max: CONSTANTS.STRING_LEN.EMAILTEMPLATE,
                      message: `Maximum value ${CONSTANTS.STRING_LEN.EMAILTEMPLATE}`,
                    },
                  ]}
                >
                
                   <ReactQuill
                    modules={toolbarOptions}
                    theme="snow" 
                    placeholder=""
                    style={{
                      height: 100,
                      resize: "none",
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={12} >
                <Form.Item
                  name="forget_password"
                  label="Forget Password Email"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your forget passsword mail!",
                    },
                    {
                      max: CONSTANTS.STRING_LEN.EMAILTEMPLATE,
                      message: `Maximum value ${CONSTANTS.STRING_LEN.EMAILTEMPLATE}`,
                    },
                  ]}
                  hidden
                >
                
                   <ReactQuill
                    modules={toolbarOptions} 
                    placeholder=""
                    style={{
                      height: 100,
                      resize: "none",
                    }}
                  />
                </Form.Item>
              </Col>
            
            </Row>
            <br/>
            <Row gutter={32} className='mt-5 mb-5'>
              <Col span={12}>
                <Form.Item
                  name="account_recover"
                  label="Account Recovery Mail"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your mail!",
                    },
                    {
                      max: CONSTANTS.STRING_LEN.EMAILTEMPLATE,
                      message: `Maximum value ${CONSTANTS.STRING_LEN.EMAILTEMPLATE}`,
                    },
                  ]}
                >
                
                   <ReactQuill
                    modules={toolbarOptions}
                    theme="snow" 
                    placeholder=""
                    style={{
                      height: 100,
                      resize: "none",
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="signin"
                  label="Sign in OTP Mail"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your mail!",
                    },
                    {
                      max: CONSTANTS.STRING_LEN.EMAILTEMPLATE,
                      message: `Maximum value ${CONSTANTS.STRING_LEN.EMAILTEMPLATE}`,
                    },
                  ]}
                >
                
                   <ReactQuill
                    modules={toolbarOptions}
                    theme="snow" 
                    placeholder=""
                    style={{
                      height: 100,
                      resize: "none",
                    }}
                  />
                </Form.Item>
              </Col>
            
            </Row>
            <br/>
            <Row gutter={32} className='mt-5 mb-5'>
            <Col span={12}>
                <Form.Item
                  name="plan_purchase_mail"
                  label="Plan Purchase Mail"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your plan purchase mail!",
                    },
                    {
                      max: CONSTANTS.STRING_LEN.EMAILTEMPLATE,
                      message: `Maximum value ${CONSTANTS.STRING_LEN.EMAILTEMPLATE}`,
                    },
                  ]}
                >
                
                   <ReactQuill
                    modules={toolbarOptions} 
                    placeholder=""
                    style={{
                      height: 100,
                      resize: "none",
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="plan_purchase_failure"
                  label="Plan Purchase Failure Mail"
                  rules={[
                    {
                      required: true,
                      message: "Please enter plan purchase failure mail",
                    },
                    {
                      max: CONSTANTS.STRING_LEN.EMAILTEMPLATE,
                      message: `Maximum value ${CONSTANTS.STRING_LEN.EMAILTEMPLATE}`,
                    },
                  ]}
                >
                
                   <ReactQuill
                    modules={toolbarOptions}
                    theme="snow" 
                    placeholder=""
                    style={{
                      height: 100,
                      resize: "none",
                    }}
                  />
                </Form.Item>
              </Col>
              {/* <Col span={12}>
                <Form.Item
                  name="plan_purchase_mail"
                  label="Plan Purchase Mail"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your plan purchase mail!",
                    },
                    {
                      max: CONSTANTS.STRING_LEN.EMAILTEMPLATE,
                      message: `Maximum value ${CONSTANTS.STRING_LEN.EMAILTEMPLATE}`,
                    },
                  ]}
                >
                
                   <ReactQuill
                    modules={toolbarOptions} 
                    placeholder=""
                    style={{
                      height: 100,
                      resize: "none",
                    }}
                  />
                </Form.Item>
              </Col> */}
            </Row>
            <br/>
            <Row gutter={32} className='mt-5 mb-5'>
              <Col span={12}>
                <Form.Item
                  name="plan_renew_mail"
                  label="Plan Renew Mail"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your plan renew mail!",
                    },
                    {
                      max: CONSTANTS.STRING_LEN.EMAILTEMPLATE,
                      message: `Maximum value ${CONSTANTS.STRING_LEN.EMAILTEMPLATE}`,
                    },
                  ]}
                >
                
                   <ReactQuill
                    modules={toolbarOptions}
                    theme="snow" 
                    placeholder=""
                    style={{
                      height: 100,
                      resize: "none",
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="plan_upgrade_mail"
                  label="Plan Upgrade Mail"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your plan upgrade mail!",
                    },
                    {
                      max: CONSTANTS.STRING_LEN.EMAILTEMPLATE,
                      message: `Maximum value ${CONSTANTS.STRING_LEN.EMAILTEMPLATE}`,
                    },
                  ]}
                >
                
                   <ReactQuill
                    modules={toolbarOptions} 
                    placeholder=""
                    style={{
                      height: 100,
                      resize: "none",
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
            {/* second row */}
            <Row gutter={32} className='mt-5 mb-5'>
              <Col span={12} className='mt-5'>
                <Form.Item
                  name="hc_plan_purchase_mail"
                  label="Heath care Plan Purchase Mail"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your health care plan purchase mail!",
                    },
                    {
                      max: CONSTANTS.STRING_LEN.EMAILTEMPLATE,
                      message: `Maximum value ${CONSTANTS.STRING_LEN.EMAILTEMPLATE}`,
                    },
                  ]}
                >
                
                   <ReactQuill
                    modules={toolbarOptions} 
                    placeholder=""
                    style={{
                      height: 100,
                      resize: "none",
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={12} className='mt-5'>
                <Form.Item
                  name="plan_expiry_mail"
                  label="Plan Expiry Mail"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your plan expiry mail!",
                    },
                    {
                      max: CONSTANTS.STRING_LEN.EMAILTEMPLATE,
                      message: `Maximum value ${CONSTANTS.STRING_LEN.EMAILTEMPLATE}`,
                    },
                  ]}
                >
                
                   <ReactQuill
                    modules={toolbarOptions} 
                    placeholder=""
                    style={{
                      height: 100,
                      resize: "none",
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
            {/* 3rd row */}
            <Row gutter={32} className='mt-5 mb-5'>
              <Col span={12}  className='mt-5'>
                <Form.Item
                  name="hc_plan_expiry_mail"
                  label="Health Care Plan Expiry Mail"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your health care plan expiry mail!",
                    },
                    {
                      max: CONSTANTS.STRING_LEN.EMAILTEMPLATE,
                      message: `Maximum value ${CONSTANTS.STRING_LEN.EMAILTEMPLATE}`,
                    },
                  ]}
                >
                
                   <ReactQuill
                    modules={toolbarOptions} 
                    placeholder=""
                    style={{
                      height: 100,
                      resize: "none",
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}  className='mt-5'>
                <Form.Item
                  name="claim_submission_mail"
                  label="Claim Submission Mail"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your claim submission mail!",
                    },
                    {
                      max: CONSTANTS.STRING_LEN.EMAILTEMPLATE,
                      message: `Maximum value ${CONSTANTS.STRING_LEN.EMAILTEMPLATE}`,
                    },
                  ]}
                >
                
                   <ReactQuill
                    modules={toolbarOptions} 
                    placeholder=""
                    style={{
                      height: 100,
                      resize: "none",
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
            {/* 4th row */}
            <Row gutter={32} className='mt-5 mb-5'>
              <Col span={12}  className='mt-5'>
                <Form.Item
                  name="claim_approval_mail"
                  label="Claim Approval Mail"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your claim approval mail!",
                    },
                    {
                      max: CONSTANTS.STRING_LEN.EMAILTEMPLATE,
                      message: `Maximum value ${CONSTANTS.STRING_LEN.EMAILTEMPLATE}`,
                    },
                  ]}
                >
                
                   <ReactQuill
                    modules={toolbarOptions} 
                    placeholder=""
                    style={{
                      height: 100,
                      resize: "none",
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}  className='mt-5'>
                <Form.Item
                  name="claim_rejection_mail"
                  label="Claim Rejection Mail"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your claim rejection mail!",
                    },
                    {
                      max: CONSTANTS.STRING_LEN.EMAILTEMPLATE,
                      message: `Maximum value ${CONSTANTS.STRING_LEN.EMAILTEMPLATE}`,
                    },
                  ]}
                >
                
                   <ReactQuill
                    modules={toolbarOptions} 
                    placeholder=""
                    style={{
                      height: 100,
                      resize: "none",
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
            {/* 5th row */}
             <Row gutter={32} className='mt-5 mb-5'>
              <Col span={12} className='mt-5'>
                <Form.Item
                  name="claim_clarification_mail"
                  label="Claim Clarification Mail"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your claim clarification mail!",
                    },
                    {
                      max: CONSTANTS.STRING_LEN.EMAILTEMPLATE,
                      message: `Maximum value ${CONSTANTS.STRING_LEN.EMAILTEMPLATE}`,
                    },
                  ]}
                >
                
                   <ReactQuill
                    modules={toolbarOptions}                  
                    placeholder=""
                    style={{
                      height: 100,
                      resize: "none",
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={12} className='mt-5'>
                <Form.Item
                  name="claim_updation_mail"
                  label="Claim Updation Mail"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your claim updation mail!",
                    },
                    {
                      max: CONSTANTS.STRING_LEN.EMAILTEMPLATE,
                      message: `Maximum value ${CONSTANTS.STRING_LEN.EMAILTEMPLATE}`,
                    },
                  ]}
                >
                
                   <ReactQuill
                    modules={toolbarOptions}                  
                    placeholder=""
                    style={{
                      height: 100,
                      resize: "none",
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
            {/* 6th row */}
         
            {/* 7th row */}
            <Row gutter={32} className='mt-5 mb-5'>
              <Col span={12} className='mt-5'>
                <Form.Item
                  name="claim_invalid_mail"
                  label="Claim Invalid Mail"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your claim Invalid mail!",
                    },
                    {
                      max: CONSTANTS.STRING_LEN.EMAILTEMPLATE,
                      message: `Maximum value ${CONSTANTS.STRING_LEN.EMAILTEMPLATE}`,
                    },
                  ]}
                >
                
                   <ReactQuill
                    modules={toolbarOptions}                  
                    placeholder=""
                    style={{
                      height: 100,
                      resize: "none",
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={12} className='mt-5'>
                <Form.Item
                  name="claim_settled_mail"
                  label="Claim Settled Mail"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your claim settled mail!",
                    },
                    {
                      max: CONSTANTS.STRING_LEN.EMAILTEMPLATE,
                      message: `Maximum value ${CONSTANTS.STRING_LEN.EMAILTEMPLATE}`,
                    },
                  ]}
                >
                
                   <ReactQuill
                    modules={toolbarOptions}                  
                    placeholder=""
                    style={{
                      height: 100,
                      resize: "none",
                    }}
                  />
                </Form.Item>
              </Col>
             
            </Row>
            <Row gutter={32} className='mt-5 mb-5'>
              <Col span={12} className='mt-5'>
                <Form.Item
                  name="dispute_submission_mail"
                  label="Dispute Submission Mail"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your dispute raise mail!",
                    },
                    {
                      max: CONSTANTS.STRING_LEN.EMAILTEMPLATE,
                      message: `Maximum value ${CONSTANTS.STRING_LEN.EMAILTEMPLATE}`,
                    },
                  ]}
                >
                
                   <ReactQuill
                    modules={toolbarOptions}                  
                    placeholder=""
                    style={{
                      height: 100,
                      resize: "none",
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={12} className='mt-5'>
                <Form.Item
                  name="dispute_approval_mail"
                  label="Dispute Approval Mail"
                  rules={[
                    {
                      required: true,
                      message: "Please enter dispute approve mail!",
                    },
                    {
                      max: CONSTANTS.STRING_LEN.EMAILTEMPLATE,
                      message: `Maximum value ${CONSTANTS.STRING_LEN.EMAILTEMPLATE}`,
                    },
                  ]}
                >
                
                   <ReactQuill
                    modules={toolbarOptions}                  
                    placeholder=""
                    style={{
                      height: 100,
                      resize: "none",
                    }}
                  />
                </Form.Item>
              </Col>
             
            </Row>
            <Row gutter={32} className='mt-5 mb-5'>
              <Col span={12} className='mt-5'>
                <Form.Item
                  name="dispute_rejection_mail"
                  label="Dispute Rejection Mail"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your dispute rejection mail!",
                    },
                    {
                      max: CONSTANTS.STRING_LEN.EMAILTEMPLATE,
                      message: `Maximum value ${CONSTANTS.STRING_LEN.EMAILTEMPLATE}`,
                    },
                  ]}
                >
                
                   <ReactQuill
                    modules={toolbarOptions}                  
                    placeholder=""
                    style={{
                      height: 100,
                      resize: "none",
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={12} className='mt-5'>
                <Form.Item
                  name="dispute_settled_mail"
                  label="Dispute Settled Mail"
                  rules={[
                    {
                      required: true,
                      message: "Please enter dispute approve mail!",
                    },
                    {
                      max: CONSTANTS.STRING_LEN.EMAILTEMPLATE,
                      message: `Maximum value ${CONSTANTS.STRING_LEN.EMAILTEMPLATE}`,
                    },
                  ]}
                >
                
                   <ReactQuill
                    modules={toolbarOptions}                  
                    placeholder=""
                    style={{
                      height: 100,
                      resize: "none",
                    }}
                  />
                </Form.Item>
              </Col>
             
            </Row>
            <Row gutter={32} className='mt-5 mb-5'>
              <Col span={12} className='mt-5'>
                <Form.Item
                  name="profile_update"
                  label="User Profile Update Mail"
                  rules={[
                    {
                      required: true,
                      message: "Please enter user profile mail!",
                    },
                    {
                      max: CONSTANTS.STRING_LEN.EMAILTEMPLATE,
                      message: `Maximum value ${CONSTANTS.STRING_LEN.EMAILTEMPLATE}`,
                    },
                  ]}
                >
                
                   <ReactQuill
                    modules={toolbarOptions}                  
                    placeholder=""
                    style={{
                      height: 100,
                      resize: "none",
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={12} className='mt-5'>
                <Form.Item
                  name="user_add_member"
                  label="User add family member"
                  rules={[
                    {
                      required: true,
                      message: "Please enter user member add mail!",
                    },
                    {
                      max: CONSTANTS.STRING_LEN.EMAILTEMPLATE,
                      message: `Maximum value ${CONSTANTS.STRING_LEN.EMAILTEMPLATE}`,
                    },
                  ]}
                >
                
                   <ReactQuill
                    modules={toolbarOptions}                  
                    placeholder=""
                    style={{
                      height: 100,
                      resize: "none",
                    }}
                  />
                </Form.Item>
              </Col>
            
          
             
            </Row>
            <Row gutter={32} className='mt-5 mb-5'>
              <Col span={12} className='mt-5'>
                <Form.Item
                  name="member_status_action"
                  label="Member Paid/Unpaid Status Mail"
                  rules={[
                    {
                      required: true,
                      message: "Please enter member status mail mail!",
                    },
                    {
                      max: CONSTANTS.STRING_LEN.EMAILTEMPLATE,
                      message: `Maximum value ${CONSTANTS.STRING_LEN.EMAILTEMPLATE}`,
                    },
                  ]}
                >
                
                   <ReactQuill
                    modules={toolbarOptions}                  
                    placeholder=""
                    style={{
                      height: 100,
                      resize: "none",
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={12} className='mt-5'>
                <Form.Item
                  name="profile_update_action"
                  label="Profile Update Admin Action Mail"
                  rules={[
                    {
                      required: true,
                      message: "Please enter profile update admin action mail!",
                    },
                    {
                      max: CONSTANTS.STRING_LEN.EMAILTEMPLATE,
                      message: `Maximum value ${CONSTANTS.STRING_LEN.EMAILTEMPLATE}`,
                    },
                  ]}
                >
                
                   <ReactQuill
                    modules={toolbarOptions}                  
                    placeholder=""
                    style={{
                      height: 100,
                      resize: "none",
                    }}
                  />
                </Form.Item>
              </Col>
              {/* <Col span={12} className='mt-5'>
                <Form.Item
                  name="profile_update_action"
                  label="Profile Update Admin Action Mail"
                  rules={[
                    {
                      required: true,
                      message: "Please enter profile update admin action mail!",
                    },
                    {
                      max: CONSTANTS.STRING_LEN.EMAILTEMPLATE,
                      message: `Maximum value ${CONSTANTS.STRING_LEN.EMAILTEMPLATE}`,
                    },
                  ]}
                >
                
                   <ReactQuill
                    modules={toolbarOptions}                  
                    placeholder=""
                    style={{
                      height: 100,
                      resize: "none",
                    }}
                  />
                </Form.Item>
              </Col> */}
             
            </Row>
            <Row gutter={32} className='mt-5 mb-5'>
              <Col span={12} className='mt-5'>
                <Form.Item
                  name="member_personal_details_action"
                  label="Family Member Details Updated by Admin Mail"
                  rules={[
                    {
                      required: true,
                      message: "Please enter member details admin action mail!",
                    },
                    {
                      max: CONSTANTS.STRING_LEN.EMAILTEMPLATE,
                      message: `Maximum value ${CONSTANTS.STRING_LEN.EMAILTEMPLATE}`,
                    },
                  ]}
                >
                
                   <ReactQuill
                    modules={toolbarOptions}                  
                    placeholder=""
                    style={{
                      height: 100,
                      resize: "none",
                    }}
                  />
                </Form.Item>
              </Col>
              {/* <Col span={12} className='mt-5'>
                <Form.Item
                  name="profile_update_action"
                  label="Profile Update Admin Action Mail"
                  rules={[
                    {
                      required: true,
                      message: "Please enter profile update admin action mail!",
                    },
                    {
                      max: CONSTANTS.STRING_LEN.EMAILTEMPLATE,
                      message: `Maximum value ${CONSTANTS.STRING_LEN.EMAILTEMPLATE}`,
                    },
                  ]}
                >
                
                   <ReactQuill
                    modules={toolbarOptions}                  
                    placeholder=""
                    style={{
                      height: 100,
                      resize: "none",
                    }}
                  />
                </Form.Item>
              </Col> */}
            
             
            </Row>
            <br/>
            <Row gutter={32} className='mt-5'>
              <Col span={24} className='mt-3'>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Save
                  </Button>
                </Form.Item>
              </Col>
            </Row>
        </Form>
        </div>
      </div>
    </div>
    </>
  )
}

export default EmailSettings
