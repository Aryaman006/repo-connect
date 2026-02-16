import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Axios } from '../../axios/axiosFunctions';
import config from '../../config/config';
import axios from 'axios';
import { Badge, Descriptions, notification } from "antd";
import {Select,Card, Row, Col, Pagination,Button, Table, Input, Modal, Switch,  DatePicker, Form,  Space,
  InputNumber  } from "antd";
import { capitalizeFirstLetter, CapitalizeFirstLetterAndRemoveUnderscore } from "../../utils";
const { Search } = Input;
const { confirm } = Modal;
const {TextArea} = Input;
const {Option} = Select;    
import {
    EditFilled,
    DeleteFilled,
    ArrowUpOutlined,
    ExclamationCircleFilled,
    EyeOutlined,
    PlusOutlined,
    FileImageOutlined
  } from "@ant-design/icons";
import dayjs from 'dayjs';
import CONSTANTS from '../../constant/Constants';
import { GetRelationString } from '../../utils';
import { LeftCircleOutlined } from "@ant-design/icons";
const userType = Number(localStorage.getItem("user_type"));


const { RangePicker } = DatePicker;
const FamilyList = () => {
  const [familyData,setFamilyData] = useState([]);
  const [plan,setPlan] = useState([]);
  const [form] = Form.useForm();
  const [userProfile, setUserProfile] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [relationList, setRelationList] = useState([]);
  const { id } = useParams();

  console.log("iiiiddddd:",id)

  useEffect(() => {
    const handleRelationList = async () => {
      const response = await Axios.fetchAxiosData(config.GetRelationList);
      setRelationList(response.data);
    };
    handleRelationList();
  }, []);

  const fetchAll = async () => {
    try {
     const response = await Axios.fetchAxiosData(config.GetAllFamilyMembers+id);
     if(!response.data)return;
        
     setFamilyData(response.data.records);
     setPlan(response.data.userPlan);
     setUserProfile(response.data.userProfile);
       
    } catch (error) {
       notification.error({
        message:"Something went wrong"
       })
    }
  };

  useEffect(()=>{fetchAll()},[]);

  const handleSelectChange = async (value, id) => {
    confirm({
        title: "Are you sure you want to modify the record?",
        icon: <ExclamationCircleFilled />,
        centered: true,
        async onOk() {
            try {
                await Axios.patchAxiosData(config.ApproveUpdatedUser + id, {
                  review_status: value,
                });
                notification.success({
                  message: "Success",
                  description: "Record Successfully edited",
                });
                fetchAll();
              } catch (error) {
                notification.error({
                  message: "Failed",
                  description: `${error.response.data.msg}`,
                });
              }
        },
        onCancel() {},
      });
   
  };
  const handlePaidUnpaidSwitchChange = async (checked, id) => {
    confirm({
        title: "Are you sure you want to modify the record?",
        icon: <ExclamationCircleFilled />,
        centered: true,
        async onOk() {
            try {
                await Axios.patchAxiosData( config.EditFamilyMembers+id, {
                    plan_status: checked,
                });
                notification.success({
                  message: "Success",
                  description: "Record Successfully edited",
                });
                fetchAll();
              } catch (error) {
                notification.error({
                  message: "Failed",
                  description: `${error.response.data.msg}`,
                });
              }
        },
        onCancel() {},
      });
   
  };

  const onFinish = async (values) => {
    confirm({
      title: isAdding
        ? "Are you sure you want to save the record?"
        : "Are you sure you want to modify the record?",
      icon: <ExclamationCircleFilled />,
      centered: true,
      async onOk() {
        try {
          if (isAdding && !isEditing) {
            try {
              await axios.post(config.AddFamilyMembersAdmin, {
                name: values.name,
                phone: values.mobile.number,
                country_code: values.mobile.code,
                gender: values.gender,
                dob: values.dob,
                address: values.address,
                relation: values.relation,
                user_id: id
              });
              form.resetFields();
              notification.success({
                message: "Family member details added.",
                // description: "Successfully",
              });
              fetchAll();
            } catch (error) {
              notification.error({
                message: error.response.data.message,
                description: "Try Again !",
              });
            }
          } else if (isEditing && !isAdding) {
            try {
              await axios.patch(config.EditFamilyMembersAdmin + values._id, {
                name: values.name,
                phone: values.mobile.number,
                country_code: values.mobile.code,
                gender: values.gender,
                dob: values.dob,
                address: values.address,
                relation: values.relation,
              });
              handleReset();

              notification.success({
                message: "Success",
                description: "Record updated.",
              });
              fetchAll();
            } catch (error) {
              notification.error({
                message: "Failed",
                description: "Unable to update record",
              });
            }
          }
        } catch (error) {
          notification.error({
            message: "Failed to submit",
          });
        }
      },
      onCancel() {},
    });
  };

  const handleReset = () => {
    setIsAdding(false);
    setIsEditing(false);
    form.resetFields();
  };

  const handleEdit = (record) => {
    form.setFieldsValue({
      _id: record._id,
      name: record.name,
      mobile: { number: record.phone, code: record.country_code },
      gender: record.gender,
      dob: dayjs(record.dob),
      address: record.address,
      relation: record.relation,
    });
    setIsEditing(true);
    setIsAdding(false);
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };

  const columns = [
    {
      title: "S.No",
      dataIndex: "_id",
      key: "_id",
      width: "8%",
      align: "center",
      render: (_, record, index) => {
        return index + 1;
      },
    },
    {
      title: "Name",
      key: "name",
      dataIndex: "name",
      align: "left",
      width: "35%",
    },
    {
      title: "Phone",
      key: "phone",
      align: "left",
      width: "10%",
      render: (record) => {
        return (          
            <div>{record?.country_code + record?.phone}</div>
        );
      },
    },
    {
      title: "Gender",
      key: "gender",
      align: "left",
      width: "5%",
      render: (record) => {
        switch (record.gender) {
          case 1:
            return "Male";
          case 2:
            return "Female";
          default:
            return "Others";
        }
      },
    },
    {
        title:"Relation",
        dataIndex:"relation",
        align:"middle",
        render: (relation) => (
            <span>{GetRelationString(relation)}</span>
          )
    },
    {
        title:"D.O.B.",
        dataIndex:"dob",
        align:"middle",
        render: (record) => {
            return <span>{dayjs(record).format("DD/MM/YYYY")}</span>
        }
    },
    {
        title:"Family Member Plan Status",
        // dataIndex:"plan_status",
        width:"10%",
        align:"center",
        render: (record) => {
            return <Switch
            checkedChildren="Paid"
            unCheckedChildren="Unpaid"
            checked={record.plan_status}
            onChange={(checked) => handlePaidUnpaidSwitchChange(checked ? CONSTANTS.PLAN_STATUS.PAID : CONSTANTS.PLAN_STATUS.UNPAID, record._id)}
            style={{ marginRight: "0.5rem" }}
            disabled={record.relation===0 || record.review_status === CONSTANTS.REVIEW_STATUS.REJECTED 
                || record.review_status === CONSTANTS.REVIEW_STATUS.PENDING
            }
          />
        }
    },
    {
      title: "Identity Proof",
      dataIndex: "record.update_request.file",
      align: "middle",
      key: "action",
      width: "5%",
      render: (_, record) => (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
         {<a href={record.update_request?.file} target="_blank">
         <FileImageOutlined/>
         </a>}
        </div>
      ),
    },
    {
        title: "Member Updation Action",
        dataIndex: "action",
        align: "middle",
        key: "action",
        width: "10%",
        render: (_, record) => (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Select
        value={record.review_status}
        onChange={(value) => {
            handleSelectChange(value, record.update_request?._id)
        }}
        style={{ width: 120, marginRight: "0.5rem" }}
        disabled={record.review_status === CONSTANTS.REVIEW_STATUS.ACCEPTED
            || record.review_status === CONSTANTS.REVIEW_STATUS.REJECTED
        }
      >
        <Option value={CONSTANTS.REVIEW_STATUS.PENDING}>Pending</Option>
        <Option value={CONSTANTS.REVIEW_STATUS.ACCEPTED}>Approved</Option>
        <Option value={CONSTANTS.REVIEW_STATUS.REJECTED}>Rejected</Option>
      </Select>
          
          </div>
        ),
      },
      {
        title: "Action",
        dataIndex: "action",
        align: "center",
        key: "action",
        width: "8%",
        render: (_, record) => {
          return <>
              {record.relation!==CONSTANTS.FAMILY_RELATION.SELF &&
              <EditFilled
              type="primary"
              style={{
                marginRight: "15px",
                color: "green",
                textAlign: "center",
              }}
              onClick={() => handleEdit(record)}
            />}
          </>
        },
      },
  ];
  const items = [
    {
      key: '1',
      label: 'Plan',
      children: plan.name,
    },
    {
      key: '2',
      label: 'Membership Details',
      children: plan?.selected_membership_option?.membership_label,
      span:2
    },
    {
      key: '3',
      label: 'Paid Member Count',
      children:  plan?.selected_membership_option?.member_count,
    },
    {
     key: '6',
     label: 'Status',
     children:
     userProfile?.plan?.purchased
      ? new Date(userProfile.plan?.end_date) > Date.now()
        ? <Badge status="success" text="Active" />
        : <Badge status="error" text="Expired" />
      : "-"
    },
    {
      key: '4',
      label: 'Plan Charges',
      children:  userProfile?.plan?.purchased ?`₹ ${plan?.selected_membership_option?.charges}` : `-`,
    },
    {
      key: '5',
      label: 'Purchased Date',
      children: userProfile.plan?.start_date ? dayjs(  userProfile.plan?.start_date).format("DD/MM/YYYY") : "-", 
    },
    {
      key: '5',
      label: 'Expiry Date',
      children: userProfile.plan?.end_date ? dayjs(  userProfile.plan?.end_date).format("DD/MM/YYYY") : "-",
    },
   
   
  ];
  const disableDobHandler = (current) => {
    return current && current > dayjs();
  };
  return (
     <>
              <div className="d-flex align-items-center gap-3 mb-3">
             <Link to={userType === CONSTANTS.MAN_USER_TYPES.GENERAL ? -1 : `/admin/registered-users`}>
              <LeftCircleOutlined className="text-primary fs-3" />
            </Link>           
          </div>
    <Row justify={"start"}>
      <h4 style={{ fontWeight: "bold" }} className="textblue">
        User Profile
      </h4>
    </Row>
    <br/>
    <Row justify="end">
    <Col span={5}>
        
        </Col>
      <Col span={6}>
      </Col>
    </Row>
    <Descriptions bordered items={items} />
    <br/>
    <br/>
    <Table
      bordered
      columns={columns}
      dataSource={familyData}
      size="small"
      rowKey={(record) => record._id}
      pagination={false}
      align="right"
      style={{
        marginBottom: "1rem",
      }}
    />
    <br/>
    <div>
          {!isAdding && !isEditing && userProfile?.plan?.purchased && (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Button
                onClick={() => {
                  setIsAdding(true);
                  setIsEditing(false);
                }}
                type="primary"
                style={{ minWidth: "10rem", marginBottom: "1rem" }}
              >
                <div>
                  <PlusOutlined
                    style={{
                      marginRight: "0.5rem",
                    }}
                  />
                  Add Family Member
                </div>
              </Button>
            </div>
          )}

          {(isAdding || isEditing) && (
            <Card
              style={{
                width: "100%",
                margin: "auto",
                backgroundColor: "#FAFAFA",
                marginTop: "1rem",
              }}
            >
              <Row justify={"start"}>
                <h4
                  style={{
                    fontWeight: "bold",
                    // color: "blue",
                    marginTop: "1rem",
                    // margin: "auto",
                    marginBottom: "2.5rem",
                  }}
                  className="textblue"
                >
                  {isAdding ? "Add" : "Modify"} Family Member Details
                </h4>
              </Row>
              <Form
                colon={false}
                layout="horizontal"
                labelAlign="left"
                form={form}
                name="basic"
                onFinish={onFinish}
                autoComplete="on"
                initialValues={{
                  mobile: {
                    code: "+91",
                  },
                  status: 1,
                }}
              >
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="_id" name="_id" hidden>
                      <Input disabled />
                    </Form.Item>
                  </Col>
                </Row>

                <Row>
                  <Col span={12}>
                    <Form.Item
                      label="Name"
                      name="name"
                      rules={[
                        {
                          required: true,
                          message: "Please enter name !",
                        },
                      ]}
                      labelCol={{ span: 5, offset: 2 }}
                    >
                      <Input placeholder="Enter name" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Relation"
                      name="relation"
                      rules={[
                        {
                          required: true,
                          message: "Please enter registration no !",
                        },
                        {
                          pattern: /^[a-zA-Z0-9\s()_,&-]/,
                          message: "Special character not allowed",
                        },
                      ]}
                      labelCol={{ span: 5, offset: 2 }}
                    >
                        <Select
                        
                        showSearch
                        allowClear
                        placeholder="Select Relation"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          option.children
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                        style={{ width: "150px" }}
                        rules={[{ required: true, message: "Please select relation" }]}
                      >
                        {Object.keys(relationList).map((key) => (
                          <Option key={key} value={relationList[key]} style={{width:"100%"}}
                           disabled= {relationList[key]===CONSTANTS.FAMILY_RELATION.SELF}
                          >
                            {CapitalizeFirstLetterAndRemoveUnderscore(key.toLowerCase())}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <Form.Item
                      label="D.O.B."
                      name="dob"
                      rules={[
                        {
                          required: true,
                          message: "Please select dob !",
                        },
                      ]}
                      labelCol={{ span: 5, offset: 2 }}
                    >
                       <DatePicker                        
                        type="date"
                        name="dob"
                        className="form-control form-control-sm inputTextBlack"
                        placeholder="Select Date"
                        format="DD/MM/YYYY"
                        style={{ width: "50%" }}
                        disabledDate={disableDobHandler}   
                         />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Gender"
                      name="gender"
                      rules={[
                        {
                          required: true,
                          message: "Please select gender !",
                        },
                      ]}
                      labelCol={{ span: 5, offset: 2 }}
                    >
                           <Select
                        name="gender"
                       placeholder="Select Gender"
                       style={{ width: "50%" }}
                      >
                      
                        <option value={1}>Male</option>
                        <option value={2}>Female</option>
                        <option value={3}>Other</option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
               
                <Row>
                  <Col span={12}>
                    <Form.Item label="Mobile" labelCol={{ span: 5, offset: 2 }}>
                      <Space.Compact>
                        <Form.Item
                          name={["mobile", "code"]}
                          noStyle
                          rules={[
                            {
                              required: true,
                              message: "Country code is required",
                            }
                          ]}
                        >
                      <Input  style={{
                              width: "20%",
                            }}
                            disabled
                            />
                        </Form.Item>
                        <Form.Item
                          name={["mobile", "number"]}
                          noStyle
                          rules={[
                            {
                              required: true,
                              message: "Mobile no. is required",
                            },
                            {
                              pattern: CONSTANTS.REGEX.PHONE,
                              message: "Invalid mobile no.!",
                            },
                          ]}
                        >
                          <Input
                            placeholder="Mobile No."
                            style={{
                              width: "55%",
                            }}
                          />
                        </Form.Item>
                      </Space.Compact>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Address"
                      name="address"
                      rules={[
                        {
                          required: true,
                          message: "Please enter address name !",
                        },
                        {
                          max: CONSTANTS.STRING_LEN.ADDRESS,
                          message: `Adress must not exceed ${CONSTANTS.STRING_LEN.ADDRESS} characters!`,
                        },

                        {
                          pattern: CONSTANTS.REGEX.ADDRESS,
                          message: "Please provide valid address!",
                        },
                      ]}
                      labelCol={{ span: 5, offset: 2 }}
                    >
                      <TextArea
                        showCount
                        maxLength={CONSTANTS.STRING_LEN.ADDRESS}
                        placeholder="Enter address"
                        style={{
                          height: 100,
                          resize: "none",
                        }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row justify="center" style={{ paddingTop: "1rem" }}>
                  <Col>
                    <Form.Item>
                      <div>
                        <Button
                          type="primary"
                          htmlType="submit"
                          className="me-3"
                        >
                          {isAdding ? "Submit" : "Update"}
                        </Button>
                        <Button
                          danger
                          htmlType="button"
                          onClick={handleReset}
                          className="me-3"
                        >
                          Cancel
                        </Button>
                      </div>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Card>
          )}
        </div>
  </>
  )
}

export default FamilyList