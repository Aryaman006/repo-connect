import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Form,
  Input,
  Button,
  Select,
  notification,
  DatePicker,
  Modal
} from "antd";
const { TextArea } = Input;
import { Axios } from "../../axios/axiosFunctions";
import config, { CONFIG_OBJ } from "../../config/config";
import dayjs from "dayjs";
import CONSTANTS from "../../constant/Constants";
const { Option } = Select;

const UserPersonalDetailsForm = () => {
  // states
  const [formDisabled, setFormDisabled] = useState(false);
  const [profileData, setProfileData] = useState({});
  const [stateList, setStateList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isOkButtonDisabled, setIsOkButtonDisabled] = useState(false);
  // functions

  const disableDobHandler = (current) => {
    return current && current > dayjs();
  };

  const getProfileData = async () => {
      const result = await Axios.fetchAxiosData(config.GetProfile);
      setProfileData(result.data);
      setFormDisabled(true);
  };
  useEffect(() => {
    getProfileData();
  }, []);

  useEffect(() => {
    handleView();
  }, [profileData]);
  // state list
  const getStateList = async () => {
    const response = await Axios.fetchAxiosData(config.GetStateList);
    setStateList(response.data);
  };
  useEffect(() => {
    getStateList();
  }, []);

  const [updateProfileForm] = Form.useForm();
  const [resetForm]= Form.useForm();

  const handleView = () => {

    setFormDisabled(true);
    updateProfileForm.setFieldsValue({
      name: profileData?.name,
      email: profileData?.email,
      phone: profileData?.phone,
      gender:profileData?.gender,
      dob: profileData?.dob && dayjs(profileData?.dob) ,
      country_code: profileData?.country_code,
      state: profileData?.state,
      city: profileData?.city,
      address: profileData?.address,
      pin_code: profileData?.pin_code,
    });
  };
  const handleEdit = () => {
    setFormDisabled(false);
    updateProfileForm.setFieldsValue({
      name: profileData?.name,
      email: profileData?.email,
      phone: profileData?.phone,
      gender: profileData?.gender,
      dob: profileData?.dob && dayjs(profileData?.dob),
      country_code: profileData?.country_code,
      state: profileData?.state,
      city: profileData?.city,
      address: profileData?.address,
      pin_code: profileData?.pin_code,
    });
  };

  // Function to handle save button click
  const handleSave = async () => {
    try {
      const values = await updateProfileForm.validateFields();
      const filteredValues = Object.keys(values).reduce((obj, key) => {
        if (!["name", "email", "phone", "country_code"].includes(key)) {
          obj[key] = values[key];
        }
        return obj;
      }, {});

      const updateResult = await Axios.putAxiosData(
        config.UpdateProfile,
        filteredValues,
        // CONFIG_OBJ
      );

      if (updateResult.success === true) {
        notification.success({
          message: "Profile updated successfully",
        });
        getProfileData();
      } else {
        notification.error({
          message: "Failed to update profile",
        });
      }
      setFormDisabled(true); // Disable form after save
    } catch (err) {
      // console.log("Validation failed:", err);
    }
  };

  const handleResetOk = async() => {
    const resetValues = await resetForm.validateFields();
    const response = await Axios.putAxiosData(config.UpdateProfile, resetValues
      // CONFIG_OBJ
    );
    if (response.success === true) {
      notification.success({
        message: "Password updated successfully",
      });
      setIsModalVisible(false);
      resetForm.resetFields();
    } else {
      notification.error({
        message: response.message,
      });
    }
  };

  return (
    // <>
    //   <div className="container-fluid">
    //     <div className="row mt-3">
    //       <Form
    //         form={updateProfileForm}
    //         initialValues={profileData}
    //         layout="vertical"
    //       >
    //         {/* first row */}
    //         <Row gutter={16}>
    //           <Col span={8}>
    //             <Form.Item
    //               name="name"
    //               label="Name"
    //               rules={[
    //                 {
    //                   pattern: /^[A-Za-z\s]{1,20}$/,
    //                   message:
    //                     "Please enter a valid Name (up to 20 characters,only alphabets and spaces allowed )",
    //                 },
    //               ]}
    //               style={{ marginBottom: "10px" }}
    //             >
    //               <Input
    //                 placeholder="Enter name"
    //                 type="text"
    //                 Invalue={profileData}
    //                 disabled
    //               />
    //             </Form.Item>
    //           </Col>
    //           <Col span={8}>
    //             <Form.Item
    //               name="dob"
    //               label="D.O.B"
    //               rules={[
    //                 {
    //                   type: "date",
    //                   message: "Invalid Date Format",
    //                 },
    //               ]}
    //             >
    //               <DatePicker
    //                 placeholder="Select Date"
    //                 format="DD/MM/YYYY"
    //                 disabled={formDisabled}
    //                 style={{ width: "100%" }}
    //                 disabledDate={disableDobHandler}
    //               />
    //             </Form.Item>
    //           </Col>
    //           <Col span={8}>
    //             <Form.Item
    //               name="gender"
    //               label="Gender"
    //               rules={[
    //                 {
    //                   required: true,
    //                   message: "Please select an option",
    //                 },
    //               ]}
    //             >
    //               <Select placeholder="select" disabled={formDisabled}
    //                  options={[
    //                   {
    //                     value: CONSTANTS.GENDER.MALE,
    //                     label: 'Male',
    //                   },
    //                   {
    //                     value: CONSTANTS.GENDER.FEMALE,
    //                     label: 'Female',
    //                   },
    //                   {
    //                     value: CONSTANTS.GENDER.OTHER,
    //                     label: 'Others',
    //                   }
    //                 ]}
    //              />
    //                 {/* <Option value="1">Male</Option>
    //                 <Option value="2">Female</Option>
    //                 <Option value="3">Other</Option>
    //               </Select> */}
    //             </Form.Item>
    //           </Col>
    //         </Row>

    //         {/* 3rd row */}
    //         <Row gutter={16}>
    //           <Col span={8}>
    //             <Form.Item
    //               name="address"
    //               label="Address"
    //               style={{ marginBottom: "10px" }}
    //             >
    //               <TextArea
    //                 placeholder="Enter address"
    //                 autoSize
    //                 disabled={formDisabled}
    //                 style={{ overflowY: "hidden" }}
    //               />
    //             </Form.Item>
    //           </Col>
    //           <Col span={8}>
    //             <Form.Item
    //               name="city"
    //               label="City"
    //               style={{ marginBottom: "10px" }}
    //             >
    //               <Input
    //                 placeholder="Enter city"
    //                 type="text"
    //                 disabled={formDisabled}
    //               />
    //             </Form.Item>
    //           </Col>
    //           <Col span={8}>
    //             <Form.Item
    //               name="state"
    //               label="State"
    //               style={{ marginBottom: "10px" }}
    //             >
    //               <Select placeholder="Select state" disabled={formDisabled}>
    //                 {stateList?.map((state) => (
    //                   <Option key={state.id} value={state.id}>
    //                     {state.name}
    //                   </Option>
    //                 ))}
    //               </Select>
    //             </Form.Item>
    //           </Col>
    //         </Row>
    //         {/* second row */}
    //         <Row gutter={16}>
    //           <Col span={8}>
    //             <Form.Item
    //               name="pin_code"
    //               label="Postal Code"
    //               rules={[
    //                 {
    //                   pattern: /^\d+$/,
    //                   message: "Postal code must be digits",
    //                 },
    //               ]}
    //               style={{ marginBottom: "10px" }}
    //             >
    //               <Input
    //                 placeholder="Enter postal code"
    //                 disabled={formDisabled}
    //               />
    //             </Form.Item>
    //           </Col>
    //           <Col span={8}>
    //             <Form.Item
    //               name="email"
    //               label="Email"
    //               style={{ marginBottom: "10px" }}
    //             >
    //               <Input placeholder="you@opdsure.com" disabled />
    //             </Form.Item>
    //           </Col>
    //           <div className="px-0 mx-0 d-flex gap-0">
    //             <Col span={5}>
    //               <Form.Item
    //                 name="country_code"
    //                 label="Mobile"
    //                 style={{ marginBottom: "10px", marginLeft: "0px" }}
    //               >
    //                 <Input
    //                   type="text"
    //                   style={{
    //                     width: "100%",
    //                     margin: "0 0",
    //                   }}
    //                   disabled
    //                 />
    //               </Form.Item>
    //             </Col>
    //             <Col span={20}>
    //               <Form.Item
    //                 name="phone"
    //                 label={
    //                   <span className="text-black d-none">Mobile No.</span>
    //                 }
    //                 style={{ marginBottom: "10px" }}
    //               >
    //                 <Input
    //                   type="number"
    //                   style={{
    //                     width: "80%",
    //                   }}
    //                   placeholder="mobile no."
    //                   maxLength={10}
    //                   disabled
    //                 />
    //               </Form.Item>
    //             </Col>
    //           </div>
    //         </Row>
    //         {/* 4th row */}
    //         <Row gutter={16}></Row>
    //         <Row gutter={16} className="mt-3">
    //           <Col span={2}>
    //             <Form.Item>
    //               <Button
    //                 type="primary"
    //                 onClick={handleEdit}
    //                 style={{ width: "100%" }}
    //               >
    //                 Edit
    //               </Button>
    //             </Form.Item>
    //           </Col>
    //           {/* <Col span={3}>
    //             <Form.Item>
    //               <Button
    //                 type="primary"
    //                 htmlType="submit"
    //                 style={{ width: "100%" }}
    //                 onClick={()=>{setIsModalVisible(true)}}
    //               >
    //                 Reset Password
    //               </Button>
    //             </Form.Item>
    //           </Col> */}
    //           <Col span={2}>
    //             <Form.Item>
    //               <Button
    //                 type="primary"
    //                 onClick={handleSave}
    //                 style={{ width: "100%" }}
    //                 disabled={formDisabled}
    //               >
    //                 Save
    //               </Button>
    //             </Form.Item>
    //           </Col>
    //         </Row>
    //       </Form>
    //     </div>
    //   </div>
    //   <Modal
    //     title="Reset Password"
    //     open={isModalVisible}
    //     onOk={handleResetOk}       
    //     onCancel={() => setIsModalVisible(false)}
    //     okText="Reset"
    //     okButtonProps={{disabled: isOkButtonDisabled}}
    //     centered
    //   >
    //    <Form layout="vertical" form={resetForm} className="mt-3">
    //    <Form.Item
    //       name="password"
    //       label="Current Password"
    //       rules={[
    //         {
    //           required: true,
    //           message: 'Please Enter Current password!',
    //         },
    //       ]}
    //     >
    //       <Input.Password />
    //     </Form.Item>
    //     <Form.Item
    //       name="newPassword"
    //       label="New Password"
    //       rules={[
    //         {
    //           required: true,
    //           message: 'Please input new password!',
    //         },
    //         ({ getFieldValue }) => ({
    //           validator(_, value) {
    //             if (!value || getFieldValue("password") !== value) {
    //               setIsOkButtonDisabled(false);
    //               return Promise.resolve();
                  
    //             }
    //             setIsOkButtonDisabled(true);
    //             return Promise.reject(new Error("Please enter different password!"));
                
    //           },
    //         }),
    //       ]}
    //     >
    //       <Input.Password />
    //     </Form.Item>
    //    </Form>
    //   </Modal>
    // </>


    <>
  <div className="container-fluid">
    <div className="row mt-3">
      <Form
        form={updateProfileForm}
        initialValues={profileData}
        layout="vertical"
      >
        {/* first row */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8}>
            <Form.Item
              name="name"
              label="Name"
              rules={[
                {
                  pattern: /^[A-Za-z\s]{1,20}$/,
                  message:
                    "Please enter a valid Name (up to 20 characters, only alphabets and spaces allowed)",
                },
              ]}
              style={{ marginBottom: "10px" }}
            >
              <Input
                placeholder="Enter name"
                type="text"
                Invalue={profileData}
                disabled
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Form.Item
              name="dob"
              label="D.O.B"
              rules={[
                {
                  type: "date",
                  message: "Invalid Date Format",
                },
              ]}
            >
              <DatePicker
                placeholder="Select Date"
                format="DD/MM/YYYY"
                disabled={formDisabled}
                style={{ width: "100%" }}
                disabledDate={disableDobHandler}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Form.Item
              name="gender"
              label="Gender"
              rules={[
                {
                  required: true,
                  message: "Please select an option",
                },
              ]}
            >
              <Select
                placeholder="select"
                disabled={formDisabled}
                options={[
                  {
                    value: CONSTANTS.GENDER.MALE,
                    label: "Male",
                  },
                  {
                    value: CONSTANTS.GENDER.FEMALE,
                    label: "Female",
                  },
                  {
                    value: CONSTANTS.GENDER.OTHER,
                    label: "Others",
                  },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* second row */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8}>
            <Form.Item
              name="address"
              label="Address"
              style={{ marginBottom: "10px" }}
            >
              <TextArea
                placeholder="Enter address"
                autoSize
                disabled={formDisabled}
                style={{ overflowY: "hidden" }}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Form.Item
              name="city"
              label="City"
              style={{ marginBottom: "10px" }}
            >
              <Input
                placeholder="Enter city"
                type="text"
                disabled={formDisabled}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Form.Item
              name="state"
              label="State"
              style={{ marginBottom: "10px" }}
            >
              <Select placeholder="Select state" disabled={formDisabled}>
                {stateList?.map((state) => (
                  <Option key={state.id} value={state.id}>
                    {state.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {/* third row */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8}>
            <Form.Item
              name="pin_code"
              label="Postal Code"
              rules={[
                {
                  pattern: /^\d+$/,
                  message: "Postal code must be digits",
                },
              ]}
              style={{ marginBottom: "10px" }}
            >
              <Input
                placeholder="Enter postal code"
                disabled={formDisabled}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Form.Item
              name="email"
              label="Email"
              style={{ marginBottom: "10px" }}
            >
              <Input placeholder="you@opdsure.com" disabled />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={16}>
            <div className="d-flex gap-2">
              <Form.Item
                name="country_code"
                label="Mobile"
                style={{ marginBottom: "10px", width: "25%" }}
              >
                <Input type="text" disabled />
              </Form.Item>
              <Form.Item
                name="phone"
                label={<span className="d-none">Mobile No.</span>}
                style={{ marginBottom: "10px", width: "75%" }}
              >
                <Input
                  type="number"
                  placeholder="mobile no."
                  maxLength={10}
                  disabled
                />
              </Form.Item>
            </div>
          </Col>
        </Row>

        {/* action row */}
        <Row gutter={[16, 16]} className="mt-3">
          <Col xs={12} sm={6} md={2}>
            <Form.Item>
              <Button
                type="primary"
                onClick={handleEdit}
                style={{ width: "100%" }}
              >
                Edit
              </Button>
            </Form.Item>
          </Col>
          <Col xs={12} sm={6} md={2}>
            <Form.Item>
              <Button
                type="primary"
                onClick={handleSave}
                style={{ width: "100%" }}
                disabled={formDisabled}
              >
                Save
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  </div>

  <Modal
    title="Reset Password"
    open={isModalVisible}
    onOk={handleResetOk}
    onCancel={() => setIsModalVisible(false)}
    okText="Reset"
    okButtonProps={{ disabled: isOkButtonDisabled }}
    centered
    width="90%"
  >
    <Form layout="vertical" form={resetForm} className="mt-3">
      <Form.Item
        name="password"
        label="Current Password"
        rules={[
          {
            required: true,
            message: "Please Enter Current password!",
          },
        ]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item
        name="newPassword"
        label="New Password"
        rules={[
          {
            required: true,
            message: "Please input new password!",
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("password") !== value) {
                setIsOkButtonDisabled(false);
                return Promise.resolve();
              }
              setIsOkButtonDisabled(true);
              return Promise.reject(
                new Error("Please enter different password!")
              );
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>
    </Form>
  </Modal>
</>

  );
};

export default UserPersonalDetailsForm;
