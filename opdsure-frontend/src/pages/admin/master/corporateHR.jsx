import { useEffect, useState } from "react";
import useAxiosFetch from "../../../hooks/useAxiosFetch";
import CONSTANTS from "../../../constant/Constants";
import axios from "axios";
import StatusSelect from "../../../components/Select/StatusSelect";
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
  Space,
  Tooltip,
} from "antd";
import {
  EditFilled,
  DeleteFilled,
  ArrowUpOutlined,
  ExclamationCircleFilled,
  SettingOutlined
} from "@ant-design/icons";
import { PlusOutlined } from "@ant-design/icons";
const { Search } = Input;
const { Option } = Select;
const { confirm } = Modal;
import config from "../../../config/config";
import codes from "country-calling-code";

const CorporateHR = () => {
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
  const { data: corpoData } = useAxiosFetch(
    config.GetAllCorpo + "?pageSize=1000"
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
  const fetchAll = async () => {
    try {
      const response = await axios.get(`${config.ApiBaseUrl}${config.GetAllCorpoHR}`, {
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
              await axios.post(config.AddCorpoHR, {
                name: values.name,
                corporate: values.corporate,
                phone: values.mobile.phone,
                country_code: values.mobile.code,
                email: values.email,
                status: values.status,
                password:values.password
              });
              form.resetFields();
              notification.success({
                message: "HR details added.",
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
              await axios.patch(config.EditCorpoHR + values._id, {
                name: values.name,
                corporate: values.corporate,
                phone: values.mobile.phone,
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
          }
          else {
            try {
              await axios.patch(config.EditCorpoHRPass + values._id, {
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
    form.setFieldsValue({
      _id: record._id,
      name: record.name,
      corporate: record.corporate._id,
      mobile: { phone: record.phone, country_code: record.country_code },
      email: record.email,
      status: record.status,
    });
    setIsEditing(true);
    setIsAdding(false);
    setIsEditingPass(false);
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
          await axios.delete(config.DeleteCorpoHR + record._id);
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

  const handleEditPass = (record) => {
    form.setFieldsValue({
      _id: record._id,
      name: record.name,
      user_type: record.user_type,
      corporate: record.corporate._id,
      mobile: { phone: record.phone, country_code: record.country_code },
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
      title: "Email",
      dataIndex: ["email"],
      key: "email",
      width: "10%",
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

  return (
    <>
      <div style={{ padding: "1rem" }}>
        <Row justify={"start"}>
          <h4 style={{ fontWeight: "bold" }} className="textblue">
            Corporate HR Master
          </h4>
        </Row>
        <Row justify="end">
          <Col span={6}>
            <Search
              placeholder="Search HR"
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
                  type="primary"
                  onClick={() => {
                    setIsAdding(true);
                    setIsEditing(false);
                    setIsEditingPass(false);
                  }}
                  style={{ minWidth: "10rem", marginBottom: "1rem" }}
                >
                  <PlusOutlined
                    style={{
                      marginRight: "0.5rem",
                    }}
                  />
                  Add Corporate HR
                </Button>
            
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
                    marginTop: "1rem",
                    // margin: "auto",
                    marginBottom: "3rem",
                  }}
                  className="textblue"
                >
                  {isAdding ? "Add" : "Modify"} Corporate HR Details{" "}
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
                    {" "}
                    <Form.Item
                      label="Organization"
                      name="corporate"
                      rules={[
                        {
                          required: true,
                          message: "Please select organization !",
                        },
                      ]}
                      labelCol={{ span: 5, offset: 2 }}
                    >
                      <Select
                        placeholder="Select Organization"
                        disabled={isEditingPass}
                        style={{ width: "50%" }}
                      >
                        {corpoData.records.map((corpo) => (
                          <Option
                            key={corpo._id}
                            value={corpo._id}
                            label={corpo.name}
                          >
                            {corpo.name}
                          </Option>
                        ))}
                      </Select>
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
                          name={["mobile", "phone"]}
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
                      <Input.Password style={{ width: "50%" }} />
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

export default CorporateHR;
