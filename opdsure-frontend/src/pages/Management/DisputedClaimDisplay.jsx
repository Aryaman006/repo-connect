import React, { useEffect, useState } from "react";
import { Axios } from "../../axios/axiosFunctions";
import { Link, useLocation,  useSearchParams  } from "react-router-dom";
import config, { CONFIG_OBJ } from "../../config/config";
import {
  notification,
  Row,
  Col,
  DatePicker,
  Select,
  Input,
  Typography,
  Button,
} from "antd";
import AntTable from "../../components/AntTable";
import dayjs from "dayjs";
const { RangePicker } = DatePicker;
const { Option } = Select;
const { Search } = Input;
const { Text } = Typography;
import CONSTANTS from "../../constant/Constants";
import { GetManagmentUserDisputedClaimInternalStatus, Utils } from "../../utils";
import GetManagmentUserClaimInternalStatus from "../../utils/GetManagmentUserClaimStatus";
import exportFunction from "../../utils/export";

const DisputedClaimDisplay = () => {
  const [search, setSearch] = useState(undefined);
  const [sortOrder, setSortOrder] = useState(1);
  const [startDate, setStartDate] = useState(
    dayjs().subtract(30, "day").startOf("day").toISOString()
  );
  const [endDate, setEndDate] = useState(dayjs().toISOString());
  const [claimType, setClaimType] = useState("ALL");
  const [claimDisputeStatus, setClaimDisputeStatus] = useState("ALL");
  const [resubmission, setResubmission] = useState(false);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const page = Number(queryParams.get("page"));

  const internalDesignation = Number(localStorage.getItem("designation"));
  const [searchParams, setSearchParams] = useSearchParams();
  const claimDisputeStatus1 = searchParams.get("claimDisputeStatus");
  
 
  const claimsColumns = [
    {
      title: "S.No",
      render: (text, record, index) => {
        const calculatedIndex = (currentPage - 1) * 10 + index + 1;
        return <p className="text-center my-auto">{calculatedIndex}.</p>;
      },
    },

    {
      title: "Claim ID",
      render: (text, record) => (
        <Link to={`/management/claim-details/disputed/${record?._id}`}>
          <p className="text-primary text-decoration-underline my-auto">
            {record?.original_claim_id?.claim_id}
          </p>
        </Link>
      ),
    },
    {
      title: "OPD Date",
      render: (text, record) => (
        <p className="text-center my-auto">{Utils.DateFormat(record?.original_claim_id?.opd_date)}</p>
      ),
    },
  
    {
      title: "Name",
      dataIndex: ["original_claim_id","member_id", "name"],
    },
    {
      title: "Doctor's Name",
      dataIndex: ["original_claim_id", "doc_name"],
    },
    {
      title: "Hospital / Clinic Name",
      dataIndex: ["original_claim_id", "hospital"],
      // render: (text, record) => <p className="text-center my-auto">{record?.hospital}</p>,
    },

    {
      title: "Act. Bill Amt.",
      // dataIndex: "",
      render: (text, record) => (
        <p className="text-center my-auto">{record?.original_claim_id?.bill_amount?.toLocaleString("en-IN",{ minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
      ),
    },

    {
      title: "Claimable Amt.",
      // dataIndex: "english",
      render: (text, record) => (
        <p className="text-center my-auto">{record?.original_claim_id?.claimable_amount?.toLocaleString("en-IN",{ minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
      ),
    },

    {
      title: "Status",
      render: (text, record) => (
        <>{GetManagmentUserClaimInternalStatus(record?.original_claim_id?.internal_status,record?.original_claim_id?.resubmission,internalDesignation)}</>
      ),
    },
    {
      title: "Dispute Status",
      render: (text, record) => (
        <>{GetManagmentUserDisputedClaimInternalStatus(record?.internal_status,internalDesignation)}</>
      ),
    },
  ];
  const [claimsData, setClaimsData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentpageSize, setCurrentpageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [claimsDataExcel, setClaimsDataExcel] = useState([]);

  const fetchDisputedClaimsData = async () => {
    const response = await Axios.fetchAxiosData(config.GetAllDisputedClaimsManagement, {
      params: {
        page: currentPage,
        pageSize: currentpageSize,
        search,
        claimDisputeStatus:claimDisputeStatus || "ALL",
        startDate,
        endDate,
      },
    });
    
    setClaimsData(response?.data?.records);
    const filteredRecords = response?.data?.records?.map((record) => ({
      claim_id: record.original_claim_id?.claim_id,
      opd_date: Utils.DateFormat(record?.original_claim_id?.opd_date),
      claim_type: record.original_claim_id?.claim_type === 0 ? "OPD" : record.claim_type === 1 ? "Pharmacy" : record.claim_type === 2 ? "Lab-Test" : "",
      name: record.original_claim_id?.member_id?.name || "",
      doc_name: record.original_claim_id?.doc_name,
      hospital: record.original_claim_id?.hospital,
      bill_amount: record?.original_claim_id?.bill_amount?.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      claimable_amount: record?.original_claim_id?.claimable_amount?.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      status: GetManagmentUserClaimInternalStatus(record?.original_claim_id?.internal_status,record?.original_claim_id?.resubmission,internalDesignation)?.props?.children || "Unknown",
      dispute_status: GetManagmentUserDisputedClaimInternalStatus(record?.internal_status,internalDesignation)?.props?.children || "Unknown",
    }))|| [];
    setClaimsDataExcel(filteredRecords);
    setTotal(response?.data?.pagination.totalRecords);
  };
  useEffect(() => {
    fetchDisputedClaimsData();
  }, [currentPage, search, claimDisputeStatus, startDate, endDate]);

  const handlePageSizeChange = (size) => {
    // setCurrentPage(1);
    setCurrentpageSize(size);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
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

  const onSearch = async () => {
    fetchDisputedClaimsData();
  };

  const handleExport = (type) => {
    if (type === "pdf") {
      exportFunction.exportToPDF(pdfData, headers, total, pdftitle,ExportFileName);
    } else if (type === "excel") {
      exportFunction.exportToExcel(dataWithHeaders, ExportFileName);
    }
  };

  const headers = [
    "S.No",
    "Claim ID",
    "OPD Date",
    "Claim Type",
    "Name",
    "Doctor Name",
    "Hospital / Clinic Name",
    "Act. Bill Amt.",
    "Claimable Amt.",
    "Status",
    "Dispute Status",
  ];

  const dataWithHeaders = [
    headers,
    ...claimsDataExcel?.map((item, index) => [
      index + 1,
      item.claim_id,
      item.opd_date,
      item.claim_type,
      item.name,
      item.doc_name,
      item.hospital,
      item.bill_amount,
      item.claimable_amount,
      item.status,
      item.dispute_status,
    ])
  ];

  const pdfData = claimsDataExcel?.map((item, index) => [
    index + 1,
    item.claim_id,
    item.opd_date,
    item.claim_type,
    item.name,
    item.doc_name,
    item.hospital,
    item.bill_amount,
    item.claimable_amount,
    item.status,
    item.dispute_status,
  ]);

  const pdftitle = "DisputedClaims Data";
  const ExportFileName = "Disputed_Claims_Data";

  return (
    <>
      <div className="container">
        <Row justify="end" style={{ marginBottom: "1rem" }}>
          <Col>
          <Text
              // type="secondary"
              style={{  marginTop: "0.5rem",marginRight:"0.5rem" }}
            >
             Status :
            </Text>
            <Select
              allowClear
              placeholder="Select Status"
              style={{ width: "120px", marginRight: "0.5rem" }}
              options={[
                { value: "ALL", label: "All" },
                {
                  value: CONSTANTS.CLAIM_STATUS.DISPUTE_STATUS.RAISED,
                  label: "Raised",
                },
                // {
                //   value: CONSTANTS.CLAIM_STATUS.DISPUTE_STATUS.IN_PROCESS,
                //   label: "In Process",
                // },
                {
                  value: CONSTANTS.CLAIM_STATUS.DISPUTE_STATUS.APPROVED,
                  label: "Approved",
                },
                {
                  value: CONSTANTS.CLAIM_STATUS.DISPUTE_STATUS.REJECTED,
                  label: "Rejected",
                },
               
              ]}
              defaultValue="ALL"
              onChange={(value) => setClaimDisputeStatus(value)}
            />
         
          </Col>
          
          <Col span={5}>
            <RangePicker
              format="DD/MM/YYYY"
              disabledDate={disabledDate}
              onChange={handleDateRangeChange}
              style={{ marginRight: "0.5rem" }}
              defaultValue={[dayjs().subtract(30, "day"), dayjs()]}
            />
           
          </Col>
          <Col span={6}>
            <Search
              placeholder="Search"
              onSearch={onSearch}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              enterButton
            />
          </Col>
        </Row>
        <div className="row d-flex justify-content-between">
          <div className="col-7">
            <h5>Disputed Claims</h5>
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
              <Button onClick={() => handleExport("pdf")} type="primary" size="small">
                Export to PDF
              </Button>
            </div>
            <div className="col-3">
              <p>
                <span>(</span>
                <span className="text-danger">*</span>Amount in &#8377;)
              </p>
            </div>
          </div>
        </div>
        <div className="row">
          <AntTable
            columns={claimsColumns}
            data={claimsData}
            onChange={handlePageChange}
            current={currentPage}
            total={total}
            pageSize={currentpageSize}
            onShowSizeChange={handlePageSizeChange}
          />
        </div>
      </div>
    </>
  );
};

export default DisputedClaimDisplay;
