import { useEffect, useState } from "react";
import useAxiosFetch from "../../../hooks/useAxiosFetch";
import axios from "axios";
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
} from "antd";
import {
  EditFilled,
  DeleteFilled,
  ArrowUpOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import { PlusOutlined } from "@ant-design/icons";
const { Search } = Input;
const { Option } = Select;
const { confirm } = Modal;
const { TextArea } = Input;
import { useAuth } from "../../../context/authProvider";
import config from "../../../config/config";
import  CONSTANTS  from "../../../constant/Constants"

const HealthTest = () => {
  const [form] = Form.useForm();
  const [test, setTest] = useState([]);
  const [search, setSearch] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [sortOrder, setSortOrder] = useState(1);
  const [subscriberTypeFilter, setSetSubscriberTypeFilter] = useState(CONSTANTS.SUBSCRIBER_TYPE.INDIVIDUAL);
  const [subscriberTypeList, setSetSubscriberTypeList] = useState(CONSTANTS.SUBSCRIBER_TYPE.INDIVIDUAL);
  const [pagination, setPagination] = useState({
    totalRecords: 0,
    pageSize: 10,
    totalPages: 0,
    currentPage: 1,
    nextPage: null,
    prevPage: null,
  });
  const {
    data: planData,
  } = useAxiosFetch(config.GetAllPlan + `?pageSize=1000&subscriberTypeFilter=${subscriberTypeList}`);

  useEffect(() => {
    fetchAll();
  }, [pagination.currentPage, pagination.pageSize, sortOrder,subscriberTypeFilter]);

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
      const response = await axios.get(`${config.ApiBaseUrl}${config.GetAllTest}`, {
        params: {
          search: search || undefined,
          page: pagination.currentPage,
          pageSize: pagination.pageSize,
          sortBy: "name",
          sortOrder: sortOrder,
          subscriberType: subscriberTypeFilter
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
      console.log(error);
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
              await axios.post(config.AddTest, values);
              form.resetFields();
              notification.success({
                message: "Record added successfully.",
                // description: "Successfully",
              });
              fetchAll();
            } catch (error) {
              notification.error({
                message: "Failed to add Record.",
                description: "Try Again !",
              });
            }
          }
          if (isEditing && !isAdding) {
            try {
              await axios.patch(config.EditTest + values._id, {
                name: values.name,
                plan: values.plan,
                details: values.details,
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

  //extracting id for edit
  const handleEdit = (record) => {
    form.setFieldsValue({
      _id: record._id,
      subscriber_type: record.subscriber_type,
      name: record.name,
      plan: record.plan._id,
      details: record.details,
    });
    setSetSubscriberTypeList(record.subscriber_type);
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
          await axios.delete(config.DeleteTest + record._id);
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

  // search functionality
  const onSearch = async () => {
    await fetchAll();
  };
  const onFinishFailed = () => {
    console.log("form submitt fail");
  };
  const handleReset = () => {
    setIsAdding(false);
    setIsEditing(false);
    form.resetFields();
  };
  //Pagination
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
          Test Name
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
      title: "Plan Name",
      dataIndex: ["plan", "name"],
      key: "plan",
      width: "10%",
      align: "left",
    },
    {
      title: "Details",
      dataIndex: "details",
      key: "details",
      width: "40%",
      align: "left",
    },
    {
      title: "Action",
      dataIndex: "action",
      align: "center",
      key: "action",
      width: "10%",
      render: (_, record) => (
        <>
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
          <h4 style={{ fontWeight: "bold" }} className="textblue">Test Master</h4>
        </Row>
        <Row justify="end">
        <Col span={4} style={{ marginRight: "1rem" }}>
            <Select
              defaultValue={CONSTANTS.SUBSCRIBER_TYPE.INDIVIDUAL}
              placeholder="Select Subscriber type"
              options={[
                {
                  value: CONSTANTS.SUBSCRIBER_TYPE.INDIVIDUAL,
                  label: "Retailer",
                },
                {
                  value: CONSTANTS.SUBSCRIBER_TYPE.CORPORATE,
                  label: "Corporate",
                },
              ]}
              onChange={(value) => {
                setSetSubscriberTypeFilter(value);
                // if (value !== CONSTANTS.SUBSCRIBER_TYPE.CORPORATE) {
                //   setCorporateFilter(undefined);
                // }
              }}
              style={{ width: "100%" }}
            />
          </Col>
          <Col span={6}>
            <Search
              placeholder="Search Test"
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
          // scroll={{
          //   y: 400,
          // }}
          // sticky={{ offsetHeader: 0 }}
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
          {!isAdding && !isEditing && (
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
                  Add Test
                </div>
              </Button>
            </div>
          )}

          {(isAdding || isEditing) && (
            <Card
              style={{
                width: "50%",
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
                    marginBottom: "2.5rem",
                  }}
                  className="textblue"
                >
                  {isAdding ? "Add" : "Modify"} Test
                </h4>
              </Row>

              <Form
                colon={false}
                layout="vertical"
                labelAlign="left"
                form={form}
                name="basic"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="on"
                className=""
                initialValues={{subscriber_type:CONSTANTS.SUBSCRIBER_TYPE.INDIVIDUAL}}
              >
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="Test Id" name="_id" hidden>
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={20}>
                    <Form.Item
                      label="Subscriber Type"
                      name="subscriber_type"
                      rules={[
                        {
                          required: true,
                          message: "Please select subscriber type !",
                        },
                      ]}
                      // labelCol={{ span: 5, offset: 2 }}
                    >
                     <Col span={12} style={{ marginRight: "1rem" }}>
            <Select
              defaultValue={CONSTANTS.SUBSCRIBER_TYPE.INDIVIDUAL}
              placeholder="Select Subscriber type"
              options={[
                {
                  value: CONSTANTS.SUBSCRIBER_TYPE.INDIVIDUAL,
                  label: "Retailer",
                },
                {
                  value: CONSTANTS.SUBSCRIBER_TYPE.CORPORATE,
                  label: "Corporate",
                },
              ]}
              onChange={(value) => {
                setSetSubscriberTypeList(value);
                form.setFieldsValue({ subscriber_type: value });
              }}
              style={{ width: "100%" }}
            />
          </Col>
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={20}>
                    <Form.Item
                      label="Plan Name"
                      name="plan"
                      rules={[
                        {
                          required: true,
                          message: "Please select plan !",
                        },
                      ]}
                      // labelCol={{ span: 5, offset: 2 }}
                    >
                      <Select placeholder="Select plan">
                        {planData.records.map((plan) => (
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
                </Row>

                <Row>
                  <Col span={20}>
                    <Form.Item
                      label="Test Name"
                      name="name"
                      rules={[
                        {
                          required: true,
                          message: "Please enter test name !",
                        },
                        {
                          pattern: /^[a-zA-Z0-9\s()_,&-]+$/,
                          message:
                            "Special character not allowed max length 50",
                        },
                      ]}
                      // labelCol={{ span: 5, offset: 2 }}
                    >
                      <Input placeholder="Enter test name" />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={20}>
                    <Form.Item
                      label="Details"
                      name="details"
                      rules={[
                        {
                          required: true,
                          message: "Please enter details name !",
                        },
                        {
                          max:150,
                          message:
                            "Allowed max length 150",
                        },
                      ]}
                      // labelCol={{ span: 5, offset: 2 }}
                    >
                       <TextArea
                        rows={4}
                        showCount
                        maxLength={150}
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

export default HealthTest;
