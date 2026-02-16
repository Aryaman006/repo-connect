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
} from "antd";
const { Search } = Input;
import CONSTANTS from "../../../constant/Constants";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  EditFilled,
  DeleteFilled,
  ArrowUpOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import { PlusOutlined } from "@ant-design/icons";
import { useAuth } from "../../../context/authProvider";
import config from "../../../config/config";
import useAxiosFetch from "../../../hooks/useAxiosFetch";

const { confirm } = Modal;
const Designation = () => {
  const { userid } = useAuth();
  const { data: privileges } = useAxiosFetch(
    config.GetIndividualPrivilegs +
      userid +
      "/" +
      CONSTANTS.PRIVILEGE.PROGRAMME.ADMIN.DESIGNATION.id
  );
  const [form] = Form.useForm();
  const [designation, setDesignation] = useState([]);
  const [search, setSearch] = useState("");
  const [isEditing, setIsEditing] = useState(false);
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
      const response = await axios.get(`${config.ApiBaseUrl}${config.GetAllDesig}`, {
        params: {
          search: search || undefined,
          page: pagination.currentPage,
          pageSize: pagination.pageSize,
          sortBy: "designation",
          sortOrder: sortOrder,
        },
      });
      setDesignation(response.data.data.records);
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
        ? "Are you sure you want to add the record?"
        : "Are you sure you want to modify the record?",
      icon: <ExclamationCircleFilled />,
      centered: true,
      async onOk() {
        try {
          if (isAdding && !isEditing) {
            try {
              await axios.post(config.AddDesig, values);
              form.resetFields();
              notification.success({
                message: "Designation Added.",
                description: "Successfully",
              });
              fetchAll();
            } catch (error) {
              notification.error({
                message: "Failed to add Designation.",
                description: "Try Again !",
              });
            }
          }
          if (isEditing && !isAdding) {
            try {
              await axios.patch(config.EditDesig + values._id, {
                designation: values.designation,
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
      designation: record.designation,
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
          await axios.delete(config.DeleteDesig + record._id);
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
      width: "10%",
      align: "center",
      render: (_, record, index) => {
        return (pagination.currentPage - 1) * pagination.pageSize + index + 1;
      },
    },
    {
      title: (
        <div>
          Designation
          {
            <ArrowUpOutlined
              style={{ marginLeft: 12, fontSize: "1rem" }}
              onClick={handleSortChange}
              rotate={sortOrder === -1 ? 0 : 180}
            />
          }
        </div>
      ),
      dataIndex: "designation",
      key: "designation",
      // width: "0%",
      align: "left",
    },
    {
      title: "Action",
      dataIndex: "action",
      align: "left",
      key: "action",
      width: "25%",
      hidden: !privileges?.PATCH && !privileges?.DELETE,
      render: (_, record) => (
        <>
          {privileges?.PATCH && (
            <EditFilled
              type="primary"
              style={{
                marginRight: "15px",
                marginLeft: "25px",
                color: "green",
                textAlign: "center",
              }}
              onClick={() => handleEdit(record)}
            />
          )}
          {privileges?.DELETE && record.internal_id ===null && (
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
          <h4 style={{ fontWeight: "bold" }} className="textblue">
            Designation Master
          </h4>
        </Row>
        <Row justify="end">
          <Col span={6}>
            <Search
              placeholder="Search designation"
              onSearch={onSearch}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              enterButton
              style={{ marginBottom: "16px", width: "100%" }}
            />
          </Col>
        </Row>
        {/* <GenSearch /> */}

        <Table
          bordered
          columns={columns}
          dataSource={designation}
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
                  //  form.setFieldsValue({
                  //    project_id: Number(project_id),
                  //    status: "notstarted",
                  //  });
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
                  Add Designation
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
                    marginBottom: "3rem",
                  }}
                  className="textblue"
                >
                  {isAdding ? "Add" : "Modify"} Designation
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
              >
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="Designation Id" name="_id" hidden>
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>

                {/* <Row > */}
                <Col span={24}>
                  <Form.Item
                    label="Designation"
                    name="designation"
                    rules={[
                      {
                        required: true,

                        message: "Please enter designation name !",
                      },
                      {
                        pattern: /^[a-zA-Z0-9\s]{1,50}$/,
                        message: "Max length 50 char",
                      },
                      {
                        pattern: /^[a-zA-Z0-9\s()_,&-]+$/,
                        message: "Special character not allowed",
                      },
                    ]}
                    labelCol={{ span: 5, offset: 2 }}
                    // style={{border:"1px solid black"}}
                  >
                    <Input
                      placeholder="Add new Designation"
                      // style={{ width:"100%" }}
                    />
                  </Form.Item>
                </Col>
                {/* </Row> */}

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
                          className="me-3 btn-secondary"
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

export default Designation;
