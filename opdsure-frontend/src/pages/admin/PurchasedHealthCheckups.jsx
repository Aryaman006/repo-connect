import { useEffect, useState } from "react";
import useAxiosFetch from "../../hooks/useAxiosFetch";
import CONSTANTS from "../../constant/Constants";
import axios from "axios";
import StatusSelect from "../../components/Select/StatusSelect";
import { getStatus } from "../../utils";
import exportFunction from "../../utils/export";
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
  DatePicker,

} from "antd";
import {
  EditFilled,
  DeleteFilled,
  ArrowUpOutlined,
  ExclamationCircleFilled,
  SettingOutlined
} from "@ant-design/icons";
import config from "../../config/config";
import { PlusOutlined } from "@ant-design/icons";
const { Search } = Input;
const { Option } = Select;
const { confirm } = Modal;
const { RangePicker } = DatePicker;
import codes from "country-calling-code";
import dayjs from "dayjs";
import {Utils} from "../../utils"

const PurchasedHealthCheckups = () => {
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
          const response = await axios.patch(config.EditPurchasedHealthCheckupsAdmin+`${record._id}`, {
            completed:action,
          });
        
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
          title: (
            <div>
              Requested At
              {
                <ArrowUpOutlined
                  style={{ marginLeft: 12, fontSize: "1rem" }}
                  onClick={handleSortChange}
                  rotate={sortOrder === -1 ? 0 : 180}
                />
              }
            </div>
          ),
          width: "10%",
          align: "center",
          render: (_,record)=> {
            return dayjs(record.createdAt).format("DD/MM/YYYY")
            }
        },
        {
          title: "Requested by",
          align: "left",
          width: "20%",
          render: (record) => {
            const { name, phone, email, country_code } = record.user || {};
            return (
              <div>
                <div>{name}</div>
                <div>{country_code + phone}</div>
                <div>{email}</div>
              </div>
            );
          },
        },
        {
            title: "Health Plan",
            align: "left",
            width: "20%",
            render: (record) => {
              const { name, base_price,discounted_price } = record.health_plan || {};
              return (
                <div>
                  <div>{name}</div>
                  <div>Base Price: {base_price}</div>
                  <div>Discounted Price: {discounted_price}</div>
                </div>
              );
            },
          },
        {
          title: "Paid Price",
          width: "5%",
          align: "center",
          dataIndex: "paid_price",
          key: "paid_price",
        },
        {
          title: "Patient Details",
          align: "left",
          width: "15%",
          render: (record) => {
            const { patient_name, age, address, pincode, gender } = record;
            const genderLabel = gender === 1 ? "Male" : gender === 2 ? "Female" : "Others";
            return (
              <div>
                <div>Name: {patient_name}</div>
                <div>Age: {age}</div>
                <div>Address: {address}</div>
                <div>Pincode: {pincode}</div>
                <div>Gender: {genderLabel}</div>
              </div>
            );
          },
        },
        {
          title: "Appointment",
          align: "center",
          width: "10%",
          render: (record) => {
            return dayjs(record.appointment).format("DD/MM/YYYY HH:mm a");
          },
        },
        {
          title: 'Status',
          key: 'completed ',
          width: "20%",
          render: (text, record) => (
            <Select
              defaultValue={record.completed ? true : false}
              onChange={(value) => handleAction(value, record)} // Handle selection
            >
              <Select.Option value={true}>Completed</Select.Option>
              <Select.Option value={false}>Pending</Select.Option>
            </Select>
          ),
        }
      ];

    const fetchAll = async () => {
      try {
        const response = await axios.get(`${config.ApiBaseUrl}${config.GetPurchasedHealthCheckupsAdmin}`, {
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
       
        const filteredRecords = response?.data.data.records.map((record) => ({
          patient_name: record.patient_name,
          appointment: record.appointment,
          createdAt: Utils.DateFormat(record.createdAt),
          address: record.address || "",
          pincode: record.pincode || "",
          gender: record.gender || "",
          age: record.age || "",
          phone: `+91-${record.user.phone}` || "",
          health_plan: record.health_plan.name,
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
        setTotal(response.data.data.pagination.totalRecords);
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
        console.log("error",error)
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
      "Raised Date",
      "Health Plan",
      "Patient Name",
      "Patient Age",
      "Patient Gender",
      "Contact",
      "Address",
      "Pincode",
      "Appointment",
      
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
        item.createdAt,
        item.health_plan,
        item.patient_name,
        item.age,
        getGenderString(item.gender),
        item.phone,
        item.address,
        item.pincode,
        dayjs( item.appointment).format('DD/MM/YYYY hh:mm A'),
        
      ])
    ];
  
    const pdfData = claimsDataExcel?.map((item, index) => [
      index + 1,
      item.createdAt,
        item.health_plan,
        item.patient_name,
        item.age,
        getGenderString(item.gender),
        item.phone,
        item.address,
        item.pincode,
        dayjs( item.appointment).format('DD/MM/YYYY hh:mm A'),
    ]);
  
    const pdftitle = `Health_Chechups_Appointments_${dayjs().format('DD_MM_YYYY hh_mm A')}`;
    const ExportFileName =`Health_Chechups_Appointments_${dayjs().format('DD_MM_YYYY hh_mm A')}`;

  return (
    <>
    <div style={{ padding: "1rem" }}>
      <Row justify={"start"}>
        <h4 style={{ fontWeight: "bold" }} className="textblue">
          Purchased Health Checkup Plans Lists
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

export default PurchasedHealthCheckups