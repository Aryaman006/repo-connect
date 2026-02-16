import React, { useEffect, useState } from "react";
import { Axios } from "../../axios/axiosFunctions";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import config, { CONFIG_OBJ } from "../../config/config";
import {
  notification,
  Row,
  Col,
  DatePicker,
  Select,
  Input,
  Typography,
  Button
} from "antd";
import AntTable from "../../components/AntTable";
import dayjs from "dayjs";
const { RangePicker } = DatePicker;
const { Option } = Select;
const { Search } = Input;
const { Text } = Typography;
import CONSTANTS from "../../constant/Constants";
import { Utils } from "../../utils";
import GetManagmentUserClaimInternalStatus from "../../utils/GetManagmentUserClaimStatus";
import exportFunction from "../../utils/export";

const ClaimDisplay = () => {
  const [search, setSearch] = useState(undefined);
  const [sortOrder, setSortOrder] = useState(1);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);         
  
  // const [claimInternalStatus, setClaimInternalStatus] = useState("");
  const [resubmission, setResubmission] = useState(false);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const page = Number(queryParams.get("page"));
  const [searchParams, setSearchParams] = useSearchParams();
  const internalStatusFilter = searchParams.get("internalStatusFilter");
  const internalDesignation = Number(localStorage.getItem("designation"));

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

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch();
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [search]);
 
  const claimsColumns = [
    {
      title: "S.No",
      width: "5%",
      render: (text, record, index) => {
        const calculatedIndex = (currentPage - 1) * currentpageSize + index + 1;
        return <p className="text-center my-auto">{calculatedIndex}.</p>;
      },
    },

    {
      title: "Claim ID",
      width: "10%",
      sorter: (a, b) => a.claim_id.localeCompare(b.claim_id),
      render: (text, record) => (
        <Link to={`/management/claim-details/${record?._id}/?page=${currentPage}`}>
          <p className="text-primary text-decoration-underline my-auto">
            {record?.claim_id}
          </p>
        </Link>
      ),
    },
    {
      title: "Raised Date",
      width: "10%",
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      render: (text, record) => (
        <p className="text-center my-auto">{Utils.DateFormat(record?.createdAt)}</p>
      ),
    },
    // {
    //   title: "Claim Type",
    //   render: (text, record) => (
    //     <p className=" text-center my-auto">
    //       {record?.claim_type === 0
    //         ? "OPD"
    //         : record?.claim_type === 1
    //         ? "Pharmacy"
    //         : record?.claim_type === 2
    //         ? "Lab-Test"
    //         : ""}
    //     </p>
    //   ),
    // },
    {
      title: "Name",
      width: "10%",
      sorter: (a, b) =>
        (a.member_id?.name || "").localeCompare(b.member_id?.name || ""),
      dataIndex: ["member_id", "name"],
    },
    {
      title: "Doctor's Name",
      width: "10%",
      sorter: (a, b) => (a.doc_name || "").localeCompare(b.doc_name || ""),
      dataIndex: "doc_name",
    },
    {
      title: "Hospital / Clinic Name",
      width: "10%",
      sorter: (a, b) => (a.hospital || "").localeCompare(b.hospital || ""),
      dataIndex: "hospital",
      // render: (text, record) => <p className="text-center my-auto">{record?.hospital}</p>,
    },

    {
      title: "Act. Bill Amt.",
      width: "5%",
      sorter: (a, b) => a.bill_amount - b.bill_amount,
      // dataIndex: "",
      render: (text, record) => (
        <p className="text-center my-auto">{record?.bill_amount.toLocaleString("en-IN",{ minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
      ),
    },

    {
      title: "Claimable Amt.",
      width: "5%",
      sorter: (a, b) => a.claimable_amount - b.claimable_amount,
      render: (text, record) => (
        <p className="text-center my-auto">{record?.claimable_amount.toLocaleString("en-IN",{ minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
      ),
    },
 {
      title: "Approved Amt.",
      width: "5%",
      // sorter: (a, b) => a.approved_claimable_amount - b.approved_claimable_amount,
      render: (text, record) => (
        <p className="text-center my-auto">{(record?.approved_claimable_amount?.toLocaleString("en-IN",{ minimumFractionDigits: 2, maximumFractionDigits: 2 }) || record.internal_status !== CONSTANTS.CLAIM_STATUS.STATUS.SETTLED) ? record?.approved_claimable_amount?.toLocaleString("en-IN",{ minimumFractionDigits: 2, maximumFractionDigits: 2 }) : record?.claimable_amount.toLocaleString("en-IN",{ minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
      ),
    },
     {
      title: "Subscriber Type",
      width: "5%",
      dataIndex: ["user_id", "subscriber_type"],
      render: (text, record) => GetSubscriberType(record?.user_id?.subscriber_type),
    },  
    {
      title: "Status",
      width: "15%",
      sorter: (a, b) => a.internal_status - b.internal_status,
      // render: (text, record) => (
      //   <>{GetManagmentUserClaimInternalStatus(record?.internal_status,record?.resubmission,internalDesignation)}</>
      // ),
      align:"center",
        render: (text, record) => {
          const status = GetManagmentUserClaimInternalStatus(record?.internal_status,record?.resubmission,internalDesignation);
          return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div>{status}</div>
              {record.internal_status === CONSTANTS.CLAIM_STATUS.STATUS.APPROVED && record.claim_closure_Date && (
                <span style={{ marginTop: "0.5rem" }}>
                  {dayjs(record.claim_closure_Date).format("DD/MM/YYYY")}
                </span>
              )}
            </div>
          );
        }
    },
   
  ];
  const [claimsData, setClaimsData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentpageSize, setCurrentpageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [claimsDataExcel, setClaimsDataExcel] = useState([]);

const status = location.state?.claimInternalStatus
// console.log(aa)
  useEffect(() => {
    if (!status) {
      // setClaimInternalStatus(CONSTANTS.CLAIM_STATUS.INTERNAL_STATUS.APPROVED);
      // fetchclaimsData("");
      fetchclaimsData("");
    } else {
    //   // setClaimInternalStatus(location.state.claimInternalStatus);
      fetchclaimsData(status);
    }
  }, [status]);
  


  const fetchclaimsData = async (statusParam) => {
    const statusToUse = statusParam;
  
    const params = {
      page: currentPage,
      pageSize: currentpageSize,
      search,
      claimInternalStatus: statusToUse,
    };
  // console.log("claimInternalStatus", statusToUse)
    if (startDate && endDate) {
      params.startDate = startDate;
      params.endDate = endDate;
    }
  if(statusToUse !== undefined){
    const response = await Axios.fetchAxiosData(config.GetClaimsManagement, {
      params,
    });
  
    
  
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
        status:
          GetManagmentUserClaimInternalStatus(
            record?.internal_status,
            record?.resubmission,
            internalDesignation
          )?.props?.children || "Unknown",
      })) || [];
  
    setClaimsDataExcel(filteredRecords);
    setTotal(response?.data?.pagination.totalRecords);
  }
  };
  
  
  
  // useEffect(() => {
  //   if (
  //     claimInternalStatus !== undefined &&
  //     claimInternalStatus !== null &&
  //     claimInternalStatus !== ""
  //   ) {
  //     fetchclaimsData();
  //   }
  // }, [currentPage, currentpageSize, search, claimInternalStatus, startDate, endDate]);
  
  

  const handlePageSizeChange = (size) => {
    // setCurrentPage(1);
    setCurrentpageSize(size);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

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

  const onSearch = async () => {
    fetchclaimsData();
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
    ])
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

  const pdftitle = "Claims Data";
  const ExportFileName = "Claims_Data";
  return (
    <>
      <div className="container">
        <Row justify="end" style={{ marginBottom: "1rem" }}>
          {/* <Col>
          <Text
              // type="secondary"
              style={{  marginTop: "0.5rem",marginRight:"0.5rem" }}
            >
             Status :
            </Text>
            <Select
  // allowClear
  placeholder="Select Status"
  style={{ width: "160px", marginRight: "0.5rem" }}
  options={[
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
  ]}
  // value={claimInternalStatus || null}
  // onChange={(value) => setClaimInternalStatus(value || "")}
/>

          </Col> */}
          
          {/* <Col span={5}>
          <RangePicker
  format="DD/MM/YYYY"
  disabledDate={disabledDate}
  onChange={handleDateRangeChange}
  style={{ marginRight: "0.5rem" }}
  value={startDate && endDate ? [dayjs(startDate), dayjs(endDate)] : null}  // Default is empty
/>

           
          </Col> */}
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
        <div className="row d-flex justify-content-between">
          <div className="col-7">
          {
    location.state?.claimInternalStatus == "" ? 
    <h4>
     Total Claims
    </h4>
    : location.state?.claimInternalStatus == 0?
    <h4>
     Pending Claims
    </h4>
    : location.state?.claimInternalStatus == 8?
    <h4>
     Approved Claims
    </h4>
    : location.state?.claimInternalStatus == 12?
     <h4>
      Settled Claims
    </h4>
    : location.state?.claimInternalStatus == 5?
    <h4>
     Rejected Claims
   </h4>
   :location.state?.claimInternalStatus == 6?
   <h4>
    Clarification Claims
  </h4>
   : 
   location.state?.claimInternalStatus == 7?
   <h4>
    Invalid Claims
  </h4>
  :
   <h4>
   Total Claims
  </h4>
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

export default ClaimDisplay;
