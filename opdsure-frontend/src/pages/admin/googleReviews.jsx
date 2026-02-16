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
  Pagination,
  Table,
  InputNumber,
  Select
} from "antd";
import {
    EditFilled,
    DeleteFilled,
    ArrowUpOutlined,
    ExclamationCircleFilled,
    PlusOutlined
  } from "@ant-design/icons";
const { TextArea } = Input;
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


const GoogleReviews = () => {
  const [form] = Form.useForm();
  const [reviews, setReviews] = useState([]);
  const [sortOrder, setSortOrder] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [files, setFiles] = useState([]);
  const [filesUrl, setFilesUrl] = useState([]);
  const [corporateReview,setCorporateReview] = useState(false);
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
  }, [pagination.currentPage, pagination.pageSize]);

  const fetchAll = async () => {
    try {
      const response = await axios.get(`${config.ApiBaseUrl}${config.GetAllGoogleReviews}`,
        {
            params: {
                page: pagination.currentPage,
                pageSize: pagination.pageSize,
                sortBy: "createdAt",
                sortOrder: sortOrder,
              },
        }
      );
      setReviews(response.data.data.records);
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
          message: "Something went wrong"
        });
      }
    }
  };

  const handleDocumentSubmit = async () => {
   
    try {     
      
      if(files.length > 0){
       
        const formData = new FormData();
        files.forEach((file) => {
            formData.append("files", file.file);
          });

          const response = await Axios.postAxiosData(
            config.AdminUploadFiles,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              }
            }
          );

          if (response.success) {
            return { data: response.data };
          } else {
            throw new Error(`Failed to upload documents`);
          }
      }
      const uploadPromises = files?.map(async ({ files, documentType }) => {
       
        if (files.length > 0) {
          const formData = new FormData();
          files.forEach((file) => {
            formData.append("files", file.file);
          });

          const response = await Axios.postAxiosData(
            config.AdminUploadFiles,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data", 
             }
            }
          );

          if (response.success) {
            return { documentType, data: response.data.data };
          } else {
            throw new Error(`Failed to upload ${documentType} documents`);
          }
        }
        return null;
      });

      const results = await Promise.all(uploadPromises);
      const documents = results.reduce((acc, result) => {
        if (result) {
          acc[result.documentType] = result.data;
        }
        return acc;
      }, {});

      setFilesUrl(documents);
    } catch (error) {
      notification.error({
        message: "Failed to upload documents",
      });
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
        const files = await handleDocumentSubmit();
        if( isAdding && files?.length === 0 ){
            notification.error({
                message:"Failed to upload files"
            });
            return;
        }
        try {
          if (isAdding && !isEditing) {
            try {
              await axios.post(config.AddGoogleReview, {
                name: values.name,
                feedback: values.feedback,
                rating: values.rating,
                review_url: values.review_url,
                corporate_review:values.corporate_review,
                corporate_name:values.corporate_name,
                ...(files?.data && files?.data?.length > 0 && { avatar: files.data[0] }),
              });
              form.resetFields();
              notification.success({
                message: "Google Review added successfully.",
              });
              setFiles([]);
              setFilesUrl([]);
              fetchAll();
            } catch (error) {
              console.log("Error",error)
              notification.error({
                message: "Failed",
                description: error.response.data.message,
              });
            }
          }
          if (isEditing && !isAdding) {
            try {
              await axios.patch(config.EditGoogleReview + values._id, {
                name: values.name,
                feedback: values.feedback,
                rating: values.rating,
                review_url: values.review_url,
                corporate_review:values.corporate_review,
                corporate_name:values.corporate_name,
                ...(files?.data && files?.data?.length > 0 && { avatar: files.data[0] }),
              });
              form.resetFields();
              handleReset();

              notification.success({
                message: "Success",
                description: "Record updated.",
              });
              setFiles([]);
              setFilesUrl([]);
              fetchAll();
            } catch (error) {
              notification.error({
                message: "Failed",
                description: error.response.data.message,
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
      feedback: record.feedback,
      rating: record.rating,
      review_url: record.review_url,
      corporate_review:record.corporate_review,
      corporate_name:record.corporate_name,
    });
    setCorporateReview(record.corporate_review);
    form.setFieldsValue({corporate_review:record.corporate_review})
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
          await axios.delete(config.DeleteGoogleReview + record._id);
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
      width: "5%",
      align: "center",
      render: (_, record, index) => {
        return (pagination.currentPage - 1) * pagination.pageSize + index + 1;
      },
    },
    {
      title: (
        <div>
          Name
        </div>
      ),
      dataIndex: "name",
      key: "name",
      width:"15%",
      align: "left",
    },
    {
        title: "Type",
        dataIndex: "corporate_review",
        key: "corporate_review",
        width: "10%",
        align: "left",
        render: (record)=> {
          return record ? "Corporate" : "Individual"
        }
    },
    {
        title: "Feedback",
        dataIndex: "feedback",
        key: "feedback",
        width: "40%",
        align: "left",
    },
    {
        title: "Rating",
        dataIndex: "rating",
        key: "rating",
        width:"5%",
        align: "center",
    },
    {
      title: "Image",
      dataIndex: "avatar_url",
      key: "avatar_url",
      width:"8%",
      align: "center",
      render: (avatar_url, record) => {
        return (
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
            {avatar_url ? (
              <Card
                hoverable
                style={{
                  width: 120,
                  height: 120,
                  margin: '5px',
                  position: 'relative',
                  padding: 0,
                  overflow: 'hidden',
                }}
                cover={
                  <img
                    alt="avatar"
                    src={avatar_url}
                    style={{
                      width: '200',
                      height: '200',
                      objectFit: 'cover',
                    }}
                  />
                }
              />
            ) : (
              <span>No Avatar</span>
            )}
          </div>
        );
      },
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
            Google Reviews
          </h4>
        </Row>

        <Table
          bordered
          columns={columns}
          dataSource={reviews}
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
                Add Google Review
              </div>
            </Button>
          </div>

          {(isAdding || isEditing) && (
            <Card
              style={{
                width: "80%",
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
                  {isAdding ? "Add" : "Modify"} Review
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
                initialValues={{corporate_review:false}}
              >
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="Review Id" name="_id" hidden>
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
                  <Row gutter={12}>
                <Col span={12}>
                  <Form.Item
                    label="Review type"
                    name="corporate_review"
                    rules={[
                      {
                        required: true,
                        message: "Please select review type",
                      },
                    ]}
                  >
                    
                    <Select
     
      style={{
        width: 160,
      }}
      onChange={(value)=>{
        setCorporateReview(value)}}
      options={[
        {
          value:false,
          label: 'Individual',
        },
        {
          value:true,
          label: 'Corporate',
        },
      ]}
      placeholder="Review type"
    />
                  </Form.Item>
                </Col>
                {corporateReview && <Col span={12}>
                  <Form.Item
                    label="Organization Name"
                    name="corporate_name"
                    rules={[
                      {
                        required: true,
                        message: "Please enter company name",
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
                </Col>}
                </Row>
                  <Row gutter={12}>
                <Col span={12}>
                  <Form.Item
                    label="Reviewer Name"
                    name="name"
                    rules={[
                      {
                        required: true,
                        message: "Please enter name",
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
                    label="Rating"
                    name="rating"
                    rules={[
                      {
                        required: true,
                        message: "Please enter rating",
                      },
                      {
                        type: "number",
                        min:0,
                        message: "Minimum value 0",
                      },
                      {
                        type: "number",
                        max:5,
                        message: "Maximum value 5",
                      },
                      
                    ]}
                  >
                    <InputNumber placeholder={"Enter rating"} style={{width:"25%"}} step={.1} precision={1}/>
                  </Form.Item>
                </Col>
                </Row>
                <Row>
                  <Col span={18}>
                <Form.Item
                  name="feedback"
                  label="Feedback"
                  rules={[
                    {
                      required: true,
                      message: "Feedback cannot be empty",
                    },
                    {
                      max: CONSTANTS.STRING_LEN.CONDITIONS,
                      message: `Maximum value ${CONSTANTS.STRING_LEN.CONDITIONS}`,
                    },
                  ]}
                >
                  <TextArea
      showCount
      maxLength={5000}
      placeholder="Enter feedback"
      style={{
        height: 120,
        resize: 'none',
      }}
    />
                </Form.Item>
                  </Col>
              </Row>
      <p className="fw-bolder">Avatar image</p>
    <Row style={{ marginTop: '2rem' }} justify={"start"}>
      <Col span={12}>
      <DocumentUploader
            onFilesChange={(files) => setFiles(files)}
            imageprop={disputeimg}
            // alttext="blog image" // Uncomment if needed
          />
      </Col>
    </Row>

    <Row gutter={12} justify={"start"}>
                <Col span={12}>
                  <Form.Item
                    label="Google review link"
                    name="review_url"
                    rules={[
                      {
                        required: false,
                        message: "Please enter review url",
                      },
                      {
                        length: 500,
                        message: "Maximum length 500",
                      },
                      
                    ]}
                  >
                    <Input placeholder="Add review url" />
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

export default GoogleReviews;