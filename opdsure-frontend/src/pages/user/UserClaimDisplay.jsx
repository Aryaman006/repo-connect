// import React, { useEffect, useState } from "react";
// import {Button, Modal, Tag, DatePicker,Row, Col, Select, Input, Tooltip  } from "antd";
// import {
//   PlusOutlined,
//   ArrowLeftOutlined,
//   EyeOutlined,
//   DeleteFilled,
//   CloseCircleOutlined,
//   DislikeFilled,
//   ExclamationCircleOutlined
// } from "@ant-design/icons";
// import dayjs from "dayjs";
// import { Link , useSearchParams} from "react-router-dom";
// import { Axios } from "../../axios/axiosFunctions";
// import config, { CONFIG_OBJ } from "../../config/config";
// import AntTable from "../../components/AntTable";
// import { GetSubscriberClaimStatus, GetSubscriberDisputeClaimStatus, Utils } from "../../utils";
// import CONSTANTS from "../../constant/Constants";
// const { confirm } = Modal;
// const { RangePicker } = DatePicker;
// const { Option } = Select;
// const { Search } = Input;
// import { Typography } from 'antd';
// const { Text } = Typography;
// import exportFunction from "../../utils/export";

// const UserClaimDisplay = () => {

//   // all states
//   const [data, setData] = useState([]);
//   const [userData, setUserData] = useState([]);
//   const [userReaction, setUserReaction] = useState(undefined);
//   const [dispute, setDispute] = useState(undefined);
//   const [documentModalOpen, setDocumentModalOpen] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [currentpageSize, setCurrentpageSize] = useState(10);
//   const [total, setTotal] = useState(0);
//   const [searchParams, setSearchParams] = useSearchParams();
//   const statusFilter = searchParams.get("statusFilter");
//   const disputeFilter = searchParams.get("disputeFilter");
//   const [search, setSearch] = useState(undefined);
//   const [sortOrder, setSortOrder] = useState(1);
//   const [startDate, setStartDate] = useState(
//     dayjs().subtract(30, "day").startOf("day").toISOString()
//   );
//   const [endDate, setEndDate] = useState(dayjs().toISOString());
//   const [claimStatus, setClaimStatus] = useState("ALL");
//   const [claimsDataExcel, setClaimsDataExcel] = useState([]);
//   const [profileData, setProfileData] = useState({});
//   const [planExpired,setPlanExpired] = useState(false);
//   sessionStorage.removeItem("opdClaimForm");
//   const fetchProfileData = async () => {
//     try {
//       const time = await Axios.fetchAxiosData(config.CurrentTime);

//       const response = await Axios.fetchAxiosData(config.GetProfile);
//       setProfileData(response?.data);
//       if(dayjs(response?.data.plan?.end_date).isBefore(time.data)) setPlanExpired(true)
//     } catch (error) {
//       setPlanExpired(false)
//     }

// };
//     const fetchclaimsData = async () => {
//       const response = await Axios.fetchAxiosData(
//         config.GetAllClaims,
//         { params: { page: currentPage, pageSize: currentpageSize, statusFilter: statusFilter || "ALL",
//           //  disputeFilter: disputeFilter || "ALL",
//         search,
//         claimStatus,
//         startDate,
//         endDate,
//            } },
//       );
//       setData(response?.data?.records);
//       const filteredRecords = response?.data?.records?.map((record) => ({
//         claim_id: record.claim_id,
//         createdAt: Utils.DateFormat(record.createdAt),
//         name: record.member_id?.name || "",
//         hospital: record.hospital,
//         bill_amount: record?.bill_amount?.toLocaleString("en-IN", {
//           minimumFractionDigits: 2,
//           maximumFractionDigits: 2,
//         }),
//         claimable_amount: record?.claimable_amount?.toLocaleString("en-IN", {
//           minimumFractionDigits: 2,
//           maximumFractionDigits: 2,
//         }),
//         status: GetSubscriberClaimStatus(record.status, record.subscriber_reaction)?.props?.children || "Unknown",
//         dispute_details: record.dispute ? GetSubscriberDisputeClaimStatus(record?.dispute_details)?.props?.children || "Unknown": "Raise Dispute",
//       }))|| [];
//       setClaimsDataExcel(filteredRecords);
//       setUserReaction(response?.data?.subscriber_reaction);
//       setTotal(response?.data?.pagination.totalRecords);
//       setDispute(response?.data?.pagination.dispute);
//     };
//     useEffect(() => {
//       fetchclaimsData();
//       fetchProfileData();
//     }, [currentPage, search, claimStatus, startDate, endDate]);

