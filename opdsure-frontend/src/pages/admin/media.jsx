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

const Media = () => {
    const [form] = Form.useForm();
    const [medias, setMedias] = useState([]);
    const [sortOrder, setSortOrder] = useState(1);
    const [isEditing, setIsEditing] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [files, setFiles] = useState([]);
    const [iconFiles, setIconFiles] = useState([]);
    const [filesUrl, setFilesUrl] = useState([]);
    const [iconFilesUrl, setIconFilesUrl] = useState([]);
    const [disableFileUpload,setDisableFileUpload]=useState()
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
        const response = await axios.get(`${config.ApiBaseUrl}${config.GetAllMedias}`,
          {
              params: {
                  page: pagination.currentPage,
                  pageSize: pagination.pageSize,
                  sortBy: "createdAt",
                  sortOrder: sortOrder,
                },
          }
        );
        setMedias(response.data.data.records);
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
    const handleIconDocumentSubmit = async () => {
     
      try {     
        
        if(iconFiles.length > 0){
         
          const formData = new FormData();
          iconFiles.forEach((file) => {
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
         
          if (iconFiles.length > 0) {
            const formData = new FormData();
            iconFiles.forEach((file) => {
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
          if(iconFiles.length > 1){
            notification.error({
              message:"Max one file can be uploaded"
          });
            return;
          }
          const icon = await handleIconDocumentSubmit();
          
          if( isAdding && files?.length === 0 ){
              notification.error({
                  message:"Failed to upload files"
              });
              return;
          }
          if( isAdding && files == undefined ){
              notification.error({
                  message:"Please add at least one image"
              });
              return;
          }
          try {
            if (isAdding && !isEditing) {
              try {
                await axios.post(config.AddMedia, {
                  title: values.title,
                  desciption: values.desciption,
                  author: values.author,
                  media_url: values.media_url,
                  media_name: values.media_name,
                  files: files.data,
                  ...(icon?.data && icon?.data?.length > 0 && { media_icon: icon.data[0] }),
                });
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
              setIconFiles([]); 
              setFiles([]);
            }
            if (isEditing && !isAdding) {
              try {
                await axios.patch(config.EditMedia + values._id, {
                  title: values.title,
                  desciption: values.desciption,
                  author: values.author,
                  media_url: values.media_url,
                  media_name: values.media_name,
                  ...(files?.data && files?.data?.length > 0 && { files: files.data }),
                  ...(icon?.data && icon?.data?.length > 0 && { media_icon: icon.data[0] }),

                });
                form.resetFields();
                setIconFiles([]); 
                setFiles([]);
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
        desciption: record.desciption,
        author: record.author,
        media_url: record.media_url,
        media_name: record.media_name,
      });
      setDisableFileUpload(record?.fileUrls?.length>=5)
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
            await axios.delete(config.DeleteMedia + record._id);
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
    const handleDeleteImage = async (record, file,index) => {
      try {
          await axios.delete(`${config.DeleteMediaImage}${record._id}/${index}`);
          notification.success({
              description: "Image deleted successfully.",
            });
          fetchAll();
      } catch (error) {
          notification.error({
              description: `${error.response.data.message}`,
            });
      }
    };
    const handleDeleteIcon = async (record) => {
      try {
          await axios.delete(`${config.DeleteMediaIcon}${record._id}`);
          notification.success({
              description: "Icon deleted successfully.",
            });
          fetchAll();
      } catch (error) {
          notification.error({
              description: `${error.response.data.message}`,
            });
      }
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
            Title
          </div>
        ),
        dataIndex: "title",
        key: "title",
        align: "left",
      },
      {
          title: "Author",
          dataIndex: "author",
          key: "author",
          // width: "5%",
          align: "left",
      },
      {
        title: "Media Icon",
        dataIndex: "mediaIconUrl",
        key: "mediaIconUrl",
        width:"8%",
        align: "center",
        render: (mediaIconUrl, record) => {
          console.log("mediaIconUrl",mediaIconUrl)
          return (
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
              {mediaIconUrl ? (
                // <Card
                //   hoverable
                //   style={{
                //     width: 120,
                //     height: 120,
                //     margin: '5px',
                //     position: 'relative',
                //     padding: 0,
                //     overflow: 'hidden',
                //   }}
                //   cover={
                //     <img
                //       alt="avatar"
                //       src={mediaIconUrl}
                //       style={{
                //         width: '200',
                //         height: '200',
                //         objectFit: 'cover',
                //       }}
                //     />
                //   }
                // />
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
                  alt="media icon"
                  src={mediaIconUrl}
                  style={{ 
                    width: '150px', 
                    height: '150px',
                    objectFit: 'cover'
                  }}
                />
              }
            >
              <Button
                icon={<DeleteFilled style={{ color: 'red' }} />}
                style={{
                  position: 'absolute',
                  top: 5,
                  right: 5,
                  background: 'transparent',
                  border: 'none',
                  boxShadow: '0 0 2px rgba(0,0,0,0.2)',
                }}
                onClick={() => handleDeleteIcon(record)}
              />
            </Card>
              ) : (
                <span>No Avatar</span>
              )}
            </div>
          );
        },
      },
      {
          title: "Image",
          dataIndex: "fileUrls",
          key: "fileUrls",
          align: "left",
          render: (files, record) => (
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {files.map((file, index) => (
            <Card
              key={index}
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
                  alt="example"
                  src={file}
                  style={{ 
                    width: '150px', 
                    height: '150px',
                    objectFit: 'cover'
                  }}
                />
              }
            >
              <Button
                icon={<DeleteFilled style={{ color: 'red' }} />}
                style={{
                  position: 'absolute',
                  top: 5,
                  right: 5,
                  background: 'transparent',
                  border: 'none',
                  boxShadow: '0 0 2px rgba(0,0,0,0.2)',
                }}
                onClick={() => handleDeleteImage(record, file, index)}
              />
            </Card>
          ))}
        </div>
        
          ),
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
              Media Master
            </h4>
          </Row>
  
          <Table
            bordered
            columns={columns}
            dataSource={medias}
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
                  Add Media
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
                    {isAdding ? "Add" : "Modify"} Media
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
                      label="Author"
                      name="author"
                      rules={[
                        {
                          required: true,
                          message: "Please enter author",
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
                      <Input placeholder="Add Author" />
                    </Form.Item>
                  </Col>
                  </Row>
                  <Row gutter={12}>
                  <Col span={12}>
                    <Form.Item
                      label="Publisher name"
                      name="media_name"
                      rules={[
                        {
                          length: 100,
                          message: "Maximum lenght 100",
                        },
                        {
                          pattern: CONSTANTS.REGEX.NAME,
                          message: "Special character not allowed",
                        },
                        {
                          required: true,
                          message: "Please enter publisher name",
                        }
                      ]}
                    >
                      <Input placeholder="Add publisher name" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Article link"
                      name="media_url"
                      rules={[
                        {
                          type:"url",
                          message:"Please enter correct url"
                        },
                        {
                          length: 500,
                          message: "Maximum lenght 100",
                        },
                        {
                          required: true,
                          message: "Please enter article link",
                        },
                      ]}
                    >
                      <Input placeholder="Add article link" />
                    </Form.Item>
                  </Col>
                  </Row>
                <Row>
                <Col span={24}>
                  <Form.Item
                    name="desciption"
                    label="Desciption"
                    rules={[
                      {
                        required: true,
                        message: "Desciption cannot be empty",
                      },
                      {
                        max: CONSTANTS.STRING_LEN.CONDITIONS,
                        message: `Maximum value ${CONSTANTS.STRING_LEN.CONDITIONS}`,
                      },
                    ]}
                  >
                  
                     <ReactQuill
                      value={form.getFieldValue('desciption')}
                      onChange={(value) => form.setFieldsValue({ desciption: value })}
                      modules={{
                        toolbar: [
                          [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                          [{ 'size': [] }],
                          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                          [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}, {'align': []}],
                          ['link', 'image', 'video'],
                          ['align', 'clean'],
                          ['code-block']
                        ],
                      }}
                      
                      placeholder=""
                      style={{
                        height: 400,
                        resize: "none",
                      }}
                    />
                  </Form.Item>
                </Col>
                  {/* <Row style={{marginTop:"2rem"}} >
                      <Col span={24}>
        
                          <DocumentUploader
                          // action={action}
                          onFilesChange={(files) => setFiles(files)}
                          imageprop = {disputeimg}
                          // alttext="blog image"
                          />
                      </Col>
                  </Row> */}
                  <br/><br/>
                  <Row style={{ marginTop: '4rem' }}>
                    <p>Article images</p>
        <Col span={24}>
          {disableFileUpload ? (
            <div
              style={{
                width: '100%',     
                height: '100px', 
                border: '1px solid #dcdcdc', 
                borderRadius: '4px',
                display: 'flex',   
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f0f0f0',
                padding:"1rem",
                cursor:"not-allowed"
              }}
            >
              <span className="text-danger"> Upload Disabled. Max 5 images can be uploaded </span> {/* Placeholder text when upload is disabled */}
            </div>
          ) : (
            <DocumentUploader
              onFilesChange={(files) => setFiles(files)}
              imageprop={disputeimg}
              // alttext="blog image" // Uncomment if needed
            />
          )}
        </Col>
      </Row>
                  <Row style={{ marginTop: '4rem' }}>
                    <p>Media house logo</p>
        <Col span={24}>
          
            <DocumentUploader
              onFilesChange={(files) => setIconFiles(files)}
              imageprop={disputeimg}
              // alttext="blog image" // Uncomment if needed
            />
        </Col>
      </Row>
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

export default Media