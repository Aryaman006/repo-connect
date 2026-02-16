import { useEffect, useState } from "react";
import STATES from "../../../constant/States";
import CONSTANTS from "../../../constant/Constants";
import axios from "axios";
import {Axios} from "../../../axios/axiosFunctions";
import StatusSelect from "../../../components/Select/StatusSelect";
import { getStatus } from "../../../utils";
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
  Space,
  InputNumber,
} from "antd";
import {
  EditFilled,
  DeleteFilled,
  ArrowUpOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import { PlusOutlined } from "@ant-design/icons";
const { Search, TextArea } = Input;
const { Option } = Select;
const { confirm } = Modal;
import config from "../../../config/config";
import useAxiosFetch from "../../../hooks/useAxiosFetch";
import { useAuth } from "../../../context/authProvider";
import codes from "country-calling-code";
import exportFunction from "../../../utils/export";
const Doctor = () => {
  const {userid} = useAuth();
  const { data : privileges } = useAxiosFetch(config.GetIndividualPrivilegs+userid+"/"+CONSTANTS.PRIVILEGE.PROGRAMME.ADMIN.DOCTORS.id);
  const [form] = Form.useForm();
  const [doctor, setDoctor] = useState([]);
  const [specializationList, setSpecializationList] = useState([]);
  const [doctorData, setDoctorData] = useState([]);
  const [total, setTotal] = useState(0);
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

  const fetchSpecialization = async()=>{
     const response = await Axios.fetchAxiosData(config.GetAllSpecialization, {params: { pageSize: 1000 }},)
     setSpecializationList(response?.data?.records);
  }

  useEffect (()=>{
    fetchSpecialization();
  },[])

  //fetch all data/read
  const fetchAll = async () => {
    try {
      const response = await axios.get(`${config.ApiBaseUrl}${config.GetAllDoctors}`, {
        params: {
          search: search || undefined,
          page: pagination.currentPage,
          pageSize: pagination.pageSize,
          sortBy: "name",
          sortOrder: sortOrder,
        },
      });
      
      setDoctor(response.data.data.records);
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
      if(error?.request?.status === 401 ){
        notification.error({
          message: error?.response?.data?.error,
          description: "Please contact system admin !",
        });
      }
    }
  };

  const fetchAllDoctors = async () => {
    try {
      const response = await axios.get(`${config.ApiBaseUrl}${config.GetAllDoctorsList}`, {
      });
      
      const filteredRecords =
      response?.data?.data?.records?.map((record) => ({
        name: record.name,
        specialization: record.specialization,
        exp: record.exp,
        hospital: record.hospital,
        mobile: record.mobile,
        status: GetCorporateStatus(record.status),
      })) || [];
      setDoctorData(filteredRecords);
      setTotal(response?.data?.data?.pagination.totalRecords);
      
    } catch (error) {
      if(error?.request?.status === 401 ){
        notification.error({
          message: error?.response?.data?.error,
          description: "Please contact system admin !",
        });
      }
    }
  };

  useEffect(()=>{
    fetchAllDoctors()
  },[])
  const GetCorporateStatus = (status) => {
    switch (status) {
      case CONSTANTS.STATUS.ACTIVE:
        return "Active";
      case CONSTANTS.STATUS.INACTIVE:
        return "InActive";
      default:
        return "Unknown Status";
    }
  };

  const pdftitle = "Doctor List";
  const ExportFileName = "Doctor_List";

  const handleExport = (type) => {
    if (type === "pdf") {
      exportFunction.exportToPDF(
        pdfData,
        headers,
        total,
        pdftitle,
        ExportFileName
      );
    } else if (type === "excel") {
      exportFunction.exportToExcel(dataWithHeaders, ExportFileName);
    }
  };

  const headers = [
    "S.No",
    "Name",
    "Mobile No",
    "Specialization",
    "Hospital",
    "Expreience",
    "Status",
  ];

  const dataWithHeaders = [
    headers,
    ...doctorData?.map((item, index) => [
      index + 1,
      item.name,
      item.mobile,
      item.specialization,
      item.hospital,
      item.exp,
      item.status,   
    ]),
  ];

  const pdfData = doctorData?.map((item, index) => [
    index + 1,
    item.name,
    item.mobile,
    item.specialization,
    item.hospital,
    item.exp,
    item.status,
  ]);

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
              await axios.post(config.AddDoctor, {
                name: values.name,
                reg_no: values.reg_no,
                specialization: values.specialization,
                exp: values.exp,
                hospital: values.hospital,
                address: values.address,
                state: values.state,
                mobile: values.mobile.number,
                country_code: values.mobile.code,
                email: values.email,
                status: values.status,
              });
              form.resetFields();
              notification.success({
                message: "Doctors details added.",
                // description: "Successfully",
              });
              fetchAll();
            } catch (error) {
              notification.error({
                message: error.response.data.message,
                description: "Try Again !",
              });
            }
          } else if (isEditing && !isAdding) {
            try {
              await axios.patch(config.EditDoctor + values._id, {
                name: values.name,
                reg_no: values.reg_no,
                specialization: values.specialization,
                exp: values.exp,
                hospital: values.hospital,
                address: values.address,
                state: values.state,
                mobile: values.mobile.number,
                country_code: values.mobile.code,
                email: values.email,
                status: values.status,
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
      name: record.name,
      reg_no: record.reg_no,
      specialization: record.specialization,
      exp: record.exp,
      hospital: record.hospital,
      address: record.address,
      state: record.state,
      mobile: { number: record.mobile, code: record.country_code },
      email: record.email,
      status: record.status,
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
          await axios.delete(config.DeleteDoctor + record._id);
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
      width: "2%",
      align: "center",
      render: (_, record, index) => {
        return (pagination.currentPage - 1) * pagination.pageSize + index + 1;
      },
    },
    {
      title: (
        <div>
          Name
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
      title: "Mobile No.",
      dataIndex: "mobile",
      key: "reg_no",
      width: "8%",
      align: "left",
    },
    {
      title: "Specialization",
      dataIndex: "specialization",
      key: "specialization",
      width: "8%",
      align: "left",
    },
    {
      title: "Hospital",
      dataIndex: "hospital",
      key: "hospital",
      width: "10%",
      align: "left",
    },
    {
      title: "Experience",
      dataIndex: "exp",
      key: "exp",
      width: "10%",
      align: "left",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: "5%",
      align: "left",
      render: (record) => getStatus(record),
    },
    {
      title: "Approve Status",
      align:"center",
      width:"10%",
      render:(record)=>(
        record.approved_by_admin===CONSTANTS.DOCTOR.APPROVED_BY_ADMIN && record.added_by=== CONSTANTS.DOCTOR.ADDED_BY_ADMIN ? <span className="text-success">Approved</span> 
       
        :record.approved_by_admin===CONSTANTS.DOCTOR.NOACTION_BY_ADMIN && record.added_by === CONSTANTS.DOCTOR.ADDED_BY_DOCTOR ?
        <Select
        onChange={value => handleSelectChange(value, record)}
              allowClear
              placeholder="Select"
              style={{ width: "120px", marginRight: "0.5rem" }}
              options={[
                {
                  value: CONSTANTS.DOCTOR.APPROVED_BY_ADMIN,
                  label: "Approve",
                },
                {
                  value: CONSTANTS.DOCTOR.REJECTED_BY_ADMIN,
                  label: "Reject",
                },
               
              ]}
            />
             :record.approved_by_admin===CONSTANTS.DOCTOR.REJECTED_BY_ADMIN && record.added_by === CONSTANTS.DOCTOR.ADDED_BY_DOCTOR ? <span className="text-danger">Rejected</span> 
             :record.approved_by_admin === CONSTANTS.DOCTOR.APPROVED_BY_ADMIN && record.added_by === CONSTANTS.DOCTOR.ADDED_BY_DOCTOR?<span className="text-success">Approved</span>
                          :""
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      align: "center",
      key: "action",
      width: "8%",
      hidden: (!privileges?.PATCH && !privileges?.DELETE),
      render: (_, record) => (
        <>
          {privileges?.PATCH && <EditFilled
            type="primary"
            style={{
              marginRight: "15px",
              color: "green",
              textAlign: "center",
            }}
            
            onClick={() => handleEdit(record)}
          />}
          {privileges?.DELETE && <DeleteFilled
            type="primary"
            style={{ color: "red" }}
            onClick={() => handleDelete(record)}
          />}
        </>
      ),
    },
  ];

  const handleSelectChange = (value, record) => {
    const newApprovedStatus = value === CONSTANTS.DOCTOR.APPROVED_BY_ADMIN;

    confirm({
      title: 'Confirmation',
      content: `Are you sure you want to ${newApprovedStatus ? 'approve' : 'reject'} this record?`,
      icon: <ExclamationCircleFilled/>,
      onOk: async() =>{
       const response = await Axios.patchAxiosData(config.EditDoctor + record._id, {
        name: record.name,
        reg_no: record.reg_no,
        specialization: record.specialization,
        exp: record.exp,
        hospital: record.hospital,
        address: record.address,
        state: record.state,
        mobile: record.mobile.number,
        country_code: record.mobile.code,
        email: record.email,
        status: record.status,
        approved_by_admin: value,

      }) 
      if(response.success === true){
        notification.success({
          message: "Success",
          description: "Record updated.",
        });
        fetchAll();
      }   
      },
      // handleUpdate(record.key, value),
      onCancel: () => {}
    });
  };

  console.log("doctor",doctor)

  return (
    <>
      <div style={{ padding: "1rem" }}>
        {/* <Row justify={"start"}>
          <h4 style={{ fontWeight: "bold" }} className="textblue">Doctor Master</h4>
        </Row> */}
        <Row justify="end">
          <Col span={6}>
            <Search
              placeholder="Search"
              onSearch={onSearch}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              enterButton
              style={{ marginBottom: "16px", width: "100%" }}
            />
          </Col>
        </Row>
        <div className="row d-flex justify-content-between my-4">
                        <div className="col-3">
                          <h5>Doctor List</h5>
                        </div>
                        <div className="col-5 d-flex gap-2 justify-content-end">
                          <div className="col-3">
                            <Button
                              onClick={() => handleExport("excel")}
                              type="primary"
                              size="small"
                              style={{ marginRight: "3rem" }}
                            >
                              Export to Excel
                            </Button>
                          </div>
                          <div className="col-3">
                            <Button
                              onClick={() => handleExport("pdf")}
                              type="primary"
                              size="small"
                            >
                              Export to PDF
                            </Button>
                          </div>
             </div>
        </div>
        <Table
          bordered
          columns={columns}
          dataSource={doctor}
          size="small"
          rowKey={(record) => record._id}
          pagination={false}
          align="right"
          //   scroll={{
          //     y: 400,
          //   }}
          //   sticky={{ offsetHeader: 0 }}
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
                  Add Doctor
                </div>
              </Button>
            </div>
          )}

          {(isAdding || isEditing) && (
            <Card
              style={{
                width: "100%",
                margin: "auto",
                backgroundColor: "#FAFAFA",
                marginTop: "1rem",
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
                  {isAdding ? "Add" : "Modify"} Doctor Details
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
                initialValues={{
                  mobile: {
                    code: "+91",
                  },
                  status: 1,
                }}
              >
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="_id" name="_id" hidden>
                      <Input disabled />
                    </Form.Item>
                  </Col>
                </Row>

                <Row>
                  <Col span={12}>
                    <Form.Item
                      label="Name"
                      name="name"
                      rules={[
                        {
                          required: true,
                          message: "Please enter name !",
                        },
                      ]}
                      labelCol={{ span: 5, offset: 2 }}
                    >
                      <Input placeholder="Enter name" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Reg. No."
                      name="reg_no"
                      rules={[
                        {
                          required: true,
                          message: "Please enter registration no !",
                        },
                        {
                          pattern: /^[a-zA-Z0-9\s()_,&-]/,
                          message: "Special character not allowed",
                        },
                      ]}
                      labelCol={{ span: 5, offset: 2 }}
                    >
                      <Input placeholder="Enter registration no." />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <Form.Item
                      label="Specialization"
                      name="specialization"
                      rules={[
                        {
                          required: true,
                          message: "Please enter specialization !",
                        },
                        {
                          max: 100,
                          message: "Name must not exceed 100 characters!",
                        },
                        {
                          pattern: /^[a-zA-Z0-9\s()_,&-]/,
                          message: "Special character not allowed",
                        },
                      ]}
                      labelCol={{ span: 5, offset: 2 }}
                    >
                      {/* <Input placeholder="Enter specialization" /> */}
                      <Select placeholder="Select Specialization">
                  {specializationList?.map(s=>(
                    <Option key={s._id} value={s.name} label={s.name} >{s.name}</Option>
                  ))}
                 </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Hospital"
                      name="hospital"
                      rules={[
                        {
                          required: true,
                          message: "Please enter hospital !",
                        },
                        {
                          max: 100,
                          message: "Name must not exceed 100 characters!",
                        },
                        {
                          pattern: /^[a-zA-Z0-9\s()_,&-]/,
                          message: "Special character not allowed",
                        },
                      ]}
                      labelCol={{ span: 5, offset: 2 }}
                    >
                      <Input placeholder="Enter hospital name" />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <Form.Item
                      label="Experience"
                      name="exp"
                      rules={[
                        {
                          required: true,
                          message: "Please enter experience!",
                        },
                        {
                          type: "number",
                          min: 0,
                          message: "Min exp should be greater than 0.",
                        },
                        {
                          type: "number",
                          max: 99,
                          message: "Max exp should be less than 99.",
                        },
                      ]}
                      labelCol={{ span: 5, offset: 2 }}
                    >
                      <InputNumber placeholder="Enter exp" />
                    </Form.Item>
                  </Col>
                  <Col span={12}></Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <Form.Item
                      label="Address"
                      name="address"
                      rules={[
                        {
                          required: true,
                          message: "Please enter address name !",
                        },
                        {
                          max: CONSTANTS.STRING_LEN.ADDRESS,
                          message: `Adress must not exceed ${CONSTANTS.STRING_LEN.ADDRESS} characters!`,
                        },

                        {
                          pattern: CONSTANTS.REGEX.ADDRESS,
                          message: "Please provide valid address!",
                        },
                      ]}
                      labelCol={{ span: 5, offset: 2 }}
                    >
                      <TextArea
                        showCount
                        maxLength={CONSTANTS.STRING_LEN.ADDRESS}
                        placeholder="Enter address"
                        style={{
                          height: 120,
                          resize: "none",
                        }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="State"
                      name="state"
                      rules={[
                        {
                          required: true,
                          message: "Please select state !",
                        },
                      ]}
                      labelCol={{ span: 5, offset: 2 }}
                    >
                      <Select
                        placeholder="Select State"
                        allowClear
                        style={{ width: "50%" }}
                      >
                        {STATES.map((state) => (
                          <Option
                            key={state.id}
                            value={state.id}
                            label={state.name}
                          >
                            {state.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <Form.Item
                      label="Email"
                      name="email"
                      rules={[
                        {
                          required: true,
                          message: "Please enter email!",
                        },
                        {
                          type: "email",
                          message: "Invalid email!",
                        },
                      ]}
                      labelCol={{ span: 5, offset: 2 }}
                    >
                      <Input placeholder="Enter email" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Mobile" labelCol={{ span: 5, offset: 2 }}>
                      <Space.Compact>
                        <Form.Item
                          name={["mobile", "code"]}
                          noStyle
                          rules={[
                            {
                              required: true,
                              message: "Country code is required",
                            },
                            {
                              pattern: CONSTANTS.REGEX.COUNTRY_CODE,
                              message: "Invalid country code",
                            },
                          ]}
                        >
                          {/* <Input style={{ width: "25%" }} placeholder="Code" /> */}
                          <Select
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          option.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                        defaultValue="+91"
                        placeholder="code"
                        style={{ width: "30%" }}
                        disabled
                      >
                        {codes?.map((country) => (
                          <Option
                            key={country.isoCode2}
                            value={country.countryCodes[0]}
                          >
                            {`+${country.countryCodes[0]}`}
                          </Option>
                        ))}
                      </Select>
                        </Form.Item>
                        <Form.Item
                          name={["mobile", "number"]}
                          noStyle
                          rules={[
                            {
                              required: true,
                              message: "Mobile no. is required",
                            },
                            {
                              pattern: CONSTANTS.REGEX.PHONE,
                              message: "Invalid mobile no.!",
                            },
                          ]}
                        >
                          <Input
                            placeholder="Mobile No."
                            style={{
                              width: "55%",
                            }}
                          />
                        </Form.Item>
                      </Space.Compact>
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <Form.Item
                      label="Status"
                      name="status"
                      rules={[
                        {
                          required: true,
                          message: "Please select status!",
                        },
                      ]}
                      labelCol={{ span: 5, offset: 2 }}
                    >
                      <StatusSelect
                        style={{ width: "50%" }}
                        placeholder="Select Status"
                        onChange={(value) => {
                          form.setFieldsValue({ status: value });
                        }}
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

export default Doctor;
