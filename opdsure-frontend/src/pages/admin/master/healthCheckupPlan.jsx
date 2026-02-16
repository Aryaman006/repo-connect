import STATES from "../../../constant/States";
import CONSTANTS from "../../../constant/Constants";
import PlanFreqSelect from "../../../components/Select/PlanFreqSelect";
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
  InputNumber,
  Divider,
  Tooltip
} from "antd";
const { Search } = Input;
const { TextArea } = Input;
const { Option } = Select;
import axios from "axios";
import { useEffect, useState } from "react";
import {
  EditFilled,
  DeleteFilled,
  ArrowUpOutlined,
  ExclamationCircleFilled,
  MinusCircleOutlined,
  EyeOutlined,
  InfoCircleOutlined
} from "@ant-design/icons";
import { PlusOutlined } from "@ant-design/icons";
import { useAuth } from "../../../context/authProvider";
import useAxiosFetch from "../../../hooks/useAxiosFetch";
import config from "../../../config/config";
import { getPlanFreqType } from "../../../utils";
const { confirm } = Modal;
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // or another theme

const HealthCheckupPlan = () => {
  const { userid } = useAuth();
//   const { data: privileges } = useAxiosFetch(
//     config.GetIndividualPrivilegs +
//       userid +
//       "/" +
//       CONSTANTS.PRIVILEGE.PROGRAMME.ADMIN.PLANS.id
//   );
 
  const [form] = Form.useForm();
  const [plan, setPlan] = useState([]);
  const [search, setSearch] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [sortOrder, setSortOrder] = useState(1);
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
  }, [
    pagination.currentPage,
    pagination.pageSize,
    sortOrder,
  ]);

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
      const response = await axios.get(`${config.ApiBaseUrl}${config.GetAllHealthCheckupPlan}`, {
        params: {
          search: search || undefined,
          page: pagination.currentPage,
          pageSize: pagination.pageSize,
          sortBy: "name",
          sortOrder: sortOrder,
        },
      });
      setPlan(response.data.data.records);
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
          if (isAdding && !isEditing) {
            try {
              await axios.post(config.AddHealthCheckupPlan, values);
              form.resetFields();
              notification.success({
                message: "Health Checkup plan details added.",
              });
              fetchAll();
            } catch (error) {
              notification.error({
                message: "Failed to add Health Checkup plan.",
                description: "Try Again!",
              });
            }
          }
          if (isEditing && !isAdding) {
            const { _id, ...restValues } = values;
            try {
              await axios.patch(config.EditHealthCheckupPlan + values._id, restValues);
              handleReset();
              notification.success({
                message: "Success",
                description: "Record updated.",
              });
              fetchAll();
            } catch (error) {
              notification.error({
                message: error.response.data.message,
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
        checkup_code: record.checkup_code,
        name: record.name,
        base_price: record.base_price,
        discounted_price: record.discounted_price,
        parameters: record.parameters,
        test_details: record.test_details,
    });
   
      setIsEditing(true);
      setIsAdding(false);
      setIsViewing(false);
    
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };
  const handleView = (record) => {
    form.setFieldsValue({
      _id: record._id,
      checkup_code: record.checkup_code,
      name: record.name,
      base_price: record.base_price,
      discounted_price: record.discounted_price,
      parameters: record.parameters,
      test_details: record.test_details,
    });
    
      setIsViewing(true);
      setIsEditing(false);
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
          await axios.delete(config.DeleteHealthCheckupPlan + record._id);
          notification.success({
            message: "Success",
            description: "Record deleted Successfully.",
          });
          fetchAll();
        } catch (error) {
          notification.error({
            message: "Failed",
            description: "Record can't be deleted, it is already in use.",
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
    form.resetFields();
    setIsAdding(false);
    setIsEditing(false);
    setIsViewing(false)
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
          Checkup Name
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
      align: "left",
    },
    {
      title: "Checkup Code",
      dataIndex: "checkup_code",
      key: "checkup_code",
      width: "10%",
      align: "left",
    },
    {
      title: "Base Price",
      dataIndex: "base_price",
      key: "base_price",
      width: "10%",
      align: "left",
    },
    {
      title: "Discounted Price",
      dataIndex: "discounted_price",
      key: "discounted_price",
      width: "10%",
      align: "left",
    },
    {
      title: "Parameters",
      dataIndex: "parameters",
      key: "parameters",
      width: "8%",
      align: "left",
      sorter: (a, b) => a.parameters - b.parameters,
    },
    {
      title: "Action",
      dataIndex: "action",
      align: "center",
      key: "action",
      width: "15%",
      render: (_, record) => (
        <>
          <EyeOutlined
            type="primary"
            style={{
              marginRight: "15px",
              color: "blue",
              textAlign: "center",
            }}
            onClick={()=>{handleView(record); }}
          />
       
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
          <h4 style={{ fontWeight: "bold"}} className="textblue">Health Checkup Plan Master</h4>
        </Row>
        <Row justify="end">
          <Col span={6}>
            <Search
              placeholder="Search Health Checkup"
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
          dataSource={plan}
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
          {!isAdding && !isEditing && !isViewing && (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Button
                onClick={() => {
                  form.resetFields();
                  setIsAdding(true);
                  setIsEditing(false);
                  setIsViewing(false);
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
                  Add Plan
                </div>
              </Button>
            </div>
          )}

          {(isAdding || isEditing || isViewing) && (
            <Card
              style={{
                width: "100%",
                margin: "auto",
                marginTop: "2rem",
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
                    marginBottom: "2.5rem",
                  }}
                  className="textblue"
                >
                  {isViewing ? "View" : isAdding ? "Add" : "Modify"} Health Checkup Plan Details
                </h4>
              </Row>

              <Form
                colon={false}
                layout="vertical"
                labelAlign="left"
                form={form}
                name="basic"
                onFinish={onFinish}
                autoComplete="on"
                className=""
                disabled={isViewing}
                // initialValues={{                  
                //     test_details: Array.from({ length: 1 }, () => ({ tests_name: ""})),                 
                // }}
              >
                <Row gutter={2}>
                  <Col span={12}>
                    <Form.Item label="_id" name="_id" hidden >
                      <Input disabled />
                    </Form.Item>
                  </Col>
                </Row>
                    <Row gutter={16}>
                    <Col span={12}>
                    <Form.Item
                      label="Checkup Code"
                      name="checkup_code"
                      rules={[
                        {
                          required: true,
                          message: "Please enter checkup code name !",
                        },
                        {
                          max:100,
                          message: "Max length 100 char",
                        },
                        {
                          pattern: CONSTANTS.REGEX.NAME,
                          message: "Special character not allowed",
                        },
                      ]}
                      // labelCol={{ span: 5, offset: 2 }}
                    >
                      <Input placeholder="Add checkup code" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Plan Name"
                      name="name"
                      rules={[
                        {
                          required: true,
                          message: "Please enter plan name !",
                        },
                        {
                          max: 100,
                          message: "Max length 100 char",
                        },
                        {
                          pattern: CONSTANTS.REGEX.NAME,
                          message: "Special character not allowed",
                        },
                      ]}
                      // labelCol={{ span: 5, offset: 2 }}
                    >
                      <Input placeholder="Add plan name" />
                    </Form.Item>
                  </Col>
                </Row>    
                <Row gutter={10}>
                      <Col span={6}>
                        <Form.Item
                          label="Base Price"
                          name="base_price"
                          rules={[
                            {
                              required: true,
                              message: "Please enter opd base price",
                            },
                            {
                              type: "number",
                              min: 0,
                              message: "Minimum 0",
                            },
                            {
                              type: "number",
                              max: 1000000,
                              message: "Maximum 1000000",
                            },
                          ]}
                          // labelCol={{ span: 5, offset: 2 }}
                        >
                          <InputNumber style={{ width: "100%" }} precision={2} />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item
                          label="Discounted Price"
                          name="discounted_price"
                          rules={[
                            {
                              required: true,
                              message: "Please enter discounted price!",
                            },
                            {
                              type: "number",
                              min: 0,
                              message: "Minimum amount 0",
                            },
                            {
                              type: "number",
                              max: 100000,
                              message: `Maximum amount 100000`,
                            },
                          ]}
                        >
                          <InputNumber precision={2} style={{ width: "100%" }} />
                        </Form.Item>
                      </Col>
                    </Row>
             
                         
                {/* <Row gutter={0}>
                  <Col span={24}> */}
                    <Divider />
                    <h5 style={{ fontWeight: "bold" }} className="textblue mb-3">Test Details</h5>
                    <Row gutter={10}>
                      <Col span={6}>
                        <Form.Item
                          label="Total Parameter Count"
                          name="parameters"
                          rules={[
                            {
                              required: true,
                              message: "Please enter parameters",
                            },
                            {
                              type: "number",
                              min: 0,
                              message: "Minimum 0",
                            },
                            {
                              type: "number",
                              max: 1000,
                              message: "Maximum 1000",
                            },
                          ]}
                          style={{marginLeft:"18%"}}
                        >
                          <InputNumber style={{ width: "50%" }} precision={0} />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row>
                        
                   <Col span={24}>
                    <Form.List name="test_details">
                      {(fields, { add, remove }) => (
                        <>
                          {fields.map(({ key, name, ...restField }, index) => (
                            <Row
                              key={key}
                              gutter={12}
                              align="top"
                            >
                                <Col span={1} >
                                <p  style={{ marginTop: index === 0 ? '2rem' : "unset" }}>{index+1}.</p>
                                </Col>
                                <Col span={6}>
                                <Form.Item
                                  {...restField}
                                  name={[name, "sub_parameter"]}
                                  label={index === 0 ? "Parameter Label" : ""}
                                  rules={[
                                    {
                                      required: true,
                                      message: "Please enter test parameter name",
                                    },
                                  ]}
                                >
                                  <TextArea placeholder="Enter test parameter" 
                                  autoSize={{
                                    minRows: 1,
                                    maxRows: 3,
                                  }} />
                                </Form.Item>
                              </Col>
                                <Col span={2}>
                                <Form.Item
                                  {...restField}
                                  name={[name, "sub_parameter_count"]}
                                  label={index === 0 ? "Count" : ""}
                                  rules={[
                                    {
                                      required: true,
                                      message: "Please enter parameter count",
                                    },
                                    {
                                        type: "number",
                                        min: 0,
                                        message: "Minimum 0",
                                      },
                                      {
                                        type: "number",
                                        max: 1000,
                                        message: "Maximum 1000",
                                      },
                                  ]}
                                >
                                  <InputNumber placeholder="Count" />
                                </Form.Item>
                              </Col>
                              <Col span={14}>
                                 
                                    <Form.Item
                                  {...restField}
                                  name={[name, "tests_name"]}
                                  label={index === 0 ? "Tests Lists" : ""}
                                  // rules={[
                                  //   {
                                  //     pattern: CONSTANTS.REGEX.TEST_LISTS,
                                  //     message: "Please check text format",
                                  //   },
                                  
                                  // ]}
                                  
                                  style={{marginLeft:"1rem"}}
                                >
                                  
                                    <ReactQuill placeholder="Enter tests list"/>
                                  </Form.Item>
                                  
                              </Col>
                              <MinusCircleOutlined
                                onClick={() => remove(name)}
                                hidden={index === 0 || isViewing}
                                style={{
                                  marginLeft: "1rem",
                                  color: "red",
                                  marginBottom: "1.2rem",
                                }}
                              />
                            </Row>
                          ))}
                          <Form.Item>
                            <Button
                              type="dashed"
                              onClick={() => add()}
                              block
                              icon={<PlusOutlined />}
                              style={{ width: "30%", margin: "0 auto" }}
                              disabled={fields.length >= 100 || isViewing}
                            >
                              Add Test Details
                            </Button>
                          </Form.Item>
                        </>
                      )}
                    </Form.List>
                    </Col>
                    </Row>
                  {/* </Col>
                </Row> */}

                <Row justify="center" style={{ paddingTop: "0rem" }}>
                  <Col>
                    <Form.Item hidden={isViewing}>
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
              <Row
                justify="center"
                style={{ paddingTop: "1rem" }}
                hidden={isAdding || isEditing}
              >
                <Col>
                  <Button
                    danger
                    htmlType="button"
                    onClick={() => setIsViewing(false)}
                    className="me-3"
                  >
                    Cancel
                  </Button>
                </Col>
              </Row>
            </Card>
          )}
        </div>
      </div>
    </>
  );
};

export default HealthCheckupPlan;


