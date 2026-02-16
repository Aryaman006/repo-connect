import  { useEffect, useState } from "react";
import { Axios } from "../../axios/axiosFunctions";
import dayjs from "dayjs";
import config from "../../config/config";
import { notification, Skeleton } from "antd";
import { Row, Col, Pagination, Table, Descriptions, Input, Modal, Switch,  DatePicker  } from "antd";
const { Search } = Input;
const { confirm } = Modal;
const { RangePicker } = DatePicker;
import {
    EditFilled,
    DeleteFilled,
    ArrowUpOutlined,
    ExclamationCircleFilled,
  } from "@ant-design/icons";
import CONSTANTS from "../../constant/Constants";
const CouponUsage = () => {
    const [couponData, setCouponData] = useState([]);
    const [couponAggregate, setCouponAggregate] = useState([]);
    const [search, setSearch] = useState("");
    const [tableLoading, setTableLoading] = useState(true);
    const [aggregationLoading, setAggregationLoading] = useState(true);
    const [sortOrder, setSortOrder] = useState(1);
    const [pagination, setPagination] = useState({
      totalRecords: 0,
      pageSize: 10,
      totalPages: 0,
      currentPage: 1,
      nextPage: null,
      prevPage: null,
    });
    const [startDate, setStartDate] = useState(
      dayjs().subtract(30, "day").startOf("day").toISOString()
    );
    const [endDate, setEndDate] = useState(dayjs().endOf("day").toISOString());
    const fetchAllAmount = async () => {
      try {
        setAggregationLoading(true);
        const response = await Axios.fetchAxiosData(config.GetDiscountAggregation);
        if(response.data ) {
          setCouponAggregate(response?.data[0]);
          setAggregationLoading(false);
        }
          
      } catch (error) {
          notification.error({
            message: "Something went wrong",
          });
      }
    };
    const fetchAll = async () => {
        try {
          setTableLoading(true);
          const response = await Axios.fetchAxiosData(config.GetAllCouponUsages, 
            {
            params: {
              search: search || undefined,
              page: pagination.currentPage,
              pageSize: pagination.pageSize,
              // sortBy: "designation",
              // sortOrder: sortOrder,
              // startDate: startDate,
              // endDate: endDate,
            },
          }
        );
          if(response.data && response.data.records ) {
            setCouponData(response.data.records);
            setTableLoading(false);
          }
          if(response.data && response.data.records ) {
            const {
              totalRecords,
              totalPages,
              currentPage,
              nextPage,
              prevPage,
              pageSize,
            } = response.data.pagination;
    
            setPagination((prevState) => ({
              ...prevState,
              totalRecords: totalRecords,
              totalPages: totalPages,
              pageSize: pageSize,
              currentPage: currentPage,
              nextPage: nextPage,
              prevPage: prevPage,
            }));
          }
            
        } catch (error) {
            notification.error({
              message: "Something went wrong",
            });
        }
      };
      useEffect(() => {
        fetchAll();
      }, [pagination.currentPage, pagination.pageSize, sortOrder,startDate,endDate]);
      useEffect(()=>{
        fetchAllAmount();
      },[])
      useEffect(() => {
        const timer = setTimeout(() => {
          onSearch();
        }, 1000);
    
        return () => {
          clearTimeout(timer);
        };
      }, [search]);
    
      const onSearch = async () => {
        await fetchAll();
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
    
      const handlePageChange = (page) => {
        setPagination((prevState) => ({
          ...prevState,
          currentPage: page,
        }));
      };
    
      const pageSizeChange = (current, pageSize) => {
        setPagination((prevState) => ({
          ...prevState,
          pageSize: pageSize,
        }));
      };
      const handleSortChange = () => {
        setSortOrder((prevOrder) => {
          if (prevOrder === 1) {
            return -1;
          } else {
            return 1;
          }
        });
      };
      const items = [
        {
          key: '1',
          label: 'Total Amount Paid',
          children: `₹ ${new Intl.NumberFormat('en-IN', { 
            minimumFractionDigits: 2, 
            maximumFractionDigits: 2 
          }).format(couponAggregate?.total_sum || 0)}`,
        },
        
        {
          key: '2',
          label: 'Total Discount',
          children: `₹ ${new Intl.NumberFormat('en-IN', { 
            minimumFractionDigits: 2, 
            maximumFractionDigits: 2 
          }).format(couponAggregate?.total_discount || 0)}`,
        }        
      ]
      const columns = [
        {
          title: "S.No",
          dataIndex: "_id",
          key: "_id",
          width: "8%",
          align: "center",
          render: (_, record, index) => {
            return (pagination.currentPage - 1) * pagination.pageSize + index + 1;
          },
        },
      {
        // title: (
        //     <div>
        //      Date
        //       {
        //         <ArrowUpOutlined
        //           style={{ marginLeft: 12, fontSize: "1rem" }}
        //           onClick={handleSortChange}
        //           rotate={sortOrder === -1 ? 0 : 180}
        //         />
        //       }
        //     </div>
        //   ),
        title : "Date",
        dataIndex:" createdAt",
        key:" createdAt",
        render: (text,record) => dayjs(record.createdAt).format("DD/MM/YYYY")      
      },
      { 
        title: "Coupon Code",
        dataIndex:["coupon","coupon_code"],
        key:["coupon","coupon_code"]
      },
      { 
        title: "Coupon Type",
        dataIndex:["coupon","coupon_type"],
        key:["coupon","coupon_type"],
        render: (text,record) => {
          return record.coupon?.coupon_type === CONSTANTS.COUPON_TYPE.CORPORATE ? "Corporate" : "Individual"
        } 
      },
      { 
        title: "Usage Type",
        dataIndex:["coupon","usage_type"],
        key:["coupon","usage_type"],
        render: (text,record) => {
          return record.coupon?.usage_type === CONSTANTS.COUPON_USAGE_TYPE.SINGLE ? "Single" : "Multiple"
        }
      },
      { 
        title: "User",
        dataIndex:["user","name"],
        key:["user","name"]
      },
      { 
        title: "Plan Name",
        render: (text, record) => {
          return record.plan?.name || record.health_plan?.name || "N/A";
        },
      },
      { 
        title: "Amount Paid",
        dataIndex:"amount",
        key:"amount",
        render: (text, record) => {
          const formattedAmount = new Intl.NumberFormat('en-IN').format(record.amount.toFixed(2));
      
          return formattedAmount;
        }   
      },
      { 
        title: "Discount",
        dataIndex:"discount",
        key:"discount",
        render: (text, record) => {
          const formattedAmount = new Intl.NumberFormat('en-IN').format(record.discount.toFixed(2));
      
          return formattedAmount;
        }
      },
      
      ];
  return (
    <>
    <Row justify={"start"}>
      <h4 style={{ fontWeight: "bold" }} className="textblue">
       Consumed Coupons
      </h4>
    </Row>
    {aggregationLoading ? <Skeleton /> :<Descriptions bordered items={items} />}
    <br/>
    <br/>
 
    <Table
      bordered
      columns={columns}
      dataSource={couponData}
      size="small"
      loading={tableLoading}
      rowKey={(record) => record._id}
      pagination={false}
      align="right"
      style={{
        marginBottom: "1rem",
      }}
    />
    <Row justify="end">
      <Col>
        <Pagination
          current={pagination.currentPage}
          total={pagination.totalRecords}
          pageSize={pagination.pageSize}
          onChange={handlePageChange}
          showLessItems={true}
          onShowSizeChange={pageSizeChange}
          showQuickJumper={false}
          showPrevNextJumpers={true}
          showSizeChanger={true}
          onPrev={() => handlePageChange(pagination.prevPage)}
          onNext={() => handlePageChange(pagination.nextPage)}
          style={{
            marginBottom: "2%",
          }}
        />
      </Col>
    </Row>
  </>
  )
}

export default CouponUsage