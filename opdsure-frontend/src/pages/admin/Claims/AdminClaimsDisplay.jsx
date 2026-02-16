import React, { useState, useEffect } from "react";
import { Axios } from "../../../axios/axiosFunctions";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  notification,
  Row,
  Col,
  DatePicker,
  Select,
  Input,
  Typography,
  Button,
  Card,
  Statistic,
} from "antd";

import AntTable from "../../../components/AntTable";
import dayjs from "dayjs";
import config from "../../../config/config";
import CONSTANTS from "../../../constant/Constants";
import { Utils } from "../../../utils";
import GetAdminUserClaimStatus from "../../../utils/GetAdminUserClaimStatus";
import exportFunction from "../../../utils/export";

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Search } = Input;
const { Text } = Typography;

const AdminClaimsDisplay = () => {
  const navigate = useNavigate()
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState('createdAt');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);   
  // const [startDate, setStartDate] = useState(
  //   dayjs().subtract(1730, "day").startOf("day").toISOString()
  // );
  // const [endDate, setEndDate] = useState(dayjs().endOf("day").toISOString());
  const [claimInternalStatus, setClaimInternalStatus] = useState("ALL");
  const [claimsData, setClaimsData] = useState([]);
  const [claimsDataCount, setClaimsDataCount] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [pending, setPending] = useState(0);

  const [approval, setApproval] = useState(0);
  const [settled, setSettled] = useState(0);
  const [rejected, setRejected] = useState(0);
  const [clarification, setClarification] = useState(0);
  const [invalid, setInvalid] = useState(0);
  const [remaining, setRemaining] = useState(0);


  const [claimsDataExcel, setClaimsDataExcel] = useState([]);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const page = Number(queryParams.get("page")) || 1;

  useEffect(() => {
    fetchClaimsData();
  }, [currentPage, search, claimInternalStatus, startDate, endDate]);

  const fetchClaimsData = async () => {
    try {
      const response = await Axios.fetchAxiosData(config.GetClaimsAdmin, {
        params: {
          page: currentPage,
          pageSize: currentPageSize,
          search,
          claimInternalStatus,
          startDate,
          endDate,
        },
      });

      // console.log("response",response)
      setClaimsData(response?.data?.records || []);
      const filteredRecords =
        response?.data?.records?.map((record) => ({
          claim_id: record.claim_id,
          createdAt: Utils.DateFormat(record.createdAt),
          name: record.member_id?.name || "",
          doc_name: record.doc_name,
          hospital: record.hospital,
          bill_amount: record?.bill_amount?.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }),
          claimable_amount: record?.claimable_amount?.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }),
          approved_claimable_amount: (record?.approved_claimable_amount?.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }) ||  record.internal_status !== CONSTANTS.CLAIM_STATUS.STATUS.SETTLED)? record?.approved_claimable_amount?.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }) :  record?.claimable_amount?.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }),
          status: GetClaimStatus(record?.internal_status, record?.resubmission),
        })) || [];
      setClaimsDataExcel(filteredRecords);
      setTotal(response?.data?.pagination?.totalRecords || 0);
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to fetch claims data",
      });
    }
  };

  const fetchClaimsDataCount = async () => {
    try {
      const response = await Axios.fetchAxiosData(config.GetClaimsAdmin, {
        params: {
          page: currentPage,
          pageSize: currentPageSize,
          search,
          startDate,
          endDate,
        },
      });

      // console.log("response",response)
      setClaimsDataCount(response?.data?.records || []);
      // setTotal(response?.data?.pagination?.totalRecords || 0);
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to fetch claims data",
      });
    }
  };

  useEffect(() => {
    fetchClaimsDataCount();
  }, [currentPage, search, startDate, endDate]);
  // console.log("claimsData", claimsData)

  const handleCardClick = (status) => {
    setClaimInternalStatus(status);
    // navigate("/admin/claims");
  };

  const GetSubscriberType = (subscriberType) => {
    switch (subscriberType) {
      case CONSTANTS.SUBSCRIBER_TYPE.INDIVIDUAL:
        return "Retail";
      case CONSTANTS.SUBSCRIBER_TYPE.CORPORATE:
        return "Corporate";
      default:
        return "Unknown";
    }
  };
  

  const claimsColumns = [
    {
      title: "S.No",
      render: (text, record, index) => (
        <p className="text-center my-auto">
          {(currentPage - 1) * currentPageSize + index + 1}.
        </p>
      ),
    },
    {
      title: "Claim ID",
      sorter: (a, b) => a.claim_id.localeCompare(b.claim_id),
      render: (text, record) => (
        <Link to={`/admin/claim-details/${record?._id}/?page=${currentPage}`}>
          <p className="text-primary text-decoration-underline my-auto">
            {record?.claim_id}
          </p>
        </Link>
      ),
    },
    {
      title: "Raised Date",
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      render: (text, record) => (
        <p className="text-center my-auto">
          {Utils.DateFormat(record?.createdAt)}
        </p>
      ),
    },
    {
      title: "Name",
      sorter: (a, b) =>
        (a.member_id?.name || "").localeCompare(b.member_id?.name || ""),
      dataIndex: ["member_id", "name"],
    },
    {
      title: "Doctor's Name",
      sorter: (a, b) => (a.doc_name || "").localeCompare(b.doc_name || ""),
      dataIndex: "doc_name",
    },
    {
      title: "Hospital / Clinic Name",
      sorter: (a, b) => (a.hospital || "").localeCompare(b.hospital || ""),
      dataIndex: "hospital",
    },
    {
      title: "Act. Bill Amt.",
      sorter: (a, b) => a.bill_amount - b.bill_amount,
      render: (text, record) => (
        <p className="text-center my-auto">
          {record?.bill_amount.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
      ),
    },
    {
      title: "Claimable Amt.",
      sorter: (a, b) => a.claimable_amount - b.claimable_amount,
      render: (text, record) => (
        <p className="text-center my-auto">
          {record?.claimable_amount.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
      ),
    },
    {
      title: "Approved Amt.",
      // sorter: (a, b) => a.approved_claimable_amount - b.approved_claimable_amount,
      render: (text, record) => (
        <p className="text-center my-auto">{(record?.approved_claimable_amount?.toLocaleString("en-IN",{ minimumFractionDigits: 2, maximumFractionDigits: 2 }) || record.internal_status !== CONSTANTS.CLAIM_STATUS.STATUS.SETTLED) ? record?.approved_claimable_amount?.toLocaleString("en-IN",{ minimumFractionDigits: 2, maximumFractionDigits: 2 }) : record?.claimable_amount.toLocaleString("en-IN",{ minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
      ),
    },
    {
      title: "Subscriber Type",
      dataIndex: ["user_id", "subscriber_type"],
      render: (text, record) => GetSubscriberType(record?.user_id?.subscriber_type),
    },    
    {
      title: "Status",
      sorter: (a, b) => a.internal_status - b.internal_status,
      render: (text, record) => {
        const status = GetAdminUserClaimStatus(
          record?.internal_status,
          record?.resubmission
        );
        
        return (
          <div
          >
            <div>{status}</div>
            {record.internal_status ===
              CONSTANTS.CLAIM_STATUS.STATUS.APPROVED &&
              record.claim_closure_Date && (
                <span style={{ marginTop: "0.5rem" }}>
                  {dayjs(record.claim_closure_Date).format("DD/MM/YYYY")}
                </span>
              )}
          </div>
        );
      },
    },
  ];

  const GetClaimStatus = (status, resubmissionStatus) => {
    switch (status) {
      case CONSTANTS.CLAIM_STATUS.INTERNAL_STATUS.REJECTED:
        return "Rejected";
      case CONSTANTS.CLAIM_STATUS.INTERNAL_STATUS.INVALID:
        return "Invalid";
      case CONSTANTS.CLAIM_STATUS.INTERNAL_STATUS.CLARIFICATION:
        return "Clarification";
      case CONSTANTS.CLAIM_STATUS.INTERNAL_STATUS.APPROVED:
        return "Approved";
      case CONSTANTS.CLAIM_STATUS.INTERNAL_STATUS.SETTLED:
        return "Settled";
      case CONSTANTS.CLAIM_STATUS.INTERNAL_STATUS.NO_ACTION:
        return resubmissionStatus ? "Re-Submitted" : "Pending";
      default:
        return "Unknown Status";
    }
  };

  const handlePageSizeChange = (size) => {
    setCurrentPageSize(size);
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // const handleDateRangeChange = (dates, dateStrings) => {
  //   const formattedDates = dateStrings.map((date, index) => {
  //     const dayjsDate = dayjs(date, "DD/MM/YYYY");
  //     return index === 0
  //       ? dayjsDate.startOf("day").toISOString()
  //       : dayjsDate.endOf("day").toISOString();
  //   });
  //   if (dates) {
  //     setStartDate(formattedDates[0]);
  //     setEndDate(formattedDates[1]);
  //   }
  // };

  const handleDateRangeChange = (dates) => {
    if (dates && dates.length === 2) {
      setStartDate(dates[0].startOf("day").toISOString());
      setEndDate(dates[1].endOf("day").toISOString());
    } else {
      setStartDate(null); // Reset to null when cleared
      setEndDate(null);
    }
  }; 

  const disabledDate = (current) => {
    return current && current >= dayjs().endOf("day");
  };

  const onSearch = () => {
    fetchClaimsData();
  };
  const pdftitle = "Claims Data";
  const ExportFileName = "Claims_Data";

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
    "Claim ID",
    "Raised Date",
    "Name",
    "Doctor Name",
    "Hospital / Clinic Name",
    "Act. Bill Amt.",
    "Claimable Amt.",
    "Approved Amt.",
    "Status",
  ];

  const dataWithHeaders = [
    headers,
    ...claimsDataExcel?.map((item, index) => [
      index + 1,
      item.claim_id,
      item.createdAt,
      item.name,
      item.doc_name,
      item.hospital,
      item.bill_amount,
      item.claimable_amount,
      item.approved_claimable_amount || item.internal_status !== CONSTANTS.CLAIM_STATUS.STATUS.SETTLED? item.approved_claimable_amount : item.claimable_amount,
      item.status,
    ]),
  ];

  const pdfData = claimsDataExcel?.map((item, index) => [
    index + 1,
    item.claim_id,
    item.createdAt,
    item.name,
    item.doc_name,
    item.hospital,
    item.bill_amount,
    item.claimable_amount,
    item.approved_claimable_amount || item.internal_status !== CONSTANTS.CLAIM_STATUS.STATUS.SETTLED? item.approved_claimable_amount : item.claimable_amount,
    item.status,
  ]);

  // console.log("total",claimsData[0].status)

  useEffect(() => {
    let approvalCount = 0;
    let rejectedCount = 0;
    let pendingCount = 0;
    let remainingCount = 0;
    let settledCount = 0;
    let clarificationCount = 0;
    let invalidCount = 0;
    
  
    claimsDataCount.forEach((item) => {

      if (item.internal_status === 8) {
        approvalCount++;
      } else if (item.internal_status === 5) {
        rejectedCount++;
      } else if (item.internal_status === 12) {
        settledCount++;
      }else if (item.internal_status === 0) {
        pendingCount++;
      }else if (item.internal_status === 6) {
        clarificationCount++;
      }else if (item.internal_status === 7) {
        invalidCount++;
      } else {
        remainingCount++;
      }
    });
  
  
    setApproval(approvalCount);
    setRejected(rejectedCount);
    setPending(pendingCount);
    setRemaining(remainingCount);
    setSettled(settledCount);
    setClarification(clarificationCount);
    setInvalid(invalidCount);
    setTotalCount(approvalCount + rejectedCount + pendingCount + remainingCount + settledCount + clarificationCount + invalidCount)
  }, [claimsDataCount]);
  


  return (
    <>
      <div className="container">
        <Row justify="end" style={{ marginBottom: "1rem" }}>
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
                  value: CONSTANTS.CLAIM_STATUS.INTERNAL_STATUS.APPROVED,
                  label: "Approved",
                },
                {
                  value: CONSTANTS.CLAIM_STATUS.INTERNAL_STATUS.SETTLED,
                  label: "Settled",
                },
                {
                  value: CONSTANTS.CLAIM_STATUS.INTERNAL_STATUS.NO_ACTION,
                  label: "Pending",
                },
                {
                  value: CONSTANTS.CLAIM_STATUS.INTERNAL_STATUS.REJECTED,
                  label: "Rejected",
                },
                {
                  value: CONSTANTS.CLAIM_STATUS.INTERNAL_STATUS.INVALID,
                  label: "Invalid",
                },
                {
                  value: CONSTANTS.CLAIM_STATUS.INTERNAL_STATUS.CLARIFICATION,
                  label: "Clarification Required",
                },
                {
                  value: CONSTANTS.CLAIM_STATUS.INTERNAL_STATUS.DISPUTE,
                  label: "Dispute",
                },
              ]}
              defaultValue="ALL"
              onChange={(value) => setClaimInternalStatus(value)}
            />
          </Col>

          <Col span={5}>
            <RangePicker
              format="DD/MM/YYYY"
              disabledDate={disabledDate}
              onChange={handleDateRangeChange}
              style={{ marginRight: "0.5rem" }}
              value={startDate && endDate ? [dayjs(startDate), dayjs(endDate)] : null} 
              placeholder={["From Date", "To Date"]}
            />
          </Col>
          <Col span={6}>
            <Search
              placeholder="Search by hospital, doctor or claim id"
              onSearch={onSearch}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              enterButton
            />
          </Col>
        </Row>

        <div className="my-4">
      <Row gutter={[16, 16]}>
        <Col span={3} xs={24} sm={12} md={8} lg={3}>
          <div
            onClick={() => handleCardClick("ALL")}
            className="cursor-pointer"
            style={{ cursor: "pointer" }}
          >
            <Card bordered className="card-body bg-light-blue rounded-4 shadow-sm">
              <Statistic
                title={<span style={{ fontSize: "1.3rem", color: "black" }}>Total</span>}
                value={totalCount}
                precision={0}
                valueStyle={{ color: "#3f8600", fontSize: "1.8rem", fontWeight: "500" }}
              />
            </Card>
          </div>
        </Col>

        <Col span={3} xs={24} sm={12} md={8} lg={3}>
          <div onClick={() => handleCardClick(CONSTANTS.CLAIM_STATUS.INTERNAL_STATUS.NO_ACTION)} className="cursor-pointer"  style={{ cursor: "pointer" }}>
            <Card bordered className="card-body bg-light-blue rounded-4 shadow-sm">
              <Statistic
                title={<span style={{ fontSize: "1.3rem", color: "black" }}>Pending</span>}
                value={pending}
                precision={0}
                valueStyle={{ color: "#cf1322", fontSize: "1.8rem", fontWeight: "500" }}
              />
            </Card>
          </div>
        </Col>

        <Col span={3} xs={24} sm={12} md={8} lg={3}>
          <div onClick={() => handleCardClick(CONSTANTS.CLAIM_STATUS.INTERNAL_STATUS.REJECTED)} className="cursor-pointer"  style={{ cursor: "pointer" }}>
            <Card bordered className="card-body bg-light-blue rounded-4 shadow-sm">
              <Statistic
                title={<span style={{ fontSize: "1.3rem", color: "black" }}>Rejected</span>}
                value={rejected}
                precision={0}
                valueStyle={{ color: "#cf1322", fontSize: "1.8rem", fontWeight: "500" }}
              />
            </Card>
          </div>
        </Col>

        <Col span={3} xs={24} sm={12} md={8} lg={3}>
          <div onClick={() => handleCardClick(CONSTANTS.CLAIM_STATUS.INTERNAL_STATUS.APPROVED)} className="cursor-pointer"   style={{ cursor: "pointer" }}>
            <Card bordered className="card-body bg-light-blue rounded-4 shadow-sm">
              <Statistic
                title={<span style={{ fontSize: "1.3rem", color: "black" }}>Approved</span>}
                value={approval}
                precision={0}
                valueStyle={{ fontSize: "1.8rem", fontWeight: "500" }}
              />
            </Card>
          </div>
        </Col>

        <Col span={3} xs={24} sm={12} md={8} lg={3}>
          <div onClick={() => handleCardClick(CONSTANTS.CLAIM_STATUS.INTERNAL_STATUS.SETTLED)} className="cursor-pointer"   style={{ cursor: "pointer" }}>
            <Card bordered className="card-body bg-light-blue rounded-4 shadow-sm">
              <Statistic
                title={<span style={{ fontSize: "1.3rem", color: "black" }}>Settled</span>}
                value={settled}
                precision={0}
                valueStyle={{ fontSize: "1.8rem", fontWeight: "500", color: "#3f8600" }}
              />
            </Card>
          </div>
        </Col>
        <Col span={3} xs={24} sm={12} md={8} lg={3}>
          <div onClick={() => handleCardClick(CONSTANTS.CLAIM_STATUS.INTERNAL_STATUS.CLARIFICATION)} className="cursor-pointer"   style={{ cursor: "pointer" }}>
            <Card bordered className="card-body bg-light-blue rounded-4 shadow-sm">
              <Statistic
                title={<span style={{ fontSize: "1.3rem", color: "black" }}>Clarification</span>}
                value={clarification}
                precision={0}
                valueStyle={{ fontSize: "1.8rem", fontWeight: "500" }}
              />
            </Card>
          </div>
        </Col>
        <Col span={3} xs={24} sm={12} md={8} lg={3}>
          <div onClick={() => handleCardClick(CONSTANTS.CLAIM_STATUS.INTERNAL_STATUS.INVALID)} className="cursor-pointer"   style={{ cursor: "pointer" }}>
            <Card bordered className="card-body bg-light-blue rounded-4 shadow-sm">
              <Statistic
                title={<span style={{ fontSize: "1.3rem", color: "black" }}>Invalid</span>}
                value={invalid}
                precision={0}
                valueStyle={{ fontSize: "1.8rem", fontWeight: "500", color: "#cf1322" }}
              />
            </Card>
          </div>
        </Col>
      </Row>
    </div>
        <div className="row d-flex justify-content-between">
          <div className="col-3">
          {
    claimInternalStatus == "ALL" ? 
    <h5>
     Total Claims
    </h5>
    : claimInternalStatus == 0?
    <h5>
     Pending Claims
    </h5>
    : claimInternalStatus == 8?
    <h5>
     Approved Claims
    </h5>
    : claimInternalStatus == 12?
     <h5>
      Settled Claims
    </h5>
    : claimInternalStatus == 5?
    <h5>
     Rejected Claims
   </h5>
   :claimInternalStatus == 6?
   <h5>
    Clarification Claims
  </h5>
   : 
   claimInternalStatus == 7?
   <h5>
    Invalid Claims
  </h5>
  :
   <h5>
   Total Claims
  </h5>
    }
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
            pageSize={currentPageSize}
            onShowSizeChange={handlePageSizeChange}
          />
        </div>
      </div>
    </>
  );
};

export default AdminClaimsDisplay;
