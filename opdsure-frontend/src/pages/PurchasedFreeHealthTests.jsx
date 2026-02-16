import { useEffect, useState } from "react";
import useAxiosFetch from "../hooks/useAxiosFetch";
import CONSTANTS from "../constant/Constants";
import axios from "axios";
import StatusSelect from "../components/Select/StatusSelect";
import { getStatus } from "../utils";
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
  Tooltip,
  DatePicker
} from "antd";
import {
  EditFilled,
  DeleteFilled,
  ArrowUpOutlined,
  ExclamationCircleFilled,
  SettingOutlined
} from "@ant-design/icons";
import config from "../config/config";
import { PlusOutlined } from "@ant-design/icons";
const { Search } = Input;
const { Option } = Select;
const { confirm } = Modal;
const { RangePicker } = DatePicker;
import codes from "country-calling-code";
import dayjs from "dayjs";
import exportFunction from "../utils/export";
import {Utils} from "../utils"

const PurchasedFreeHealthTests = () => {
  const [claimsDataExcel, setClaimsDataExcel] = useState([]);
    const [test, setTest] = useState([]);
    const [search, setSearch] = useState("");
    const [sortOrder, setSortOrder] = useState(1);
    const [total, setTotal] = useState(0);
    const [startDate, setStartDate] = useState(
        dayjs().subtract(30, "day").startOf("day").toISOString()
      );
      const [endDate, setEndDate] = useState(dayjs().endOf("day").toISOString());
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
    }, [pagination.currentPage, pagination.pageSize, sortOrder,search,startDate,endDate]);
  
    useEffect(() => {
      const timer = setTimeout(() => {
        onSearch();
      }, 1000);
  
      return () => {
        clearTimeout(timer);
      };
    }, [search]);

    const onSearch = async () => {
        await fetchAll();
      }
    
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
    
      const handleAction = async (action, record) => {
        try {
          const response = await axios.patch(config.FreeHealtTestsActionAdmin+`/${record._id}`, {
            status:action,
          });
          console.log("response",response.data.success)
          if (response.data.success==true) {
            notification.success({message:"Action taken successfully"});
          } 
        } catch(error) {
            notification.error({message:'Action failed. Please try again.'});
          }
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
          title: 'Health Checkup ID',
          dataIndex: 'health_checkup_id',
          width:"13%",
          key: 'health_checkup_id',
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            width:"8%",
            key: 'createdAt',
            render: (text) => {
              const date = new Date(text);
              const day = String(date.getDate()).padStart(2, '0');
              const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
              const year = date.getFullYear();
              return `${day}/${month}/${year}`;
            },
          },
        {
          title: 'Message',
          dataIndex: 'message',
          key: 'message',
        },
        {
          title: 'Appointment',
          dataIndex: 'appointment',
          key: 'appointment',
          width:"10%",
          render: (text) => new Date(text).toLocaleString(), // Format the date as needed
        },
        {
            title: 'Member Details',
            dataIndex: 'member_details',
            key: 'member_details',
            width:"20%",
            align:"center",
            render: (member) => {
              const name = member?.name?.charAt(0).toUpperCase() + member?.name?.slice(1);
              const genderText = (() => {
                switch (member?.gender) {
                  case CONSTANTS.GENDER.MALE:
                    return 'Male';
                  case CONSTANTS.GENDER.FEMALE:
                    return 'Female';
                  case CONSTANTS.GENDER.OTHER:
                    return 'Other';
                  default:
                    return 'Unknown';
                }
              })();
              return (
                <div>
                  <strong>{name}</strong> <span className="text-muted">({genderText})</span>
                  <br />
                  <span>Phone: {member?.phone}</span>
                </div>
              );
            },
          },
          {
            title: 'Action',
            key: 'action',
            width: "10%",
            render: (text, record) => (
              <Select
              defaultValue={record.status}
                onChange={(value) => handleAction(value, record)} // Handle selection
              >
                <Option value={CONSTANTS.HEALTH_CHECKUP.STATUS.PENDING}>Pending</Option>
                <Option value={CONSTANTS.HEALTH_CHECKUP.STATUS.DONE}>Done</Option>
                <Option value={CONSTANTS.HEALTH_CHECKUP.STATUS.CANCELED}>Canceled</Option>
              </Select>
            ),
          },
      ];

    const fetchAll = async () => {
      try {
        const response = await axios.get(`${config.ApiBaseUrl}${config.GetFreeHealtTestsAdmin}`, {
          params: {
            search: search || undefined,
            page: pagination.currentPage,
            pageSize: pagination.pageSize,
            sortBy: "createdAt",
            sortOrder: sortOrder,
            startDate: startDate,
              endDate: endDate,
          },
        });
        setTest(response.data.data.records);
        const filteredRecords = response?.data?.data?.records?.map((record) => ({
          health_checkup_id: record.health_checkup_id,
          message: record.message,
          appointment: record.appointment,
          createdAt: Utils.DateFormat(record.createdAt),
          name: record.member_details?.name || "",
          address: record.member_details.address || "",
          gender: record.member_details?.gender || "",
          phone: `+91-${record.member_details?.phone}` || "",
        }))|| [];
        setClaimsDataExcel(filteredRecords);
        const {
          totalRecords,
          totalPages,
          currentPage,
          nextPage,
          prevPage,
          pageSize,
        } = response.data.data.pagination;
        setTotal(response?.data?.pagination.totalRecords);
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

    const disabledDate = (current) => {
       return current && current >= dayjs().endOf("day");
    };
    const handleExport = (type) => {
     
      if (type === "pdf") {
        exportFunction.exportToPDF(pdfData, headers, total, pdftitle,ExportFileName);
      } else if (type === "excel") {
        console.log("dataWithHeaders",dataWithHeaders)
        exportFunction.exportToExcel(dataWithHeaders, ExportFileName);
      }
    };
  
    const headers = [
      "S.No",
      "Health Checkup ID",
      "Raised Date",
      "Name",
      "Contact",
      "Address",
      "Gender",
      "Appointment",
      "Message",
    ];
    function getGenderString(genderCode) {
      switch (genderCode) {
        case CONSTANTS.GENDER.MALE:
          return 'Male';
        case CONSTANTS.GENDER.FEMALE:
          return 'Female';
        case CONSTANTS.GENDER.OTHER:
          return 'Other';
        default:
          return 'Unknown'; 
      }
    }
  
    const dataWithHeaders = [
      headers,
      ...claimsDataExcel?.map((item, index) => [
        index + 1,
        item.health_checkup_id,
        item.createdAt,
        item.name,
        item.phone,
        item.address,
        getGenderString(item.gender),
        dayjs( item.appointment).format('DD/MM/YYYY hh:mm A'),
        item.message,
      ])
    ];
  
    const pdfData = claimsDataExcel?.map((item, index) => [
      index + 1,
      item.health_checkup_id,
      item.createdAt,
      item.name,
      item.phone,
      item.address,
      getGenderString(item.gender),
      dayjs( item.appointment).format('DD/MM/YYYY hh:mm A'),
      item.message,
    ]);
  
    const pdftitle = `Free Tests Appointments ${dayjs().format('DD_MM_YYYY hh_mm A')}`;
    const ExportFileName =`Free Tests Appointments ${dayjs().format('DD_MM_YYYY hh_mm A')}`;
  
  return (
    <>
    <div style={{ padding: "1rem" }}>
      <Row justify={"start"}>
        <h4 style={{ fontWeight: "bold" }} className="textblue">
          Purchased Free Tests Lists
        </h4>
      </Row>
      <Row justify="end" gutter={12}>
        <Col span={6}>
          <Search
            placeholder="Search"
            onSearch={onSearch}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            enterButton
            style={{ marginBottom: "1.5rem", width: "100%", marginRight:"1rem" }}
          />
          </Col>
          <Col span={6}>
          <RangePicker
            format="DD/MM/YYYY"
            disabledDate={disabledDate}
            onChange={handleDateRangeChange}
            style={{ marginBottom:"1.5rem" }}
            defaultValue={[dayjs().subtract(30, "day"), dayjs()]}
          />
        </Col>
       
        <Col span={3}>
                <Button
                  onClick={() => handleExport("excel")}
                  type="primary"
                  size="middle"
                  style={{ marginRight: "1rem" }}
                >
                  Export to Excel
                </Button>
             </Col>
             <Col span={3}>
              <Button onClick={() => handleExport("pdf")} type="primary" size="middle">
                Export to PDF
              </Button>
              </Col>
            
      
      </Row>
      <Table
        bordered
        columns={columns}
        dataSource={test}
        size="small"
        rowKey={(record) => record._id}
        pagination={false}
        align="right"
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
      
    </div>
  </>
  )
}

export default PurchasedFreeHealthTests