import React, { useState, useEffect } from "react";
import AntTable from "../../components/AntTable";
import {
  Row, Button,
  Col,
  DatePicker,
  Select,
  Input,
  Typography,
  message, Popconfirm
} from "antd";
import { EyeOutlined, DeleteOutlined  } from "@ant-design/icons";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { Axios } from "../../axios/axiosFunctions";
import config from "../../config/config";
import CONSTANTS from "../../constant/Constants";
import exportFunction from "../../utils/export";

const { RangePicker } = DatePicker;
const { Search } = Input;
const { Text } = Typography;
const SubscriberList = () => {
  const columns = [
    {
      title: "S.No",
      width: "8%",
      align: "center",
      render: (text, record, index) => {
        const calculatedIndex = (currentPage - 1) * currentpageSize + index + 1;
        return <p className="my-auto">{calculatedIndex}.</p>;
      },
    },

    {
      title: "Name",
      key: "name",
      // dataIndex: "name",
      align: "center",
      width: "25%",
      render: (record) => {
        return <div><Link to={`/admin/families/${record?._id}`}>{record?.name}</Link></div>;
      },
    },
    {
      title: "Email",
      key: "email",
      align: "center",
      width: "25%",
      render: (record) => {
        return <div>{record?.email}</div>;
      },
    },
    {
      title: "Phone",
      key: "phone",
      align: "center",
      width: "20%",
      render: (record) => {
        return <div>{record?.country_code + record?.phone}</div>;
      },
    },
    {
      title: "Subscriber Type",
      width: "15%",
       align: "center",
      render: (record) => {
        return (
          <div>
            {record?.subscriber_type=== 1 ? (
              <span>Retail</span>
            ) : (
              <span>Corporate</span>
            )}
          </div>
        );
      },
    },
    {
      title: "Status",
      width: "15%",
       align: "center",
      render: (record) => {
        return (
          <div>
            {record?.plan?.purchased === true ? (
              <span className="text-success">Paid</span>
            ) : (
              <span className="text-danger">UnPaid</span>
            )}
          </div>
        );
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      align: "middle",
      key: "action",
      width: "15%",
      render: (_, record) => (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "1rem" }}>
          <Link to={`/admin/families/${record?._id}`}>
            <EyeOutlined style={{ color: "blue" }} />
          </Link>
    
          <Popconfirm
            title="Are you sure you want to delete this user?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <DeleteOutlined style={{ color: "red", cursor: "pointer" }} />
          </Popconfirm>
        </div>
      ),
    },
  ];
  const [subscriberTypeStatus, setSubscriberTypeStatus] = useState("ALL");
  const [search, setSearch] = useState(undefined);
  const [tableData, setTableData] = useState([]);
  const [subscriberData, setSubscriberData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentpageSize, setCurrentpageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [sortOrder, setSortOrder] = useState(1);
  const [startDate, setStartDate] = useState(
    dayjs().subtract(730, "day").startOf("day").toISOString()
  );
  const [endDate, setEndDate] = useState(dayjs().toISOString());
  const fetchAllSubscriber = async () => {
    const response = await Axios.fetchAxiosData(
      config.GetRegisteredUsersAdmin,
      {
        params: {
          page: currentPage,
          pageSize: currentpageSize,
          subscriberTypeStatus,
          search,
          startDate,
          endDate,
        },
      }
    );
    if (response.success === true) {
      setTableData(response?.data?.records);
      setTotal(response?.data?.pagination.totalRecords);
    }

  };

  const handleDelete = async (id) => {
    try {
      await Axios.deleteAxiosData(`${config.DeleteRegisteredUsers}/${id}`);
      message.success("User deleted successfully");
  
      // Refetch or update local data
      fetchSubscriber(); // or your specific fetch function
    } catch (error) {
      console.error("Delete error:", error);
      message.error("Failed to delete user");
    }
  };
  
  

  const fetchSubscriber = async () => {
    const response = await Axios.fetchAxiosData(
      config.GetUsersAdmin,
    );
    
    const filteredRecords =
    response?.data?.records?.map((record) => ({
      name: record.name,
      email: record.email,
      phone: record.phone,
      subscriber_type: GetSubscriberType(record.subscriber_type),
      status: (record.plan.purchased? "PAID" : "UNPAID"),
    })) || [];
    setSubscriberData(filteredRecords);
  };

  const disabledDate = (current) => {
    return current && current >= dayjs().endOf("day");
  };

  const GetStatus = (status) => {
    switch (status) {
      case CONSTANTS.PLAN_STATUS.PAID:
        return "Paid";
      case CONSTANTS.PLAN_STATUS.UNPAID:
        return "Unpaid";
      default:
        return "Unknown Status";
    }
  };

  const GetSubscriberType = (subscriber_type) => {
    switch (subscriber_type) {
      case CONSTANTS.SUBSCRIBER_TYPE.INDIVIDUAL:
        return "Retail";
      case CONSTANTS.SUBSCRIBER_TYPE.CORPORATE:
        return "Corporate";
      default:
        return "Unknown Type";
    }
  };

  const handleDateRangeChange = (dates, dateStrings) => {
    const formattedDates = dateStrings.map((date, index) => {
      const dayjsDate = dayjs(date, "DD/MM/YYYY");
      if (index === 0) {
        return dayjsDate.startOf("day").toISOString();
      } else {
        return dayjsDate.endOf("day").toISOString();
      }
    });
    if (dates) {
      setStartDate(formattedDates[0]);
      setEndDate(formattedDates[1]);
    }
  };

  const pdftitle = "Users List";
  const ExportFileName = "Users_List";

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
    "Email",
    "Phone",
    "Subscriber Type",
    "Status",
  ];

  const dataWithHeaders = [
    headers,
    ...subscriberData?.map((item, index) => [
      index + 1,
      item.name,
      item.email,
      item.phone,
      item.subscriber_type,
      item.status,
    ]),
  ];

  const pdfData = subscriberData?.map((item, index) => [
    index + 1,
      item.name,
      item.email,
      item.phone,
      item.subscriber_type,
      item.status,
  ]);

  const handlePageSizeChange = (size) => {
    // setCurrentPage(1);
    setCurrentpageSize(size);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    fetchSubscriber();
  }, []);

  useEffect(() => {
    fetchAllSubscriber();
  }, [currentPage, currentpageSize, search, startDate, endDate, subscriberTypeStatus]);

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch();
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [search]);

  const onSearch = async () => {
    await fetchAllSubscriber();
  };
  return (
    <>
      <Row justify={"start"}>
        <h4 style={{ fontWeight: "bold" }} className="textblue">
          All Subscribers List
        </h4>
      </Row>
      <Row justify="end">
        <Col>
          <Text style={{ marginTop: "0.5rem", marginRight: "0.5rem" }}>
            Status :
          </Text>
          <Select
            allowClear
            placeholder="Select Status"
            style={{ width: "120px", marginRight: "0.5rem" }}
            options={[
              { value: "ALL", label: "All" },
              {
                value: CONSTANTS.SUBSCRIBER_TYPE.INDIVIDUAL,
                label: "Retail",
              },
              {
                value: CONSTANTS.SUBSCRIBER_TYPE.CORPORATE,
                label: "Corporate",
              },
            ]}
            defaultValue="ALL"
            onChange={(value) => setSubscriberTypeStatus(value)}
          />
        </Col>
        <Col span={5}>
          <RangePicker
            format="DD/MM/YYYY"
            disabledDate={disabledDate}
            onChange={handleDateRangeChange}
            style={{ marginRight: "0.5rem" }}
            defaultValue={[dayjs().subtract(730, "day"), dayjs()]}
          />
        </Col>
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
      <div className="row d-flex justify-content-between my-2">
                <div className="col-3">
                  <h5>User List</h5>
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
      <AntTable
        bordered
        columns={columns}
        data={tableData}
        size="small"
        align="right"
        onChange={handlePageChange}
        current={currentPage}
        total={total}
        pageSize={currentpageSize}
        onShowSizeChange={handlePageSizeChange}
      />
    </>
  );
};

export default SubscriberList;
