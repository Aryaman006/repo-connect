import { useEffect, useState } from "react";
import axios from "axios";
import {
  Row,
  Col,
  Input,
  Button,
  notification,
  Modal,
  Form,
  Card,
  Radio,
  DatePicker,
  Pagination,
  Table,
} from "antd";
import {
    EditFilled,
    DeleteFilled,
    ArrowUpOutlined,
    ExclamationCircleFilled,
    PlusOutlined
  } from "@ant-design/icons";
const { TextArea } = Input;
import dayjs from "dayjs";
const { confirm } = Modal;
import { useAuth } from "../../context/authProvider";
import config from "../../config/config";
import CONSTANTS from "../../constant/Constants";
import useAxiosFetch from "../../hooks/useAxiosFetch";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; 
import { Axios } from "../../axios/axiosFunctions";
import DocumentUploader from "../../components/DocumentUploader";
import disputeimg from "../../assets/dispute.jfif";


const Linkedin = () => {
    const [form] = Form.useForm();
    const [posts, setPosts] = useState([]);
    const [sortOrder, setSortOrder] = useState(1);
    const [isEditing, setIsEditing] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
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
    }, []);
  
    const fetchAll = async () => {
      try {
        const response = await axios.get(`${config.ApiBaseUrl}${config.GetAllLinkedinPosts}`,
          {
              params: {
                  page: pagination.currentPage,
                  pageSize: pagination.pageSize,
                  sortBy: "createdAt",
                  sortOrder: sortOrder,
                },
          }
        );
        setPosts(response.data.data.records);
        const {
          totalRecords,
          totalPages,
          currentPage,
          nextPage,
          prevPage,
          pageSize,
        } = response.data.pagination;
  
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
            message: "Something went wrong"
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
                await axios.post(config.AddLinkedinPost, values);
                form.resetFields();
                notification.success({
                  message: "Record added successfully.",
                });
                fetchAll();
              } catch (error) {
                notification.error({
                  message: "Failed",
                  description: error.response.data.message,
                });
              }
            }
            if (isEditing && !isAdding) {
              try {
                await axios.patch(config.EditLinkedinPost + values._id, {
                    title: values.title,
                    iframe: values.iframe,
                    post_url: values.post_url
                });
                form.resetFields();
                handleReset();
  
                notification.success({
                  message: "Success",
                  description: "Record updated.",
                });
                fetchAll();
              } catch (error) {
                notification.error({
                  message: "Failed",
                  description: error.response.data.message,
                });
              }
            }
          } catch (error) {
            console.log("error",error)
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
        title: record.title,
        iframe: record.iframe,
        post_url: record.post_url,
      });
      setIsEditing(true);
      setIsAdding(false);
    };
  
    const handleDelete = async (record) => {
      confirm({
        title: "Are you sure you want to delete the record?",
        icon: <ExclamationCircleFilled />,
        centered: true,
        async onOk() {
          try {
            await axios.delete(config.DeleteLinkedinPost + record._id);
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
      handleReset();
    };
  
    const handleReset = () => {
      form.resetFields();
      setIsEditing(false);
      setIsAdding(false);
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
            Title
          </div>
        ),
        dataIndex: "title",
        key: "title",
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
            <h4 style={{ fontWeight: "bold" }} className="textblue">
              Linkedin Master
            </h4>
          </Row>
  
          <Table
            bordered
            columns={columns}
            dataSource={posts}
            size="small"
            rowKey={(record) => record._id}
            pagination={false}
            align="right"
            style={{
              marginBottom: "1rem",
            }}
             scroll={{
              x: 1000,
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
                  Add Post
                </div>
              </Button>
            </div>
  
            {(isAdding || isEditing) && (
              <Card
                style={{
                  width: "90%",
                  margin: "auto",
                  backgroundColor: "#FAFAFA",
                }}
              >
                <Row justify={"start"}>
                  <h4
                    style={{
                      fontWeight: "bold",
  
                      marginTop: "1rem",
  
                      marginBottom: "3rem",
                    }}
                    className="textblue"
                  >
                    {isAdding ? "Add" : "Modify"} Event
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
                >
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item label="Specialization Id" name="_id" hidden>
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={12}>
                  <Col span={12}>
                    <Form.Item
                      label="Title"
                      name="title"
                      rules={[
                        {
                          required: true,
                          message: "Please enter title",
                        },
                        {
                          length: 100,
                          message: "Maximum lenght 100",
                        },
                        {
                          pattern: CONSTANTS.REGEX.NAME,
                          message: "Special character not allowed",
                        },
                      ]}
                    >
                      <Input placeholder="Add Title" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Post Link"
                      name="post_url"
                      rules={[
                        {
                          required: false,
                          
                        },
                        {
                            type:"url",
                            message:"Please enter valid url"
                        }
                      ]}
                    >
                       <Input placeholder="Add post url" />
                    </Form.Item>
                  </Col>
                  </Row>
                  
                <Row>
                <Col span={24}>
                  <Form.Item
                    name="iframe"
                    label="Linked iframe"
                    rules={[
                      {
                        required: true,
                        message: "Desciption cannot be empty",
                      },
                    ]}
                  >
                  <TextArea
        placeholder="Add iframe"
        autoSize={{
          minRows: 3,
          maxRows: 5,
        }}
      />
                  </Form.Item>
                </Col>
               
    
              </Row>
                  <Row justify="center" style={{ paddingTop: "2rem" }}>
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
}

export default Linkedin