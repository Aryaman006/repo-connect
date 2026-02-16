import React, { useEffect, useState } from "react";
import { Axios } from "../../axios/axiosFunctions";
import dayjs from "dayjs";
import config from "../../config/config";
import { notification } from "antd";
import { Row, Col, Pagination, Table, Input, Modal, Switch,  DatePicker, Button  } from "antd";
const { Search } = Input;
const { confirm } = Modal;
const { RangePicker } = DatePicker;
import CONSTANTS from "../../constant/Constants";
import exportFunction from "../../utils/export";
import {
  EditFilled,
  DeleteFilled,
  ArrowUpOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";

const ContactUsCorporate = () => {
  const [userData, setUserData] = useState([]);
  const [search, setSearch] = useState("");
  const [contactRetailData, setContactRetailData] = useState([]);
  const [total, setTotal] = useState(0);
  const [sortOrder, setSortOrder] = useState(1);
  const [pagination, setPagination] = useState({
    totalRecords: 0,
    pageSize: 10,
    totalPages: 0,
    currentPage: 1,
    nextPage: null,
    prevPage: null,
  });
  const [startDate, setStartDate] = useState(
    dayjs().subtract(30, "day").startOf("day").toISOString()
  );
  const [endDate, setEndDate] = useState(dayjs().endOf("day").toISOString());

  const fetchAll = async () => {

    try {
      const response = await Axios.fetchAxiosData(config.GetContactUsCorporateAdmin, {
        params: {
          page: pagination.currentPage,
          pageSize: pagination.pageSize,
          sortBy: "createdAt",
          sortOrder: sortOrder,
          startDate: startDate,
          endDate: endDate,
        },
      });
      if(response.data && response.data.records ) {
        setUserData(response.data.records);
      }
      if(response.data && response.data.records ) {
        const {
          totalRecords,
          totalPages,
          currentPage,
          nextPage,
          prevPage,
          pageSize,
        } = response.data.pagination;

        setPagination((prevState) => ({
          ...prevState,
          totalRecords: totalRecords,
          totalPages: totalPages,
          pageSize: pageSize,
          currentPage: currentPage,
          nextPage: nextPage,
          prevPage: prevPage,
        }));
      }
        
    } catch (error) {
        notification.error({
          message: "Something went wrong",
        });
    }
  };
  useEffect(() => {
    fetchAll();
  }, [pagination.currentPage, pagination.pageSize, sortOrder,startDate,endDate]);

  const fetchAllList = async () => {

    try {
      const response = await Axios.fetchAxiosData(config.GetContactUsCorporateAdminList, {
      });
       const filteredRecords =
                  response?.data?.records?.map((record) => ({
                  createdAt: dayjs(record.createdAt).format("DD/MM/YYYY"),
                  name: record.name,
                  phone : record.phone,
                  designation: record.designation,
                  email : record.email,
                  message : record.message,
                  hear : record.hear,
                  organization : record.organization
                  })) || [];
                  setContactRetailData(filteredRecords);
                  setTotal(response?.data?.pagination.totalRecords);
        
    } catch (error) {
        // notification.error({
        //   message: "Something went wrong",
        // });
    }
  };

  useEffect(() => {
    fetchAllList();
  }, []);

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
  };

  const pdftitle = "ContactUs Corporate List";
  const ExportFileName = "ContactUs_Corporate_List";

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
    "Date",
    "Name",
    "Phone",
    "Email",
    "Designation",
    "Message",
    "Heard from",
    "Company Details"
  ];

  const dataWithHeaders = [
    headers,
    ...contactRetailData?.map((item, index) => [
      index + 1,
      item.createdAt,
      item.name,
      item.phone,
      item.email,
      item.designation,
      item.message,
      item.hear, 
      item.organization 
    ]),
  ];

  const pdfData = contactRetailData?.map((item, index) => [
    index + 1,
    item.createdAt,
    item.name,
    item.phone,
    item.email,
    item.designation,
    item.message,
    item.hear, 
    item.organization 
  ]);

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
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      width: "8%",
      align: "center",
      render: (_, record, index) => {
        return dayjs(record.createdAt).format("DD/MM/YYYY");
      },
    },
    
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      // width: "8%",
      align: "left",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      // width: "8%",
      align: "left",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      // width: "8%",
      align: "left",
    },
    {
      title:"Designation",
      dataIndex: "designation",
      key: "designation",
      // width: "10%",
      align: "left",
    },
    {
      title: "Message",
      dataIndex: "message",
      key: "message",
      // width: "8%",
      align: "left",
    },
    {
      title: "Heard from",
      dataIndex: "hear",
      key: "hear",
      // width: "8%",
      align: "left",
    },
    {
      title: "Company Details",
      align: "left",
      width: "35%",
      render: (record) => {
        const { organization, employees } = record;
        return (
          <div>
            <div>Name: {organization}</div>
            <div>No. of Employees: {CONSTANTS.NO_OF_EMPLOYEES_OPTIONS.find(option => option.value === employees)?.label}</div>
          </div>
        );
      },
    },
   
  ];
  return (
    <>
      <Row justify={"start"}>
        <h4 style={{ fontWeight: "bold" }} className="textblue">
          Contact Us Corporate Users
        </h4>
      </Row>
      <Row justify="end">
      <Col span={5}>
            <RangePicker
              format="DD/MM/YYYY"
              disabledDate={disabledDate}
              onChange={handleDateRangeChange}
              style={{marginRight: "0.5rem" }}
              defaultValue={[dayjs().subtract(30, "day"), dayjs()]}
            />
          </Col>
      </Row>
      <div className="row d-flex justify-content-between my-4">
                        <div className="col-3">
                          <h5>Contact Us Corporate List</h5>
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
        dataSource={userData}
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
    </>
  );
}

export default ContactUsCorporate