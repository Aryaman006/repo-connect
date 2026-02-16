import React, { useEffect,useState } from 'react'
import { Axios } from '../../axios/axiosFunctions';
import config from '../../config/config';
import { notification } from "antd";
import { Row, Col, Pagination, Table, Input, Modal, Switch,  DatePicker  } from "antd";
const { Search } = Input;
const { confirm } = Modal;
import {
    EditFilled,
    DeleteFilled,
    ArrowUpOutlined,
    ExclamationCircleFilled,
    EyeOutlined
  } from "@ant-design/icons";
const { RangePicker } = DatePicker;
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import CONSTANTS from '../../constant/Constants';
const ApproveUpdatedMembers = () => {
  const [userData,setUserData] = useState([]);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState(-1);
  const [pagination, setPagination] = useState({
    totalRecords: 0,
    pageSize: 10,
    totalPages: 0,
    currentPage: 1,
    nextPage: null,
    prevPage: null,
  });
  const [startDate, setStartDate] = useState(
    dayjs().subtract(3000, "day").startOf("day").toISOString()
  );
  const [endDate, setEndDate] = useState(dayjs().endOf("day").toISOString());
  const fetchAll = async () => {
    try {
        const response = await Axios.fetchAxiosData(config.GetAllUpdatedUsers,{
            params: {
                search: search || undefined,
                page: pagination.currentPage,
                pageSize: pagination.pageSize,
                startDate: startDate,
                endDate: endDate,
                sortOrder:sortOrder,
                sortBy:"createdAt"
              },
        });
        if(!response.data) return;
    
        setUserData(response.data.records);
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
    } catch (error) {
        notification.error({
            message: "Something went wrong",
          });
    }
    
  };
  useEffect(()=>{
    fetchAll()
  },[pagination.currentPage, pagination.pageSize,startDate,endDate,sortOrder]);
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
  const handleDelete = async (record) => {
    confirm({
      title: "Are you sure you want to delete the record?",
      icon: <ExclamationCircleFilled />,
      centered: true,
      async onOk() {
        try {
          await Axios.deleteAxiosData(config.DeleteUpdatedUser + record._id);
          notification.success({
            message: "Success",
            description: "Record deleted Successfully.",
          });
          fetchAll();
        } catch (error) {
          notification.error({
            message: "Failed",
            description: `${error.response.data.msg}`,
          });
        }
      },
      onCancel() {},
    });
  };
  const handleSwitchChange = async (checked, id) => {
    try {
      await Axios.patchAxiosData(config.ApproveUpdatedUser + id, {
        review_status: checked,
      });
      notification.success({
        message: "Success",
        description: "Record Successfully edited",
      });
      fetchAll();
    } catch (error) {
      notification.error({
        message: "Failed",
        description: `${error.response.data.msg}`,
      });
    }
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
  const handleSortChange = () => {
    setSortOrder((prevOrder) => {
      if (prevOrder === 1) {
        return -1;
      } else {
        return 1;
      }
    });
  };
 
  const pageSizeChange = (current, pageSize) => {
    setPagination((prevState) => ({
      ...prevState,
      pageSize: pageSize,
    }));
  };
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
        title: (
          <div>
            Request Date
            {
              <ArrowUpOutlined
                style={{ marginLeft: 12, fontSize: "1rem" }}
                onClick={handleSortChange}
                rotate={sortOrder === -1 ? 0 : 180}
              />
            }
          </div>
        ),
        dataIndex: "createdAt",
        key: "createdAt",
        align: "center",
        width: "10%",
        render: (record) => dayjs(record).format("DD/MM/YYYY")
      },
    {
      title: "Name",
      key: "name",
      dataIndex: "name",
      align: "left",
      width: "35%",
    },
    {
      title: "Phone",
      key: "phone",
      align: "left",
      width: "35%",
      render: (record) => {
        return (          
            <div>{record?.country_code + record?.phone}</div>
        );
      },
    },
    {
      title: "Review Status",
      key: "review_status",
      dataIndex:"review_status",
      align: "left",
      width: "10%",
      render: (record) => {
        switch (record) {
          case CONSTANTS.REVIEW_STATUS.ACCEPTED:
            return "Accepted";
          case CONSTANTS.REVIEW_STATUS.REJECTED:
            return "Rejected";
          case CONSTANTS.REVIEW_STATUS.PENDING:
            return "Pending";
          default:
            return null;
        }
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      align: "middle",
      key: "action",
      width: "15%",
      render: (_, record) => (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Link to={`/admin/families/${record?.user_id?._id}`}>
          <EyeOutlined 
          style={{ color:"blue", marginRight: "0rem" }}
          />
          </Link>
        </div>
      ),
    },
  ];
  return (
    <>
    <Row justify={"start"}>
      <h4 style={{ fontWeight: "bold" }} className="textblue">
        Subscribers Details Update Request
      </h4>
    </Row>
    <Row justify="end">
    <Col span={5}>
          <RangePicker
            format="DD/MM/YYYY"
            disabledDate={disabledDate}
            onChange={handleDateRangeChange}
            style={{marginRight: "0.5rem" }}
            defaultValue={[dayjs().subtract(3000, "day"), dayjs()]}
          />
        </Col>
      <Col span={6}>
        <Search
          placeholder="Search"
          onSearch={onSearch}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          enterButton
          style={{ marginBottom: "16px", width: "100%" }}
        />
      </Col>
    </Row>
    <Table
      bordered
      columns={columns}
      dataSource={userData}
      size="small"
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

export default ApproveUpdatedMembers