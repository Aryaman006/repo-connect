import { useEffect, useState } from "react";
import CONSTANTS from "../../../constant/Constants";
import useAxiosFetch from "../../../hooks/useAxiosFetch";
import axios from "axios";
import {
  Row,
  Col,
  Input,
  InputNumber,
  Button,
  notification,
  Modal,
  Form,
  Card,
  Tooltip,
  Select,
} from "antd";
import {

  InfoCircleOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
const { confirm } = Modal;
import { useAuth } from "../../../context/authProvider";
import config from "../../../config/config";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const toolbarOptions = {
  toolbar: [
    [{ 'header': '1' }, { 'header': '2' }, { 'header': '3' }, { 'header': '4' }, { 'header': '5' }, { 'header': '6' }, { 'font': [] }],
    [{ 'size': [] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{'list': 'ordered'}, {'list': 'bullet'},{'list' : 'roman'}, {'list': 'alphabet'}, {'indent': '-1'}, {'indent': '+1'}, {'align': []}],
    ['link', 'image', 'video'],
    ['align', 'clean'],
    ['code-block']
  ],
};
const SystemSettings = () => {
  const {userid} = useAuth();
  const { data : privileges } = useAxiosFetch(config.GetIndividualPrivilegs+userid+"/"+CONSTANTS.PRIVILEGE.PROGRAMME.ADMIN.SYSTEM.id);
  const [form] = Form.useForm();
  // const [sysSettings, setSysSettings] = useState([]);
  //   const [isEditing, setIsEditing] = useState(false);
  //   const [componentDisabled, setComponentDisabled] = useState(true);

  //   const { data: settingsData } = useAxiosFetch(config.GetAllSettings);
  useEffect(() => {
    fetchAll();
  }, []);

  //fetch all data/read
  const fetchAll = async () => {
    try {
      const response = await axios.get(`${config.ApiBaseUrl}${config.GetAllSettings}`);
      form.setFieldsValue({
        id: response.data.data[0]._id,
        docSize: response.data.data[0].docSize / 1024,
        file_type: response.data.data[0].file_type,
        speciality: response.data.data[0].speciality,
        years_of_exp: response.data.data[0].years_of_exp,
        doctor: response.data.data[0].doctor,
        appointment: response.data.data[0].appointment,
        disclaimer: response.data.data[0].disclaimer
      });
    } catch (error) {
      if(error?.request?.status === 401 ){
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
          try {
            await axios.patch(config.EditSettings + values.id, {
              docSize: Math.round(values.docSize * 1024),
              file_type: values.file_type,
              speciality: values.speciality,
              years_of_exp: values.years_of_exp,
              doctor: values.doctor,
              appointment: values.appointment,
              disclaimer: values.disclaimer,
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

  const onFinishFailed = () => {};
  const handleReset = () => {
    form.resetFields();
  };

  return (
    <>
      <div style={{ padding: "1rem" }}>
        <Row justify={"start"}>
          <h4 style={{ fontWeight: "bold" }} className="textblue">System Settings</h4>
        </Row>

        <Card
          style={{
            width: "60%",
            margin: "auto",
            backgroundColor: "#FAFAFA",
            marginTop: "3.5rem",
          }}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            style={{ marginTop: "1.5rem" }}
          >
            <Row>
              <Col span={12}>
                <Form.Item name="id" label="Settings id" hidden>
                  <InputNumber />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item
                  name="docSize"
                  label="Document Size (MB)"
                  rules={[
                    {
                      required: true,
                      message: "Settings cannot be empty",
                    },
                    {
                      type: "number",
                      min: 0.1,
                      message: "File size should be min 0.1 MB!",
                    },
                    {
                      type: "number",
                      max: 10,
                      message: "File size should be max 10 MB!",
                    },
                  ]}
                >
                  <InputNumber min={0.1} max={10} precision={2} step={0.1} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="file_type"
                  label="Allowed File Extention Types"
                  rules={[
                    {
                      required: true,
                      message: "Types cannot be empty",
                    },
                    {
                      pattern: CONSTANTS.REGEX.FILE_TYPE,
                      message:
                        "Only comma and alpabets allowed or cannor end with comma",
                    },
                  ]}
                >
                  <Input
                    placeholder="Enter allowed file types"
                    suffix={
                      <Tooltip title="Enter file type seperated by comma.">
                        <InfoCircleOutlined
                          style={{
                            color: "rgba(0,0,0,.45)",
                          }}
                        />
                      </Tooltip>
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item
                  name="speciality"
                  label="Specialities"
                  rules={[
                    {
                      required: true,
                      message: "Cannot be empty",
                    },
                    {
                      type: "number",
                      min: 1,
                      message: "Min 1",
                    },
                    {
                      type: "number",
                      max: 1000000,
                      message: "Max 1000000",
                    },
                  ]}
                >
                  <InputNumber min={1} max={1000000} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="years_of_exp"
                  label="Years of Experience"
                  rules={[
                    {
                      required: true,
                      message: "Cannot be empty",
                    },
                    {
                      type: "number",
                      min: 1,
                      message: "Min 1",
                    },
                    {
                      type: "number",
                      max: 1000000,
                      message: "Max 1000000",
                    },
                  ]}
                >
                  <InputNumber min={1} max={1000000} />
                </Form.Item>
              </Col>
              
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item
                  name="appointment"
                  label="Appointments"
                  rules={[
                    {
                      required: true,
                      message: "Cannot be empty",
                    },
                    {
                      type: "number",
                      min: 1,
                      message: "Min 1",
                    },
                    {
                      type: "number",
                      max: 1000000,
                      message: "Max 1000000",
                    },
                  ]}
                >
                  <InputNumber min={1} max={1000000} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="doctor"
                  label="Doctors"
                  rules={[
                    {
                      required: true,
                      message: "Cannot be empty",
                    },
                    {
                      type: "number",
                      min: 1,
                      message: "Min 1",
                    },
                    {
                      type: "number",
                      max: 1000000,
                      message: "Max 1000000",
                    },
                  ]}
                >
                  <InputNumber min={1} max={1000000} />
                </Form.Item>
              </Col>
              
            </Row>
            <Row>
            <Col span={24}>
                <Form.Item
                  name="disclaimer"
                  label="Disclaimer"
                  rules={[
                    {
                      required: true,
                      message: "Please enter disclaimer",
                    },
                    {
                      max: CONSTANTS.STRING_LEN.DISCLAIMER,
                      message: `Maximum value ${CONSTANTS.STRING_LEN.DISCLAIMER}`,
                    },
                  ]}
                >
                
                   <ReactQuill
                    modules={toolbarOptions}
                    theme="snow" 
                    placeholder=""
                    style={{
                      height: 100,
                      resize: "none",
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row align="center">
              <Col>
                <Form.Item style={{ marginTop: "5rem" }}>
                  { privileges?.PATCH &&<Button type="primary" htmlType="submit">
                    Submit Settings
                  </Button>}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      </div>
    </>
  );
};

export default SystemSettings;
