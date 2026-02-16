import React, { useState, useEffect } from "react";
import {Link} from "react-router-dom";
import {Button,Row} from "antd";
import {Axios} from "../../axios/axiosFunctions";
import config from "../../config/config";
import AntTable from "../../components/AntTable";
import { Utils } from "../../utils";

const AppliedJobs = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentpageSize, setCurrentpageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const handlePageSizeChange = (size) => {
    setCurrentpageSize(size);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const fetchAllJobsData = async()=>{
   const response = await Axios.fetchAxiosData(config.GetAppliedJob,
    { params: { page: currentPage, pageSize: currentpageSize, }
      //  disputeFilter: disputeFilter || "ALL",
      },
   )
   setData(response?.data?.records);
   setTotal(response?.data?.pagination.totalRecords);
  }

  useEffect (()=>{
    fetchAllJobsData();
  },[currentPage])

  const jobsColumns = [
    {
        title: "S.No.",
        render: (text, record, index) => {
          const calculatedIndex = (currentPage - 1) * 10 + index + 1;
          return <p className="text-center my-auto">{calculatedIndex}.</p>
        },
      },
      
      {
        title: "Application Received Date",
        render: (text, record) => (
            <p className="text-center my-auto">
              {Utils.DateFormat(record?.createdAt)}
            </p>
          ), 
      },
      {
        title: "Name",
        render: (text, record) => (
            <p className="text-center my-auto">
              {record?.name}
            </p>
          ), 
      },
      {
        title: "Email",
        render: (text, record) => (
            <p className="text-center my-auto">
              {record?.email}
            </p>
          ), 
      },
      {
        title: "Contact No.",
        render: (text, record) => (
            <p className="text-center my-auto">
              {record?.mobile}
            </p>
          ), 
      },
      {
        title: "Experience (in Yrs)",
        render: (text, record) => (
            <p className="text-center my-auto">
              {record?.experience}
            </p>
          ), 
      },
      {
        title: "Resume Link",
        render: (text, record) => (
            <p className="text-center my-auto">
              <Link to={record?.resumeUrl} target="_blank">Resume Link</Link>
            </p>
          ), 
      },

      {
        title: "Applied For",
        render: (text, record) => (
            <p className="text-center my-auto">
              {record?.job?.title}
            </p>
          ), 
      },
      {
        title: "Job Details",
        render: (text, record) => (
                <Button onClick={() => window.open(record?.jdUrl, "_blank")} type="primary" className="text-center my-auto" >
             View
            </Button>
          ), 
      },
  ]

  

  return (
    <>
      <div className="container-fluid">
      <Row justify={"start"}>
          <h4 style={{ fontWeight: "bold" }} className="textblue">
            Applications Received
          </h4>
        </Row>
        <div className="row">
          <div className="col-12">
            <AntTable
              columns={jobsColumns}
              data={data}
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

export default AppliedJobs;
