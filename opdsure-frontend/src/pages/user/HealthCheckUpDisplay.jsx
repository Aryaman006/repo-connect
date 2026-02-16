import React, { useEffect, useState } from "react";
import {Button, DatePicker, Row, Col, Tooltip } from "antd";
import {
  PlusOutlined,
  ArrowLeftOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { Axios } from "../../axios/axiosFunctions";
import config, { CONFIG_OBJ } from "../../config/config";
import AntTable from "../../components/AntTable";
import { Utils } from "../../utils";
import dayjs from "dayjs";
const { RangePicker } = DatePicker;

const HealthCheckUpDisplay = () => {
  const formatDate = (date) => {
    return dayjs(date).format('DD/MM/YYYY hh:mm A');
  };
const healthColumns = [
  {
    title: <p className="text-center my-auto responsive-fontsize-table-header" >S.No</p>,
    render: (text, record, index) => {
      const calculatedIndex = (currentPage - 1) * 10 + index + 1;
      return <p className="text-center my-auto">{calculatedIndex}.</p>
    },
    width:'5%'
  },
  {
    title: <p className="text-center my-auto responsive-fontsize-table-header">Booking Date</p>,
    render: (text, record) => (
      <p className="text-center my-auto">
        {Utils.DateFormat(record?.createdAt)}
      </p>
    ), 
  width:'10%'
 },
  {
    title: <p className="text-center my-auto responsive-fontsize-table-header">Health CheckUp ID</p>,
    render: (text, record) => (
      // <Link to={`/user/checkup-details/${record?._id}`}>
        <p className="
       
        my-auto 
        text-center">{record?.health_checkup_id}</p>
      // </Link>
    ),
    width:'15%'
  },
 
  
 
  {
    title: <p className="text-center my-auto responsive-fontsize-table-header">Name</p>,
    render: (text, record) => <p className="text-center my-auto">{record?.member_details?.name}</p>,
    width:'15%'
  },
  {
    title: <p className="text-center my-auto responsive-fontsize-table-header">Address</p>,
    render: (text, record) => <p className="my-auto">{record?.member_details?.address}</p>,
    // render: (text, record) => <p className="text-center my-auto">{record?.member_details?.address}</p>,
    width:'20%'
  },
  {
    title: <p className="text-center my-auto responsive-fontsize-table-header">Tests</p>,
     render: (text, record) => (
      <p className="text-center my-auto">
      {record.checkup_details && record.checkup_details.length > 0
        ? record.checkup_details.map(detail => detail.name).join(', ')
        : 'No tests available'}
    </p>
     ),
    width:'25%'
  },
  {
    title: <p className="text-center my-auto responsive-fontsize-table-header">Appointment</p>,
    render: (text, record) => (
      <p className="text-center my-auto">
        {record.appointment ? formatDate(record.appointment) : 'No date available'}
      </p>
    ),
    width: '25%'
  },
  {
    title: <p className="text-center my-auto responsive-fontsize-table-header">Status</p>,
    render: (text, record) => (
      <p className="text-center my-auto">{record?.status === 0 ? <span className="text-warning">Pending</span> : record?.status === 1 ? <span className="text-success">Approved</span> : record?.status === 2 ? <span className="text-danger">Rejected</span> : ""}</p>
    ),  
    width:'10%'
  }
];

  // all states
  const [data, setData] = useState([]);
  const [testList, setTestList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentpageSize, setCurrentpageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [profileData, setProfileData] = useState({});
  const [planExpired,setPlanExpired] = useState(false);
  
  // all functions
  const fetchProfileData = async () => {  
    try {
      const time = await Axios.fetchAxiosData(config.CurrentTime);
     
      const response = await Axios.fetchAxiosData(config.GetProfile);
      setProfileData(response?.data);      
      if(dayjs(response?.data.plan?.end_date).isBefore(time.data)) setPlanExpired(true)
    } catch (error) {
      setPlanExpired(false)
    }
   
};
  // all functions
  const fetchHealthData = async () => {
    const response = await Axios.fetchAxiosData(config.GetHealthCheckUp, {
      // params: { page: currentPage, pageSize: currentpageSize },
      // ...CONFIG_OBJ,
    });
    setData(response.data?.records);
    setTotal(response.data?.pagination.totalRecords);
  };

  const getTestName = (record) => {  
    const testNamesList = record?.checkup_for?.map(testId => {
      const test = testList.find(test => test.value === testId);
      return test ? test.name : '';
    });
    return testNamesList.join(", ");
  };
  

    useEffect(() => {
      fetchHealthData();
    }, [currentPage]);

    const formatFieldLabel = (label) => {
      return label
        .split("_")
        ?.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    };
    const fetchTestData = async () => {
      const result = await Axios.fetchAxiosData(config.GetTestList);
      const array = Object.entries(result.data)?.map(([name, value]) => ({
        name: formatFieldLabel(name),
        value,
      }));

      setTestList(array);
    };

    useEffect(() => {
      fetchProfileData();
      fetchTestData();
    }, []);

  const handlePageSizeChange = (size) => {
    setCurrentpageSize(size);
  };
  
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <div className="container">
        
        <div className="row d-flex justify-content-end">
          <Row justify="end" style={{marginRight:"1.5rem"}}>
           {
            planExpired ?
            <div className="col-1 me-4 text-end">
            <Tooltip title="Your plan has expired. Please renew to book more free tests." color={"blue"} >
            <Button type="primary" disabled>
              <PlusOutlined />
              New Request
            </Button>
            </Tooltip>
             </div>
            :
            <div className="col-1 me-4 text-end">
            <Link to="/user/addhealth-checkups">
            
              <Button type="primary" className="responsive-font">
                <PlusOutlined />
                New Request
              </Button>
            </Link>
          </div>}
          </Row>
        </div>


        <div className="row d-flex justify-content-start mt-3">
          <div className="">
            <h4 className="text-purple">Free Health Tests </h4>
            </div>
        </div>


        <Row justify="end" className="my-2"> 
          <Col >
          <RangePicker />
          </Col>        
        </Row>

        <div className="table-container">
        <AntTable
  columns={healthColumns}
  data={data}
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

export default HealthCheckUpDisplay;





// import React, { useEffect, useState } from "react";
// import {Button, DatePicker, Row, Col, Tooltip } from "antd";
// import {
//   PlusOutlined,
//   ArrowLeftOutlined,
//   EyeOutlined,
// } from "@ant-design/icons";
// import { Link } from "react-router-dom";
// import { Axios } from "../../axios/axiosFunctions";
// import config, { CONFIG_OBJ } from "../../config/config";
// import AntTable from "../../components/AntTable";
// import { Utils } from "../../utils";
// import dayjs from "dayjs";
// const { RangePicker } = DatePicker;

// const HealthCheckUpDisplay = () => {
//   const formatDate = (date) => {
//     return dayjs(date).format('DD/MM/YYYY hh:mm A');
//   };
// const healthColumns = [
//   {
//     title: <p className="text-center my-auto" >S.No</p>,
//     render: (text, record, index) => {
//       const calculatedIndex = (currentPage - 1) * 10 + index + 1;
//       return <p className="text-center my-auto">{calculatedIndex}.</p>
//     },
//     width:'5%'
//   },
//   {
//     title: <p className="text-center my-auto">Booking Date</p>,
//     render: (text, record) => (
//       <p className="text-center my-auto">
//         {Utils.DateFormat(record?.createdAt)}
//       </p>
//     ), 
//   width:'10%'
//  },
//   {
//     title: <p className="text-center my-auto">Health CheckUp ID</p>,
//     render: (text, record) => (
//       // <Link to={`/user/checkup-details/${record?._id}`}>
//         <p className="
       
//         my-auto 
//         text-center">{record?.health_checkup_id}</p>
//       // </Link>
//     ),
//     width:'15%'
//   },
 
  
 
//   {
//     title: <p className="text-center my-auto">Name</p>,
//     render: (text, record) => <p className="text-center my-auto">{record?.member_details?.name}</p>,
//     width:'15%'
//   },
//   {
//     title: <p className="text-center my-auto">Address</p>,
//     render: (text, record) => <p className="my-auto">{record?.member_details?.address}</p>,
//     // render: (text, record) => <p className="text-center my-auto">{record?.member_details?.address}</p>,
//     width:'20%'
//   },
//   {
//     title: <p className="text-center my-auto">Tests</p>,
//      render: (text, record) => (
//       <p className="text-center my-auto">
//       {record.checkup_details && record.checkup_details.length > 0
//         ? record.checkup_details.map(detail => detail.name).join(', ')
//         : 'No tests available'}
//     </p>
//      ),
//     width:'25%'
//   },
//   {
//     title: <p className="text-center my-auto">Appointment</p>,
//     render: (text, record) => (
//       <p className="text-center my-auto">
//         {record.appointment ? formatDate(record.appointment) : 'No date available'}
//       </p>
//     ),
//     width: '25%'
//   },
//   {
//     title: <p className="text-center my-auto">Status</p>,
//     render: (text, record) => (
//       <p className="text-center my-auto">{record?.status === 0 ? <span className="text-warning">Pending</span> : record?.status === 1 ? <span className="text-success">Approved</span> : record?.status === 2 ? <span className="text-danger">Rejected</span> : ""}</p>
//     ),  
//     width:'10%'
//   }
// ];

//   // all states
//   const [data, setData] = useState([]);
//   const [testList, setTestList] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [currentpageSize, setCurrentpageSize] = useState(10);
//   const [total, setTotal] = useState(0);
//   const [profileData, setProfileData] = useState({});
//   const [planExpired,setPlanExpired] = useState(false);
  
//   // all functions
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
//   // all functions
//   const fetchHealthData = async () => {
//     const response = await Axios.fetchAxiosData(config.GetHealthCheckUp, {
//       // params: { page: currentPage, pageSize: currentpageSize },
//       // ...CONFIG_OBJ,
//     });
//     setData(response.data?.records);
//     setTotal(response.data?.pagination.totalRecords);
//   };

//   const getTestName = (record) => {  
//     const testNamesList = record?.checkup_for?.map(testId => {
//       const test = testList.find(test => test.value === testId);
//       return test ? test.name : '';
//     });
//     return testNamesList.join(", ");
//   };
  

//     useEffect(() => {
//       fetchHealthData();
//     }, [currentPage]);

//     const formatFieldLabel = (label) => {
//       return label
//         .split("_")
//         ?.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
//         .join(" ");
//     };
//     const fetchTestData = async () => {
//       const result = await Axios.fetchAxiosData(config.GetTestList);
//       const array = Object.entries(result.data)?.map(([name, value]) => ({
//         name: formatFieldLabel(name),
//         value,
//       }));

//       setTestList(array);
//     };

//     useEffect(() => {
//       fetchProfileData();
//       fetchTestData();
//     }, []);

//   const handlePageSizeChange = (size) => {
//     setCurrentpageSize(size);
//   };
  
//   const handlePageChange = (pageNumber) => {
//     setCurrentPage(pageNumber);
//   };

//   return (
//     <>
//       <div className="container-fluid">
//         <div className="row d-flex justify-content-end">

//               <Row justify="end" style={{ marginBottom: "1rem" }}>
//               <Col xs={24} sm={12} md={6} lg={4} className="text-end">
//                 {planExpired ? (
//                   <Tooltip
//                     title="Your plan has expired. Please renew to book more free tests."
//                     color={"blue"}
//                   >
//                     <Button type="primary" disabled>
//                       <PlusOutlined />
//                       New Request
//                     </Button>
//                   </Tooltip>
//                 ) : (
//                   <Link to="/user/addhealth-checkups">
//                     <Button type="primary">
//                       <PlusOutlined />
//                       New Request
//                     </Button>
//                   </Link>
//                 )}
//               </Col>
//             </Row>

//         </div>
//         <div className="row d-flex justify-content-start mt-3">
//           <div className="">
//             <h4 className="text-purple">Free Health Tests </h4>
//             </div>
//         </div>
//         <Row gutter={[16, 16]} className="my-4">
//   <Col xs={24} sm={12} md={6} lg={6}>
//     <RangePicker style={{ width: "100%" }} />
//   </Col>
// </Row>

//         {/* <div className="row my-4"> */}
//         <AntTable
//   columns={healthColumns}
//   data={data}
//   onChange={handlePageChange}
//   current={currentPage}
//   total={total}
//   pageSize={currentpageSize}
//   onShowSizeChange={handlePageSizeChange}
//   scroll={{ x: 1000 }} // Enables horizontal scrolling if content overflows
// />

//         {/* </div> */}
//       </div>
//     </>
//   );
// };

// export default HealthCheckUpDisplay;