//     const claimsColumns = [
//       {
//         title: "S.No.",
//         render: (text, record, index) => {
//           const calculatedIndex = (currentPage - 1) * 10 + index + 1;
//           return <p className="text-center my-auto">{calculatedIndex}.</p>
//         },
//       },

//       {
//         title: "Claim ID",
//         sorter: (a, b) => a.claim_id.localeCompare(b.claim_id),
//         render: (text, record) => (
//           record.dispute ?
//         <Link to={`/user/addclaims/${record?._id}/?action=${CONSTANTS.CLAIM_STATUS.STATUS.DISPUTE}`}>
//             <p className="text-primary text-decoration-underline my-auto">{record?.claim_id}</p>
//           </Link>
//           :
//           <Link to={`/user/addclaims/${record?._id}/?action=${record.status}`}>
//             <p className="text-primary text-decoration-underline my-auto">{record?.claim_id}</p>
//           </Link>
//         ),
//       },
//       {
//         title: "Raised Date",
//         sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
//         render: (text, record) => (
//           <p className="text-center my-auto">
//             {Utils.DateFormat(record?.createdAt)}
//           </p>
//         ),  },
//       {
//         title: "Name",
//         sorter: (a, b) =>
//           (a.member_id?.name || "").localeCompare(b.member_id?.name || ""),
//         dataIndex: ["member_id","name"],

//       },
//       // {
//       //   title: "Doctor's Name",
//       //   render: (text, record) => <p className="text-center my-auto">{record?.doc_name}</p>,
//       // },
//       {
//         title: "Clinic/Hospital Name",
//         sorter: (a, b) => (a.hospital || "").localeCompare(b.hospital || ""),
//         render: (text, record) => <p className="my-auto">{record?.hospital}</p>,
//       },

//       {
//         title: "Act. Bill Amt.",
//         sorter: (a, b) => a.bill_amount - b.bill_amount,
//         render: (text, record) => <p className="text-center my-auto">{record?.bill_amount.toLocaleString("en-IN",{ minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>,
//       },

//       {
//         title: "Claimable Amt.",
//         sorter: (a, b) => a.claimable_amount - b.claimable_amount,
//         render: (text, record) => <p className="text-center my-auto">{record?.claimable_amount.toLocaleString("en-IN",{ minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>,
//       },
//       {
//         title: "Status / Approval Date",
//         align:"center",
//         render: (text, record) => {
//           const status = GetSubscriberClaimStatus(record.status, record.subscriber_reaction);
//           return (
//             <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
//               <div>{status}</div>
//               {record.status === CONSTANTS.CLAIM_STATUS.STATUS.APPROVED && record.claim_closure_Date && (
//                 <span style={{ marginTop: "0.5rem" }}>
//                   {dayjs(record.claim_closure_Date).format("DD/MM/YYYY")}
//                 </span>
//               )}
//             </div>
//           );
//         }
//       },
//       {
//         title: "Raise Dispute",
//         render: (_, record) => (
//           <>
//             {record.dispute ?
//             <Link to={`/user/claim/dispute/${record._id}`}>{GetSubscriberDisputeClaimStatus(record?.dispute_details)}</Link>
//             : ((
//              record.dispute ||
//              record.status === CONSTANTS.CLAIM_STATUS.STATUS.DISPUTE ||
//              record.status === CONSTANTS.CLAIM_STATUS.STATUS.CLARIFICATION ||
//              record.status === CONSTANTS.CLAIM_STATUS.STATUS.IN_PROCESS ||
//              record.status === CONSTANTS.CLAIM_STATUS.STATUS.PENDING) ? (
//               <Tag
//               disabled
//               icon={<ExclamationCircleOutlined />}
//             >Raise Dispute</Tag>
//             ) : (
//               <Link to={`/user/addclaims/${record?._id}/?action=${CONSTANTS.CLAIM_STATUS.STATUS.DISPUTE}`}>
//               <Tag
//                color="error"
//                 icon={<ExclamationCircleOutlined />}
//               >Raise Dispute</Tag>
//             </Link>

