import { useEffect, useState } from "react";
import useAxiosFetch from "../../../hooks/useAxiosFetch";
import CONSTANTS from "../../../constant/Constants";
import axios from "axios";
import StatusSelect from "../../../components/Select/StatusSelect";
import { getGender, getStatus } from "../../../utils";
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
  DatePicker,
  Dropdown,
  Menu,
  Upload,
  Tooltip,
} from "antd";
import dayjs from "dayjs";
import {
  EditFilled,
  DeleteFilled,
  ArrowUpOutlined,
  ExclamationCircleFilled,
  UploadOutlined,
  DownloadOutlined,
  SettingOutlined
} from "@ant-design/icons";
import { PlusOutlined } from "@ant-design/icons";
const { Search } = Input;
const { Option } = Select;
const { confirm } = Modal;
const { TextArea } = Input;
import { useAuth } from "../../../context/authProvider";
import config from "../../../config/config";
import GenderSelect from "../../../components/Select/GenderSelect";
import codes from "country-calling-code";
import CorpoEmpBulkUpload from "../../../components/CorpoEmpBulkUpload";
import exportFunction from "../../../utils/export";
const CorpoEmp = () => {
  const { userid } = useAuth();
  const { data: privileges } = useAxiosFetch(
    config.GetIndividualPrivilegs +
      userid +
      "/" +
      CONSTANTS.PRIVILEGE.PROGRAMME.ADMIN.CORPORATE_EMPLOYEE.id
  );
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [test, setTest] = useState([]);
  const [organization, setOrganization] = useState(null);
  const [organizationFilter, setOrganizationFilter] = useState("ALL");
  const [plans,setPlans] = useState([]);
  const [plansRenew,setPlansRenew] = useState([]);
  const [selectedPlan,setSelectedPlan] = useState(null);
  const [selectedPlanBulk,setSelectedPlanBulk] = useState(null);
  const [memberShipOptions, setMembershipOptions] = useState([]);
  const [corporateEmplData, setCorporateEmplData] = useState([]);
  const [total, setTotal] = useState(0);
  const [memberShipOptionsBulk, setMembershipOptionsBulk] = useState([]);
  const [selectedMemberShipOption, setSelectedMembershipOption] = useState([]);
  const [selectedMemberShipOptionBulk, setSelectedMembershipOptionBulk] = useState([]);
  const [search, setSearch] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingPass, setIsEditingPass] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [sortOrder, setSortOrder] = useState(1);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    totalRecords: 0,
    pageSize: 10,
    totalPages: 0,
    currentPage: 1,
    nextPage: null,
    prevPage: null,
  });
  const { data: corpoData } = useAxiosFetch(
    config.GetAllCorpo + "?pageSize=1000"
  );
  const fetchPlans = async () => {
    try {
      if(organization != null){
        const resp = await axios.get(config.GetPlanData,
          {params: { pageSize: 1000,
            subscriberTypeFilter: CONSTANTS.SUBSCRIBER_TYPE.CORPORATE,
            ...(organization != "null" && { corporateFilter: organization })
   },
      })
      setPlans(resp.data.data.records)
      }
      else if(organization == null && organizationFilter !== "ALL"){
        const resp = await axios.get(config.GetPlanData,
          {params: { pageSize: 1000,
            subscriberTypeFilter: CONSTANTS.SUBSCRIBER_TYPE.CORPORATE,
            ...(organizationFilter != "ALL" && { corporateFilter: organizationFilter })
   },
      })
      setPlans(resp.data.data.records)
      }
     
    } catch (error) {
      console.log("failed to fetch plans")
    } finally{
      setIsModalVisible(false);
    }
  };
  const fetchPlansRenew = async () => {
    try {
      
        const resp = await axios.get(config.GetPlanData,
          {params: { pageSize: 1000,
            subscriberTypeFilter: CONSTANTS.SUBSCRIBER_TYPE.CORPORATE,
            corporateFilter: organizationFilter
   },
      })
      setPlansRenew(resp.data.data.records)
    
     
    } catch (error) {
      console.log("failed to fetch plans")
    } finally{
      setIsModalVisible(false);
    }
  };
  const filterMembeshipOptions = () => {
    const temp = plans?.find((plan) => plan._id == selectedPlan );
    const filteredTemp = temp?.membership_options?.filter(t => t.charges >= 0 );
    setMembershipOptions(filteredTemp);
  }
  const filterMembeshipOptionsRenew = () => {
    const temp = plansRenew?.find((plan) => plan._id == selectedPlanBulk );
    const filteredTemp = temp?.membership_options?.filter(t => t.charges >= 0 );
    setMembershipOptionsBulk(filteredTemp);
  }

  const [isBulkUpload, setIsBulkUpload] = useState(false);

  useEffect(() => {
    fetchAll();
  }, [pagination.currentPage, pagination.pageSize, sortOrder,organizationFilter]);

  useEffect(() => {
    fetchPlans();
    fetchPlansRenew();
  }, [organization,organizationFilter]);
  useEffect(()=>{
    filterMembeshipOptions();

  },[selectedPlan])
  useEffect(()=>{
    filterMembeshipOptionsRenew();
  },[selectedPlanBulk])

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
     
      const response = await axios.get(`${config.ApiBaseUrl}${config.GetAllCorpoEmp}`, {
        params: {
          search: search || undefined,
          page: pagination.currentPage,
          pageSize: pagination.pageSize,
          sortBy: "name",
          organizationFilter,
          sortOrder: sortOrder,
        },
      });
      setTest(response.data.data.records);
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

  const fetchAllCorpEmp = async () => {
    try {
     
      const response = await axios.get(`${config.ApiBaseUrl}${config.GetCorpoEmp}`, {
      });
      const filteredRecords =
      response?.data?.data?.records?.map((record) => ({
                name: record.name,
                corporate: record.corporate.name,
                phone: record.phone,
                email: record.email,
                status: GetCorporateStatus(record.status),
                plan: record.plan.id.name
      })) || [];
      setCorporateEmplData(filteredRecords);
      setTotal(response?.data?.data?.totalRecords);
    } catch (error) {
      if (error?.request?.status === 401) {
        notification.error({
          message: error?.response?.data?.error,
          description: "Please contact system admin !",
        });
      }
    }
  };

  useEffect (()=>{
    fetchAllCorpEmp()
  }, [])

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

  const pdftitle = "Corporate_Employees List";
  const ExportFileName = "Corporate_Employees_List";

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
    "Organization",
    "Mobile No",
    "Email",
    "Plan",
    "Status",
  ];

  const dataWithHeaders = [
    headers,
    ...corporateEmplData?.map((item, index) => [
      index + 1,
      item.name,
      item.corporate,
      item.phone,
      item.email,
      item.plan,
      item.status,   
    ]),
  ];

  const pdfData = corporateEmplData?.map((item, index) => [
    index + 1,
    item.name,
    item.corporate,
    item.phone,
    item.email,
    item.plan,
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
          if (isAdding && !isEditing && !isEditingPass) {
            try {
              await axios.post(config.AddCorpoEmp, {
                employeeId: values.employeeId,
                name: values.name,
                corporate: values.corporate,
                designation: values.designation,
                bank_name: values.bank_name,
                department: values.department,
                address: values.address,
                dob: values.dob,
                gender: values.gender,
                phone: values.mobile.number,
                country_code: values.mobile.code,
                email: values.email,
                status: values.status,
                plan: values.plan,
                membership: values.membership
                // password: values.password
              });
              handleReset();
              notification.success({
                message: "Organization employee details added.",
                // description: "Successfully",
              });
              fetchAll();
            } catch (error) {
              notification.error({
                message: error.response.data.message,
                description: "Try Again !",
              });
            }
          } else if (isEditing && !isAdding && !isEditingPass) {
            try {
              await axios.patch(config.EditCorpoEmp + values._id, {
                employeeId: values.employeeId,
                name: values.name,
                corporate: values.corporate,
                bank_name: values.bank_name,
                designation: values.designation,
                department: values.department,
                address: values.address,
                dob: values.dob,
                gender: values.gender,
                phone: values.mobile.number,
                country_code: values.mobile.code,
                email: values.email,
                status: values.status,
                // password: values.password,
              });
              handleReset();

              notification.success({
                message: "Success",
                description: "Record updated.",
              });
              fetchAll();
            } catch (error) {
              notification.error({
                message: error.response.data.message,
                description: "Try Again !",
              });
            }
          }
          else {
            try {
              await axios.patch(config.EditCorpoEmpPassword + values._id, {
                password: values.password,
              });
              handleReset();

              notification.success({
                message: "Success",
                description: "Password updated.",
              });
              fetchAll();
            } catch (error) {
              notification.error({
                message: "Failed",
                description: "Unable to update password",
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
      employeeId: record.employeeId,
      name: record.name,
      corporate: record.corporate._id,
      designation: record.designation,
      department: record.department,
      bank_name: record.bank_name,
      address: record.address,
      dob: dayjs(record.dob),
      gender: record.gender,
      mobile: { number: record.phone, country_code: record.country_code },
      email: record.email,
      status: record.status,
    });
    setIsEditing(true);
    setIsAdding(false);
    setIsEditingPass(false);
    setOrganization(record.corporate._id)
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
          await axios.delete(config.DeleteCorpoEmpAdmin + record._id);
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

  const handleEditPass = (record) => {
    form.setFieldsValue({
      _id: record._id,
      employeeId: record.employeeId,
      name: record.name,
      corporate: record.corporate._id,
      designation: record.designation,
      department: record.department,
      bank_name: record.bank_name,
      address: record.address,
      dob: dayjs(record.dob),
      gender: record.gender,
      mobile: { number: record.phone, country_code: record.country_code },
      email: record.email,
      status: record.status,
    });
    setIsEditing(false);
    setIsEditingPass(true);
    setIsAdding(false);
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };

  const onSearch = async () => {
    await fetchAll();
  };

  const handleReset = () => {
    setIsAdding(false);
    setIsEditingPass(false);
    setIsEditing(false);
    setSelectedPlan(null);
    setPlans([]);
    setMembershipOptions([]);
    setOrganization("ALL");
    setIsBulkUpload(false);
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

  const disabledDate = (current) => {
    // return current && current > dayjs().endOf("day");
    return current && current > dayjs().subtract(18, "year");
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
    // {
    //   title: "Emp ID",
    //   dataIndex: "employeeId",
    //   key: "employeeId",
    //   width: "8%",
    //   align: "left",
    // },
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
      title: "Organization",
      dataIndex: ["corporate", "name"],
      key: "corporate",
      width: "8%",
      align: "left",
    },
    // {
    //   title: "Department",
    //   dataIndex: "department",
    //   key: "department",
    //   width: "4%",
    //   align: "left",
    // },
    {
      title: "Mobile",
      dataIndex: "phone",
      key: "phone",
      width: "10%",
      align: "left",
      render: (text, record) => `${record.country_code}-${record.phone}`,
    },

    {
      title: "Email",
      dataIndex: ["email"],
      key: "email",
      width: "10%",
      align: "left",
    },
    // {
    //   title: "Bank",
    //   dataIndex: "bank_name",
    //   key: "bank_name",
    //   width: "12%",
    //   align: "left",
    // },
    {
      title: 'Plan & Membership',
      key: 'plan',
      render: (text, record) => {
        const name  = record.plan?.id?.name;
        const membershipId = record.plan?.membership_id;
        const membershipOptions = record.plan?.id?.membership_options || [];
        const matchingMembership = membershipOptions.find(option => option.membership_id === membershipId);
        const membershipLabel = matchingMembership ? matchingMembership.membership_label : 'N/A';

        return (
          <div>
            <div>{name}</div>
            <div>{membershipLabel}</div>
          </div>
        );
      },
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
      title: "Action",
      dataIndex: "action",
      align: "center",
      key: "action",
      width: "8%",
      hidden: !privileges?.PATCH && !privileges?.DELETE,
      render: (_, record) => (
        <>
        
         {/* {privileges?.PATCH && (
            <Tooltip placement="topLeft" title={"Reset Password"}>
              <SettingOutlined
                type="primary"
                style={{
                  marginRight: "15px",
                  color: "blue",
                  textAlign: "center",
                }}
                onClick={() => handleEditPass(record)}
              />
            </Tooltip>
          )} */}
          {privileges?.PATCH && (
            <EditFilled
              type="primary"
              style={{
                marginRight: "15px",
                color: "green",
                textAlign: "center",
              }}
              onClick={() => handleEdit(record)}
            />
          )}
          {privileges?.DELETE && (
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

  // for bulk uploading

  const handleAddIndividual = () => {
    setIsAdding(true);
    setIsEditing(false);
    setIsEditingPass(false);
    setIsBulkUpload(false);
  };

  const handleBulkUpload = () => {
    setIsAdding(false);
    setIsEditing(false);
    setIsEditingPass(false);
    setIsBulkUpload(true);
  };

  // Menu items for the dropdown
  const menu = (
    <Menu>
      <Menu.Item key="individual" onClick={handleAddIndividual}>
        <PlusOutlined /> Add Individual
      </Menu.Item>
      <Menu.Item key="bulk" onClick={handleBulkUpload}>
        <UploadOutlined /> Bulk Upload
      </Menu.Item>
    </Menu>
  );
  const onSelectChange = (newSelectedRowKeys) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const start = async () => {
   confirm({
      title: "Are you sure you want to renew plan?",
      icon: <ExclamationCircleFilled />,
      okText:"Renew",
      okButtonProps: {
        disabled: !selectedPlanBulk || !setSelectedMembershipOptionBulk,
      },
      centered: true,
    
      async onOk() {
       
        try {
          await axios.post(config.RenewBulkCorpoEmpPlan,{
            corporate:organizationFilter,
            plan:selectedPlanBulk,
            membership:selectedMemberShipOptionBulk,
            employees: selectedRowKeys
          });
          notification.success({
            message: "Success",
            description: "Plan renewed Successfully.",
          });
          fetchAll();
          handleReset();
          setLoading(false);
        } catch (error) {
          notification.error({
            message: "Failed",
            description: `${error.response.data.msg}`,
          });
        }
      },
      onCancel() {setLoading(false  );handleReset(); setOrganizationFilter("ALL"); setSelectedRowKeys([]) },
    });
   
    
  };
  const hasSelected = selectedRowKeys.length > 0;
  return (
    <>
      <div style={{ padding: "1rem" }}>
        <Row justify={"start"}>
          <h4 style={{ fontWeight: "bold" }} className="textblue">
            Corporate Subscribers Master
          </h4>
        </Row>
        <Row justify="end">
          <Col span={6}>
          <Select
                        placeholder="Select Organization"
                        style={{ width: "100%" }}
                        defaultValue={"ALL"}
                        onChange={(value)=>{setOrganizationFilter(value); setSelectedRowKeys([]);}}
                      >
                            <Option value="ALL" label="ALL">
                              All
                            </Option>
                        {corpoData?.records?.map((corpo) => (
                          <Option
                            key={corpo._id}
                            value={corpo._id}
                            label={corpo.name}
                          >
                            {corpo.name}
                          </Option>
                        ))}
                      </Select>
          </Col>
          <Col span={6}>
            <Search
              placeholder="Search subscriber"
              onSearch={onSearch}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              enterButton
              style={{ marginBottom: "16px", width: "100%",marginLeft:"1rem" }}
            />
          </Col>
        </Row>
        {!loading && <Button type="primary" onClick={()=>setLoading(true)} disabled={!hasSelected || organizationFilter === "ALL" || organizationFilter ===undefined} loading={loading}>
          Renew Plan
        </Button>}
        {
          loading && 
          <>
          <Row className="mt-2">
            <Col span={8}>
            <Select
                        placeholder="Select Plan"
                        disabled={isEditingPass}
                        style={{ width: "100%", marginBottom:"1rem" }}
                        onChange={(value)=>{ 
                          setSelectedPlanBulk(value);
                          setSelectedMembershipOptionBulk(null);
                         
                        }}
                      >
                        {plansRenew?.map((plan) => (
                          <Option
                            key={plan._id}
                            value={plan._id}
                            label={plan.name}
                          >
                            {plan.name}
                          </Option>
                        ))}
                      </Select></Col>
            <Col span={10}>
            <Select
                        placeholder="Select Membership"
                        onChange={(value)=>{setSelectedMembershipOptionBulk(value)}}
                        style={{ width: "100%",marginBottom:"1.5rem",marginLeft:"1.5rem"  }}
                        disabled={!selectedPlanBulk}
                        allowClear
                      >
                        {memberShipOptionsBulk?.map((memb) => (
                         
                          <Option
                            key={memb.membership_id}
                            value={memb.membership_id}
                            label={memb.membership_label}
                          >
                            {memb.membership_label}
                          </Option>
                        ))}
                      </Select></Col>
          </Row>
         
                
                    
                      <Button
        type="primary"
        onClick={start}
        disabled={!selectedPlanBulk || selectedMemberShipOptionBulk == null}
      >
        Submit
      </Button>
                      <Button
        type="default"
        danger
        onClick={()=>{setLoading(false);selectedMemberShipOptionBulk(null);selectedPlanBulk(null);}}
       style={{marginLeft:"0.5rem"}}
      >
        Cancel
      </Button>
          </>
        }
          <div className="row d-flex justify-content-between my-4">
                        <div className="col-3">
                          <h5>Corporate Subscriber List</h5>
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
          rowSelection={rowSelection}
          bordered
          columns={columns}
          dataSource={test}
          size="small"
          rowKey={(record) => record._id}
          pagination={false}
          align="right"
          style={{
            marginBottom: "1rem",
            marginTop:"1rem"
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
              <Dropdown overlay={menu} placement="bottom">
                <Button
                  type="primary"
                  style={{ minWidth: "10rem", marginBottom: "1rem" }}
                >
                  <PlusOutlined
                    style={{
                      marginRight: "0.5rem",
                    }}
                  />
                  Add Corporate Subscriber
                </Button>
              </Dropdown>
            </div>
          )}

          {(isAdding || isEditing || isEditingPass) && (
            <Card
              style={{
                width: "100%",
                margin: "auto",
                backgroundColor: "#FAFAFA",
                marginTop: "2.5rem",
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
                  {isAdding ? "Add" : "Modify"} Corporate Subscriber Details{" "}
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
                  status: CONSTANTS.STATUS.ACTIVE,
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
                      label="Organization"
                      name="corporate"
                      rules={[
                        {
                          required: true,
                          message: "Please select organization !",
                        },
                      ]}
                      labelCol={{ span: 5, offset: 2 }}
                    >
                      <Select
                        placeholder="Select Organization"
                        disabled={isEditingPass}
                        style={{ width: "100%" }}
                        onChange={(value)=>{setOrganization(value)}}
                      >
                        {corpoData.records.map((corpo) => (
                          <Option
                            key={corpo._id}
                            value={corpo._id}
                            label={corpo.name}
                          >
                            {corpo.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
               
                </Row>
                {!isEditing && <Row>
                 
                  <Col span={12}>
                    <Form.Item
                      label="Plan"
                      name="plan"
                      rules={[
                        {
                          required: true,
                          message: "Please select plan !",
                        },
                      ]}
                      labelCol={{ span: 5, offset: 2 }}
                    >
                       <Select
                        placeholder="Select Plan"
                        disabled={isEditingPass}
                        style={{ width: "100%" }}
                        onChange={(value)=>{ setSelectedPlan(value)}}
                      >
                        {plans?.map((plan) => (
                          <Option
                            key={plan._id}
                            value={plan._id}
                            label={plan.name}
                          >
                            {plan.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Membership"
                      name="membership"
                      rules={[
                        {
                          required: true,
                          message: "Please select membership !",
                        },
                      ]}
                      labelCol={{ span: 5, offset: 2 }}
                    >
                       <Select
                        placeholder="Select Membership"
                        disabled={isEditingPass}
                        style={{ width: "100%" }}
                        // onChange={(value)=>{setOrganization(value)}}
                      >
                        {memberShipOptions?.map((memb) => (
                          <Option
                            key={memb.membership_id}
                            value={memb.membership_id}
                            label={memb.membership_label}
                          >
                            {memb.membership_label}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>}
                <Row>
                 
                  <Col span={12}>
                    <Form.Item
                      label="Employee ID"
                      name="employeeId"
                      rules={[
                        {
                          required: true,
                          message: "Please enter employeeId !",
                        },
                      ]}
                      labelCol={{ span: 5, offset: 2 }}
                    >
                      <Input
                        placeholder="Enter employeeId"
                        style={{ width: "50%" }}
                        disabled={isEditingPass}
                      />
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
                      <Input
                        placeholder="Enter user name"
                        disabled={isEditingPass}
                        style={{ width: "50%" }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Gender"
                      name="gender"
                      rules={[
                        {
                          required: true,
                          message: "Please select gender!",
                        },
                      ]}
                      labelCol={{ span: 5, offset: 2 }}
                    >
                      <GenderSelect
                        placeholder="Select Gender"
                        onChange={(value) => {
                          form.setFieldsValue({ status: value });
                        }}
                        style={{ width: "50%" }}
                        disabled={isEditingPass}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <Form.Item
                      label="Department"
                      name="department"
                      rules={[
                        {
                          required: true,
                          message: "Please enter department!",
                        },
                        {
                          pattern: /^[a-zA-Z0-9\s]{1,100}$/,
                          message: "Max length 50 char",
                        },
                        {
                          pattern: /^[a-zA-Z0-9\s()_,&-]{1,100}$/,
                          message: "Special character not allowed",
                        },
                      ]}
                      labelCol={{ span: 5, offset: 2 }}
                    >
                      <Input
                        placeholder="Enter department"
                        disabled={isEditingPass}
                        style={{ width: "50%" }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Designation"
                      name="designation"
                      rules={[
                        {
                          required: true,
                          message: "Please enter designation!",
                        },

                        {
                          max: 50,
                          message: "Designation must not exceed 50 characters!",
                        },
                        {
                          pattern: /^[a-zA-Z0-9\s()_,&-]/,
                          message: "Special character not allowed",
                        },
                      ]}
                      labelCol={{ span: 5, offset: 2 }}
                    >
                      <Input
                        placeholder="Enter designation"
                        disabled={isEditingPass}
                        style={{ width: "50%" }}
                      />
                    </Form.Item>
                  </Col>
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
                        disabled={isEditingPass}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Bank Name"
                      name="bank_name"
                      rules={[
                        {
                          required: true,
                          message: "Please enter address name !",
                        },
                        {
                          max: CONSTANTS.STRING_LEN.NAME,
                          message: `Adress must not exceed ${CONSTANTS.STRING_LEN.NAME} characters!`,
                        },
                      ]}
                      labelCol={{ span: 5, offset: 2 }}
                    >
                      <Input
                        placeholder="Enter bank name"
                        style={{ width: "50%" }}
                        disabled={isEditingPass}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <Form.Item
                      label="DOB"
                      name="dob"
                      rules={[
                        {
                          required: true,
                          message: "Please select DOB!",
                        },
                      ]}
                      labelCol={{ span: 5, offset: 2 }}
                    >
                      <DatePicker
                        format={"DD/MM/YYYY"}
                        disabledDate={disabledDate}
                        disabled={isEditingPass}
                      />
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
                          <Select
                            showSearch
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                              option.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            }
                            placeholder="code"
                            style={{ width: "30%" }}
                            disabled={isEditingPass}
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
                              width: "53%",
                            }}
                            disabled={isEditingPass}
                          />
                        </Form.Item>
                      </Space.Compact>
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
                      <Input
                        placeholder="Enter email"
                        disabled={isEditingPass}
                        style={{ width: "50%" }}

                      />
                    </Form.Item>
                  </Col>
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
                        placeholder="Select Status"
                        onChange={(value) => {
                          form.setFieldsValue({ status: value });
                        }}
                        style={{ width: "50%" }}
                        disabled={isEditingPass}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row justify={"start"}>
                {/* <Col span={12}>
                    <Form.Item
                      label="Password"
                      name="password"
                      rules={[
                        {
                          required: isEditing ? false : true,
                          message: "Please enter password !",
                        },
                      ]}
                      hasFeedback
                      labelCol={{ span: 5, offset: 2 }}
                      hidden={isEditing}
                    >
                      <Input.Password style={{ width: "50%" }} />
                    </Form.Item>
                  </Col> */}
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

          {isBulkUpload && (
          <CorpoEmpBulkUpload handleReset={handleReset}/>
          )}
        </div>
      </div>
    </>
  );
};

export default CorpoEmp;
