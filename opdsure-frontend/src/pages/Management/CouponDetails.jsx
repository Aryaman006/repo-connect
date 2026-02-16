import React, { useEffect, useState } from "react";
import { Axios } from "../../axios/axiosFunctions";
import { Link } from "react-router-dom";
import config, { CONFIG_OBJ } from "../../config/config";
import AntTable from "../../components/AntTable";
import { faArrowsLeftRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const claimDisplay = () => {
  const couponColumns = [
    {
      title: <p className="text-center my-auto">S.No</p>,
      render: (text, record, index) => {
        const calculatedIndex = (currentPage - 1) * 10 + index + 1;
        return <p className="text-center my-auto">{calculatedIndex}</p>;
      },
    },

    {
      title: <p className="text-center my-auto">Coupon Code</p>,
      render: (text, record) => (
        <Link to={`/user/addclaims/${record?._id}`}>
          <p className="text-primary text-decoration-underline my-auto text-center">
            {record?._id}
          </p>
        </Link>
      ),
    },
    {
      title: <p className="text-center my-auto">Discount</p>,
      render: (text, record) => (
        <p className="text-center my-auto">{record?.opd_date.slice(0, 10)}</p>
      ),
    },

    {
      title: <p className="text-center my-auto">Start Date - End Date</p>,
      //   dataIndex: "doc_name",
      render: (text, record) => (
        <div className="text-center my-auto">
          <span className="">{record?.opd_date.slice(0, 10)}</span>
          <FontAwesomeIcon icon={faArrowsLeftRight} className="mx-2"/>
          <span className="">{record?.opd_date.slice(0, 10)}</span>
        </div>
      ),
      
    },
  ];

  const [couponData, setCouponData] = useState([]);
  const [currentPage, setCurrentPage] = useState(2);
  const [currentpageSize, setCurrentpageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const fetchcouponsData = async () => {
    const response = await Axios.fetchAxiosData(config.GetAllClaims, {
      params: { page: currentPage, pageSize: currentpageSize },
      ...CONFIG_OBJ,
    });
    setCouponData(response.data.records);
    setTotal(response.data.pagination.totalRecords);
  };
  useEffect(() => {
    fetchcouponsData();
  }, [currentPage]);

  const handlePageSizeChange = (size) => {
    setCurrentpageSize(size);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <div className="container">
        <div className="row">
          <AntTable
            columns={couponColumns}
            data={couponData}
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

export default claimDisplay;
