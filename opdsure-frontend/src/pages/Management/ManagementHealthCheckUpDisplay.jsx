import React, { useEffect, useState } from "react";
import { Button, DatePicker, Select } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { Axios } from "../../axios/axiosFunctions";
import config, { CONFIG_OBJ } from "../../config/config";
import AntTable from "../../components/AntTable";
import { Utils } from "../../utils";

const { RangePicker } = DatePicker;
const ManagementHealthCheckUpDisplay = () => {
  const healthColumns = [
    {
      title: <p className="text-center my-auto">S.No</p>,
      render: (text, record, index) => {
        const calculatedIndex = (currentPage - 1) * 10 + index + 1;
        return <p className="text-center my-auto">{calculatedIndex}</p>;
      },
      width: "5%",
    },
    {
      title: <p className="text-center my-auto">Application Date</p>,
      render: (text, record) => (
        <p className="text-center my-auto">
          {Utils.DateFormat(record?.createdAt)}
        </p>
      ),
      width: "12%",
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: <p className="text-center my-auto">Health CheckUp Id</p>,
      render: (text, record) => (
        <Link to={`/management/health-checkups-details/${record?._id}`}>
          <p className="text-primary text-decoration-underline my-auto text-center">
            {record?.health_checkup_id}
          </p>
        </Link>
      ),
      width: "15%",
      sorter: (a, b) => a.health_checkup_id.localeCompare(b.health_checkup_id),
    },

    {
      title: <p className="text-center my-auto">Name</p>,
      render: (text, record) => (
        <p className="text-center my-auto">{record?.member_details?.name}</p>
      ),
      sorter: (a, b) => {
        const nameA = a.member_details?.name || '';
        const nameB = b.member_details?.name || '';
        return nameA.localeCompare(nameB);
      },
    
      width: "10%",
    },
    {
      title: <p className="text-center my-auto">Contact Details</p>,
      render: (text, record) => (
        <div className="text-center my-auto m-0 p-0">
        <p className="m-0 p-0">{record?.member_details?.phone}</p>
        <p className="m-0 p-0">{record?.member_details?.address}</p>
        </div>
      ),
      width: "20%",
    },
    {
      title: <p className="text-center my-auto">Test</p>,
      render: (text, record) => (
        <p className="text-center my-auto">{getTestName(record)}</p>
      ),
      width: "20%",
      sorter: (a, b) => {
        const testNameA = getTestName(a) || '';
        const testNameB = getTestName(b) || '';
        return testNameA.localeCompare(testNameB);
      },
    },
   
  ];

  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };

  const actionOptions = [
    { value: "1", label: "Open" },
    { value: "2", label: "Close" },
  ];
  // all states
  const [data, setData] = useState([]);
  const [testList, setTestList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentpageSize, setCurrentpageSize] = useState(10);
  const [total, setTotal] = useState(0);

  // all functions
  const fetchHealthData = async () => {
    const response = await Axios.fetchAxiosData(config.GetAllHealthCheckUp, {
      //   params: { page: currentPage, pageSize: currentpageSize },
    });
    setData(response.data?.records);
    setTotal(response.data?.pagination.totalRecords);
  };

  const getTestName = (record) => {
    const testNamesList = record?.checkup_for?.map((testId) => {
      const test = testList.find((test) => test._id == testId);
      return test ? test.name : "";
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
    // const array = Object.entries(result.data)?.map(([name, value]) => ({
    //   name: formatFieldLabel(name),
    //   value,
    // }));

    setTestList(result.data);
  };

  console.log(testList)

  useEffect(() => {
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
        <div className="row d-flex justify-content-end mt-3">
          <div className="col-9">
            <h4 className="text-purple">Free Health Checkup </h4>
          </div>
          <div className="col-3 text-end">
            <RangePicker />
          </div>
        </div>
        <div className="row my-4">
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

export default ManagementHealthCheckUpDisplay;
