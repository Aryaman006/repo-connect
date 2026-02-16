import STATES from "../../../constant/States";
import CONSTANTS from "../../../constant/Constants";
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
  Divider,
} from "antd";
const { Search } = Input;
const { Option } = Select;
import axios from "axios";
import getStateById from "../../../utils/findStateById";
import { useEffect, useState } from "react";
import {
  EditFilled,
  DeleteFilled,
  ArrowUpOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { useAuth } from "../../../context/authProvider";
import config from "../../../config/config";
import useAxiosFetch from "../../../hooks/useAxiosFetch";
import codes from "country-calling-code";
import exportFunction from "../../../utils/export";
const { confirm } = Modal;
const Corporate = () => {
  const { userid } = useAuth();
  const { data: privileges } = useAxiosFetch(
    config.GetIndividualPrivilegs +
      userid +
      "/" +
      CONSTANTS.PRIVILEGE.PROGRAMME.ADMIN.CORPORATE.id
  );
  const [form] = Form.useForm();
  const [corporate, setcorporate] = useState([]);
  const [corporateData, setCorporateData] = useState([]);
  const [search, setSearch] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [sortOrder, setSortOrder] = useState(1);
  const [total, setTotal] = useState(0);
  const [stateSortOrder, setStateSortOrder] = useState(1);
  const [pagination, setPagination] = useState({
    totalRecords: 0,
    pageSize: 10,
    totalPages: 0,
    currentPage: 1,
    nextPage: null,
    prevPage: null,
  });

  useEffect(() => {
    fetchAll();
  }, [pagination.currentPage, pagination.pageSize, sortOrder, stateSortOrder]);

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
      const response = await axios.get(`${config.ApiBaseUrl}${config.GetAllCorpo}`, {
        params: {
          search: search || undefined,
          page: pagination.currentPage,
          pageSize: pagination.pageSize,
          sortStateBy: "state",
          stateSortOrder: stateSortOrder,
          sortBy: "name",
          sortOrder: sortOrder,
        },
      });
      setcorporate(response.data.data.records);

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

  const fetchAllCorp = async () => {
    try {
      const response = await axios.get(`${config.ApiBaseUrl}${config.GetAllCorporation}`, {
      });

      const filteredRecords =
      response?.data?.data?.records?.map((record) => ({
        name: record.name,
        address: record.address,
        // state: getStateById(record.state.name),
        status: GetCorporateStatus(record.status),
        email: record.email,
      })) || [];
      setCorporateData(filteredRecords);
      setTotal(response?.data?.data?.pagination.totalRecords);
    } catch (error) {
      if (error?.request?.status === 401) {
        notification.error({
          message: error?.response?.data?.error,
          description: "Please contact system admin !",
        });
      }
    }
  };

  useEffect(()=>{
    fetchAllCorp()
  }, [])
  
  const GetCorporateStatus = (status) => {
    switch (status) {
      case CONSTANTS.STATUS.ACTIVE:
        return "Active";
      case CONSTANTS.STATUS.INACTIVE:
        return "InActive";
      default:
        return "Unknown Status";
    }
  };

  const pdftitle = "Corporate List";
  const ExportFileName = "Corporate_List";

  const handleExport = (type) => {
    if (type === "pdf") {
      exportFunction.exportToPDF(
        pdfData,
        headers,
        total,
        pdftitle,
        ExportFileName
      );
    } else if (type === "excel") {
      exportFunction.exportToExcel(dataWithHeaders, ExportFileName);
    }
  };

  const headers = [
    "S.No",
    "Name",
    "Address",
    // "State",
    "Status",
    "Email",
  ];

  const dataWithHeaders = [
    headers,
    ...corporateData?.map((item, index) => [
      index + 1,
      item.name,
      item.address,
      // item.state,
      item.status,
      item.email,
    ]),
  ];

  const pdfData = corporateData?.map((item, index) => [
    index + 1,
    item.name,
    item.address,
    // item.state,
    item.status,
    item.email,
  ]);

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
              await axios.post(config.AddCorpo, {
                name: values.name,
                address: values.address,
                state: values.state,
                status: values.status,
                email: values.email,
                // mobile: values.mobile,
                phone: values.mobile.number,
                country_code: values.mobile.country_code,
                contact_person: JSON.stringify(values.contact_person),
              });
              form.resetFields();
              notification.success({
                message: "Organization details added.",
              });
              fetchAll();
            } catch (error) {
              notification.error({
                message: error.response.data.message,
                description: "Try Again !",
              });
            }
          }
          if (isEditing && !isAdding) {
            try {
              await axios.patch(config.EditCorpo + values._id, {
                name: values.name,
                address: values.address,
                state: values.state,
                status: values.status,
                email: values.email,
                // mobile: values.mobile,
                phone: values.mobile.number,
                country_code: values.mobile.country_code,
                // phone: values.phone,
                contact_person: JSON.stringify(values.contact_person),
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

  const handleEdit = (record) => {
    form.setFieldsValue({
      _id: record._id,
      name: record.name,
      address: record.address,
      state: record.state,
      status: record.status,
      email: record.email,
      // mobile: record.mobile,
      mobile: { number: record.phone, country_code: record.country_code },
      // phone: record.phone,
      contact_person: record.contact_person !== undefined ? JSON.parse(record.contact_person) : null,
    });
    setIsEditing(true);
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
          await axios.delete(config.DeleteCorpo + record._id);
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
      width: "5%",
      align: "center",
      render: (_, record, index) => {
        return (pagination.currentPage - 1) * pagination.pageSize + index + 1;
      },
    },
    {
      title: (
        <div>
          Organization Name
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
      width: "15%",
      align: "left",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      // width: "0%",
      align: "left",
    },
   
    {
      title: "State",
      dataIndex: "state",
      key: "state",
      width: "10%",
      align: "left",
      render: (_, record) => {
        const stateInfo = getStateById(record.state);
        return stateInfo ? stateInfo.name : "Unknown";
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: "5%",
      align: "center",
      render: (status) => (status === 1 ? "Active" : "Inactive"),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: "10%",
      align: "left",
    },
    // {
    //   title: "Phone",
    //   dataIndex: "mobile",
    //   key: "mobile",
    //   // width: "0%",
    //   align: "center",
    // },
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
          <h4 style={{ fontWeight: "bold"}} className="textblue">
            Corporate Master
          </h4>
        </Row>
        <Row justify="end">
          <Col span={6}>
            <Search
              placeholder="Search organization"
              onSearch={onSearch}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              enterButton
              style={{ marginBottom: "16px", width: "100%" }}
            />
          </Col>
        </Row>

          <div className="row d-flex justify-content-between my-2">
                        <div className="col-3">
                          <h5>Corporate List</h5>
                        </div>
                        <div className="col-5 d-flex gap-2 justify-content-end">
                          <div className="col-3">
                            <Button
                              onClick={() => handleExport("excel")}
                              type="primary"
                              size="small"
                              style={{ marginRight: "3rem" }}
                            >
                              Export to Excel
                            </Button>
                          </div>
                          <div className="col-3">
                            <Button
                              onClick={() => handleExport("pdf")}
                              type="primary"
                              size="small"
                            >
                              Export to PDF
                            </Button>
                          </div>
             </div>
        </div>

        <Table
          bordered
          columns={columns}
          dataSource={corporate}
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
          {!isAdding && !isEditing && privileges?.POST && (
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
                  Add Corporate
                </div>
              </Button>
            </div>
          )}

          {(isAdding || isEditing) && (
            <Card
              style={{
                width: "100%",
                marginTop: "1.5rem",
                margin: "auto",
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
                  {isAdding ? "Add" : "Modify"} Corporate
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
                initialValues={{ status: CONSTANTS.STATUS.ACTIVE ,
                  mobile: {
                    country_code: "+91",
                  },
                  // contact_person:{
                  //   country_code: "+91",
                  // },
                  }}
              >
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="_id" name="_id" hidden>
                      <Input disabled />
                    </Form.Item>
                  </Col>
                </Row>

                <Row >
                  <Col span={12}>
                    <Form.Item
                      label="Organization"
                      name="name"
                      rules={[
                        {
                          required: true,
                          message: "Please enter organization name !",
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
                      <Input placeholder="Add organization name" />
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
                          pattern: CONSTANTS.REGEX.ADDRESS,
                          message: "Please provide valid address!",
                        },
                      ]}
                      labelCol={{ span: 5, offset: 2 }}
                    >
                      <Input placeholder="Add address" />
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
                          message: "Please enter email name !",
                        },
                        {
                          type: "email",
                          message: "Invalid email!",
                        },
                      ]}
                      labelCol={{ span: 5, offset: 2 }}
                    >
                      <Input placeholder="Add email" style={{ width: "50%" }} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="State"
                      name="state"
                      rules={[
                        {
                          required: true,
                          message: "Please select state !",
                        },
                      ]}
                      labelCol={{ span: 5, offset: 2 }}
                    >
                      <Select
                        placeholder="Select State"
                        allowClear
                        style={{ width: "40%" }}
                      >
                        {STATES.map((state) => (
                          <Option
                            key={state.id}
                            value={state.id}
                            label={state.name}
                          >
                            {state.name}
                          </Option>
                        ))}
                      </Select>
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
                        defaultValue="+91"
                        placeholder="code"
                        style={{ width: "30%" }}
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
                          message: "Please select status !",
                        },
                      ]}
                      labelCol={{ span: 5, offset: 2 }}
                    >
                      <Select
                        options={[
                          { value: CONSTANTS.STATUS.ACTIVE, label: "Active" },
                          {
                            value: CONSTANTS.STATUS.INACTIVE,
                            label: "Inactive",
                          },
                        ]}
                        allowClear
                        style={{ width: "40%" }}
                        placeholder="Select Status"
                      />
                    </Form.Item>
                  </Col>
                </Row>
              <h6>Contact Person</h6>
                 <Row justify={"center"}>
    <Col span={24} style={{ textAlign: "center" }}>
    <Form.List name="contact_person">
  {(fields, { add, remove }) => (
    <>
      {fields.map(({ key, name, ...restField }) => (
        <Row key={key} gutter={16} align="middle" style={{ }} className="my-3 d-flex align-items-center">
          <Col span={7}>
            <Form.Item
              {...restField}
              name={[name, "name"]}
              label="Name"
              rules={[
                {
                  required: true,
                  message: "Please enter name",
                },
              ]}
              labelCol={{ span: 5, offset: 3  }}
            >
              <Input placeholder="Enter Name" />
            </Form.Item>
          </Col>
          <Col span={7}>
            <Form.Item
              {...restField}
              name={[name, "email"]}
              label="Email"
              rules={[
                {
                  required: true,
                  message: "Please enter email name!",
                },
                {
                  type: "email",
                  message: "Invalid email!",
                },
              ]}
              labelCol={{ span: 8 }}
            >
              <Input placeholder="Enter email" />
            </Form.Item>
          </Col>
            <Col span={8}>
              <Form.Item
                {...restField}
                name={[name, "contact"]}
                label="Contact"
                rules={[
                  {
                    required: true,
                    message: "Please enter contact details",
                  },
                ]}
                labelCol={{ span: 8 }}
              >
                <Input placeholder="Enter contact details" prefix="+91" />
              </Form.Item>
            </Col>
           
          
          <Col span={1} className="pb-4">
          <MinusCircleOutlined onClick={() => remove(name)} className=""/>
          </Col>
          
        </Row>
      ))}
      <Form.Item>
        <Button
          type="dashed"
          onClick={() => add()}
          block
          icon={<PlusOutlined />}
          style={{ width: "30%", margin: "0 auto" }}
        >
          Add contact person
        </Button>
      </Form.Item>
    </>
  )}
</Form.List>

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

export default Corporate;