//             ))}
//           </>
//         ),
//       },
//     ];
//   const handleDocumentOk = () => {
//     setDocumentModalOpen(false);
//   };

//   const handlePageSizeChange = (size) => {
//     // setCurrentPage(1);
//     setCurrentpageSize(size);
//   };

//   const handlePageChange = (pageNumber) => {
//     setCurrentPage(pageNumber);
//   };

//   const disabledDate = (current) => {
//     return current && current >= dayjs().endOf("day");
//   };

//   const handleDateRangeChange = (dates, dateStrings) => {
//     const formattedDates = dateStrings.map((date, index) => {
//       const dayjsDate = dayjs(date, "DD/MM/YYYY");
//       if (index === 0) {
//         return dayjsDate.startOf("day").toISOString();
//       } else {
//         return dayjsDate.endOf("day").toISOString();
//       }
//     });
//     if (dates) {
//       setStartDate(formattedDates[0]);
//       setEndDate(formattedDates[1]);
//     }
//   };

//   const onSearch = async () => {
//     fetchclaimsData();
//   };

//   const handleExport = (type) => {
//     if (type === "pdf") {
//       exportFunction.exportToPDF(pdfData, headers, total, pdftitle,ExportFileName);
//     } else if (type === "excel") {
//       exportFunction.exportToExcel(dataWithHeaders, ExportFileName);
//     }
//   };

//   const headers = [
//     "S.No",
//     "Claim ID",
//     "Raised Date",
//     "Name",
//     "Hospital / Clinic Name",
//     "Act. Bill Amt.",
//     "Claimable Amt.",
//     "Status/Approval Date",
//     "Raise Dispute",
//   ];

//   const dataWithHeaders = [
//     headers,
//     ...claimsDataExcel?.map((item, index) => [
//       index + 1,
//       item.claim_id,
//       item.createdAt,
//       item.name,
//       item.hospital,
//       item.bill_amount,
//       item.claimable_amount,
//       item.status,
//       item.dispute_details,
//     ])
//   ];

//   const pdfData = claimsDataExcel?.map((item, index) => [
//     index + 1,
//     item.claim_id,
//     item.createdAt,
//     item.name,
//     item.hospital,
//     item.bill_amount,
//     item.claimable_amount,
//     item.status,
//     item.dispute_details,
//   ]);

//   const pdftitle = "OPDSure Claims Data";
//   const ExportFileName = "OpdSure_Claims_Data";

//   return (
//     <>
//       <div className="container">
//       <Row justify="end" style={{ marginBottom: "1rem" }}>
//           <Col>
//           <Text
//               // type="secondary"
//               style={{  marginTop: "0.5rem",marginRight:"0.5rem" }}
//             >
//              Status :
//             </Text>
//             <Select
//               allowClear
//               placeholder="Select Status"
//               style={{ width: "120px", marginRight: "0.5rem" }}
//               options={[
//                 { value: "ALL", label: "All" },
//                 {
//                   value: CONSTANTS.CLAIM_STATUS.STATUS.APPROVED,
//                   label: "Approved",
//                 },
//                 {
//                   value: CONSTANTS.CLAIM_STATUS.STATUS.SETTLED,
//                   label: "Settled",
//                 },
//                 {
//                   value: CONSTANTS.CLAIM_STATUS.STATUS.PENDING,
//                   label: "Pending",
//                 },
//                 {
//                   value: CONSTANTS.CLAIM_STATUS.STATUS.REJECTED,
//                   label: "Rejected",
//                 },
//                 {
//                   value: CONSTANTS.CLAIM_STATUS.STATUS.INVALID,
//                   label: "Invalid",
//                 },
//                 {
//                   value: CONSTANTS.CLAIM_STATUS.STATUS.CLARIFICATION,
//                   label: "Clarification Required",
//                 },
//                 {
//                   value: CONSTANTS.CLAIM_STATUS.STATUS.DISPUTE,
//                   label: "Dispute",
//                 },
//               ]}
//               defaultValue="ALL"
//               onChange={(value) => setClaimStatus(value)}
//             />
//           </Col>

//           <Col span={5}>
//             <RangePicker
//               format="DD/MM/YYYY"
//               disabledDate={disabledDate}
//               onChange={handleDateRangeChange}
//               style={{ marginRight: "0.5rem" }}
//               defaultValue={[dayjs().subtract(30, "day"), dayjs()]}
//             />

