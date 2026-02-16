import { useEffect, useState } from "react";
import useAxiosFetch from "../../hooks/useAxiosFetch";
import CONSTANTS from "../../constant/Constants";
import axios from "axios";
import StatusSelect from "../../components/Select/StatusSelect";
import { getStatus } from "../../utils";
import {
  Row,
  Col,
  Input,
  Pagination,
  Button,
  Table,
  notification,
  Modal,
  Form,
  Card,
  Select,
  Space,
  DatePicker,
  Dropdown,
  Menu,
  Upload,
  Tooltip,
} from "antd";
import dayjs from "dayjs";
import {
  EditFilled,
  DeleteFilled,
  ArrowUpOutlined,
  ExclamationCircleFilled,
  UploadOutlined,
  DownloadOutlined,
  SettingOutlined
} from "@ant-design/icons";
import { PlusOutlined } from "@ant-design/icons";
const { Search } = Input;
const { Option } = Select;
const { confirm } = Modal;
const { TextArea } = Input;
import { useAuth } from "../../context/authProvider";
import config from "../../config/config";
import GenderSelect from "../../components/Select/GenderSelect";
import codes from "country-calling-code";
import HRCorpoEmpBulkUpload from "../../components/HRCorpoEmpBulkUpload";
const CorporateEmp = () => {
  
  const [form] = Form.useForm();
  const [test, setTest] = useState([]);
  const [search, setSearch] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingPass, setIsEditingPass] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [sortOrder, setSortOrder] = useState(1);
  const [pagination, setPagination] = useState({
    totalRecords: 0,
    pageSize: 10,
    totalPages: 0,
    currentPage: 1,
    nextPage: null,
    prevPage: null,
  });
  
  const [isBulkUpload, setIsBulkUpload] = useState(false);
  const [organization, setOrganization] = useState(null);
  const [selectedPlan,setSelectedPlan] = useState(null);
  const [plans,setPlans] = useState([]);
  const [memberShipOptions, setMembershipOptions] = useState([]);

  useEffect(() => {
    fetchAll();
  }, [pagination.currentPage, pagination.pageSize, sortOrder]);

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch();
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [search]);

  const fetchAll = async () => {
    try {
      const response = await axios.get(`${config.ApiBaseUrl}${config.HrGetAllCorpoEmp}`, {
        params: {
          search: search || undefined,
          page: pagination.currentPage,
          pageSize: pagination.pageSize,
          sortBy: "name",
          sortOrder: sortOrder,
        },
      });
      setTest(response.data.data.records);
      setOrganization(response.data.data.records[0].corporate._id)
      const {
        totalRecords,
        totalPages,
        currentPage,
        nextPage,
        prevPage,
        pageSize,
      } = response.data.data.pagination;

      setPagination((prevState) => ({
        ...prevState,
        totalRecords: totalRecords,
        totalPages: totalPages,
        pageSize: pageSize,
        currentPage: currentPage,
        nextPage: nextPage,
        prevPage: prevPage,
      }));
    } catch (error) {
      if (error?.request?.status === 401) {
        notification.error({
          message: error?.response?.data?.error,
          description: "Please contact system admin !",
        });
      }
    }
  };

  const fetchPlans = async () => {
    try {
      if(organization != null){
        const resp = await axios.get(config.GetPlanData,
          {params: { pageSize: 1000,
            subscriberTypeFilter: CONSTANTS.SUBSCRIBER_TYPE.CORPORATE,
            ...(organization != "null" && { corporateFilter: organization })
   },
      })
      setPlans(resp.data.data.records)
      }
     
    } catch (error) {
      console.log("failed to fetch plans")
    } 
  };

  const filterMembeshipOptions = () => {
    const temp = plans?.find((plan) => plan._id == selectedPlan );
    const filteredTemp = temp?.membership_options?.filter(t => t.charges >= 0 );
    setMembershipOptions(filteredTemp);
  }

  useEffect(() => {
    fetchPlans();
  }, [organization]);

  useEffect(()=>{
    filterMembeshipOptions();

  },[selectedPlan])

  const onFinish = async (values) => {
    confirm({
      title: isAdding
        ? "Are you sure you want to save the record?"
        : "Are you sure you want to modify the record?",
      icon: <ExclamationCircleFilled />,
      centered: true,
      async onOk() {
        try {
          if (isAdding && !isEditing && !isEditingPass) {
            try {
              await axios.post(config.HrAddCorpoEmp, {
                employeeId: values.employeeId,
                name: values.name,
                corporate: values.corporate,
                designation: values.designation,
                bank_name: values.bank_name,
                department: values.department,
                address: values.address,
                dob: values.dob,
                gender: values.gender,
                phone: values.mobile.number,
                country_code: values.mobile.code,
                email: values.email,
                status: values.status,
                plan: values.plan,
                membership: values.membership
                // password: values.password
              });
              form.resetFields();
              notification.success({
                message: "Organization employee details added.",
                // description: "Successfully",
              });
              fetchAll();
            } catch (error) {
              notification.error({
                message: error.response.data.message,
                description: "Try Again !",
              });
            }
          } else if (isEditing && !isAdding && !isEditingPass) {
            // console.log("values",values)
            try {
              await axios.patch(config.HrEditCorpoEmp + values._id, {
                employeeId: values.employeeId,
                name: values.name,
                corporate: values.corporate,
                bank_name: values.bank_name,
                designation: values.designation,
                department: values.department,
                address: values.address,
                dob: values.dob,
                gender: values.gender,
                phone: values.mobile.number,
                country_code: values.mobile.code,
                email: values.email,
                status: values.status,
                
              });
              handleReset();

              notification.success({
                message: "Success",
                description: "Record updated.",
              });
              fetchAll();
            } catch (error) {
              notification.error({
                message: error.response.data.message,
                description: "Try Again !",
              });
            }
          }else{
            try {
                await axios.patch(config.HrEditCorpoEmpPass + values._id, {
                  password: values.password
                });
                handleReset();  
                notification.success({
                  message: "Success",
                  description: "Password updated.",
                });
                fetchAll();
              } catch (error) {
                notification.error({
                  message: error.response.data.message,
                  description: "Try Again !",
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

  const handleDelete = async (record) => {
      confirm({
        title: "Are you sure you want to delete the record?",
        icon: <ExclamationCircleFilled />,
        centered: true,
        async onOk() {
          try {
            await axios.delete(config.DeleteCorpoEmp + record._id);
            notification.success({
              message: "Success",
              description: "Record deleted Successfully.",
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

  const handleEdit = (record) => {
    console.log("record",record)
    setIsEditing(true);
    setIsAdding(false);
    setIsEditingPass(false);
    form.setFieldsValue({
      _id: record._id,
      employeeId: record.employeeId,
      name: record.name,
      corporate: record.corporate._id,
      designation: record.designation,
      department: record.department,
      bank_name: record.bank_name,
      address: record.address,
      dob: dayjs(record.dob),
      gender: record.gender,
      mobile: { number: record.phone, country_code: record.country_code },
      email: record.email,
      status: record.status,
    });
   
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };

  const onSearch = async () => {
    await fetchAll();
  };

  const handleReset = () => {
    setIsAdding(false);
    setIsEditingPass(false);
    setIsEditing(false);
    form.resetFields();
  };

  const handlePageChange = (page) => {
    setPagination((prevState) => ({
      ...prevState,
      currentPage: page,
    }));
  };

  const pageSizeChange = (current, pageSize) => {
    setPagination((prevState) => ({
      ...prevState,
      pageSize: pageSize,
    }));
  };

  const handleSortChange = () => {
    setSortOrder((prevOrder) => {
      if (prevOrder === 1) {
        return -1;
      } else {
        return 1;
      }
    });
  };

  const disabledDate = (current) => {
    return current && current > dayjs().subtract(18, "year");
  };

  const handleEditPass = (record) => {
    form.setFieldsValue({
        _id: record._id,
        employeeId: record.employeeId,
        name: record.name,
        corporate: record.corporate._id,
        designation: record.designation,
        department: record.department,
        bank_name: record.bank_name,
        address: record.address,
        dob: dayjs(record.dob),
        gender: record.gender,
        mobile: { number: record.phone, country_code: record.country_code },
        email: record.email,
        status: record.status,
    });
    setIsEditing(false);
    setIsEditingPass(true);
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
      width: "2%",
      align: "center",
      render: (_, record, index) => {
        return (pagination.currentPage - 1) * pagination.pageSize + index + 1;
      },
    },
    {
      title: "Emp ID",
      dataIndex: "employeeId",
      key: "employeeId",
      width: "8%",
      align: "left",
    },
    {
      title: (
        <div>
          Name
          {
            <ArrowUpOutlined
              style={{ marginLeft: 12, fontSize: "1rem" }}
              onClick={handleSortChange}
              rotate={sortOrder === -1 ? 0 : 180}
            />
          }
        </div>
      ),
      dataIndex: "name",
      key: "name",
      width: "10%",
      align: "left",
    },
    {
      title: "Organization",
      dataIndex: ["corporate", "name"],
      key: "corporate",
      width: "8%",
      align: "left",
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
      width: "4%",
      align: "left",
    },
    {
      title: "Mobile",
      dataIndex: "phone",
      key: "phone",
      width: "10%",
      align: "left",
      render: (text, record) => `${record.country_code}-${record.phone}`,
    },

    {
      title: "Email",
      dataIndex: ["email"],
      key: "email",
      width: "10%",
      align: "left",
    },
    {
      title: "Bank",
      dataIndex: "bank_name",
      key: "bank_name",
      width: "12%",
      align: "left",
    },

    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: "5%",
      align: "left",
      render: (record) => getStatus(record),
    },
    {
      title: "Action",
      dataIndex: "action",
      align: "center",
      key: "action",
      width: "8%",
     
      render: (_, record) => (
        <>  
             {/* <Tooltip placement="topLeft" title={"Reset Password"}>
              <SettingOutlined
                type="primary"
                style={{
                  marginRight: "15px",
                  color: "blue",
                  textAlign: "center",
                }}
                onClick={() => handleEditPass(record)}
              />
            </Tooltip>
          */}
            <EditFilled
              type="primary"
              style={{
                marginRight: "15px",
                color: "green",
                textAlign: "center",
              }}
              onClick={() => handleEdit(record)}
            />
            <DeleteFilled
              type="primary"
              style={{ color: "red" }}
              onClick={() => handleDelete(record)}
            />
        </>
      ),
    },
  ];


  const handleAddIndividual = () => {
    setIsAdding(true);
    setIsEditing(false);
    setIsEditingPass(false);
    setIsBulkUpload(false);
  };

  const handleBulkUpload = () => {
    setIsAdding(false);
    setIsEditing(false);
    setIsEditingPass(false);
    setIsBulkUpload(true);
  };

  // Menu items for the dropdown
  const menu = (
    <Menu>
      <Menu.Item key="individual" onClick={handleAddIndividual}>
        <PlusOutlined /> Add Individual
      </Menu.Item>
      <Menu.Item key="bulk" onClick={handleBulkUpload}>
        <UploadOutlined /> Bulk Upload
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <div style={{ padding: "1rem" }}>
        <Row justify={"start"}>
          <h4 style={{ fontWeight: "bold" }} className="textblue">
            Corporate Subscribers Master
          </h4>
        </Row>
        <Row justify="end">
          <Col span={6}>
            <Search
              placeholder="Search subscriber"
              onSearch={onSearch}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              enterButton
              style={{ marginBottom: "16px", width: "100%" }}
            />
          </Col>
        </Row>
        <Table
          bordered
          columns={columns}
          dataSource={test}
          size="small"
          rowKey={(record) => record._id}
          pagination={false}
          align="right"
          style={{
            marginBottom: "1rem",
          }}
        />
        <Row justify="end">
          <Col>
            <Pagination
              current={pagination.currentPage}
              total={pagination.totalRecords}
              pageSize={pagination.pageSize}
              onChange={handlePageChange}
              showLessItems={true}
              onShowSizeChange={pageSizeChange}
              showQuickJumper={false}
              showPrevNextJumpers={true}
              showSizeChanger={true}
              onPrev={() => handlePageChange(pagination.prevPage)}
              onNext={() => handlePageChange(pagination.nextPage)}
              style={{
                marginBottom: "2%",
              }}
            />
          </Col>
        </Row>
        <div>
          {!isAdding && (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Dropdown overlay={menu} placement="bottom">
                <Button
                  type="primary"
                  style={{ minWidth: "10rem", marginBottom: "1rem" }}
                >
                  <PlusOutlined
                    style={{
                      marginRight: "0.5rem",
                    }}
                  />
                  Add Corporate Subscriber
                </Button>
              </Dropdown>
            </div>
          )}

          {(isAdding || isEditing || isEditingPass) && (
            <Card
              style={{
                width: "100%",
                margin: "auto",
                backgroundColor: "#FAFAFA",
                marginTop: "2.5rem",
              }}
            >
              <Row justify={"start"}>
                <h4
                  style={{
                    fontWeight: "bold",
                    // color: "blue",
                    marginTop: "1rem",
                    // margin: "auto",
                    marginBottom: "3rem",
                  }}
                  className="textblue"
                >
                  {isAdding ? "Add" : "Modify"} Corporate Subscriber Details{" "}
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
                  {isAdding && 
                  <Col span={12}>
                    <Form.Item
                      label="Plan"
                      name="plan"
                      rules={[
                        {
                          required: true,
                          message: "Please select plan !",
                        },
                      ]}
                      labelCol={{ span: 5, offset: 2 }}
                    >
                       <Select
                        placeholder="Select Plan"
                        style={{ width: "50%" }}
                        onChange={(value)=>{ setSelectedPlan(value)}}
                      >
                        {plans?.map((plan) => (
                          <Option
                            key={plan._id}
                            value={plan._id}
                            label={plan.name}
                          >
                            {plan.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  }
                  {isAdding && 
                  <Col span={12}>
                    <Form.Item
                      label="Membership"
                      name="membership"
                      rules={[
                        {
                          required: true,
                          message: "Please select membership !",
                        },
                      ]}
                      labelCol={{ span: 5, offset: 2 }}
                    >
                       <Select
                        placeholder="Select Membership"
                        style={{ width: "50%" }}
                        // onChange={(value)=>{setOrganization(value)}}
                      >
                        {memberShipOptions?.map((memb) => (
                          <Option
                            key={memb.membership_id}
                            value={memb.membership_id}
                            label={memb.membership_label}
                          >
                            {memb.membership_label}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  }
                  <Col span={12}>
                    <Form.Item
                      label="Employee ID"
                      name="employeeId"
                      rules={[
                        {
                          required: true,
                          message: "Please enter employeeId!",
                        },
                      ]}
                      labelCol={{ span: 5, offset: 2 }}
                    >
                      <Input
                        placeholder="Enter employeeId"
                        style={{ width: "50%" }}
                        disabled={isEditingPass}
                      />
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
                        {
                          max: 100,
                          message: "Name must not exceed 100 characters!",
                        },
                        {
                          pattern: /^[a-zA-Z0-9\s()_,&-]/,
                          message: "Special character not allowed",
                        },
                      ]}
                      labelCol={{ span: 5, offset: 2 }}
                    >
                      <Input
                        placeholder="Enter user name"
                        disabled={isEditingPass}
                        style={{ width: "50%" }}
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
                          message: "Please select gender!",
                        },
                      ]}
                      labelCol={{ span: 5, offset: 2 }}
                    >
                      <GenderSelect
                        placeholder="Select Gender"
                        onChange={(value) => {
                          form.setFieldsValue({ status: value });
                        }}
                        style={{ width: "50%" }}
                        disabled={isEditingPass}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <Form.Item
                      label="Department"
                      name="department"
                      rules={[
                        {
                          required: true,
                          message: "Please enter department!",
                        },
                        {
                          pattern: /^[a-zA-Z0-9\s]{1,100}$/,
                          message: "Max length 50 char",
                        },
                        {
                          pattern: /^[a-zA-Z0-9\s()_,&-]{1,100}$/,
                          message: "Special character not allowed",
                        },
                      ]}
                      labelCol={{ span: 5, offset: 2 }}
                    >
                      <Input
                        placeholder="Enter department"
                        disabled={isEditingPass}
                        style={{ width: "50%" }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Designation"
                      name="designation"
                      rules={[
                        {
                          required: true,
                          message: "Please enter designation!",
                        },

                        {
                          max: 50,
                          message: "Designation must not exceed 50 characters!",
                        },
                        {
                          pattern: /^[a-zA-Z0-9\s()_,&-]/,
                          message: "Special character not allowed",
                        },
                      ]}
                      labelCol={{ span: 5, offset: 2 }}
                    >
                      <Input
                        placeholder="Enter designation"
                        disabled={isEditingPass}
                        style={{ width: "50%" }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
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
                          height: 120,
                          resize: "none",
                        }}
                        disabled={isEditingPass}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Bank Name"
                      name="bank_name"
                      rules={[
                        {
                          required: true,
                          message: "Please enter address name !",
                        },
                        {
                          max: CONSTANTS.STRING_LEN.NAME,
                          message: `Adress must not exceed ${CONSTANTS.STRING_LEN.NAME} characters!`,
                        },
                      ]}
                      labelCol={{ span: 5, offset: 2 }}
                    >
                      <Input
                        placeholder="Enter bank name"
                        style={{ width: "50%" }}
                        disabled={isEditingPass}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <Form.Item
                      label="DOB"
                      name="dob"
                      rules={[
                        {
                          required: true,
                          message: "Please select DOB!",
                        },
                      ]}
                      labelCol={{ span: 5, offset: 2 }}
                    >
                      <DatePicker
                        format={"DD/MM/YYYY"}
                        disabledDate={disabledDate}
                        disabled={isEditingPass}
                      />
                    </Form.Item>
                  </Col>
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
                            },
                            {
                              pattern: CONSTANTS.REGEX.COUNTRY_CODE,
                              message: "Invalid country code",
                            },
                          ]}
                        >
                          <Select
                            showSearch
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                              option.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            }
                            defaultValue="+91"
                            placeholder="code"
                            style={{ width: "30%" }}
                            disabled={isEditingPass}
                          >
                            {codes?.map((country) => (
                              <Option
                                key={country.isoCode2}
                                value={country.countryCodes[0]}
                              >
                                {`+${country.countryCodes[0]}`}
                              </Option>
                            ))}
                          </Select>
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
                              width: "53%",
                            }}
                            disabled={isEditingPass}
                          />
                        </Form.Item>
                      </Space.Compact>
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <Form.Item
                      label="Email"
                      name="email"
                      rules={[
                        {
                          required: true,
                          message: "Please enter email!",
                        },
                        {
                          type: "email",
                          message: "Invalid email!",
                        },
                      ]}
                      labelCol={{ span: 5, offset: 2 }}
                    >
                      <Input
                        placeholder="Enter email"
                        disabled={isEditingPass}
                        style={{ width: "50%" }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Status"
                      name="status"
                      rules={[
                        {
                          required: true,
                          message: "Please select status!",
                        },
                      ]}
                      labelCol={{ span: 5, offset: 2 }}
                    >
                      <StatusSelect
                        placeholder="Select Status"
                        onChange={(value) => {
                          form.setFieldsValue({ status: value });
                        }}
                        style={{ width: "50%" }}
                        disabled={isEditingPass}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row justify={"start"}>
                  {/* <Col span={12}>
                    <Form.Item
                      label="Password"
                      name="password"
                      rules={[
                        {
                          required: isEditing ? false : true,
                          message: "Please enter password!",
                        },
                      ]}
                      labelCol={{ span: 5, offset: 2 }}
                      hidden={isEditing}
                    >
                      <Input.Password
                        placeholder="Enter password"
                       
                        style={{ width: "50%" }}
                      />
                    </Form.Item>
                  </Col> */}
                 
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

          {isBulkUpload && (
          <HRCorpoEmpBulkUpload organization ={organization}/>
          )}
        </div>
      </div>
    </>
  );
};

export default CorporateEmp;
