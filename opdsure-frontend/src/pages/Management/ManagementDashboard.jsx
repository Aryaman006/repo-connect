import React, { useState, useEffect } from "react";
import {
  Input,
  Tabs,
  Select,
  Steps,
  Tooltip,
  Alert,
  Row,
  Col,
  Card,
  Statistic,
  notification,
  Typography
} from "antd";
import {Axios} from "../../axios/axiosFunctions";
import {Link, useSearchParams, useNavigate} from "react-router-dom";
import config from "../../config/config";
import claims from "../../assets/claims.png";
import settledclaims from "../../assets/settledclaims.png";
import pendingclaims from "../../assets/pendingclaims.png";
import rejectedclaims from "../../assets/rejectedclaims.png";
import approvedclaims from "../../assets/approvedclaims.png";
import invalidclaims from "../../assets/invalidClaim.png";
import clarificationclaims from "../../assets/clarificationclaims.png";
import submittedIcon from "../../assets/submittedIcon.png";
import inprocessIcon from "../../assets/inprocessIcon.png";
import approvedIcon from "../../assets/Icon.png";
import settledIcon from "../../assets/settleIcon.png";
import rejectedIcon from "../../assets/rejectedIcon.png";
import pendingIcon from "../../assets/pendingIcon.png";
import congoicon from "../../assets/congo.png";
import invalidIcon from "../../assets/invalidIcon.png";
import {faUpRightFromSquare} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CONSTANTS from "../../constant/Constants";
import {GetManagmentUserDisputedClaimInternalStatus, Utils} from "../../utils";
import dayjs from "dayjs";
import { useLocation } from "react-router-dom";
import Search from "antd/es/input/Search";
import AntTable from "../../components/AntTable";
import GetManagmentUserClaimInternalStatus from "../../utils/GetManagmentUserClaimStatus";

const { Text } = Typography;

