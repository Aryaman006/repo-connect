import { useEffect, useState } from "react";
import useAxiosFetch from "../../../hooks/useAxiosFetch";
import CONSTANTS from "../../../constant/Constants";
import axios from "axios";
import { getStatus } from "../../../utils";
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
  Tooltip,
  Space,
} from "antd";
import {
  EditFilled,
  DeleteFilled,
  ArrowUpOutlined,
  ExclamationCircleFilled,
  SettingOutlined,
} from "@ant-design/icons";
import { PlusOutlined } from "@ant-design/icons";
const { Search } = Input;
const { Option } = Select;
const { confirm } = Modal;
import { useAuth } from "../../../context/authProvider";
import config from "../../../config/config";
import codes from "country-calling-code";
import StatusSelect from "../../../components/Select/StatusSelect";

const ManagmentUsers = () => {
  const { userid } = useAuth();
  const { data: privileges } = useAxiosFetch(
    config.GetIndividualPrivilegs +
      userid +
      "/" +
      CONSTANTS.PRIVILEGE.PROGRAMME.ADMIN.USER.id
  );
  const [isAdminSelected, setIsAdminSelected] = useState(false);
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
  const { data: desigData } = useAxiosFetch(
    config.GetAllDesig + "?pageSize=1000"
  );

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

  //fetch all data/read
  const fetchAll = async () => {
    try {
      const response = await axios.get(`${config.ApiBaseUrl}${config.GetAllManUsers}`, {
        params: {
          search: search || undefined,
          page: pagination.currentPage,
          pageSize: pagination.pageSize,
          sortBy: "name",
          sortOrder: sortOrder,
        },
      });
      setTest(response.data.data.records);
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
              const response =await axios.post(config.AddManUsers, {
                name: values.name,
                user_type: values.user_type,
                // designation: isAdminSelected ? "" : values.designation,
                designation: values.designation,
                password: values.password,
                mobile: values.mobile.number,
                country_code: values.mobile.country_code,
                email: values.email,
                status: values.status
              });
              form.resetFields();
              notification.success({
                message: "User details added Successfully",
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
            try {
              await axios.patch(config.EditManUsers + values._id, {
                name: values.name,
                user_type: values.user_type,
                // designation: isAdminSelected ? "" : values.designation,
                designation: values.designation,
                mobile: values.mobile.number,
                country_code: values.mobile.country_code,
                email: values.email,
                status: values.status
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
          } else {
            try {
              await axios.patch(config.EditManUsersPass + values._id, {
                password: values.password,
              });
              handleReset();

              notification.success({
                message: "Success",
                description: "Password updated.",
              });
              fetchAll();
            } catch (error) {
              notification.error({
                message: "Failed",
                description: "Unable to update password",
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

  const handleEdit = (record) => {
    setIsAdminSelected(record.user_type === CONSTANTS.MAN_USER_TYPES.ADMIN ? true : false);
    form.setFieldsValue({
      _id: record._id,
      name: record.name,
      user_type: record.user_type,
      mobile: { number: record.mobile, country_code: record.country_code },
      email: record.email,
      status: record.status,
      designation: record.designation ? record.designation._id: null,
    });
    setIsEditing(true);
    setIsAdding(false);
    setIsEditingPass(false);
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };
  const handleEditPass = (record) => {
    setIsAdminSelected(record.user_type === CONSTANTS.MAN_USER_TYPES.ADMIN ? true : false);
    form.setFieldsValue({
      _id: record._id,
      name: record.name,
      user_type: record.user_type,
      mobile: { number: record.mobile, country_code: record.country_code },
      email: record.email,
      designation: record.designation ? record.designation._id: null,
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

  const handleDelete = async (record) => {
    confirm({
      title: "Are you sure you want to delete the record?",
      icon: <ExclamationCircleFilled />,
      centered: true,
      async onOk() {
        try {
          await axios.delete(config.DeleteManUsers + record._id);
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
      title: "User Type",
      dataIndex: "user_type",
      key: "user_type",
      width: "10%",
      align: "left",
      render: (text) => (text === 1 ? "Admin" : "General"),
    },
    {
      title: "Designation",
      dataIndex: ["designation", "designation"],
      key: "designation",
      width: "10%",
      align: "left",
    },
    {
      title: "Email",
      dataIndex: ["email"],
      key: "email",
      width: "10%",
      align: "left",
    },
    {
      title: "Mobile No.",
      dataIndex: ["mobile"],
      key: "mobile",
      width: "10%",
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
      width: "10%",
      hidden: !privileges?.PATCH && !privileges?.DELETE,
      render: (_, record) => (
        <>
          {privileges?.PATCH && (
            <Tooltip placement="topLeft" title={"Reset Password"}>
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
          )}
          {privileges?.PATCH && (
            <EditFilled
              type="primary"
              style={{
                marginRight: "15px",
                color: "green",
                textAlign: "center",
              }}
              onClick={() => handleEdit(record)}
            />
          )}
          {privileges?.DELETE && (
            <DeleteFilled
              type="primary"
              style={{ color: "red" }}
              onClick={() => handleDelete(record)}
            />
          )}
        </>
      ),
    },
  ];

  return (
    <>
      <div style={{ padding: "1rem" }}>
        <Row justify={"start"}>
          <h4 style={{ fontWeight: "bold" }} className="textblue">User Master</h4>
        </Row>
        <Row justify="end">
          <Col span={6}>
            <Search
              placeholder="Search user"
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
          {!isAdding && !isEditing && !isEditingPass && (
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
                  Add Users
                </div>
              </Button>
            </div>
          )}

          {(isAdding || isEditing || isEditingPass) && (
            <Card
              style={{
                width: "100%",
                margin: "auto",
                marginTop:"1rem",
                backgroundColor: "#FAFAFA",
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
                  {isAdding ? "Add" : "Modify"} User{" "}
                  {isEditingPass ? "Password" : "Details"}
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
                className=""
                initialValues={{
                  user_type: CONSTANTS.MAN_USER_TYPES.GENERAL,
                  mobile: {
                    country_code: "+91",
                  },
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
                          message: "Please enter user name !",
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
                        placeholder="Enter user name"
                        disabled={isEditingPass}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Designation"
                      name="designation"
                      rules={[
                        {
                          required: isAdminSelected ? false : true,
                          message: "Please select designation !",
                        },
                      ]}
                      labelCol={{ span: 5, offset: 2 }}
                      // hidden={isAdminSelected}
                    >
                      <Select
                        placeholder="Select Designation"
                        disabled={isEditingPass||isAdminSelected}
                      >
                        {desigData.records.map((dsig) => (
                          <Option
                            key={dsig._id}
                            value={dsig._id}
                            label={dsig.designation}
                          >
                            {dsig.designation}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <Form.Item
                      label="User Type"
                      name="user_type"
                      rules={[
                        {
                          required: true,
                          message: "Please select user type !",
                        },
                      ]}
                      labelCol={{ span: 5, offset: 2 }}
                    >
                      <Select
                        placeholder="Select user type"
                        // disabled={true}
                        // disabled={isEditingPass}
                        options={[
                          {
                            value: CONSTANTS.MAN_USER_TYPES.GENERAL,
                            label: "General",
                          },
                          {
                            value: CONSTANTS.MAN_USER_TYPES.ADMIN,
                            label: "Admin",
                          },
                        ]}
                        onChange={(value) => {
                          if (value === CONSTANTS.MAN_USER_TYPES.ADMIN) {
                            setIsAdminSelected(true);
                          } else {
                            setIsAdminSelected(false);
                          }
                        }}
                      ></Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Email"
                      name="email"
                      rules={[
                        {
                          required: true,
                          message: "Please enter email name !",
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
                      />
                    </Form.Item>
                  </Col>
                </Row>
              
                <Row justify={"center"}>
                     <Col span={12}>
                    <Form.Item label="Mobile" labelCol={{ span: 5, offset: 2 }}>
                      <Space.Compact>
                        <Form.Item
                          name={["mobile", "country_code"]}
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
                              width: "100%",
                            }}
                            disabled={isEditingPass}
                          />
                        </Form.Item>
                      </Space.Compact>
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
                        style={{ width: "40%" }}
                        disabled={isEditingPass}
                      />
                    </Form.Item>
                  </Col>
                 </Row > 
                <Row justify={"start"} >
                <Col span={12}>
                    <Form.Item
                      label="Password"
                      name="password"
                      rules={[
                        {
                          required: isEditing ? false : true,
                          message: "Please enter password !",
                        },
                      ]}
                      hasFeedback
                      labelCol={{ span: 5, offset: 2 }}
                      hidden={isEditing}
                    >
                      <Input.Password style={{width:"100%"}} />
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
      </div>
    </>
  );
};

export default ManagmentUsers;
