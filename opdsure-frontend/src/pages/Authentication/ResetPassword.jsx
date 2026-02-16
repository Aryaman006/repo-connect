import { Button, Form, Input, Modal, notification } from 'antd';
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/authProvider";

const RestPassword = () => {

  return (
    <>
                  <div className="d-flex justify-content-center">
                  </div>
                 
                  <Form layout="vertical">
                  <Form.Item
                    name="currentpassword"
                    placeholder="Enter Current Password"
                    label={<span className='text-dark'>Current Password</span>}
                    rules={[
                      {
                        required: true,
                        message: 'Please Enter Current password!',
                      }
                    ]}
                    hasFeedback
                  >
                    <Input.Password value={currentpassword} onChange={(e) => setCurrentpassword(e.target.value)}/>
                  </Form.Item>
                  <Form.Item
                    name="newpassword"
                    label={<span className='text-dark'> New Password</span>}
                    rules={[
                      {
                        required: true,
                        message: 'Please input new password!',
                      },
                    ]}
                    hasFeedback
                  >
                    <Input.Password value={newpassword} onChange={(e) => setNewpassword(e.target.value)}/>
                  </Form.Item>

                  <Form.Item
                    name="confirmpassword"
                    label={<span className='text-dark'>Confirm Password</span>}
                    dependencies={['newpassword']}
                    hasFeedback
                    rules={[
                      {
                        required: true,
                        message: 'Please confirm your password!',
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('newpassword') === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('The new password that you entered do not match!'));
                        },
                      }),
                    ]}
                  >
                    <Input.Password value={confirmpassword} onChange={(e) => setConfirmpassword(e.target.value)} />
                    
                  </Form.Item>

                  
                  </Form>
    </>
  );
};

export default RestPassword;
