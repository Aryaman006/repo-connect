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
} from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
const { TextArea } = Input;
const { confirm } = Modal;
import { useAuth } from "../../../context/authProvider";
import config from "../../../config/config";
import CONSTANTS from "../../../constant/Constants";
import useAxiosFetch from "../../../hooks/useAxiosFetch";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import styles

const Conditions = () => {
  const { userid } = useAuth();
  const { data: privileges } = useAxiosFetch(
    config.GetIndividualPrivilegs +
      userid +
      "/" +
      CONSTANTS.PRIVILEGE.PROGRAMME.ADMIN.TC.id
  );
  const [form] = Form.useForm();
  const [value, setValue] = useState(0);
  const [conditions, setConditions] = useState([]);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const response = await axios.get(`${config.ApiBaseUrl}${config.GetAllConditions}`);
      setConditions(response.data.data.records);
      form.setFieldsValue({
        id: response.data.data.records[value]._id,
        condition: response.data.data.records[value].condition,
      });
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
      title: "Are you sure you want to modify the record?",
      icon: <ExclamationCircleFilled />,
      centered: true,
      async onOk() {
        try {
          console.log("values inside edit!", values);
          try {
            await axios.patch(config.EditCondition + values.id, {
              condition: values.condition,
            });
            handleReset();
            fetchAll();
            notification.success({
              message: "Success",
              description: "Record updated.",
            });
          } catch (error) {
            notification.error({
              message: "Failed",
              description: "Unable to update record",
            });
          }
        } catch (error) {
          notification.error({
            message: "Failed to submit",
          });
        } finally {
          fetchAll();
        }
      },
      onCancel() {},
    });
  };

  const handleReset = () => {
    form.resetFields();
  };

  const onChange = (e) => {
    form.setFieldsValue({
      id: conditions[e.target.value]._id,
      condition: conditions[e.target.value].condition,
    });
    setValue(e.target.value);
  };

  return (
    <>
      <div style={{ padding: "1rem" }}>
        <Row justify={"start"}>
          <h4 style={{ fontWeight: "bold"}} className="textblue">
            Terms & Conditions Master
          </h4>
        </Row>

        <Card
          style={{
            width: "100%",
            margin: "auto",
            backgroundColor: "#FAFAFA",
            marginTop: "1rem",
          }}
        >
          <Radio.Group onChange={onChange} value={value}>
            <Radio value={0}>Signup</Radio>
            <Radio value={1} style={{ marginLeft: "3rem" }}>
              Payment
            </Radio>
          </Radio.Group>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            // disabled={componentDisabled}
            style={{ marginTop: "1.5rem" }}
          >
            <Row>
              <Col span={24}>
                <Form.Item name="id" label="Conditions id" hidden>
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item
                  name="condition"
                  label="Terms & Conditions"
                  rules={[
                    {
                      required: true,
                      message: "T&C cannot be empty",
                    },
                    {
                      max: CONSTANTS.STRING_LEN.CONDITIONS,
                      message: `Maximum value ${CONSTANTS.STRING_LEN.CONDITIONS}`,
                    },
                  ]}
                  // labelCol={{ span: 10, offset: 0 }}
                >
                
                   <ReactQuill
                    value={form.getFieldValue('condition')}
                    onChange={(value) => form.setFieldsValue({ condition: value })}
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
                      height: 350,
                      resize: "none",
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row align="center">
              <Col>
                <Form.Item style={{ marginTop: "5rem" }}>
                  {privileges?.PATCH && (
                    <Button type="primary" htmlType="submit">
                      Submit
                    </Button>
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      </div>
    </>
  );
};

export default Conditions;
