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
  Switch,
  Pagination,
  Table,
  InputNumber,
  Select,
} from "antd";
import {
  EditFilled,
  DeleteFilled,
  ArrowUpOutlined,
  ExclamationCircleFilled,
  PlusOutlined,
  FileImageOutlined,
} from "@ant-design/icons";
const { TextArea } = Input;
const { confirm } = Modal;
import { useAuth } from "../../context/authProvider";
import config from "../../config/config";
import CONSTANTS from "../../constant/Constants";
import useAxiosFetch from "../../hooks/useAxiosFetch";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Axios } from "../../axios/axiosFunctions";
import DocumentUploader from "../../components/DocumentUploader";
import disputeimg from "../../assets/dispute.jfif";
const { Search } = Input;

const Jobs = () => {
  const [form] = Form.useForm();
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [files, setFiles] = useState([]);
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
      const response = await axios.get(
        `${config.ApiBaseUrl}${config.GetJobs}`,
        {
          params: {
            search: search || undefined,
            page: pagination.currentPage,
            pageSize: pagination.pageSize,
            sortBy: "createdAt",
            sortOrder: sortOrder,
          },
        }
      );
      setJobs(response.data.data.records);
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
          message: "Something went wrong",
        });
      }
    }
  };

  const handleDocumentSubmit = async () => {
    try {
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
            },
          }
        );

        if (response.success) {
          return { data: response.data };
        } else {
          // throw new Error(`Failed to upload documents`);
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
              },
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
      // notification.error({
      //   message: "Failed to upload documents",
      // });
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
        // if( isAdding && files?.length === 0 ){
        //     notification.error({
        //         message:"Atleast one file is required"
        //     });
        //     return;
        // }

        if (files?.length >= 1) {
          notification.error({
            message: "Max one file can be uploaded",
          });
          return;
        }
        try {
          if (isAdding && !isEditing) {
            try {
              await axios.post(config.AddJob, {
                title: values.title,
                description: values.description,
                ...(files?.data &&
                  files?.data?.length > 0 && { jd: files.data[0] }),
              });
              form.resetFields();
              notification.success({
                message: "Job opening added successfully.",
              });
              setFiles([]);
              fetchAll();
            } catch (error) {
              console.log("Error", error);
              notification.error({
                message: "Failed",
                description: error.response.data.message,
              });
            }
          }
          if (isEditing && !isAdding) {
            try {
              await axios.patch(config.EditJob + values._id, {
                title: values.title,
                description: values.description,
                ...(files?.data &&
                  files?.data?.length > 0 && { jd: files.data[0] }),
              });
              form.resetFields();
              handleReset();

              notification.success({
                message: "Success",
                description: "Record updated.",
              });
              setFiles([]);
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
      title: record.title,
      description: record.description,
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
          await axios.delete(config.DeleteJob + record._id);
          notification.success({
            message: "Success",
            description: "Record deleted Successfully.",
          });
          fetchAll();
        } catch (error) {
          notification.error({
            message: "Failed",
            // description: `${error.response.data.msg}`,
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
  const onSearch = async () => {
    await fetchAll();
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

  const handleSwitchChange = async (checked, id) => {
    confirm({
      title: "Are you sure you want to modify the record?",
      icon: <ExclamationCircleFilled />,
      centered: true,
      async onOk() {
        try {
          await Axios.patchAxiosData(config.EditJob + id, {
            status: checked,
          });
          notification.success({
            message: "Success",
            description: "Record Successfully edited",
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
      title: <div>Title</div>,
      dataIndex: "title",
      key: "title",
      width: "15%",
      align: "left",
    },
    {
      title: "Job Description",
      dataIndex: "jdUrl",
      align: "middle",
      key: "action",
      width: "5%",
      render: (_, record) => (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {
            <a href={record?.jdUrl} target="_blank">
              <FileImageOutlined />
            </a>
          }
        </div>
      ),
    },
    {
      title: "Status",
      // dataIndex:"plan_status",
      width: "10%",
      align: "center",
      render: (record) => {
        return (
          <Switch
            checkedChildren="Active"
            unCheckedChildren="Inactive"
            checked={record.status}
            onChange={(checked) =>
              handleSwitchChange(checked ? true : false, record._id)
            }
            style={{ marginRight: "0.5rem" }}
          />
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
            Job Details
          </h4>
        </Row>
        <Row justify="end">
          <Col span={6}>
            <Search
              placeholder="Search title"
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
          dataSource={jobs}
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
                Add Job Details
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
                  {isAdding ? "Add" : "Modify"} Job
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
                    <Form.Item label="Job Id" name="_id" hidden>
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={12}>
                  <Col span={12}>
                    <Form.Item
                      label="Job title"
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
                      ]}
                    >
                      <Input placeholder="Add Title" />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <Form.Item
                      name="description"
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
                        value={form.getFieldValue("description")}
                        onChange={(value) =>
                          form.setFieldsValue({ description: value })
                        }
                        modules={{
                          toolbar: [
                            [{ header: "1" }, { header: "2" }, { font: [] }],
                            [{ size: [] }],
                            [
                              "bold",
                              "italic",
                              "underline",
                              "strike",
                              "blockquote",
                            ],
                            [
                              { list: "ordered" },
                              { list: "bullet" },
                              { indent: "-1" },
                              { indent: "+1" },
                              { align: [] },
                            ],
                            ["link", "image", "video"],
                            ["align", "clean"],
                            ["code-block"],
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
                </Row>
                <br /> <br />
                <p className="fw-bolder">Upload Job Description PDF</p>
                <Row style={{ marginTop: "2rem" }} justify={"start"}>
                  <Col span={12}>
                    <DocumentUploader
                      onFilesChange={(files) => setFiles(files)}
                      imageprop={disputeimg}
                      // alttext="blog image" // Uncomment if needed
                    />
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
};

export default Jobs;
