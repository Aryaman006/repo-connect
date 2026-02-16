import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Input,
  Tabs,
  Select,
  Steps,
  Tooltip,
  Alert,
  Button,
  Modal,
  Card,
  Avatar,
  Badge,
  Statistic,
  Col,
  Row,
} from "antd";
import { Axios } from "../../axios/axiosFunctions";
import { Link } from "react-router-dom";
import config from "../../config/config";
import AmbuDash from "../../assets/AmbuDash.png";
import dashAvtar from "../../assets/dashAvtar.svg";
import CheckupDash from "../../assets/CheckupDash.png";
import DiagDash from "../../assets/DiagDash.png";
import InsuDash from "../../assets/InsuDash.png";
import submittedIcon from "../../assets/submittedIcon.png";
import inprocessIcon from "../../assets/inprocessIcon.png";
import OfflineDocDash from "../../assets/OfflineDocDash.png";
import OnlineDocDash from "../../assets/OnlineDocDash.png";
import PharmaDash from "../../assets/PharmaDash.png";
import settledIcon from "../../assets/settleIcon.png";
import rejectedIcon from "../../assets/rejectedIcon.png";
import congoicon from "../../assets/congo.png";
import { faUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CONSTANTS from "../../constant/Constants";
import dayjs from "dayjs";
import { useAuth } from "../../context/authProvider";
const UserDashboard = () => {
  const navigate = useNavigate();
  const handleTabChange = (key) => {
    setActiveKey(key);
  };
  const { setSubscriberType, setCorporate } = useAuth();
  const [activeKey, setActiveKey] = useState("0");
  const [claimsData, setClaimsData] = useState([]);
  const [totalClaims, setTotalClaims] = useState([]);
  const [latestClaims, setLatestClaims] = useState([]);
  const [profileData, setProfileData] = useState({});
  const [planExpired, setPlanExpired] = useState(false);

  const fetchProfileData = async () => {
    try {
      const time = await Axios.fetchAxiosData(config.CurrentTime);

      const response = await Axios.fetchAxiosData(config.GetProfile);

      setProfileData(response?.data);
      setCorporate(response.data.corporate);
      setSubscriberType(response.data.subscriber_type);
      if (dayjs(response?.data.plan?.end_date).isBefore(time.data))
        setPlanExpired(true);
    } catch (error) {
      setPlanExpired(false);
    }
  };
  const items = [
    { title: "Submitted", icon: submittedIcon },
    { title: "In process", icon: inprocessIcon },
    // { title: "Approved",  icon: approvedIcon },
    { title: "Settled", icon: settledIcon },
    { title: "Rejected", icon: rejectedIcon },
  ];

  const constantValue = CONSTANTS.CLAIM_STATUS.STATUS;

  const getStepsStatus = (claimStatus) => {
    return items
      ?.filter((item) => {
        if (claimStatus === constantValue.REJECTED) {
          return item.title !== "Approved" && item.title !== "Settled";
        }
        return true;
      })
      ?.map((item) => {
        let status = "wait";
        let tooltip = "";
        let iconClass = "icon-grey";
        if (claimStatus >= constantValue.PENDING && item.title === "Submitted")
          status = "finish";

        if (
          (claimStatus === constantValue.IN_PROCESS ||
            claimStatus === constantValue.APPROVED ||
            claimStatus === constantValue.SETTLED ||
            claimStatus === constantValue.REJECTED ||
            claimStatus === constantValue.CLARIFICATION ||
            claimStatus === constantValue.INVALID) &&
          item.title === "In process"
        )
          status = "finish";

        // if ((claimStatus === constantValue.APPROVED || claimStatus === constantValue.SETTLED) && item.title === "Approved") status = "finish";

        if (claimStatus === constantValue.SETTLED && item.title === "Settled")
          status = "finish";
        if (claimStatus === constantValue.REJECTED && item.title === "Rejected")
          status = "finish";
        if (
          (claimStatus === constantValue.CLARIFICATION ||
            claimStatus === constantValue.INVALID) &&
          item.title === "Approved"
        )
          status = "wait";

        if (
          claimStatus === constantValue.CLARIFICATION ||
          claimStatus === constantValue.INVALID
        ) {
          tooltip = "Additional info about this step";
        }

        if (status === "finish") {
          iconClass = "icon-default";
        }

        return {
          ...item,
          status,
          iconClass: iconClass,
          tooltip,
        };
      });
  };

  const fetchClaimsData = async () => {
    try {
      const response = await Axios.fetchAxiosData(config.GetAllClaims, {
        params: { pageSize: 1000 },
      });
      setClaimsData(response.data?.records);
      setTotalClaims(response.data?.pagination?.totalRecords);
      setLatestClaims(response.data?.records.slice(0, 5));
    } catch (error) {
      console.error("Error fetching claims:", error);
    }
  };

  const countSettledClaims = claimsData?.filter(
    (claim) => claim.status === CONSTANTS.CLAIM_STATUS.STATUS.SETTLED
  ).length;
  const countInvalidClaims = claimsData?.filter(
    (claim) => claim.status === CONSTANTS.CLAIM_STATUS.STATUS.INVALID
  ).length;
  const countRejectedClaims = claimsData?.filter(
    (claim) =>
      claim.status === CONSTANTS.CLAIM_STATUS.STATUS.REJECTED
  ).length;

  const countSubmittedClaims = claimsData?.filter(
    (claim) => claim.status === CONSTANTS.CLAIM_STATUS.STATUS.PENDING
  ).length;
  const countInProcessClaims = claimsData?.filter(
    (claim) => claim.status === CONSTANTS.CLAIM_STATUS.STATUS.IN_PROCESS
  ).length;
  const countApprovedClaims = claimsData?.filter(
    (claim) => claim.status === CONSTANTS.CLAIM_STATUS.STATUS.APPROVED
  ).length;
  const countClarificationClaims = claimsData?.filter(
    (claim) => claim.status === CONSTANTS.CLAIM_STATUS.STATUS.CLARIFICATION
  ).length;

  const totalRejectedClaims = countRejectedClaims + countInvalidClaims;
  const totalPendingClaims =
    countSubmittedClaims +
    countInProcessClaims +
    countApprovedClaims +
    countClarificationClaims;

  const totalDisputedClaims = claimsData?.filter(
    (claim) => claim.dispute === true
  ).length;
  const disputeRejected = claimsData?.filter(
    (claim) =>
      claim.dispute_details === CONSTANTS.CLAIM_STATUS.DISPUTE_STATUS.REJECTED
  ).length;
  const disputeApproved = claimsData?.filter(
    (claim) =>
      claim.dispute_details === CONSTANTS.CLAIM_STATUS.DISPUTE_STATUS.APPROVED
  ).length;

  const disputePending = claimsData?.filter(
    (claim) =>
      claim.dispute_details ===
        CONSTANTS.CLAIM_STATUS.DISPUTE_STATUS.IN_PROCESS ||
      claim.dispute_details === CONSTANTS.CLAIM_STATUS.DISPUTE_STATUS.RAISED
  ).length;

  useEffect(() => {
    fetchProfileData();
    fetchClaimsData();
    fetchExpiredMembers();
  }, []);

  const fetchExpiredMembers = async () => {
    const response = await Axios.fetchAxiosData(config.GetProfile);
    setProfileData(response?.data?.members);
  };
  const endDate = new Date(profileData?.plan?.end_date);
  const currentDate = new Date();
  const isExpired = currentDate > endDate;

  const handleMFineRedirect = async () => {
    const response = await Axios.fetchAxiosData(config.GetMfineRedirectData);
    if (response.success === true) {
      const redirectUrl = response?.data?.redirect_url;
      Modal.confirm({
        title: "Confirmation",
        content: "Consult with top doctors.",
        okText: "Yes",
        cancelText: "No",
        onOk() {
          window.open(redirectUrl, "_blank");
        },
        onCancel() {
          console.log("Redirect canceled");
        },
      });
    } else {
      console.error("API request failed");
    }
  };

  const handlePharmacyRedirect = async () => {
    const redirectUrl1 =
      "https://www.apollopharmacy.in/?utm_source=HANA_Brand&utm_medium=Brand&utm_campaign=OPDSure_Pharma";
    const redirectUrl2 =
      "https://pharmeasy.in/online-medicine-order?utm_source=alz-finlyt&utm_medium=alliance&utm_campaign=finlyt-20april2022";

    Modal.confirm({
      title: "Confirmation",
      content: "Please choose the Pharmacy.",
      footer: [
        <div
          key={111}
          style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}
          className="mt-3"
        >
          <Button key="no" type="default" onClick={() => Modal.destroyAll()}>
            No
          </Button>
          <Button
            key="redirect1"
            type="primary"
            onClick={() => window.open(redirectUrl1, "_blank")}
          >
            Apollo
          </Button>
          <Button
            key="redirect2"
            type="primary"
            onClick={() => window.open(redirectUrl2, "_blank")}
          >
            PharmEasy
          </Button>
        </div>,
      ],
    });
  };

  const handleDiagnosticsRedirect = async () => {
    const redirectUrl1 =
      "https://www.apollopharmacy.in/?utm_source=HANA_Brand&utm_medium=Brand&utm_campaign=OPDSure_Pharma";
    window.open(redirectUrl1, "_blank");
    return;
    // Modal.confirm({
    //   title: 'Confirmation',
    //   content: 'Do you want to proceed to the Apollo Pharmacy?',
    //   okText: 'Yes',
    //   cancelText: 'No',
    //   onOk() {
    //     window.open(redirectUrl1, '_blank');
    //   },
    //   // onCancel() {
    //   //   console.log('Redirect canceled');
    //   // },
    // });
  };
  const handleCheckupsRedirect = async () => {
    const redirectUrl1 = "/user/health-plans";
    navigate(redirectUrl1);
    return;
    // Modal.confirm({
    //   title: 'Confirmation',
    //   content: 'Do you want to proceed to book Health Checkups?',
    //   okText: 'Yes',
    //   cancelText: 'No',
    //   onOk() {
    //     window.open(redirectUrl1, '_blank');
    //   },
    //   // onCancel() {
    //   //   console.log('Redirect canceled');
    //   // },
    // });
  };

  const handleInsuranceRedirect = async () => {
    const redirectUrl1 = "https://www.smcinsurance.com/";
    window.open(redirectUrl1, "_blank");
    return;
    // Modal.info({
    //   title: 'Information',
    //   content: 'In case of an emergency, please call 112 immediately.',
    //   okText: 'OK',
    //   cancelText: 'No',
    //   // onOk() {
    //   //   window.open(redirectUrl1, '_blank');
    //   // },
    //   // onCancel() {
    //   //   console.log('Redirect canceled');
    //   // },
    // });
  };
  const handleAmbulanceRedirect = async () => {
    const redirectUrl1 = "/user/health-plans";
    Modal.info({
      title: "Information",
      content: "In case of an emergency, please call 108 immediately.",
      okText: "OK",
      cancelText: "No",
      // onOk() {
      //   window.open(redirectUrl1, '_blank');
      // },
      // onCancel() {
      //   console.log('Redirect canceled');
      // },
    });
  };

  const handleInClinicRedirect = async () => {
    const redirectUrl1 = "/user/claims";
    Modal.info({
      // title: 'Confirmation',
      content: "Visit any clinic or hospital.",
      okText: "OK",
      cancelText: "Cancel",
      onOk() {
        // navigate(redirectUrl1)
      },
      // onCancel() {
      //   console.log('Redirect canceled');
      // },
    });
  };

  const cardData = [
    {
      id: 1,
      title: "In-Clinic Consultation",
      more_info: "Visit any clinic or hospital",
      navigate: handleInClinicRedirect,
      btnTxt: "Order Now",
      expiryCheck: false,
      img: OfflineDocDash,
    },
    {
      id: 2,
      title: "Online Consultation",
      more_info: "Call/Video Consultations",
      navigate: handleMFineRedirect,
      btnTxt: "Book Now",
      expiryCheck: true,
      img: OnlineDocDash,
    },
    {
      id: 3,
      title: "Pharmacy",
      more_info: "Order Pharmacy",
      navigate: handlePharmacyRedirect,
      btnTxt: "Buy Now",
      expiryCheck: false,
      img: PharmaDash,
    },
    {
      id: 4,
      title: "Diagnostics",
      more_info: "Order Diagnostics",
      navigate: handleDiagnosticsRedirect,
      btnTxt: "Book Now",
      expiryCheck: false,
      img: DiagDash,
    },
    {
      id: 5,
      title: "Health Checkups",
      more_info: "Preventive Health Checkups",
      navigate: handleCheckupsRedirect,
      btnTxt: "Book Now",
      expiryCheck: false,
      img: CheckupDash,
    },
    {
      id: 6,
      title: "Ambulance",
      more_info: "Emergency Ambulance",
      navigate: handleAmbulanceRedirect,
      btnTxt: "Book Now",
      expiryCheck: true,
      img: AmbuDash,
    },
    {
      id: 7,
      title: "Simplify Insurance",
      more_info: "5k+ People Insured",
      navigate: handleInsuranceRedirect,
      btnTxt: "Learn More",
      expiryCheck: false,
      img: InsuDash,
    },
  ];
  return (
    <>
      <div className="container-fluid">
        {/* <div className="row mb-3 px-0">
          <img src={docBanner} onClick={handleMFineRedirect}  alt="banner image" hidden={isExpired} className="img-fluid" style={{cursor:"pointer"}}/>
        </div> */}

        <Row gutter={[16, 16]}>
          {" "}
          {/* gutter={[16, 16]} [horizontal, vertical] */}
          <Col span={6} xs={24} sm={12} md={12} lg={6}>
            <Link
              to="/user/claims/?statusFilter=ALL"
              className="text-decoration-none text-black"
            >
              <Card
                bordered={true}
                className="card-body bg-light-blue rounded-4 shadow-sm"
              >
                <Statistic
                  title={
                    <span style={{ fontSize: "1.1rem", color: "black" }}>
                      Total Claims
                    </span>
                  }
                  value={totalClaims}
                  precision={0}
                  valueStyle={{
                    color: "#3f8600",
                    fontSize: "1.3rem",
                    fontWeight: "500",
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                  // prefix={<ArrowUpOutlined />}
                  // suffix="%"
                />
              </Card>
            </Link>
          </Col>
          <Col span={6} xs={24} sm={12} md={12} lg={6}>
            <Link
              to="/user/claims/?statusFilter=0"
              className="text-decoration-none text-black"
            >
              <Card
                bordered={true}
                className="card-body bg-light-blue rounded-4 shadow-sm"
              >
                <Statistic
                  title={
                    <span style={{ fontSize: "1.1rem", color: "black" }}>
                      Pending
                    </span>
                  }
                  value={countSubmittedClaims}
                  precision={0}
                  valueStyle={{
                    color: "#cf1322",
                    fontSize: "1.3rem",
                    fontWeight: "500",
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                  // prefix={<ArrowDownOutlined />}
                  // suffix="%"
                />
              </Card>
            </Link>
          </Col>
          <Col span={6} xs={24} sm={12} md={12} lg={6}>
            <Link
              to="/user/claims/?statusFilter=5"
              className="text-decoration-none text-black"
            >
              <Card
                bordered={true}
                className="card-body bg-light-blue rounded-4 shadow-sm"
              >
                <Statistic
                  title={
                    <span style={{ fontSize: "1.1rem", color: "black" }}>
                      Rejected
                    </span>
                  }
                  value={totalRejectedClaims}
                  precision={0}
                  valueStyle={{
                    color: "#cf1322",
                    fontSize: "1.3rem",
                    fontWeight: "500",
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                  // prefix={<ArrowDownOutlined />}
                  // suffix="%"
                />
              </Card>
            </Link>
          </Col>
          <Col span={6} xs={24} sm={12} md={12} lg={6}>
            <Link
              to="/user/claims/?statusFilter=12"
              className="text-decoration-none text-black"
            >
              <Card
                bordered={true}
                className="card-body bg-light-blue rounded-4 shadow-sm"
              >
                <Statistic
                  title={
                    <span style={{ fontSize: "1.1rem", color: "black" }}>
                      Settled
                    </span>
                  }
                  value={countSettledClaims}
                  precision={0}
                  valueStyle={{
                    fontSize: "1.3rem",
                    fontWeight: "500",
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                  // prefix={<ArrowDownOutlined />}
                  // suffix="%"
                />
              </Card>
            </Link>
          </Col>
          <Col span={6} xs={24} sm={12} md={12} lg={6}>
            <Link
              to="/user/claims/?statusFilter=1"
              className="text-decoration-none text-black"
            >
              <Card
                bordered={true}
                className="card-body bg-light-blue rounded-4 shadow-sm"
              >
                <Statistic
                  title={
                    <span style={{ fontSize: "1.1rem", color: "black" }}>
                      Approved
                    </span>
                  }
                  value={countApprovedClaims}
                  precision={0}
                  valueStyle={{
                    fontSize: "1.3rem",
                    fontWeight: "500",
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                  // prefix={<ArrowDownOutlined />}
                  // suffix="%"
                />
              </Card>
            </Link>
          </Col>
        </Row>

        {/* <div className="row mt-4">
          <div className="col-3">
                  <Link to="/user/claims/?statusFilter=ALL" className="text-decoration-none text-black">
            <div className="card border-1 rounded-4 " >
              <div className="card-body bg-light-blue rounded-4 shadow-sm">
                <h5 className="card-title">Claims</h5>
                <h4 className="card-subtitle my-2 fw-bold">
                  {totalClaims}
                </h4>
              </div>
            </div>
                  </Link>
          </div>
       
          
          <div className="col-3">
                  <Link to="/user/claims/?statusFilter=0,1,4,6" className="text-decoration-none text-black">
          <div className="card border-0">
              <div className="card-body bg-light-blue rounded-4 shadow-sm">
                <h5 className="card-title">Pending Claims</h5>
                <h4 className="card-subtitle my-2 fw-bold">
                  {totalPendingClaims}
                </h4>
              </div>
            </div>
                  </Link>
          </div>
          <div className="col-3">
                  <Link to="/user/claims/?statusFilter=2,7" className="text-decoration-none text-black">
          <div className="card border-0 ">
              <div className="card-body bg-light-blue rounded-4 shadow-sm">
                <h5 className="card-title">Rejected Claims</h5>
                <h4 className="card-subtitle my-2 fw-bold">
                  {totalRejectedClaims}
                </h4>
              </div>
            </div>
                  </Link>
          </div>
          <div className="col-3">            
                  <Link to="/user/claims/?statusFilter=12" className="text-decoration-none text-black">
          <div className="card border-0" >
              <div className="card-body bg-light-blue rounded-4 shadow-sm">
                <h5 className="card-title">Approved Claims</h5>
                <h4 className="card-subtitle my-2 fw-bold">
                  {countSettledClaims}
                </h4>
              </div>
            </div>
                  </Link>
          </div>
        </div> */}
        {totalDisputedClaims > 0 && (
          <div className="row mt-3">
            <div className="col-12">
              <Alert
                message={
                  <div className="d-flex flex-wrap justify-content-between">
                    <Link
                      to="/user/claims/?disputeFilter=ALL"
                      className="text-danger mx-2"
                      style={{ textDecoration: "none" }}
                    >
                      <span className="fw-bold">Total Disputes Raised -</span>{" "}
                      {totalDisputedClaims}
                      <FontAwesomeIcon
                        icon={faUpRightFromSquare}
                        className="textblue ms-2"
                        size="xs"
                      />
                    </Link>

                    <Link
                      to="/user/claims/?disputeFilter=2,1"
                      className="text-secondary mx-2"
                      style={{ textDecoration: "none" }}
                    >
                      <span className="fw-bold">Pending Disputes -</span>{" "}
                      {disputePending}
                      <FontAwesomeIcon
                        icon={faUpRightFromSquare}
                        className="textblue ms-2"
                        size="xs"
                      />
                    </Link>

                    <Link
                      to="/user/claims/?disputeFilter=4"
                      className="text-danger mx-2"
                      style={{ textDecoration: "none" }}
                    >
                      <span className="fw-bold">Rejected Disputes -</span>{" "}
                      {disputeRejected}
                      <FontAwesomeIcon
                        icon={faUpRightFromSquare}
                        className="textblue ms-2"
                        size="xs"
                      />
                    </Link>

                    <Link
                      to="/user/claims/?disputeFilter=3"
                      className="text-success mx-2"
                      style={{ textDecoration: "none" }}
                    >
                      <span className="fw-bold">Resolved Disputes -</span>{" "}
                      {disputeApproved}
                      <FontAwesomeIcon
                        icon={faUpRightFromSquare}
                        className="textblue ms-2"
                        size="xs"
                      />
                    </Link>
                  </div>
                }
                type="error"
              />
            </div>
          </div>
        )}

        {/* <div className="mt-4">
  <div className="row">
    {cardData.map(card => (
      <div className="col-12 col-md-6 col-lg-3 mb-4" key={card.id}>
        <Card
          hoverable
          style={{
            width: '100%',
            height: '220px', // Set a fixed height for the card
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            padding: '0px',
          }}
        >
          <h6 style={{ margin: '10px 0', fontWeight: 'bolder', color: "#243572" }}>{card.title}</h6>
          <div style={{ display: 'flex', alignItems: 'center', margin: '10px 0' }}>
  <div style={{ backgroundColor: '#f0f0f0', padding: '0px', borderRadius: '50%' }}>
    <Avatar src={card.img} size={80} />
  </div>
  <p className="text-purple" style={{ margin: '0', fontWeight: 'bold', marginLeft: '1rem' }}>
    {card.more_info}
  </p>
</div>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
          {card.expiryCheck && planExpired ? (
        <Tooltip title="Your plan has expired." color="blue">
          <Button
            type="primary"
            size="middle"
            onClick={card.navigate}
            disabled={planExpired} // Keep disabled logic
          >
            {card.btnTxt}
          </Button>
        </Tooltip>
      ) : (
        <Button
          type="primary"
          size="middle"
          onClick={card.navigate}
          disabled={card.expiryCheck ? planExpired : false}
        >
          {card.btnTxt}
        </Button>
      )}
          </div>
        </Card>
      </div>
    ))}
  </div>
</div> */}

        {/* ///////////////////// */}

        <div className="mt-4">
          <div className="row">
            {cardData.map((card) => (
              <div className="col-12 col-md-6 col-lg-4 mb-4" key={card.id}>
                <Card
                  hoverable
                  style={{
                    width: "100%",
                    // Set a fixed height for the card
                    position: "relative",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    padding: "0px",
                  }}
                >
                  <h6
                    className="text-center text-primary fw-bold"
                    style={{
                      marginBottom: "10px",
                    }}
                  >
                    {card.title}
                  </h6>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "10px",
                      marginBottom: "10px",
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: "#f0f0f0",
                        padding: "10px",
                        borderRadius: "50%",
                      }}
                    >
                      <Avatar src={card.img} size={85} />
                    </div>
                    <p
                      className="text-purple fw-bold m-0"
                      style={{
                        fontSize: "1rem",
                      }}
                    >
                      {card.more_info}
                    </p>
                  </div>
                  <div className="d-flex justify-content-center">
                    {card.expiryCheck && planExpired ? (
                      <Tooltip title="Your plan has expired." color="blue">
                        <Button
                          type="primary"
                          size="middle"
                          onClick={card.navigate}
                          disabled={planExpired}
                        >
                          {card.btnTxt}
                        </Button>
                      </Tooltip>
                    ) : (
                      <Button
                        type="primary"
                        size="middle"
                        onClick={card.navigate}
                        disabled={card.expiryCheck ? planExpired : false}
                      >
                        {card.btnTxt}
                      </Button>
                    )}
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* ///////////////// */}

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
                className="custom-tabpane bg-light-blue p-5 border-tabcard"
              >
               {claim?.status === constantValue.SETTLED ?(
                <>
                <div className="text-center">
                <img src={congoicon} alt="congoicon" />
                 <h3 className="fw-bold mt-3">Congratulations</h3>
                 <h6 className="fw-bold">Claim money will be reflect within 24 hrs</h6>
                 <p>Sit back and relax</p>
                </div>               
                </>
               ):(
                <>
                <Steps style={{ margin: "3rem 0" }} className="custom-steps">
                  {getStepsStatus(claim?.status)?.map((item) => (
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

        {/* ///////////////////////// */}
        <div className="row mt-3">
          <div className="col-12">
            <Tabs
              defaultActiveKey="1"
              activeKey={activeKey}
              type="card"
              size="small"
              onChange={handleTabChange}
              className="custom-tabs"
              tabBarExtraContent={
                <p className="textblue fw-bold mb-0">Recent Claims</p>
              }
            >
              {latestClaims?.map((claim, index) => (
                <Tabs.TabPane
                  key={index.toString()}
                  tab={
                    <div style={{ lineHeight: 1 }} className="text-center">
                      <h6 className="text-white mb-0">{`Claim ${
                        index + 1
                      }`}</h6>
                      <p
                        className="text-white mb-0"
                        style={{ fontSize: "0.8rem" }}
                      >
                        {claim.claim_id}
                      </p>
                    </div>
                  }
                  className="custom-tabpane bg-light-blue p-5 border-tabcard"
                >
                  {claim?.status === constantValue.SETTLED ? (
                    <div className="text-center">
                      <img
                        src={congoicon}
                        alt="Congratulations"
                        className="img-fluid"
                        style={{ maxWidth: "150px" }}
                      />
                      <h3 className="fw-bold mt-3">Congratulations</h3>
                      <h6 className="fw-bold">
                        Claim money will reflect within 24 hrs
                      </h6>
                      <p>Sit back and relax</p>
                    </div>
                  ) : (
                    <Steps
                      style={{ margin: "3rem 0" }}
                      className="custom-steps"
                      responsive={true}
                    >
                      {getStepsStatus(claim?.status)?.map((item) => (
                        <Steps.Step
                          key={item.title}
                          title={item.title}
                          status={item.status}
                          icon={
                            <img
                              src={item.icon}
                              className={`${item.iconClass} img-fluid`}
                              alt={item.title}
                            />
                          }
                        />
                      ))}
                    </Steps>
                  )}
                </Tabs.TabPane>
              ))}
            </Tabs>
          </div>
        </div>
        {/* ///////////// */}
      </div>
    </>
  );
};

export default UserDashboard;