//           </Col>
//           <Col span={6}>
//             <Search
//               placeholder="Search by hospital, claim id"
//               onSearch={onSearch}
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               enterButton
//             />
//           </Col>
//         </Row>
//         <div className="row d-flex justify-content-between align-items-center">
//           <div className="col-6 d-flex">
//               <div className="col-3 me-2">
//                 <Button
//                   onClick={() => handleExport("excel")}
//                   type="primary"
//                   size="small"
//                   style={{ marginRight: "3rem" }}
//                 >
//                   Export to Excel
//                 </Button>
//               </div>
//             <div className="col-3 me-2">
//               <Button onClick={() => handleExport("pdf")} type="primary" size="small">
//                 Export to PDF
//               </Button>
//             </div>
//          </div>
//           {
//             planExpired ?
//             <div className="col-1 me-5 text-end">
//             <Tooltip title="Your plan has expired. Please renew it to make claims." color={"blue"} >
//             <Button type="primary" disabled>
//               <PlusOutlined />
//               Add Claim
//             </Button>
//             </Tooltip>
//              </div>
//             :
//             <div className="col-1 me-5 text-end">
//             <Link to={`/user/addclaims/?action=${CONSTANTS.CLAIM_STATUS.STATUS.ADDING}`}>

//               <Button type="primary">
//                 <PlusOutlined />
//                 Add Claim
//               </Button>
//             </Link>
//           </div>}
//         </div>
//         <div className="row my-4">
//           <AntTable columns={claimsColumns} data={data}
//           onChange={handlePageChange}
//           current={currentPage}
//           total={total}
//           pageSize={currentpageSize}
//           onShowSizeChange={handlePageSizeChange}
//           />
//         </div>
//       </div>
//       <Modal
//         title="Uploaded Documents"
//         open={documentModalOpen}
//         onOk={handleDocumentOk}
//         onCancel={handleDocumentOk}
//       >
//         <p>Doctor Fee Receipt : {userData?.fee_receipt}</p>
//         <p>Prescription : {userData?.prescription}</p>
//         <p>Pharmacy Receipt : {userData?.pharmacy_receipt}</p>
//         <p>Lab Test Receipt : {userData?.test_receipt}</p>
//       </Modal>
//     </>
//   );
// };

// export default UserClaimDisplay;

