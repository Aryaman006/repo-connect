import { ExclamationCircleFilled } from "@ant-design/icons";
import useAxiosFetch from "../../../hooks/useAxiosFetch";
import config from "../../../config/config";
import CONSTANTS from "../../../constant/Constants";
import axios from "axios";
import {
  Button,
  Card,
  Checkbox,
  Col,
  Form,
  Modal,
  Row,
  Select,
  Table,
  notification,
} from "antd";
import { useAuth } from "../../../context/authProvider";
import { useEffect, useState } from "react";
const { Option } = Select;
const { confirm } = Modal;

const Privilege = () => {
  const { userid } = useAuth();
  const { data: privileges } = useAxiosFetch(
    config.GetIndividualPrivilegs +
      userid +
      "/" +
      CONSTANTS.PRIVILEGE.PROGRAMME.ADMIN.CORPORATE.id
  );

  const { data: userData } = useAxiosFetch(
    config.GetAllManUsers + "?pageSize=1000"
  );
  const { data: adminUserData } = useAxiosFetch(config.GetAllAdminUsers);
  const { data: adminProgData } = useAxiosFetch(config.GetAdminProgList);
  const { data: genProgData } = useAxiosFetch(config.GetGeneralProgList);

  const [form] = Form.useForm();
  const [programs, setPrograms] = useState([]);
  const [modules, setModules] = useState([]);
  const [userType, SetUserType] = useState([]);
  const [moduleCode, setModuleCode] = useState();
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState();
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    if (moduleCode === CONSTANTS.MODULE_TYPE.ADMIN) {
      setUserList(adminUserData.records);
    } else if (moduleCode === CONSTANTS.MODULE_TYPE.GENERAL) {
      setUserList(userData.records);
    }
  }, [moduleCode]);
  useEffect(() => {
    if (moduleCode === 1) {
      const data = Object.values(adminProgData).map((item) => ({
        id: item.id,
        value: item.value,
      }));
      setPrograms(data);
    } else if (moduleCode === 2) {
      const data = Object.values(genProgData).map((item) => ({
        id: item.id,
        value: item.value,
      }));
      setPrograms(data);
    }
  }, [moduleCode]);

  useEffect(() => {
    const fetchAllPrivileges = async () => {
      try {
        const response = await axios.get(`${config.ApiBaseUrl}${config.GetAllPrivilegs}` + userId);
        const selectedPrivileges = response.data.data.records;

        if (selectedPrivileges.length === 0) {
          const originalPrograms = programs.map((program) => {
            const { _id, user_id, ...rest } = program;
            return {
              ...rest,
              GET: false,
              POST: false,
              PATCH: false,
              DELETE: false,
            };
          });
          setPrograms(originalPrograms);
        } else {
          const mergedPrograms = programs.map((program) => {
            const userPrivilege = selectedPrivileges.find(
              (p) => p.program_id === program.id
            );
            return userPrivilege ? { ...program, ...userPrivilege } : program;
          });

          setPrograms(mergedPrograms);
        }
      } catch (error) {
        if (error?.request?.status === 401) {
          notification.error({
            message: error?.response?.data?.error,
            description: "Please contact system admin !",
          });
        }
      }
    };

    if (userId) {
      fetchAllPrivileges();
    }
  }, [userId]);

  const handleAllCheckboxChange = (columnName) => (event) => {
    const newData = programs.map((item) => ({
      ...item,
      [columnName]: event.target.checked,
    }));
    setPrograms(newData);
  };

  const handleCheckboxChange = (key, columnName) => (event) => {
    const newData = [...programs];
    const index = newData.findIndex((item) => item.id === key);
    if (index > -1) {
      newData[index] = {
        ...newData[index],
        [columnName]: event.target.checked,
      };
      setPrograms(newData);
    }
  };

  const handleSubmit = (values) => {
    const updatedPrograms = programs.map((program) => ({
      module_id: moduleCode,
      user_id: userId,
      program_id: program.id,
      GET: program.GET,
      POST: program.POST,
      PATCH: program.PATCH,
      DELETE: program.DELETE,
    }));
    confirm({
      title: "saveWarning",
      icon: <ExclamationCircleFilled />,
      centered: true,
      async onOk() {
        try {
          const privileges = await axios.get(`${config.ApiBaseUrl}${config.GetAllPrivilegs}` + userId);
          if (privileges.data.data.records.length === 0) {
            const response = await axios.post(
              config.AddPrivilegs,
              //   ...values.id,
              updatedPrograms
            );
            notification.success({
              message: "Success",
              description: response.message,
            });
          } else {
            const response = await axios.patch(
              config.EditPrivilegs + userId + `/${moduleCode}`,
              programs
            );
            notification.success({
              message: "Success",
              description: response.message,
            });
          }
        } catch (error) {
          notification.error({
            message: "Failed",
            description: `${error}`,
          });
        }
      },
      onCancel() {},
    });
  };

  const columns = [
    { title: "Program", dataIndex: "value", key: "value" },
    {
      title: (
        <div>
          {privileges?.PATCH && (
            <Checkbox
              style={{ marginRight: "1em" }}
              checked={programs.every((item) => item.GET)}
              onChange={handleAllCheckboxChange("GET")}
            />
          )}
          View
        </div>
      ),
      dataIndex: "GET",
      key: "GET",
      hidden: !privileges?.PATCH,
      render: (GET, record) => (
        <Checkbox
          checked={GET}
          onChange={handleCheckboxChange(record.id, "GET")}
        />
      ),
    },
    {
      title: (
        <div>
          {privileges?.PATCH && (
            <Checkbox
              style={{ marginRight: "1em" }}
              checked={programs.every((item) => item.POST)}
              onChange={handleAllCheckboxChange("POST")}
            />
          )}
          Add
        </div>
      ),
      dataIndex: "POST",
      key: "POST",
      hidden: !privileges?.PATCH,
      render: (POST, record) => (
        <Checkbox
          checked={POST}
          onChange={handleCheckboxChange(record.id, "POST")}
        />
      ),
    },
    {
      title: (
        <div>
          {privileges?.PATCH && (
            <Checkbox
              style={{ marginRight: "1em" }}
              checked={programs.every((item) => item.PATCH)}
              onChange={handleAllCheckboxChange("PATCH")}
            />
          )}
          Modify
        </div>
      ),
      dataIndex: "PATCH",
      key: "PATCH",
      hidden: !privileges?.PATCH,
      render: (PATCH, record) => (
        <Checkbox
          checked={PATCH}
          onChange={handleCheckboxChange(record.id, "PATCH")}
        />
      ),
    },
    {
      title: (
        <div>
          {privileges?.PATCH && (
            <Checkbox
              style={{ marginRight: "1em" }}
              checked={programs.every((item) => item.DELETE)}
              onChange={handleAllCheckboxChange("DELETE")}
            />
          )}
          Delete
        </div>
      ),
      dataIndex: "DELETE",
      key: "DELETE",
      hidden: !privileges?.PATCH,
      render: (del, record) => (
        <Checkbox
          checked={del}
          onChange={handleCheckboxChange(record.id, "DELETE")}
        />
      ),
    },
  ];

  return (
    <>
     <Row justify={"start"}>
          <h4 style={{ fontWeight: "bold" }} className="textblue">Privilege Master</h4>
        </Row>
      <Form onFinish={handleSubmit} form={form}>
        <Card style={{ border: "none" }}>
          <Row justify="start">
            <Col>
              <Form.Item
                //   style={bottomSpacing}
                labelCol={{ span: 9 }}
                name="module_id"
                rules={[
                  {
                    required: true,
                    message: "Please select module !",
                  },
                ]}
              >
                <Select
                  allowClear
                  placeholder="Select Module"
                  style={{ width: "180px", marginRight: "1em" }}
                  onChange={(value) => {
                    setModuleCode(value);
                    form.resetFields(["user_id"]);
                    setUserId(null);
                  }}
                >
                  <Option
                    value={CONSTANTS.MODULE_TYPE.ADMIN}
                    key={CONSTANTS.MODULE_TYPE.ADMIN}
                  >
                    Admin
                  </Option>
                  <Option
                    value={CONSTANTS.MODULE_TYPE.GENERAL}
                    key={CONSTANTS.MODULE_TYPE.GENERAL}
                  >
                    General
                  </Option>
                </Select>
              </Form.Item>
            </Col>
            <Col>
              <Form.Item
                //   style={bottomSpacing}
                labelCol={{ span: 9 }}
                name="user_id"
                //   rules={fieldsValidation}
                rules={[
                  {
                    required: true,
                    message: "Please select user !",
                  },
                ]}
                colon={false}
              >
                <Select
                  allowClear
                  style={{ width: "180px", marginLeft: "1%" }}
                  placeholder="Select User"
                  onChange={(value) => setUserId(value)}
                >
                  {userList?.map((user) => (
                    <Option value={user._id} key={user._id}>
                      {user.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Card>
        {privileges?.GET && (
          <Card className="border-0">
            <Table
              columns={columns}
              dataSource={programs}
              size="small"
              pagination={false}
              rowKey={(record) => record.program_id}
            />

            <Row
              gutter={[16, 24]}
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "1em",
              }}
            >
              <Col className="gutter-row">
                {privileges?.PATCH && (
                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button>
                )}
              </Col>
            </Row>
          </Card>
        )}
      </Form>
    </>
  );
};

export default Privilege;