const ManagementDashboard = () => {
  const internalDesignation = Number(localStorage.getItem("designation"));

  const handleTabChange = (key) => {
    setActiveKey(key);
  };
  const navigate = useNavigate()
  const [activeKey, setActiveKey] = useState("0");
  const [allClaimsData, setAllClaimsData] = useState([]);
  const [claimsData, setClaimsData] = useState([]);
  const [totalClaims, setTotalClaims] = useState([]);
  const [latestClaims, setLatestClaims] = useState([]);
  const [disputedClaims, setDisputedClaims] = useState([]);
  const [tatData, setTatData] = useState();

  const [search, setSearch] = useState(undefined);
  const [sortOrder, setSortOrder] = useState(1);
  const [startDate, setStartDate] = useState(
    dayjs().subtract(730, "day").startOf("day").toISOString()
  );
  const [endDate, setEndDate] = useState(dayjs().toISOString());
  const [claimType, setClaimType] = useState("ALL");
  const [claimDisputeStatus, setClaimDisputeStatus] = useState("ALL");
  const [resubmission, setResubmission] = useState(false);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  // const page = Number(queryParams.get("page"));

  const [searchParams, setSearchParams] = useSearchParams();
  const claimDisputeStatus1 = searchParams.get("claimDisputeStatus");

  const [total, setTotal] = useState(0);

  const [mytotal, setMyTotal] = useState(0);
  const [pending, setPending] = useState(0);
  const [approval, setApproval] = useState(0);
  const [settled, setSettled] = useState(0);
  const [rejected, setRejected] = useState(0);
  const [clarification, setClarification] = useState(0);
  const [invalid, setInvalid] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [myclaimsData, setMyClaimsData] = useState([]);
  const [claimInternalStatus, setClaimInternalStatus] = useState("ALL");

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
        <Link to={`/management/claim-details/${record?._id}`}>
          <p className="text-primary text-decoration-underline my-auto">
            {record?.claim_id}
          </p>
        </Link>
      ),
    },
    {
      title: "Claim Raised Date",
      render: (text, record) => (
        <p className="text-center my-auto">{Utils.DateFormat(record?.createdAt)}</p>
      ),
    },
  
    {
      title: "Name",
      dataIndex: ["member_id", "name"],
    },

    {
      title: "Act. Bill Amt.",
      render: (text, record) => (
        <p className="text-center my-auto">{record?.bill_amount?.toLocaleString("en-IN",{ minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
      ),
    },

    {
      title: "Claimable Amt.",
      render: (text, record) => (
        <p className="text-center my-auto">{record?.claimable_amount?.toLocaleString("en-IN",{ minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
      ),
    },

    {
      title: "Status",
      render: (text, record) => (
        <>{GetManagmentUserClaimInternalStatus(record?.internal_status,record?.original_claim_id?.resubmission,internalDesignation)}</>
      ),
    },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const [currentpageSize, setCurrentpageSize] = useState(10);
  // const [total, setTotal] = useState(0);

  const fetchDisputedClaimsData = async () => {
    const response = await Axios.fetchAxiosData(config.GetAllDisputedClaimsManagement, {
      params: {
        page: currentPage,
        pageSize: currentpageSize,
        search,
        // claimDisputeStatus:claimDisputeStatus || "ALL",
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
    setTotal(response?.data?.pagination.totalRecords);
  };
  useEffect(() => {
    fetchClaimsData();
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

  // const onSearch = async () => {
  //   fetchDisputedClaimsData();
  // };


  useEffect(() => {
    GetClaimsData();
  }, [ search, startDate, endDate, claimInternalStatus]);

  const GetClaimsData = async () => {
    try {
      const response = await Axios.fetchAxiosData(config.GetClaimsMan, {
        params: {
          search,
          startDate,
          endDate,
          claimInternalStatus
        },
      });

      // console.log("response",response)
      setMyClaimsData(response?.data?.records || []);
      setMyTotal(response?.data?.pagination?.totalRecords || 0);
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to fetch claims data",
      });
    }
  };
  // console.log("claimsData", claimsData)

  const handleCardClick = (status) => {
    // console.log(status)
    navigate("/management/claims", { state: { claimInternalStatus: status } });
  };
  

 useEffect(() => {
    let approvalCount = 0;
    let rejectedCount = 0;
    let pendingCount = 0;
    let remainingCount = 0;
    let settledCount = 0;
    let clarificationCount = 0;
    let invalidCount = 0;
    
  
    myclaimsData.forEach((item) => {

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
  }, [myclaimsData]);  


  const headers = [
    "S.No",
    "Claim ID",
    "OPD Date",
    "Claim Type",
    "Name",
    // "Doctor Name",
    // "Hospital / Clinic Name",
    "Act. Bill Amt.",
    "Claimable Amt.",
    "Status",
    "Dispute Status",
  ];

  const items = [
    { title: "Pending",  icon: pendingIcon },
    { title: "In process",  icon: inprocessIcon },
    { title: "Approved",  icon: approvedIcon },
    { title: "Settled",  icon: settledIcon },
    { title: "Invalid", icon: invalidIcon },
    { title: "Rejected", icon: rejectedIcon },

  ];

  const getStepsStatus = (claimStatus) => {
    return items?.filter((item) => {
      if (claimStatus === constantValue.REJECTED) {
        return item.title !== "Approved" && item.title !== "Settled" && item.title !== "Invalid";
      }
      if (claimStatus === constantValue.APPROVED_BY_VERIFIER || claimStatus === constantValue.APPROVED_BY_FINANCER || claimStatus === constantValue.APPROVED_BY_MANAGER || claimStatus === constantValue.SETTLED) {
        return item.title !== "In process";
      }

      return true;
    })?.map((item) => {
      let status = "wait";
      let iconClass = "icon-grey";
          if (claimStatus >= constantValue.NO_ACTION && item.title === "Pending") status = "finish";

          if ((claimStatus === constantValue.CLARIFICATION || claimStatus === constantValue.REJECTED)
             && item.title === "In process") status = "finish";

          if (internalDesignation === CONSTANTS.DESIGNATIONS[3].internal_id){
            if ((claimStatus === constantValue.APPROVED_BY_VERIFIER || claimStatus === constantValue.APPROVED_BY_FINANCER || claimStatus === constantValue.APPROVED_BY_MANAGER || claimStatus === constantValue.SETTLED) && item.title === "Approved") status = "finish";
          }
          else if(internalDesignation === CONSTANTS.DESIGNATIONS[1].internal_id){
            if ((claimStatus === constantValue.APPROVED_BY_MANAGER || claimStatus === constantValue.APPROVED_BY_FINANCER || claimStatus === constantValue.SETTLED) && item.title === "Approved") status = "finish";
          }
          else if(internalDesignation === CONSTANTS.DESIGNATIONS[4].internal_id){
            if ((claimStatus === constantValue.APPROVED_BY_FINANCER || claimStatus === constantValue.SETTLED) && item.title === "Approved") status = "finish";
          }
          
          if (claimStatus === constantValue.SETTLED && item.title === "Settled") status = "finish";
          if (claimStatus === constantValue.INVALID && item.title === "Invalid") status = "finish";
          if (claimStatus === constantValue.REJECTED && item.title === "Rejected") status = "finish";
         
            if (status === "finish") {
              iconClass = "icon-default";
            }
        
      return {
        ...item,
        status,
        iconClass:  iconClass,
      };
    });
  };

  const fetchClaimsData = async () => {
    try {
      const response = await Axios.fetchAxiosData(config.GetClaimsManagement, {
        params: {
          pageSize: 1000,
        }
      });

      // Store unfiltered data
      setAllClaimsData(response.data?.records);

      const fiveDaysAgo = dayjs().subtract(5, 'days').endOf('day');

      // Filter data based on role and time
      const filteredData = response.data?.records.filter((record) => {
        const isOlderThanFiveDays = dayjs(record?.createdAt).isBefore(fiveDaysAgo);
        const isRoleSpecific = (internalDesignation === CONSTANTS.DESIGNATIONS[3].internal_id && record.internal_status === constantValue.NO_ACTION) ||
                                (internalDesignation === CONSTANTS.DESIGNATIONS[1].internal_id && (record.internal_status === constantValue.NO_ACTION || record.internal_status === constantValue.APPROVED_BY_VERIFIER)) ||
                                (internalDesignation === CONSTANTS.DESIGNATIONS[4].internal_id && (record.internal_status === constantValue.NO_ACTION || record.internal_status === constantValue.APPROVED_BY_VERIFIER || record.internal_status === constantValue.APPROVED_BY_MANAGER)) ||
                                (internalDesignation === CONSTANTS.DESIGNATIONS[2].internal_id && record.internal_status === constantValue.NO_ACTION);

        return isOlderThanFiveDays && isRoleSpecific;
      });

      setClaimsData(filteredData);
      setTotalClaims(response.data?.pagination?.totalRecords);
      setLatestClaims(filteredData.slice(0, 5));
    } catch (error) {
      console.error("Error fetching claims:", error);
    }
  };

  const fetchDisputeData = async () => {
      const result = await Axios.fetchAxiosData(config.GetAllDisputedClaimsManagement, {
        params: { pageSize: 1000 }
      });
      setDisputedClaims(result.data?.records);  
  };


  const constantValue = CONSTANTS.CLAIM_STATUS.INTERNAL_STATUS;
  const constantValueDispute = CONSTANTS.CLAIM_STATUS.DISPUTE_STATUS;

  const countSettledClaims = claimsData?.filter(claim => claim.internal_status === constantValue.SETTLED).length;
  const countInvalidClaims = claimsData?.filter(claim => claim.internal_status === constantValue.INVALID).length;
  const countRejectedClaims = claimsData?.filter(claim => claim.internal_status === constantValue.REJECTED).length;
  
  const countPendingClaimsVerifier = claimsData?.filter(claim => claim.internal_status === constantValue.NO_ACTION ).length;
  const countPendingClaimsManager = claimsData?.filter(claim => claim.internal_status === constantValue.NO_ACTION || claim.internal_status === constantValue.APPROVED_BY_VERIFIER).length;
  const countPendingClaimsFinancer = claimsData?.filter(claim => claim.internal_status === constantValue.NO_ACTION || claim.internal_status === constantValue.APPROVED_BY_VERIFIER || claim.internal_status === constantValue.APPROVED_BY_MANAGER).length;
  const countPendingClaimsManagement = claimsData?.filter(claim => claim.internal_status === constantValue.NO_ACTION ).length;

  const countApprovedClaimsVerifier = claimsData?.filter(claim => claim.internal_status === constantValue.APPROVED_BY_VERIFIER || claim.internal_status === constantValue.APPROVED_BY_FINANCER || claim.internal_status === constantValue.APPROVED_BY_MANAGER || claim.internal_status === constantValue.APPROVED).length;
  const countApprovedClaimsManager = claimsData?.filter(claim => claim.internal_status === constantValue.APPROVED_BY_MANAGER || claim.internal_status === constantValue.APPROVED_BY_FINANCER || claim.internal_status === constantValue.APPROVED).length;
  const countApprovedClaimsFinancer = claimsData?.filter(claim => claim.internal_status === constantValue.APPROVED_BY_FINANCER || claim.internal_status === constantValue.APPROVED ).length;
  const countApprovedClaimsManagement = claimsData?.filter(claim => claim.internal_status === constantValue.APPROVED ).length;

  const countClarificationClaims = claimsData?.filter(claim => claim.internal_status === constantValue.CLARIFICATION).length;

  const disputeAvailable = disputedClaims?.filter(claim => claim.dispute === true).length;
  const totalDisputedClaims = disputedClaims?.filter(claim => claim.dispute_status === constantValueDispute.RAISED).length;
  const disputeRejected = disputedClaims?.filter(claim => claim.dispute_status === constantValueDispute.REJECTED).length;
  const disputeApproved = disputedClaims?.filter(claim => claim.dispute_status === constantValueDispute.APPROVED).length;
  const disputeSettled = disputedClaims?.filter(claim => claim.dispute_status === constantValueDispute.SETTLED).length;

  const disputePending =  disputedClaims?.filter(claim => claim.dispute_status === constantValueDispute.IN_PROCESS).length;


  useEffect(() => {
    fetchClaimsData();
    fetchDisputeData();
  }, []);

  let PendingDrill;
  if (internalDesignation === CONSTANTS.DESIGNATIONS[3].internal_id){
    PendingDrill = constantValue.NO_ACTION;
  }
  else if( internalDesignation === CONSTANTS.DESIGNATIONS[1].internal_id){
    PendingDrill= `${constantValue.APPROVED_BY_VERIFIER},${constantValue.NO_ACTION}`;
  }
  else if( internalDesignation === CONSTANTS.DESIGNATIONS[4].internal_id){
    PendingDrill = `${constantValue.APPROVED_BY_VERIFIER},${constantValue.APPROVED_BY_MANAGER},${constantValue.NO_ACTION}`;
  }
  else if(internalDesignation === CONSTANTS.DESIGNATIONS[2].internal_id){
    PendingDrill = `${constantValue.NO_ACTION}`
  }

  let ApprovedDrill;
  if (internalDesignation === CONSTANTS.DESIGNATIONS[3].internal_id){
    ApprovedDrill = `${constantValue.APPROVED_BY_VERIFIER},${constantValue.APPROVED_BY_FINANCER},${constantValue.APPROVED_BY_MANAGER},${constantValue.APPROVED}`;
  }
  else if( internalDesignation === CONSTANTS.DESIGNATIONS[1].internal_id){
    ApprovedDrill= `${constantValue.APPROVED_BY_MANAGER},${constantValue.APPROVED_BY_FINANCER},${constantValue.APPROVED}`;
  }
  else if( internalDesignation === CONSTANTS.DESIGNATIONS[4].internal_id){
    ApprovedDrill = `${constantValue.APPROVED_BY_FINANCER},${constantValue.APPROVED}`;
  }
  else if(internalDesignation === CONSTANTS.DESIGNATIONS[2].internal_id){
    ApprovedDrill = `${constantValue.APPROVED}`;
  }

  return (
    <>
      <div className="container-fluid">
      <div className="my-4">
      <Row gutter={[16, 16]}>
        <Col span={3} xs={24} sm={12} md={8} lg={3}>
          <div
            onClick={() => handleCardClick("")}
            className="cursor-pointer"
            style={{ cursor: "pointer" }}
          >
            <Card bordered className="card-body bg-light-blue rounded-4 shadow-sm">
              <Statistic
                title={<span style={{ fontSize: "1.3rem", color: "black" }}>Total</span>}
                value={mytotal}
                precision={0}
                valueStyle={{ color: "#3f8600", fontSize: "1.8rem", fontWeight: "500" }}
              />
            </Card>
          </div>
        </Col>

        <Col span={3} xs={24} sm={12} md={8} lg={3}>
          <div onClick={() => handleCardClick("0")} className="cursor-pointer"  style={{ cursor: "pointer" }}>
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

      {/* {
        disputeAvailable > 0 &&(
        <div className="row mt-3">
          <div className="col-12">
          <Alert 
          message={
          <div className="d-flex"> 
            <div className="col-2 text-danger text-center"><span className="fw-bold ">Total Disputes Raised -</span> {totalDisputedClaims} <Link to="/management/claims/disputed/?claimDisputeStatus=1">
                  <FontAwesomeIcon icon={faUpRightFromSquare} className="textblue ms-2" size="xs"/>
                  </Link></div>
            <div className="mx-2 text-center text-danger">|</div> 
          <div className="col-2 text-secondary text-center"><span className="fw-bold">Pending Disputes -</span> {disputePending}<Link to="/management/claims/disputed/?claimDisputeStatus=2">
                  <FontAwesomeIcon icon={faUpRightFromSquare} className="textblue ms-2" size="xs"/>
                  </Link></div> 
          <div className="mx-2 text-center text-danger">|</div> 
            <div className="col-2 text-success text-center"><span className="fw-bold">Approved Disputes -</span> {disputeApproved}<Link to="/management/claims/disputed/?claimDisputeStatus=3">
                  <FontAwesomeIcon icon={faUpRightFromSquare} className="textblue ms-2" size="xs"/>
                  </Link></div>
            <div className="mx-2 text-center text-danger">|</div> 
            <div className="col-2 text-success text-center"><span className="fw-bold">Settled Disputes -</span> {disputeSettled}<Link to="/management/claims/disputed/?claimDisputeStatus=12">
                  <FontAwesomeIcon icon={faUpRightFromSquare} className="textblue ms-2" size="xs"/>
                  </Link></div>
                  <div className="mx-2 text-center text-danger">|</div> 

            <div className="col-2 text-danger text-center"><span className="fw-bold">Rejected Disputes -</span> {disputeRejected}<Link to="/management/claims/disputed/?claimDisputeStatus=4">
                  <FontAwesomeIcon icon={faUpRightFromSquare} className="textblue ms-2" size="xs"/>
                  </Link></div>
          </div>
          } 
          type="error" />
          </div>
        </div>
        )
      } */}
        

        {/* <div className="row mt-3">
          <div className="col-12">
          <Tabs
            defaultActiveKey="1"
            activeKey={activeKey}
            type="card"
            size="small"
            onChange={handleTabChange}
            className="custom-tabs"
            tabBarExtraContent= {<p className="textblue fw-bold">Recent Claims</p>}
          >
            {latestClaims?.map((claim, index) => (
              <Tabs.TabPane
                key={index.toString()} 
                tab={
                <div style={{lineHeight:0.2}}>
                   <h6 className="text-white">{`Claim ${index + 1}`}</h6>
                   <p className="text-white" style={{fontSize:"0.7rem"}}>{claim.claim_id}</p>
                </div>}
                className="custom-tabpane bg-light-blue py-4 px-5 border-tabcard"
              >
               {claim?.internal_status === constantValue.SETTLED ?(
                <>
                <div className="text-center">
                <img src={congoicon} alt="congoicon" />
                 <h3 className="fw-bold mt-1">Done</h3>
                 <h6 className="fw-bold">Claim has been settled on {Utils.DateFormat(claim?.claim_closure_Date)}.</h6>
                </div>               
                </>
               ):(
                <>
                <Steps style={{ margin: "3rem 0" }} className="custom-steps">
                  {getStepsStatus(claim?.internal_status)?.map((item) => (
                    <Steps.Step
                      key={item.title}
                      title={item.title}
                      status={item.status}
                      icon={<img src={item.icon} className={item.iconClass} alt={item.title} />}
                    />
                  ))}
                </Steps>
               </>)}
               
              </Tabs.TabPane>
            ))}
          </Tabs>
          </div>          
        </div> */}
        <div className="container">
        <Row justify="end" style={{ marginBottom: "1rem" }}>
          <Col>
          {/* <Text
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
            /> */}
         
          </Col>
          
          <Col span={5}>
            {/* <RangePicker
              format="DD/MM/YYYY"
              disabledDate={disabledDate}
              onChange={handleDateRangeChange}
              style={{ marginRight: "0.5rem" }}
              defaultValue={[dayjs().subtract(30, "day"), dayjs()]}
            /> */}
           
          </Col>
          <Col span={6}>
            {/* <Search
              placeholder="Search"
              onSearch={onSearch}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              enterButton
            /> */}
          </Col>
        </Row>
        <div className="row d-flex justify-content-between">
          <div className="col-7">
            {/* <h5>Disputed Claims</h5> */}
          </div>
          <div className="col-5 d-flex gap-2 justify-content-end">
            <div className="col-3">
              {/* <p>
                <span>(</span>
                <span className="text-danger">*</span>Amount in &#8377;)
              </p> */}
            </div>
          </div>
        </div>
        <div className="row">
        <h5 style={{marginTop: "1rem", textAlign: "center"}}>Turnaround Time (TAT)</h5>
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
      </div>
    </>
  );
};

export default ManagementDashboard;