import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  Tag,
  DatePicker,
  Row,
  Col,
  Select,
  Input,
  Tooltip,
} from "antd";
import {
  PlusOutlined,
  ArrowLeftOutlined,
  EyeOutlined,
  DeleteFilled,
  CloseCircleOutlined,
  DislikeFilled,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { Link, useSearchParams } from "react-router-dom";
import { Axios } from "../../axios/axiosFunctions";
import config, { CONFIG_OBJ } from "../../config/config";
import AntTable from "../../components/AntTable";
import {
  GetSubscriberClaimStatus,
  GetSubscriberDisputeClaimStatus,
  Utils,
} from "../../utils";
import CONSTANTS from "../../constant/Constants";
const { confirm } = Modal;
const { RangePicker } = DatePicker;
const { Option } = Select;
const { Search } = Input;
import { Typography } from "antd";
const { Text } = Typography;
import exportFunction from "../../utils/export";

const UserClaimDisplay = () => {
  // all states
  const [data, setData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [userReaction, setUserReaction] = useState(undefined);
  const [dispute, setDispute] = useState(undefined);
  const [documentModalOpen, setDocumentModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentpageSize, setCurrentpageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const statusFilter = searchParams.get("statusFilter");
  const disputeFilter = searchParams.get("disputeFilter");
  const [search, setSearch] = useState(undefined);
  const [sortOrder, setSortOrder] = useState(1);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);   
  // const [startDate, setStartDate] = useState(
  //   dayjs().subtract(1730, "day").startOf("day").toISOString()
  // );
  // const [endDate, setEndDate] = useState(dayjs().toISOString());
  const [claimStatus, setClaimStatus] = useState("ALL");
  const [claimsDataExcel, setClaimsDataExcel] = useState([]);
  const [profileData, setProfileData] = useState({});
  const [planExpired, setPlanExpired] = useState(false);
  sessionStorage.removeItem("opdClaimForm");
  const fetchProfileData = async () => {
    try {
      const time = await Axios.fetchAxiosData(config.CurrentTime);

      const response = await Axios.fetchAxiosData(config.GetProfile);
      setProfileData(response?.data);
      if (dayjs(response?.data.plan?.end_date).isBefore(time.data))
        setPlanExpired(true);
    } catch (error) {
      setPlanExpired(false);
    }
  };
  const fetchclaimsData = async () => {
    const response = await Axios.fetchAxiosData(config.GetAllClaims, {
      params: {
        page: currentPage,
        pageSize: currentpageSize,
        statusFilter: statusFilter || "ALL",
        //  disputeFilter: disputeFilter || "ALL",
        search,
        claimStatus,
        startDate,
        endDate,
      },
    });
    setData(response?.data?.records);
    const filteredRecords =
      response?.data?.records?.map((record) => ({
        claim_id: record.claim_id,
        createdAt: Utils.DateFormat(record.createdAt),
        name: record.member_id?.name || "",
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
        }) ||  record.status !== CONSTANTS.CLAIM_STATUS.STATUS.SETTLED)? record?.approved_claimable_amount?.toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }) :  record?.claimable_amount?.toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
        status:
          GetSubscriberClaimStatus(record.status, record.subscriber_reaction)
            ?.props?.children || "Unknown",
        dispute_details: record.dispute
          ? GetSubscriberDisputeClaimStatus(record?.dispute_details)?.props
              ?.children || "Unknown"
          : "Raise Dispute",
      })) || [];
    setClaimsDataExcel(filteredRecords);
    setUserReaction(response?.data?.subscriber_reaction);
    setTotal(response?.data?.pagination.totalRecords);
    setDispute(response?.data?.pagination.dispute);
  };
  useEffect(() => {
    fetchclaimsData();
    fetchProfileData();
  }, [currentPage, search, claimStatus, startDate, endDate]);

  const claimsColumns = [
    {
      title: (
        <p className="text-center my-auto responsive-fontsize-table-header">
          S.No.
        </p>
      ),
      render: (text, record, index) => {
        const calculatedIndex = (currentPage - 1) * 10 + index + 1;
        return <p className="text-center my-auto">{calculatedIndex}.</p>;
      },
    },

    {
      title: (
        <p className="text-center my-auto responsive-fontsize-table-header">
          Claim ID
        </p>
      ),
      sorter: (a, b) => a.claim_id.localeCompare(b.claim_id),
      render: (text, record) =>
        record.dispute ? (
          <Link
            to={`/user/addclaims/${record?._id}/?action=${CONSTANTS.CLAIM_STATUS.STATUS.DISPUTE}`}
          >
            <p className="text-primary text-decoration-underline my-auto">
              {record?.claim_id}
            </p>
          </Link>
        ) : (
          <Link to={`/user/addclaims/${record?._id}/?action=${record.status}`}>
            <p className="text-primary text-decoration-underline my-auto">
              {record?.claim_id}
            </p>
          </Link>
        ),
    },
    {
      title: (
        <p className="text-center my-auto responsive-fontsize-table-header">
          Raised Date
        </p>
      ),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      render: (text, record) => (
        <p className="text-center my-auto">
          {Utils.DateFormat(record?.createdAt)}
        </p>
      ),
    },
    {
      title: (
        <p className="text-center my-auto responsive-fontsize-table-header">
          Name
        </p>
      ),
      sorter: (a, b) =>
        (a.member_id?.name || "").localeCompare(b.member_id?.name || ""),
      dataIndex: ["member_id", "name"],
    },
    // {
    //   title: "Doctor's Name",
    //   render: (text, record) => <p className="text-center my-auto">{record?.doc_name}</p>,
    // },
    {
      title: (
        <p className="text-center my-auto responsive-fontsize-table-header">
          Clinic/Hospital Name
        </p>
      ),
      sorter: (a, b) => (a.hospital || "").localeCompare(b.hospital || ""),
      render: (text, record) => <p className="my-auto">{record?.hospital}</p>,
    },

    {
      title: (
        <p className="text-center my-auto responsive-fontsize-table-header">
          Act. Bill Amt.
        </p>
      ),
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
      title: (
        <p className="text-center my-auto responsive-fontsize-table-header">
          Claimable Amt.
        </p>
      ),
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
        <p className="text-center my-auto">{(record?.approved_claimable_amount?.toLocaleString("en-IN",{ minimumFractionDigits: 2, maximumFractionDigits: 2 }) || record.status !== CONSTANTS.CLAIM_STATUS.STATUS.SETTLED) ? record?.approved_claimable_amount?.toLocaleString("en-IN",{ minimumFractionDigits: 2, maximumFractionDigits: 2 }) : record?.claimable_amount.toLocaleString("en-IN",{ minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
      ),
    },
    {
      title: (
        <p className="text-center my-auto responsive-fontsize-table-header">
          Status / Approval Date
        </p>
      ),
      align: "center",
      render: (text, record) => {
        const status = GetSubscriberClaimStatus(
          record.status,
          record.subscriber_reaction
        );
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div>{status}</div>
            {record.status === CONSTANTS.CLAIM_STATUS.STATUS.APPROVED &&
              record.claim_closure_Date && (
                <span style={{ marginTop: "0.5rem" }}>
                  {dayjs(record.claim_closure_Date).format("DD/MM/YYYY")}
                </span>
              )}
          </div>
        );
      },
    },
    {
      title: (
        <p className="text-center my-auto responsive-fontsize-table-header">
          Raise Dispute
        </p>
      ),
      render: (_, record) => (
        <>
          {record.dispute ? (
            <Link to={`/user/claim/dispute/${record._id}`}>
              {GetSubscriberDisputeClaimStatus(record?.dispute_details)}
            </Link>
          ) : record.dispute ||
            record.status === CONSTANTS.CLAIM_STATUS.STATUS.DISPUTE ||
            record.status === CONSTANTS.CLAIM_STATUS.STATUS.CLARIFICATION ||
            record.status === CONSTANTS.CLAIM_STATUS.STATUS.IN_PROCESS ||
            record.status === CONSTANTS.CLAIM_STATUS.STATUS.PENDING ? (
            <Tag disabled icon={<ExclamationCircleOutlined />}>
              Raise Dispute
            </Tag>
          ) : (
            <Link
              to={`/user/addclaims/${record?._id}/?action=${CONSTANTS.CLAIM_STATUS.STATUS.DISPUTE}`}
            >
              <Tag color="error" icon={<ExclamationCircleOutlined />}>
                Raise Dispute
              </Tag>
            </Link>
          )}
        </>
      ),
    },
  ];
  const handleDocumentOk = () => {
    setDocumentModalOpen(false);
  };

  const handlePageSizeChange = (size) => {
    // setCurrentPage(1);
    setCurrentpageSize(size);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const disabledDate = (current) => {
    return current && current >= dayjs().endOf("day");
  };

  // const handleDateRangeChange = (dates, dateStrings) => {
  //   const formattedDates = dateStrings.map((date, index) => {
  //     const dayjsDate = dayjs(date, "DD/MM/YYYY");
  //     if (index === 0) {
  //       return dayjsDate.startOf("day").toISOString();
  //     } else {
  //       return dayjsDate.endOf("day").toISOString();
  //     }
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

  const onSearch = async () => {
    fetchclaimsData();
  };

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
    "Hospital / Clinic Name",
    "Act. Bill Amt.",
    "Claimable Amt.",
    "Approved Amt.",
    "Status/Approval Date",
    "Raise Dispute",
  ];

  const dataWithHeaders = [
    headers,
    ...claimsDataExcel?.map((item, index) => [
      index + 1,
      item.claim_id,
      item.createdAt,
      item.name,
      item.hospital,
      item.bill_amount,
      item.claimable_amount,
      item.approved_claimable_amount || item.status !== CONSTANTS.CLAIM_STATUS.STATUS.SETTLED? item.approved_claimable_amount : item.claimable_amount,
      item.status,
      item.dispute_details,
    ]),
  ];

  const pdfData = claimsDataExcel?.map((item, index) => [
    index + 1,
    item.claim_id,
    item.createdAt,
    item.name,
    item.hospital,
    item.bill_amount,
    item.claimable_amount,
    item.approved_claimable_amount || item.status !== CONSTANTS.CLAIM_STATUS.STATUS.SETTLED? item.approved_claimable_amount : item.claimable_amount,
    item.status,
    item.dispute_details,
  ]);

  const pdftitle = "OPDSure Claims Data";
  const ExportFileName = "OpdSure_Claims_Data";

  return (
    <>
      <div className="container">
        <Row justify="end" style={{ marginBottom: "1rem" }}>
          <Col xs={24} md={8} style={{ marginBottom: "1rem" }}>
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
                  value: CONSTANTS.CLAIM_STATUS.STATUS.APPROVED,
                  label: "Approved",
                },
                {
                  value: CONSTANTS.CLAIM_STATUS.STATUS.SETTLED,
                  label: "Settled",
                },
                {
                  value: CONSTANTS.CLAIM_STATUS.STATUS.PENDING,
                  label: "Pending",
                },
                {
                  value: CONSTANTS.CLAIM_STATUS.STATUS.REJECTED,
                  label: "Rejected",
                },
                {
                  value: CONSTANTS.CLAIM_STATUS.STATUS.INVALID,
                  label: "Invalid",
                },
                {
                  value: CONSTANTS.CLAIM_STATUS.STATUS.CLARIFICATION,
                  label: "Clarification Required",
                },
                {
                  value: CONSTANTS.CLAIM_STATUS.STATUS.DISPUTE,
                  label: "Dispute",
                },
              ]}
              defaultValue="ALL"
              onChange={(value) => setClaimStatus(value)}
            />
          </Col>

          <Col xs={24} md={8} style={{ marginBottom: "1rem" }}>
            <RangePicker
              format="DD/MM/YYYY"
              disabledDate={disabledDate}
              onChange={handleDateRangeChange}
              style={{ marginRight: "0.5rem" }}
              value={startDate && endDate ? [dayjs(startDate), dayjs(endDate)] : null} 
            />
          </Col>

          <Col xs={24} md={8}>
            <Search
              placeholder="Search by hospital, claim id"
              onSearch={onSearch}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              enterButton
            />
          </Col>
        </Row>

  <div className="d-flex justify-content-between align-items-center gap-2 flex-wrap mb-3">
    {
    statusFilter == "ALL" ? 
    <h4>
     Total Claims
    </h4>
    : statusFilter == 0?
    <h4>
     Pending Claims
    </h4>
    : statusFilter == 1?
    <h4>
     Approved Claims
    </h4>
    : statusFilter == 12?
     <h4>
      Settled Claims
    </h4>
    : statusFilter == 5?
    <h4>
     Rejected Claims
   </h4>
   : 
   <h4>
   Total Claims
  </h4>
    }
  <div className="d-flex justify-content-end align-items-center gap-2 flex-wrap mb-3">
  {/* Export to Excel button */}
  <Button
    onClick={() => handleExport("excel")}
    type="primary"
    size="small"
  >
    Export to Excel
  </Button>

  {/* Export to PDF button */}
  <Button
    onClick={() => handleExport("pdf")}
    type="primary"
    size="small"
  >
    Export to PDF
  </Button>

  {/* Add Claim button */}
  {planExpired ? (
    <Tooltip
      title="Your plan has expired. Please renew it to make claims."
      color="blue"
    >
      <Button type="primary" disabled>
        <PlusOutlined />
        Add Claim
      </Button>
    </Tooltip>
  ) : (
    <Link to={`/user/addclaims/?action=${CONSTANTS.CLAIM_STATUS.STATUS.ADDING}`}>
      <Button type="primary">
        <PlusOutlined />
        Add Claim
      </Button>
    </Link>
  )}
</div>
</div>

        <div className="table-container">
          <AntTable
            columns={claimsColumns}
            data={data}
            onChange={handlePageChange}
            current={currentPage}
            total={total}
            pageSize={currentpageSize}
            onShowSizeChange={handlePageSizeChange}
          />
        </div>
      </div>
      <Modal
        title="Uploaded Documents"
        open={documentModalOpen}
        onOk={handleDocumentOk}
        onCancel={handleDocumentOk}
      >
        <p>Doctor Fee Receipt : {userData?.fee_receipt}</p>
        <p>Prescription : {userData?.prescription}</p>
        <p>Pharmacy Receipt : {userData?.pharmacy_receipt}</p>
        <p>Lab Test Receipt : {userData?.test_receipt}</p>
      </Modal>
    </>
  );
};

export default UserClaimDisplay;
