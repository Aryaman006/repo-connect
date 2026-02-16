import { useEffect, useState } from "react";
import useAxiosFetch from "../../../hooks/useAxiosFetch";
import axios from "axios";
import dayjs from "dayjs";
import CouponStatusSelect from "../../../components/Select/CouponStatusSelect";
import DiscountSelect from "../../../components/Select/DiscountSelect";
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
  Radio,
  DatePicker,
  InputNumber,
} from "antd";
import {
  EditFilled,
  DeleteFilled,
  ArrowUpOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import { PlusOutlined } from "@ant-design/icons";
const { Search } = Input;
const { Option } = Select;
const { confirm } = Modal;
const { TextArea } = Input;
import { useAuth } from "../../../context/authProvider";
import config from "../../../config/config";
import CONSTANTS from "../../../constant/Constants";
import exportFunction from "../../../utils/export";
import {
  getCouponUsageType,
  getCouponDiscType,
  getCouponType,
} from "../../../utils";

const Coupon = () => {
  const { userid } = useAuth();
  const { data: privileges } = useAxiosFetch(
    config.GetIndividualPrivilegs +
      userid +
      "/" +
      CONSTANTS.PRIVILEGE.PROGRAMME.ADMIN.COUPONS.id
  );
  const { data:Corporates } = useAxiosFetch( config.GetAllCorpo + "?pageSize=1000");
  const [form] = Form.useForm();
  const [test, setTest] = useState([]);
  const [search, setSearch] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [sortOrder, setSortOrder] = useState(1);
  const [couponData, setCouponData] = useState([]);
  const [total, setTotal] = useState(0);
  const [couponType, setCouponType] = useState(CONSTANTS.COUPON_TYPE.INDIVIDUAL);
  const [couponTypeFilter, setCouponTypeFilter] = useState(CONSTANTS.COUPON_TYPE.INDIVIDUAL);
  const [couponUsageTypeFilter, setCouponUsageTypeFilter] = useState(CONSTANTS.COUPON_USAGE_TYPE.SINGLE);
  const [pagination, setPagination] = useState({
    totalRecords: 0,
    pageSize: 10,
    totalPages: 0,
    currentPage: 1,
    nextPage: null,
    prevPage: null,
  });
  const [discountType, setDiscountType] = useState(
    CONSTANTS.COUPON_DISC_TYPE.PERCENT
  );
  const [couponUsageType, setCouponUsageType] = useState(
    CONSTANTS.COUPON_USAGE_TYPE.SINGLE
  );

  useEffect(() => {
    fetchAll();
  }, [pagination.currentPage, pagination.pageSize, sortOrder, couponTypeFilter, couponUsageTypeFilter]);

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
      const response = await axios.get(`${config.ApiBaseUrl}${config.GetAllCoupons}`, {
        params: {
          search: search || undefined,
          page: pagination.currentPage,
          pageSize: pagination.pageSize,
          sortBy: "name",
          sortOrder: sortOrder,
          CouponType: couponTypeFilter,
          UsageType: couponUsageTypeFilter
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

  const fetchAllCoupon = async () => {
    try {
      const response = await axios.get(`${config.ApiBaseUrl}${config.GetAllCouponsList}`, {

      });
      const filteredRecords =
      response?.data?.data?.records?.map((record) => ({
      coupon_type: GetCouponType(record.coupon_type),
      name: record.name,
      // coupon_code: record.preCode + record.postCode,
      start_date: dayjs(record.start_date).format("DD/MM/YYYY"),
      end_date: dayjs(record.end_date).format("DD/MM/YYYY"),
      discount_type: GetDiscountType(record.discount_type),
      discount: record.discount,
      usage_type: GetUsageType(record.usage_type),
      usage: record.usage,
      terms: record.terms,
      })) || [];
      setCouponData(filteredRecords);
      setTotal(response?.data?.data?.pagination.totalRecords);
    } catch (error) {
      if (error?.request?.status === 401) {
        notification.error({
          message: error?.response?.data?.error,
          description: "Please contact system admin !",
        });
      }
    }
  };

  useEffect(()=>{
    fetchAllCoupon()
  },[])
  
  const GetCouponType = (status) => {
    switch (status) {
      case CONSTANTS.PLAN_TYPE.INDIVIDUAL:
        return "Individual";
      case CONSTANTS.PLAN_TYPE.FAMILY:
        return "Family";
      default:
        return "Unknown Type";
    }
  };

  const GetDiscountType = (status) => {
    switch (status) {
      case CONSTANTS.COUPON_DISC_TYPE.AMOUNT:
        return "Amount";
      case CONSTANTS.COUPON_DISC_TYPE.PERCENT:
        return "Percent";
      default:
        return "Unknown Type";
    }
  };

  const GetUsageType = (status) => {
    switch (status) {
      case CONSTANTS.COUPON_USAGE_TYPE.SINGLE:
        return "Single";
      case CONSTANTS.COUPON_USAGE_TYPE.MULTIPLE:
        return "Multiple";
      default:
        return "Unknown Type";
    }
  };

  const pdftitle = "Coupon List";
  const ExportFileName = "Coupon_List";

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
    "Coupon Name",
    "Coupon Type",
    // "Coupon Code",
    "Discount Type",
    "Dscount",
    "Start Date",
    "End Date",
    "Usage Type",
    "Coupon Usage",
    "T&C",
  ];

  const dataWithHeaders = [
    headers,
    ...couponData?.map((item, index) => [
      index + 1,
      item.name,
      item.coupon_type,
      // item.preCode + item.postCode,
      item.discount_type,
      item.discount,
      item.start_date,  
      item.end_date, 
      item.usage_type,
      item.usage,
      item.terms,
    ]),
  ];

  const pdfData = couponData?.map((item, index) => [
    index + 1,
    item.name,
    item.coupon_type,
    // item.preCode + item.postCode,
    item.discount_type,
    item.discount,
    item.start_date,  
    item.end_date, 
    item.usage_type,
    item.usage,
    item.terms,
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
                await axios.post(config.AddCoupon, {
                    coupon_type: values.coupon_type,
                    ...(values.coupon_type === CONSTANTS.COUPON_TYPE.CORPORATE && { corporate: values.corporate }),
                    name: values.name,
                    coupon_code: values.preCode + values.postCode,
                    discount_type: values.discount_type,
                    discount: values.discount,
                    start_date: values.start_date,
                    end_date: values.end_date,
                    usage_type: values.usage_type,
                    ...(values.usage_type === CONSTANTS.COUPON_USAGE_TYPE.MULTIPLE && {
                        usage: values.usage,
                    }),
                    terms: values.terms,
                    count: values.count, // Add count to payload
                });

                notification.success({
                    message: "Coupon details added.",
                });
                fetchAll();
            } catch (error) {
                notification.error({
                    message: "Failed",
                    description: error.response.data.message,
                });
            }
        }
          // if (isAdding && !isEditing) {
          //   try {
          //     await axios.post(config.AddCoupon, {
          //       coupon_type: values.coupon_type,
          //       ...(values.coupon_type === CONSTANTS.COUPON_TYPE.CORPORATE && { corporate: values.corporate, }),
          //       name: values.name,
          //       coupon_code: values.preCode + values.postCode,
          //       discount_type: values.discount_type,
          //       discount: values.discount,
          //       start_date: values.start_date,
          //       end_date: values.end_date,
          //       usage_type: values.usage_type,
          //       ...(values.usage_type ===
          //         CONSTANTS.COUPON_USAGE_TYPE.MULTIPLE && {
          //         usage: values.usage,
          //       }),
          //       terms: values.terms,
          //     });
          //     // form.resetFields();
          //     notification.success({
          //       message: "Coupon details added.",
          //     });
          //     fetchAll();
          //   } catch (error) {
          //     notification.error({
          //       message: "Failed",
          //       description: error.response.data.message,
          //     });
          //   }
          // }
          if (isEditing && !isAdding) {
            try {
              await axios.patch(config.EditCoupon + values._id, {
                coupon_type: values.coupon_type,
                ...(values.coupon_type === CONSTANTS.COUPON_TYPE.CORPORATE && { corporate: values.corporate, }),
                name: values.name,
                discount_type: values.discount_type,
                discount: values.discount,
                start_date: values.start_date,
                end_date: values.end_date,
                usage_type: values.usage_type,
                ...(values.usage_type ===
                  CONSTANTS.COUPON_USAGE_TYPE.MULTIPLE && {
                  usage: values.usage,
                }),
                terms: values.terms,
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

  //extracting id for edit
  const handleEdit = (record) => {
    form.setFieldsValue({
      _id: record._id,
      coupon_type: record.coupon_type,
      name: record.name,
      corporate: record.corporate,
      coupon_code: record.preCode + record.postCode,
      preCode: record.coupon_code.substring(0, 4),
      postCode: record.coupon_code.substring(4),
      discount_type: record.discount_type,
      discount: record.discount,
      start_date: dayjs(record.start_date),
      end_date: dayjs(record.end_date),
      usage_type: record.usage_type,
      usage: record.usage,
      terms: record.terms,
      status: record.status,
    });
    setCouponType(record.coupon_type)
    setCouponUsageType(record.usage_type);
    setDiscountType(record.discount_type);
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
          await axios.delete(config.DeleteCoupon + record._id);
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

  const onSearch = async () => {
    await fetchAll();
  };
  const onFinishFailed = () => {};
  const handleReset = () => {
    setIsAdding(false);
    setIsEditing(false);
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
  const disabledStartDate = (current) => {
    return current && current < dayjs().startOf("day");
  };
  const disabledEndDate = (current, start_date) => {
    if (!start_date) {
      return true;
    }
    return current && current < dayjs();
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
      // title: (
      //   <div>
      //     Coupon Name
      //     {
      //       <ArrowUpOutlined
      //         style={{ marginLeft: 12, fontSize: "1rem" }}
      //         onClick={handleSortChange}
      //         rotate={sortOrder === -1 ? 0 : 180}
      //       />
      //     }
      //   </div>
      // ),
      title: "Coupon Name",
      dataIndex: "name",
      key: "name",
      width: "10%",
      align: "left",
    },
    {
      title: "Coupon Type",
      dataIndex: "coupon_type",
      key: "coupon_type",
      width: "5%",
      align: "left",
      render: (text, record) => getCouponType(record.coupon_type),
    },
    {
      title: "Coupon Code",
      dataIndex: ["coupon_code"],
      key: "coupon_code",
      width: "5%",
      align: "left",
      render: (text, record) =>
        `${record.coupon_code.substring(0, 4)}-${record.coupon_code.substring(
          4
        )}`,
    },
    {
      title: "Discount Type",
      dataIndex: "discount_type",
      key: "discount_type",
      width: "5%",
      align: "left",
      render: (text, record) => getCouponDiscType(record.discount_type),
    },
    {
      title: "Discount",
      dataIndex: "discount",
      key: "discount",
      width: "5%",
      align: "left",
      render: (text, record) =>
        record.discount_type === CONSTANTS.COUPON_DISC_TYPE.AMOUNT
          ? `Rs. ${record.discount} `
          : `${record.discount} %`,
    },
    {
      title: (
        <div>
         Start Date
          {
            <ArrowUpOutlined
              style={{ marginLeft: 12, fontSize: "1rem" }}
              onClick={handleSortChange}
              rotate={sortOrder === -1 ? 0 : 180}
            />
          }
        </div>
      ),
      // title: "Start Date",
      dataIndex: "start_date",
      key: "start_date",
      width: "8%",
      align: "left",
      render: (text, record) => dayjs(record.start_date).format("DD/MM/YYYY"),
    },
    {
      title: "End Date",
      dataIndex: "end_date",
      key: "end_date",
      width: "5%",
      align: "left",
      render: (text, record) => dayjs(record.end_date).format("DD/MM/YYYY"),
    },
    {
      title: "Usage Type",
      dataIndex: "usage_type",
      key: "usage_type",
      width: "5%",
      align: "left",
      render: (text, record) => getCouponUsageType(record.usage_type),
    },
    {
      title: "Coupon Usage",
      dataIndex: "usage",
      key: "usage",
      width: "5%",
      align: "left",
      render: (text, record) =>
        record.usage_type === CONSTANTS.COUPON_USAGE_TYPE.MULTIPLE
          ? record.usage
          : "-",
    },
    {
      title: "T&C",
      dataIndex: "terms",
      key: "terms",
      width: "20%",
      align: "left",
    },
    {
      title: "Action",
      dataIndex: "action",
      align: "center",
      key: "action",
      width: "5%",
      hidden: !privileges?.PATCH && !privileges?.DELETE,
      render: (_, record) => (
        <>
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

  return (
    <>
      <div style={{ padding: "1rem" }}>
        <Row justify={"start"}>
          <h4 style={{ fontWeight: "bold"}} className="textblue">Coupon Master</h4>
        </Row>
        <Row justify="end">
          <Col span={4} style={{ marginRight: "1rem" }}>
            <Select
              defaultValue={CONSTANTS.COUPON_TYPE.INDIVIDUAL}
              placeholder="Select Coupon type"
              options={[
                {
                  value: CONSTANTS.COUPON_TYPE.INDIVIDUAL,
                  label: "Individual",
                },
                {
                  value: CONSTANTS.COUPON_TYPE.CORPORATE,
                  label: "Corporate",
                },
              ]}
              onChange={(value) => {
                setCouponTypeFilter(value);
              }}
              style={{ width: "100%" }}
            />
          </Col>
          <Col span={4} style={{ marginRight: "1rem" }}>
            <Select
              defaultValue={CONSTANTS.COUPON_USAGE_TYPE.SINGLE}
              placeholder="Select Coupon usage type"
              options={[
                {
                  value: CONSTANTS.COUPON_USAGE_TYPE.SINGLE,
                  label: "Single",
                },
                {
                  value: CONSTANTS.COUPON_USAGE_TYPE.MULTIPLE,
                  label: "Multiple",
                },
              ]}
              onChange={(value) => {
                setCouponUsageTypeFilter(value);
              }}
              style={{ width: "100%" }}
            />
          </Col>
          <Col span={6}>
            <Search
              placeholder="Search Coupon"
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
                          <h5>Coupon List</h5>
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
          dataSource={test}
          size="small"
          rowKey={(record) => record._id}
          pagination={false}
          align="right"
          // scroll={{
          //   y: 400,
          // }}
          // sticky={{ offsetHeader: 0 }}
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
          {!isAdding && !isEditing && privileges?.POST &&  (
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
                  Add Coupon
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
                    marginBottom: "3rem",
                  }}
                  className="textblue"
                >
                  {isAdding ? "Add" : "Modify"} Coupon
                </h4>
              </Row>

              <Form
                colon={false}
                layout="horizontal"
                labelAlign="left"
                form={form}
                name="basic"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="on"
                className=""
                initialValues={{
                  coupon_type: 1,
                  discount_type: CONSTANTS.COUPON_DISC_TYPE.PERCENT,
                  usage_type: CONSTANTS.COUPON_USAGE_TYPE.SINGLE,
                  status: CONSTANTS.COUPON_STATUS.UNUSED,
                }}
              >
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="Test Id" name="_id" hidden>
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label="Coupon Type"
                      name="coupon_type"
                      rules={[
                        {
                          required: true,
                          message: "Please select coupon type !",
                        },
                      ]}
                      labelCol={{ span: 5, offset: 2 }}
                    >
                      <Radio.Group
                      onChange={(e)=> setCouponType(e.target.value)}
                      >
                        <Radio value={CONSTANTS.COUPON_TYPE.INDIVIDUAL}>
                          Individual
                        </Radio>
                        <Radio
                          value={CONSTANTS.COUPON_TYPE.CORPORATE}
                          style={{ marginLeft: "3rem" }}
                        >
                          Corporate
                        </Radio>
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                </Row>
                {couponType === CONSTANTS.COUPON_TYPE.CORPORATE && <Row gutter={16}>
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
                        // disabled={isEditingPass}
                        style={{ width: "100%" }}
                      >
                        {Corporates.records.map((corpo) => (
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
                </Row>}
                <Row>
                  <Col span={12}>
                    <Form.Item
                      label="Coupon Name"
                      name="name"
                      rules={[
                        {
                          required: true,
                          message: "Please enter coupon name !",
                        },
                        {
                          max: 100,
                          message: "Maximum char length 100 !",
                        },
                      ]}
                      labelCol={{ span: 5, offset: 2 }}
                    >
                      <Input placeholder="Enter coupon name" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    {/* <Form.Item
                      label="Coupon Code"
                      name="name"
                      rules={[
                        {
                          required: true,
                          message: "Please enter name !",
                        },
                      ]}
                      labelCol={{ span: 5, offset: 2 }}
                    > */}
                    <Form.Item
                      disabled={isEditing}
                      label="Coupon Code"
                      style={{
                        marginBottom: 0,
                      }}
                      labelCol={{ span: 5, offset: 2 }}
                    >
                      <Form.Item
                        name="preCode"
                        disabled={isEditing}
                        rules={[
                          {
                            required: isAdding ? true : false,
                            message: "Please enter code!",
                          },
                          {
                            len: 4,
                            message: "Code should be 4 charcter long!",
                          },
                        ]}
                        style={{
                          display: "inline-block",
                          width: "calc(27% - 8px)",
                        }}
                      >
                        <Input disabled={isEditing} />
                      </Form.Item>
                      <Form.Item
                        name="postCode"
                        disabled={isEditing}
                        rules={[
                          {
                            required: isAdding ? true : false,
                            message: "Please enter code!",
                          },
                          {
                            len: 5,
                            message: "Code should be 5 charcter long!",
                          },
                        ]}
                        style={{
                          display: "inline-block",
                          width: "calc(27% - 8px)",
                          margin: "0 8px",
                        }}
                      >
                        <Input disabled={isEditing} />
                      </Form.Item>
                    </Form.Item>
                    {/* </Form.Item> */}
                  </Col>
                </Row>

                <Row>
                  <Col span={12}>
                    <Form.Item
                      label="Discount Type"
                      name="discount_type"
                      rules={[
                        {
                          required: true,
                          message: "Please select discount type!",
                        },
                      ]}
                      labelCol={{ span: 5, offset: 2 }}
                    >
                      <DiscountSelect
                        style={{ width: "42%" }}
                        placeholder="Select discount type"
                        onChange={(value) => {
                          form.setFieldsValue({ discount_type: value });
                          setDiscountType(value);
                        }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Discount"
                      name="discount"
                      rules={
                        discountType === CONSTANTS.COUPON_DISC_TYPE.AMOUNT
                          ? [
                              {
                                required: true,
                                message: "Please enter discount amount!",
                              },
                              {
                                type: "number",
                                min: 0.5,
                                message: "Min value accepted 0.5!",
                              },
                              {
                                type: "number",
                                max: 999,
                                message: "Max value accepted 999!",
                              },
                            ]
                          : [
                              {
                                required: true,
                                message: "Please enter descount percentage!",
                              },
                              {
                                type: "number",
                                min: 0.5,
                                message: "Min value accepted 0.5!",
                              },
                              {
                                type: "number",
                                max: 100,
                                message: "Max value accepted 100!",
                              },
                            ]
                      }
                      labelCol={{ span: 5, offset: 2 }}
                    >
                      <InputNumber
                        precision={2}
                        placeholder={
                          discountType === CONSTANTS.COUPON_DISC_TYPE.AMOUNT
                            ? "Amount"
                            : "Percentage"
                        }
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <Form.Item
                      label="Start Date"
                      name="start_date"
                      rules={[
                        {
                          required: true,
                          message: "Please select start date!",
                        },
                      ]}
                      labelCol={{ span: 5, offset: 2 }}
                    >
                      <DatePicker
                        format={"DD/MM/YYYY"}
                        disabledDate={disabledStartDate}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="End Date"
                      name="end_date"
                      rules={[
                        {
                          required: true,
                          message: "Please enter end date!",
                        },
                      ]}
                      labelCol={{ span: 5, offset: 2 }}
                    >
                      <DatePicker
                        format={"DD/MM/YYYY"}
                        disabledDate={(current) =>
                          disabledEndDate(
                            current,
                            form.getFieldValue("start_date")
                          )
                        }
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label="Usage Type"
                      name="usage_type"
                      rules={[
                        {
                          required: true,
                          message: "Please select usage type !",
                        },
                      ]}
                      labelCol={{ span: 5, offset: 2 }}
                    >
                      <Radio.Group
                        onChange={(value) =>
                          setCouponUsageType(value.target.value)
                        }
                      >
                        <Radio value={CONSTANTS.COUPON_USAGE_TYPE.SINGLE}>
                          Single
                        </Radio>
                        <Radio
                          value={CONSTANTS.COUPON_USAGE_TYPE.MULTIPLE}
                          style={{ marginLeft: "3rem" }}
                        >
                          Multiple
                        </Radio>
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Allowed Usage"
                      name="usage"
                      rules={[
                        {
                          required:
                            couponUsageType ===
                            CONSTANTS.COUPON_USAGE_TYPE.MULTIPLE
                              ? true
                              : false,
                          message: "Please enter usage!",
                        },
                        {
                          type: "number",
                          min: 1,
                          message: "Minimum value allowed is 1",
                        },
                      ]}
                      labelCol={{ span: 5, offset: 2 }}
                      hidden={
                        couponUsageType === CONSTANTS.COUPON_USAGE_TYPE.SINGLE
                          ? true
                          : false
                      }
                    >
                      <InputNumber />
                    </Form.Item>
                  </Col>
                </Row>
                {
                  isAdding ?
              
  <Row>
    <Col span={12}>
        <Form.Item
            label="Number of Coupons"
            name="count"
            rules={[
                {
                    required: true,
                    message: "Please enter number of coupons!",
                },
                {
                    type: "number",
                    min: 1,
                    max: 10000,
                    message: "Please enter a value between 1 and 100!",
                },
            ]}
            labelCol={{ span: 5, offset: 2 }}
        >
            <InputNumber min={1} max={10000} />
        </Form.Item>
    </Col>
</Row>
:
""
          }
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label="T&C"
                      name="terms"
                      rules={[
                        {
                          required: true,
                          message: "Please enter terms & conditions !",
                        },
                        {
                          max: CONSTANTS.STRING_LEN.CONDITIONS,
                        },
                      ]}
                      labelCol={{ span: 5, offset: 2 }}
                    >
                      <TextArea
                        rows={4}
                        showCount
                        maxLength={CONSTANTS.STRING_LEN.CONDITIONS}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <Form.Item
                      label="Status"
                      name="status"
                      labelCol={{ span: 5, offset: 2 }}
                    >
                      <CouponStatusSelect
                        style={{ width: "44%" }}
                        disabled
                        placeholder="Coupon status"
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

export default Coupon;
