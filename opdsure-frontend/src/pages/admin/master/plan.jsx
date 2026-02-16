import STATES from "../../../constant/States";
import CONSTANTS from "../../../constant/Constants";
import PlanFreqSelect from "../../../components/Select/PlanFreqSelect";
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
  InputNumber,
  Divider,
} from "antd";
const { Search } = Input;
const { TextArea } = Input;
const { Option } = Select;
import axios from "axios";
import { useEffect, useState } from "react";
import {
  EditFilled,
  DeleteFilled,
  ArrowUpOutlined,
  ExclamationCircleFilled,
  MinusCircleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { PlusOutlined } from "@ant-design/icons";
import { useAuth } from "../../../context/authProvider";
import useAxiosFetch from "../../../hooks/useAxiosFetch";
import config from "../../../config/config";
import { getPlanFreqType } from "../../../utils";
const { confirm } = Modal;
import {Axios} from "../../../axios/axiosFunctions";

const Plan = () => {
  const { userid } = useAuth();
  const { data: privileges } = useAxiosFetch(
    config.GetIndividualPrivilegs +
      userid +
      "/" +
      CONSTANTS.PRIVILEGE.PROGRAMME.ADMIN.PLANS.id
  );
  const { data: corporateData } = useAxiosFetch(
    config.GetAllCorpo + "?pageSize=10000"
  );
  const [form] = Form.useForm();
  const [replicateForm] = Form.useForm();
  const [selectedData, setSelectedData] = useState([]);
  const [selectedCorpId, setSelectedCorpId] = useState(null);
  const [plan, setPlan] = useState([]);
  const [search, setSearch] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [sortOrder, setSortOrder] = useState(1);
  const [subscriberType, setSubscriberType] = useState(null);
  const [planType, setPlanType] = useState(null);
  const [claimCombination, setClaimCombination] = useState(CONSTANTS.CLAIM_COMBINATION.SEPERATE);
  const [subscriberTypeFilter, setSetSubscriberTypeFilter] = useState(
    CONSTANTS.SUBSCRIBER_TYPE.INDIVIDUAL
  );
  const [corporateFilter, setCorporateFilter] = useState(undefined);
  const initialMembershipOptions = Object.keys(
    CONSTANTS.MEMBERSHIP_OPTIONS
  ).map((key) => ({
    membership_id: CONSTANTS.MEMBERSHIP_OPTIONS[key].id,
    membership_label: CONSTANTS.MEMBERSHIP_OPTIONS[key].name,
    member_count: CONSTANTS.MEMBERSHIP_OPTIONS[key].member_count,
    charges: 0,
    wallet_balance: 0,
  }));
  //   const [stateSortOrder, setStateSortOrder] = useState(1);
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
  }, [
    pagination.currentPage,
    pagination.pageSize,
    sortOrder,
    subscriberTypeFilter,
    corporateFilter,
  ]);

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
      const response = await axios.get(`${config.ApiBaseUrl}${config.GetAllPlan}`, {
        params: {
          search: search || undefined,
          page: pagination.currentPage,
          pageSize: pagination.pageSize,
          sortBy: "name",
          sortOrder: sortOrder,
          corporateFilter,
          subscriberTypeFilter,
        },
      });
       const updatedRecords = response.data.data.records.map(record => {
        const updatedMembershipOptions = record.membership_options.map(option => {
          const { charges_incl_GST, ...rest } = option;
          return rest; 
        });
        return { ...record, membership_options: updatedMembershipOptions };
      });
  
      setPlan(updatedRecords);
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
              await axios.post(config.AddPlan, values);
              form.resetFields();
              notification.success({
                message: "Plan details added.",
                // description: "Successfully",
              });
              fetchAll();
              setSubscriberType(null);
            } catch (error) {
              notification.error({
                message: "Failed to add plan.",
                description: "Try Again!",
              });
            }
          }
          if (isEditing && !isAdding) {
            const { _id, ...restValues } = values;
            try {
              await axios.patch(config.EditPlan + values._id, restValues);
              handleReset();
              notification.success({
                message: "Success",
                description: "Record updated.",
              });
              setSubscriberType(null);
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
    setSubscriberType(record.subscriber_type);
    setClaimCombination( record.claim_combination);
    form.setFieldsValue({
      _id: record._id,
      name: record.name,
      charges: record.charges,
      frequency: record.frequency,
      plan_benefits: record.plan_benefits,
      membership_options: record.membership_options,
      subscriber_type: record.subscriber_type,
      corporate:
        record.subscriber_type === CONSTANTS.SUBSCRIBER_TYPE.CORPORATE
          ? record.corporate._id
          : null, 
      claim_combination: record.claim_combination,     
      opd_max_discount: record.opd_max_discount,
      opd_precent_discount: record.opd_precent_discount,
      lab_max_discount: record.lab_max_discount,
      lab_precent_discount: record.lab_precent_discount,
      pharmacy_max_discount: record.pharmacy_max_discount,
      pharmacy_precent_discount: record.pharmacy_precent_discount,
      combined_lab_plus_test_percent: record.combined_lab_plus_test_percent,
      combined_lab_plus_test_max_discount: record.combined_lab_plus_test_max_discount,
    });
   
      setIsEditing(true);
      setIsAdding(false);
      setIsViewing(false);
    
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };

  const removeNullOrUndefined = (obj) => {
    return Object.fromEntries(
      Object.entries(obj).filter(([key, value]) => value != null)
    );
  };

  const handleView = (record) => {
    const {corporate, name, files, _id, __v, updatedAt, createdAt, ...recordWithoutCorporate} = record;
    const cleanedRecord = removeNullOrUndefined(recordWithoutCorporate);
    setSelectedData(cleanedRecord);
    setSelectedCorpId(record?.corporate?._id);
    setSubscriberType(record.subscriber_type);
    setClaimCombination( record.claim_combination);
    form.setFieldsValue({
      _id: record?._id,
      name: record?.name,
      charges: record?.charges,
      frequency: record?.frequency,
      plan_benefits: record?.plan_benefits,
      membership_options: record?.membership_options,
      subscriber_type: record?.subscriber_type,
      corporate:
        record?.subscriber_type === CONSTANTS.SUBSCRIBER_TYPE.CORPORATE
          ? record?.corporate._id
          : null,      
      claim_combination: record?.claim_combination,
      opd_max_discount: record?.opd_max_discount,
      opd_precent_discount: record?.opd_precent_discount,
      lab_max_discount: record?.lab_max_discount,
      lab_precent_discount: record?.lab_precent_discount,
      pharmacy_max_discount: record?.pharmacy_max_discount,
      pharmacy_precent_discount: record?.pharmacy_precent_discount,
      combined_lab_plus_test_percent: record?.combined_lab_plus_test_percent,
      combined_lab_plus_test_max_discount: record?.combined_lab_plus_test_max_discount,
    });
    
      setIsViewing(true);
      setIsEditing(false);
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
          await axios.delete(config.DeletePlan + record._id);
          notification.success({
            message: "Success",
            description: "Record deleted Successfully.",
          });
          fetchAll();
        } catch (error) {
          notification.error({
            message: "Failed",
            description: "Record can't be deleted, it is already in use.",
          });
        }
      },
      onCancel() {},
    });
  };
  const onSearch = async () => {
    await fetchAll();
  };
  const handleReset = () => {
    setIsAdding(false);
    setIsEditing(false);
    setIsViewing(false)
    setSubscriberType(null);
    setClaimCombination( null);
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
          Plan Name
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
      align: "left",
    },
    {
      title: "Organization",
      dataIndex: ["corporate"],
      key: "corporate",
      width: "10%",
      render: (_, record, index) =>
        record.subscriber_type === CONSTANTS.SUBSCRIBER_TYPE.CORPORATE
          ? record.corporate?.name || ""
          : "-",
      align: "left",
    },
    {
      title: "Frequency",
      dataIndex: "frequency",
      key: "frequency",
      width: "10%",
      align: "left",
      render: (text, record) => getPlanFreqType(record.frequency),
    },

    {
      title: "Action",
      dataIndex: "action",
      align: "center",
      key: "action",
      width: "15%",
      hidden: !privileges?.PATCH && !privileges?.DELETE,
      render: (_, record) => (
        <>
          <EyeOutlined
            type="primary"
            style={{
              marginRight: "15px",
              color: "blue",
              textAlign: "center",
            }}
            onClick={()=>{handleView(record); }}
          />
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

  // const [rowSelection, setRowSelection] = useState(null);
  // const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  // const [selectAllToggle, setSelectAllToggle] = useState(false);
 

  // useEffect(() => {
  //   if (subscriberTypeFilter === CONSTANTS.SUBSCRIBER_TYPE.CORPORATE) {
  //     setRowSelection({
  //       onChange: (selectedRowKeys, selectedRows) => {
  //         setSelectedRowKeys(selectedRowKeys);
  //         setSelectedData(selectedRows);
  //       },
  //     });
  //   } else {
  //     setRowSelection(null);
  //   }
  // }, [subscriberTypeFilter, corporateFilter]);


  const handleCopy = async () => {
    confirm({
      title: (
        <>
          <p>Are you sure you want to make a copy?</p>
          <p>If yes, then select the organization where you want to replicate the plan.</p>
        </>
      ),
      icon: <ExclamationCircleFilled />,
      centered: true,
      content: (
        <Form form={replicateForm} layout="vertical">
          <Form.Item
            name="organization"
            label="Select Organization"
            rules={[{ required: true, message: 'Please select an organization.' }]}
          >
            <Select
              className="mb-3"
              placeholder="Select Organization"
            >
           
            {corporateData?.records?.filter((corp) => corp._id !== selectedCorpId)?.map((corp) => (
              <Option key={corp._id} value={corp._id}>
               {corp.name}
              </Option>
            ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="planName"
            label="Enter Plan Name"
            rules={[{ required: true, message: 'Please enter a plan name.' }]}
          >
            <Input placeholder="Enter plan name" />
          </Form.Item>
        </Form>
      ),
      async onOk() {
        await replicateForm.validateFields();
        try {
          const values = await replicateForm.validateFields();
          const response = await Axios.postAxiosData(config.AddPlan, {
            corporate: values.organization,
            name: values.planName,
            ...selectedData, 
          });

          if (response.success === true) {
            notification.success({
              message: "Plan Replicated Successfully",
            });

            replicateForm.resetFields();
            fetchAll();
          }
          else{
            notification.error({
              message: "An error occurred while replicating the plan.",
            });
          }
        } catch (error) {
          console.error("Validation Failed:", error);
          notification.error({
            message: "An error occurred while replicating the plan.",
            description: error.message,
          });
        }
      },
      onCancel() {},
    });
  };

  return (
    <>
      <div style={{ padding: "1rem" }}>
        <Row justify={"start"}>
          <h4 style={{ fontWeight: "bold"}} className="textblue">Plan Master</h4>
        </Row>
        <Row justify="end">
          {/* {selectedRowKeys.length > 0 ? (
            <Col span={2} style={{ marginRight: "1rem" }}>
            <Button type="primary" onClick={handleCopy} size="small">
             Make Copy
            </Button>
           </Col>
          ):""} */}
          
          <Col span={4} style={{ marginRight: "1rem" }}>
            <Select
              defaultValue={CONSTANTS.SUBSCRIBER_TYPE.INDIVIDUAL}
              placeholder="Select Subscriber type"
              options={[
                {
                  value: CONSTANTS.SUBSCRIBER_TYPE.INDIVIDUAL,
                  label: "Retailer",
                },
                {
                  value: CONSTANTS.SUBSCRIBER_TYPE.CORPORATE,
                  label: "Corporate",
                },
              ]}
              onChange={(value) => {
                setSetSubscriberTypeFilter(value);
                if (value !== CONSTANTS.SUBSCRIBER_TYPE.CORPORATE) {
                  setCorporateFilter(undefined);
                }
              }}
              style={{ width: "100%" }}
            />
          </Col>
          <Col span={6} style={{ marginRight: "1rem" }}>
            <Select
              style={{ width: "100%" }}
              placeholder="Select Organization"
              onChange={(value) => setCorporateFilter(value)}
              disabled={
                subscriberTypeFilter !== CONSTANTS.SUBSCRIBER_TYPE.CORPORATE
              }
            >
              {corporateData?.records?.map((corp) => (
                <Option key={corp._id} value={corp._id}>
                  {corp.name}
                </Option>
              ))}
            </Select>
          </Col>

          <Col span={6}>
            <Search
              placeholder="Search Plan"
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
          dataSource={plan}
          size="small"
          rowKey={(record) => record._id}
          pagination={false}
          align="right"
          style={{
            marginBottom: "1rem",
          }}
          // rowSelection={rowSelection}
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
          {!isAdding && !isEditing && !isViewing && privileges?.POST && (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Button
                onClick={() => {
                  setIsAdding(true);
                  setIsEditing(false);
                  setIsViewing(false);
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
                  Add Plan
                </div>
              </Button>
            </div>
          )}

          {(isAdding || isEditing || isViewing) && (
            <Card
              style={{
                width: "100%",
                margin: "auto",
                marginTop: "2rem",
                backgroundColor: "#FAFAFA",
              }}
            >
              <Row justify={"start"}>
                <h4
                  style={{
                    fontWeight: "bold",
                    marginTop: "1rem",
                    marginBottom: "2.5rem",
                  }}
                  className="textblue"
                >
                  {isViewing ? "View" : isAdding ? "Add" : "Modify"} Plan Details
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
                disabled={isViewing}
                initialValues={{                  
                  plan_benefits: Array.from({ length: 1 }, () => ({ plan_label: "", plan_feature: "" })),
                  claim_combination: CONSTANTS.CLAIM_COMBINATION.SEPERATE,
                  membership_options: initialMembershipOptions,
                }}
              >
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="_id" name="_id" hidden>
                      <Input disabled />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={5}>
                    <Form.Item
                      label="Subscriber Type"
                      name="subscriber_type"
                      rules={[
                        {
                          required: true,
                          message: "Please select subscriber type",
                        },
                      ]}
                    >
                      <Select
                        placeholder="Select Subscriber type"
                        options={[
                          {
                            value: CONSTANTS.SUBSCRIBER_TYPE.INDIVIDUAL,
                            label: "Retailer",
                          },
                          {
                            value: CONSTANTS.SUBSCRIBER_TYPE.CORPORATE,
                            label: "Corporate",
                          },
                        ]}
                        onChange={(value) => setSubscriberType(value)}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                {subscriberType === CONSTANTS.SUBSCRIBER_TYPE.CORPORATE && (
                  <Row>
                    <Col span={12}>
                      <Form.Item
                        label="Organization Name"
                        name="corporate"
                        rules={[
                          {
                            required: true,
                            message: "Please select organization",
                          },
                        ]}
                        // labelCol={{ span: 5, offset: 2 }}
                      >
                        <Select
                          style={{ width: "100%" }}
                          placeholder="Select Organization"
                        >
                          {corporateData?.records.map((corp) => (
                            <Option key={corp._id} value={corp._id}>
                              {corp.name}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                )}
                    <Row gutter={16}>
                  <Col span={14}>
                    <Form.Item
                      label="Plan Name"
                      name="name"
                      rules={[
                        {
                          required: true,
                          message: "Please enter plan name !",
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
                      // labelCol={{ span: 5, offset: 2 }}
                    >
                      <Input placeholder="Add plan name" />
                    </Form.Item>
                  </Col>
                  <Col span={5}>
                    <Form.Item
                      label="Tenure"
                      name="frequency"
                      rules={[
                        {
                          required: true,
                          message: "Please select frequency !",
                        },
                      ]}
                      // labelCol={{ span: 5, offset: 2 }}
                    >
                      <PlanFreqSelect
                        placeholder="Select plan frequency"
                        onChange={(value) =>
                          form.setFieldsValue({ frequency: value })
                        }
                      />
                    </Form.Item>
                  </Col>
                </Row>
                {
                  <Row gutter={0} style={{margin:0}}>
                     <Divider />
                    <Col span={24}>
                      <h5 style={{ fontWeight: "bold" }} className="textblue mb-3">Membership Options</h5>
                      <Form.List name="membership_options">
                        {(fields, { add, remove }) => (
                          <>
                            {fields.map(
                              ({ key, name, ...restField }, index) => (
                                <Row
                                  key={key}
                                  gutter={0}
                                  align="middle"
                                  // style={{ marginBottom: 8 }}
                                >
                                  <Col span={8}>
                                    <Form.Item
                                      {...restField}
                                      name={[name, "membership_label"]}
                                      label={
                                        index === 0 ? "Membership Type" : ""
                                      }
                                      rules={[
                                        {
                                          required: true,
                                          message:
                                            "Please enter membership label",
                                        },
                                      ]}
                                      initialValue={
                                        CONSTANTS.MEMBERSHIP_OPTIONS[index]?.name
                                      }
                                      // labelCol={{ span: 5, offset: 3  }}
                                    >
                                      <Input
                                        placeholder="Enter membership label"
                                        disabled
                                      />
                                    </Form.Item>
                                  </Col>
                                  <Col
                                    span={3}
                                    style={{ marginLeft: "0.5rem" }}
                                  >
                                    <Form.Item
                                      {...restField}
                                      name={[name, "member_count"]}
                                      label={index === 0 ? "Member Count" : ""}
                                      initialValue={
                                        CONSTANTS.MEMBERSHIP_OPTIONS[index]?.member_count
                                      }
                                    >
                                      <InputNumber
                                        placeholder="Enter plan label"
                                        disabled
                                        style={{ width: "100%" }}
                                      />
                                    </Form.Item>
                                  </Col>
                                  <Col
                                    span={4}
                                    style={{ marginLeft: "0.5rem" }}
                                  >
                                    <Form.Item
                                      {...restField}
                                      name={[name, "charges"]}
                                      label={index === 0 ? "Plan Charges (₹)" : ""}
                                      rules={[
                                        {
                                          required: true,
                                          message:
                                            "Please enter plan charges !",
                                        },
                                        {
                                          type: "number",
                                          min: 0,
                                          message: "Minimuim amount 0!",
                                        },
                                        {
                                          type: "number",
                                          max: 100000,
                                          message: "Max amount 100000!",
                                        },
                                      ]}

                                      // labelCol={{ span: 8 }}
                                    >
                                      <InputNumber
                                        precision={2}
                                        placeholder="Add plan charges"
                                        style={{ width: "100%" }}
                                      />
                                    </Form.Item>
                                  </Col>
                                  <Col
                                    span={4}
                                    style={{ marginLeft: "0.5rem" }}
                                  >
                                    <Form.Item
                                      {...restField}
                                      name={[name, "wallet_balance"]}
                                      label={
                                        index === 0 ? "Wallet Balance (₹)" : ""
                                      }
                                      rules={[
                                        {
                                          required: true,
                                          message:
                                            "Please enter wallet balance!",
                                        },
                                        {
                                          type: "number",
                                          min: 0,
                                          message: "Minimum amount 0",
                                        },
                                        {
                                          type: "number",
                                          max: 1000000,
                                          message: "Maximum amount 1000000",
                                        },
                                      ]}
                                      // labelCol={{ span: 8 }}
                                    >
                                      <InputNumber
                                        precision={2}
                                        placeholder="Add wallet balance"
                                        style={{ width: "100%" }}
                                      />
                                    </Form.Item>
                                  </Col>
                                  {/* <MinusCircleOutlined
                                    onClick={() => remove(name)}
                                    style={{
                                      marginLeft: "1rem",
                                      color: "red",
                                      marginBottom: "1.2rem",
                                    }}
                                    hidden={index === 0 || isViewing}
                                  /> */}
                                  <Col span={2}>
                                    <Form.Item
                                      {...restField}
                                      hidden
                                      name={[name, "membership_id"]}
                                      label={index === 0 ? "m_id" : ""}
                                      rules={[
                                        {
                                          required: true,
                                          message: "Please enter plan label",
                                        },
                                      ]}
                                      initialValue={index}
                                    >
                                      <Input
                                        placeholder="Enter plan label"
                                        disabled
                                      />
                                    </Form.Item>
                                  </Col>
                                </Row>
                              )
                            )}
                            {/* <Form.Item>
                              <Button
                                type="dashed"
                                onClick={() => add()}
                                block
                                icon={<PlusOutlined />}
                                style={{ width: "30%", margin: "0 auto" }}
                                hidden={
                                  fields.length >=
                                  Object.keys(CONSTANTS.MEMBERSHIP_OPTIONS)
                                    .length
                                }
                                // disabled = {planType === CONSTANTS.PLAN_TYPE.FAMILY ? fields.length >= Object.keys(CONSTANTS.MEMBERSHIP_OPTIONS).length : true }
                                // hidden = {planType === CONSTANTS.PLAN_TYPE.INDIVIDUAL }
                              >
                                Add membership options
                              </Button>
                            </Form.Item> */}
                          </>
                        )}
                      </Form.List>
                    </Col>
                  </Row>
                }

            
                <Row gutter={0}>
                  <Col span={24}>
                    <Divider />
                    <h5 style={{ fontWeight: "bold" }} className="textblue mb-3">Plan Benefits</h5>
                    <Form.List name="plan_benefits">
                      {(fields, { add, remove }) => (
                        <>
                          {fields.map(({ key, name, ...restField }, index) => (
                            <Row
                              key={key}
                              gutter={0}
                              align="middle"
                              // style={{ marginBottom: 8 }}
                            >
                              <Col span={8}>
                                <Form.Item
                                  {...restField}
                                  name={[name, "plan_label"]}
                                  label={index === 0 ? "Plan Label" : ""}
                                  rules={[
                                    {
                                      required: true,
                                      message: "Please enter plan label",
                                    },
                                  ]}
                                  // labelCol={{ span: 5, offset: 3  }}
                                >
                                  <Input placeholder="Enter plan label" />
                                </Form.Item>
                              </Col>
                              <Col span={14} style={{ marginLeft: "1rem" }}>
                                <Form.Item
                                  {...restField}
                                  name={[name, "plan_feature"]}
                                  label={index === 0 ? "Feature" : ""}
                                  rules={[
                                    {
                                      required: true,
                                      message: "Please enter feature!",
                                    },
                                  ]}
                                  // labelCol={{ span: 8 }}
                                >
                                  <Input placeholder="Enter plan feature" />
                                </Form.Item>
                              </Col>
                              <MinusCircleOutlined
                                onClick={() => remove(name)}
                                hidden={index === 0 || isViewing}
                                style={{
                                  marginLeft: "1rem",
                                  color: "red",
                                  marginBottom: "1.2rem",
                                }}
                              />
                            </Row>
                          ))}
                          <Form.Item>
                            <Button
                              type="dashed"
                              onClick={() => add()}
                              block
                              icon={<PlusOutlined />}
                              style={{ width: "30%", margin: "0 auto" }}
                              disabled={fields.length >= 20 || isViewing}
                            >
                              Add plan benefits
                            </Button>
                          </Form.Item>
                        </>
                      )}
                    </Form.List>
                    </Col>
                    </Row>
                    <Divider />
                    <h5 style={{ fontWeight: "bold", marginBottom: "2rem" }} className="textblue mb-3">Parameters for Claims</h5>
                    <Row>
                      <Col span={7}>
                      <Form.Item
                         label="Claim Combination"
                         name="claim_combination"
                         rules={[
                          {
                            required: true,
                            message: "Please select claim combination",
                          },
                        ]}
                      >
                        <Select options={[{value:CONSTANTS.CLAIM_COMBINATION.SEPERATE,label:"All three parameters are individual" },
                          {value:CONSTANTS.CLAIM_COMBINATION.PHARMACY_LAB_COMBINED,label:"Combined Pharmacy and Diagnostic"}
                        ]} 
                        onChange={(value)=>{setClaimCombination(value),console.log("value for combination typr",value)}}
                        />
                      </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={100}>
                      <Col span={5}>
                      <h6 style={{ fontWeight: "bold", marginBottom: "1rem" }}>Claims Percentage</h6>
                        </Col>
                        <Col span={5}>
                        <h6 style={{ fontWeight: "bold" }}>Max. Limit</h6>
                      </Col>
                    </Row>
                    {claimCombination===CONSTANTS.CLAIM_COMBINATION.SEPERATE&&(<><Row gutter={0}>
                      <Col span={5}>
                        <Form.Item
                          label="OPD"
                          name="opd_precent_discount"
                          rules={[
                            {
                              required: true,
                              message: "Please enter opd discount percentage",
                            },
                            {
                              type: "number",
                              min: 0,
                              message: "Minimum 0%",
                            },
                            {
                              type: "number",
                              max: 100,
                              message: "Maximum 100%",
                            },
                          ]}
                          // labelCol={{ span: 5, offset: 2 }}
                        >
                          <InputNumber style={{ width: "50%" }} precision={2} />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item
                          label=" "
                          name="opd_max_discount"
                          rules={[
                            {
                              required: true,
                              message: "Please enter max opd discount amount!",
                            },
                            {
                              type: "number",
                              min: 0,
                              message: "Minimum amount 0",
                            },
                            {
                              type: "number",
                              max: CONSTANTS.PLAN_DISCOUNTS.OPD_MAX_AMOUNT,
                              message: `Maximum amount ${CONSTANTS.PLAN_DISCOUNTS.OPD_MAX_AMOUNT}`,
                            },
                          ]}
                          // labelCol={{ span: 5, offset: 2 }}
                        >
                          <InputNumber precision={2} style={{ width: "50%" }} />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={16}>
                      <Col span={5}>
                        <Form.Item
                          label="Pharmacy"
                          name="pharmacy_precent_discount"
                          rules={[
                            {
                              required: true,
                              message:
                                "Please enter pharmacy discount percentage",
                            },
                            {
                              type: "number",
                              min: 0,
                              message: "Minimum 0%",
                            },
                            {
                              type: "number",
                              max: 100,
                              message: "Maximum 100%",
                            },
                          ]}
                          // labelCol={{ span: 5, offset: 2 }}
                        >
                          <InputNumber style={{ width: "50%" }} precision={2} />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item
                          label=" "
                          name="pharmacy_max_discount"
                          rules={[
                            {
                              required: true,
                              message:
                                "Please enter max pharmacy discount amount!",
                            },
                            {
                              type: "number",
                              min: 0,
                              message: "Minimum amount 0",
                            },
                            {
                              type: "number",
                              max: CONSTANTS.PLAN_DISCOUNTS
                                .PHARMACY_MAX_DISCOUNT,
                              message: `Maximum amount ${CONSTANTS.PLAN_DISCOUNTS.PHARMACY_MAX_DISCOUNT}`,
                            },
                          ]}
                          // labelCol={{ span: 5, offset: 2 }}
                        >
                          <InputNumber precision={2} style={{ width: "50%" }} />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={16}>
                      <Col span={5}>
                        <Form.Item
                          label="Lab"
                          name="lab_precent_discount"
                          rules={[
                            {
                              required: true,
                              message: "Please enter lab discount percentage",
                            },
                            {
                              type: "number",
                              min: 0,
                              message: "Minimum 0%",
                            },
                            {
                              type: "number",
                              max: 100,
                              message: "Maximum 100%",
                            },
                          ]}
                          // labelCol={{ span: 5, offset: 2 }}
                        >
                          <InputNumber style={{ width: "50%" }} precision={2} />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item
                          label=" "
                          name="lab_max_discount"
                          rules={[
                            {
                              required: true,
                              message: "Please enter max lab discount amount!",
                            },
                            {
                              type: "number",
                              min: 0,
                              message: "Minimum amount 0",
                            },
                            {
                              type: "number",
                              max: CONSTANTS.PLAN_DISCOUNTS.LAB_MAX_DISCOUNT,
                              message: `Maximum amount ${CONSTANTS.PLAN_DISCOUNTS.LAB_MAX_DISCOUNT}`,
                            },
                          ]}
                          // labelCol={{ span: 5, offset: 2 }}
                        >
                          <InputNumber precision={2} style={{ width: "50%" }} />
                        </Form.Item>
                      </Col>
                    </Row></>)}
                    {claimCombination===CONSTANTS.CLAIM_COMBINATION.PHARMACY_LAB_COMBINED &&(<><Row gutter={0}>
                      <Col span={5}>
                        <Form.Item
                          label="OPD"
                          name="opd_precent_discount"
                          rules={[
                            {
                              required: true,
                              message: "Please enter opd discount percentage",
                            },
                            {
                              type: "number",
                              min: 0,
                              message: "Minimum 0%",
                            },
                            {
                              type: "number",
                              max: 100,
                              message: "Maximum 100%",
                            },
                          ]}
                          // labelCol={{ span: 5, offset: 2 }}
                        >
                          <InputNumber style={{ width: "50%" }} precision={2} />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item
                          label=" "
                          name="opd_max_discount"
                          rules={[
                            {
                              required: true,
                              message: "Please enter max opd discount amount!",
                            },
                            {
                              type: "number",
                              min: 0,
                              message: "Minimum amount 0",
                            },
                            {
                              type: "number",
                              max: CONSTANTS.PLAN_DISCOUNTS.OPD_MAX_AMOUNT,
                              message: `Maximum amount ${CONSTANTS.PLAN_DISCOUNTS.OPD_MAX_AMOUNT}`,
                            },
                          ]}
                          // labelCol={{ span: 5, offset: 2 }}
                        >
                          <InputNumber precision={2} style={{ width: "50%" }} />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={16}>
                      <Col span={5}>
                        <Form.Item
                          label="Combined Pharm and Lab"
                          name="combined_lab_plus_test_percent"
                          rules={[
                            {
                              required: true,
                              message:
                                "Please enter pharmacy discount percentage",
                            },
                            {
                              type: "number",
                              min: 0,
                              message: "Minimum 0%",
                            },
                            {
                              type: "number",
                              max: 100,
                              message: "Maximum 100%",
                            },
                          ]}
                          // labelCol={{ span: 5, offset: 2 }}
                        >
                          <InputNumber style={{ width: "50%" }} precision={2} />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item
                          label=" "
                          name="combined_lab_plus_test_max_discount"
                          rules={[
                            {
                              required: true,
                              message:
                                "Please enter max pharmacy discount amount!",
                            },
                            {
                              type: "number",
                              min: 0,
                              message: "Minimum amount 0",
                            },
                            {
                              type: "number",
                              max: CONSTANTS.PLAN_DISCOUNTS
                                .PHARMACY_MAX_DISCOUNT,
                              message: `Maximum amount ${CONSTANTS.PLAN_DISCOUNTS.PHARMACY_MAX_DISCOUNT}`,
                            },
                          ]}
                          // labelCol={{ span: 5, offset: 2 }}
                        >
                          <InputNumber precision={2} style={{ width: "50%" }} />
                        </Form.Item>
                      </Col>
                    </Row></>)}
               

                <Row justify="center" style={{ paddingTop: "1rem" }}>
                  <Col>
                    <Form.Item hidden={isViewing}>
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
              <Row
                justify="center"
                style={{ paddingTop: "1rem" }}
                hidden={isAdding || isEditing}
              >
                <Col>
                  <Button
                    danger
                    htmlType="button"
                    onClick={() => setIsViewing(false)}
                    className="me-3"
                  >
                    Cancel
                  </Button>
                </Col>
{
 subscriberTypeFilter == CONSTANTS.SUBSCRIBER_TYPE.CORPORATE && (
    <Col span={2} style={{ marginRight: "1rem" }}>
    <Button type="primary" onClick={handleCopy} >
       Replicate Plan
    </Button>
</Col>
  )
}
              </Row>
            </Card>
          )}
        </div>
      </div>
    </>
  );
};

export default Plan;
