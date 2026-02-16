import {
  Row,
  Col,
  Input,
  Button,
  Table,
  notification,
  Form,
  Card,
  Modal,
} from "antd";
import {
  PlusOutlined,
  EditFilled,
  DeleteFilled,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import axios from "axios";
import { useEffect, useState } from "react";
import config from "../../../config/config";

const FAQMaster = () => {
  const [faqs, setFaqs] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentFaq, setCurrentFaq] = useState(null);
  const [form] = Form.useForm();
  const { confirm } = Modal;

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      const response = await axios.get(
        `${config.ApiBaseUrl}${config.GetAllFAQs}`
      );
      setFaqs(response.data.data.records);
    } catch (error) {
      notification.error({
        message: "Failed to fetch FAQs",
      });
    }
  };

  const onFinish = async (values) => {
    confirm({
      title: isAdding
        ? "Are you sure you want to add this FAQ?"
        : "Are you sure you want to modify this FAQ?",
      icon: <ExclamationCircleFilled />,
      centered: true,
      async onOk() {
        try {
          if (isAdding && !isEditing) {
            try {
              await axios.post(
                `${config.ApiBaseUrl}${config.AddFAQs}`,
                values
              );
              notification.success({
                message: "FAQ added successfully",
              });
              form.resetFields();
              setIsAdding(false);
              fetchFaqs();
            } catch (error) {
              notification.error({
                message: error.response?.data?.message || "Failed to add FAQ",
                description: "Please try again!",
              });
            }
          } else if (isEditing && currentFaq) {
            try {
              await axios.patch(
                `${config.ApiBaseUrl}${config.EditFAQs}/${currentFaq._id}`,
                values
              );
              notification.success({
                message: "FAQ updated successfully",
              });
              handleReset();
              fetchFaqs();
            } catch (error) {
              notification.error({
                message: error.response?.data?.message || "Failed to update FAQ",
                description: "Please try again!",
              });
            }
          }
        } catch (error) {
          notification.error({
            message: "Failed to submit",
            description: "An unexpected error occurred. Please try again!",
          });
        }
      },
      onCancel() {},
    });
  };

  const handleDelete = async (record) => {
    try {
      await axios.delete(
        `${config.ApiBaseUrl}${config.DeleteFAQs}/${record._id}`
      );
      notification.success({
        message: "FAQ deleted successfully",
      });
      fetchFaqs();
    } catch (error) {
      notification.error({
        message: "Failed to delete FAQ",
      });
    }
  };

  const handleEdit = (record) => {
    setIsAdding(true);
    setIsEditing(true);
    setCurrentFaq(record);
    form.setFieldsValue({
      question: record.question,
      answer: record.answer,
    });
  };

  const handleReset = () => {
    form.resetFields();
    setIsAdding(false);
    setIsEditing(false);
    setCurrentFaq(null);
  };

  const columns = [
    {
      title: "Question",
      dataIndex: "question",
      key: "question",
      align: "left",
    },
    {
      title: "Answer",
      dataIndex: "answer",
      key: "answer",
      align: "left",
    },
    {
      title: "Action",
      dataIndex: "action",
      align: "center",
      key: "action",
      width: "8%",
      render: (_, record) => (
        <>
          <EditFilled
            style={{
              marginRight: "15px",
              color: "green",
              textAlign: "center",
            }}
            onClick={() => handleEdit(record)}
          />
          <DeleteFilled
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
            FAQ Master
          </h4>
        </Row>

        <Table
          bordered
          columns={columns}
          dataSource={faqs}
          size="small"
          rowKey={(record) => record._id}
          pagination={false}
          align="right"
          style={{
            marginBottom: "1rem",
          }}
        />

        <div>
          {!isAdding && (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Button
                onClick={() => {
                  form.resetFields();
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
                  Add FAQ
                </div>
              </Button>
            </div>
          )}

          {isAdding && (
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
                    marginTop: "1rem",
                    marginBottom: "3rem",
                  }}
                  className="textblue"
                >
                  {isEditing ? "Edit FAQ" : "Add FAQ"}
                </h4>
              </Row>

              <Form
                layout="vertical"
                form={form}
                name="faqForm"
                onFinish={onFinish}
              >
                <Form.Item
                  label="Question"
                  name="question"
                  rules={[
                    {
                      required: true,
                      message: "Please enter the question",
                    },
                  ]}
                >
                  <Input placeholder="Enter question" />
                </Form.Item>

                <Form.Item
                  label="Answer"
                  name="answer"
                  rules={[
                    {
                      required: true,
                      message: "Please enter the answer",
                    },
                  ]}
                >
                  <Input.TextArea rows={4} placeholder="Enter answer" />
                </Form.Item>

                <Row justify="center" style={{ paddingTop: "1rem" }}>
                  <Col>
                    <Form.Item>
                      <div>
                        <Button type="primary" htmlType="submit" className="me-3">
                          {isEditing ? "Update" : "Submit"}
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

export default FAQMaster;
