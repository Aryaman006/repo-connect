import React, { useEffect, useState } from "react";
import { Axios } from "../../axios/axiosFunctions";
import dayjs from "dayjs";
import config from "../../config/config";
import { notification } from "antd";
import { Row, Col, Pagination, Table, Input, Modal, Switch,  DatePicker  } from "antd";
const { Search } = Input;
const { confirm } = Modal;
const { RangePicker } = DatePicker;
import {
  EditFilled,
  DeleteFilled,
  ArrowUpOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";

const ReferedUsers = () => {
  const [userData, setUserData] = useState([]);
  const [search, setSearch] = useState("");
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
    dayjs().subtract(180, "day").startOf("day").toISOString()
  );
  const [endDate, setEndDate] = useState(dayjs().endOf("day").toISOString());

  const fetchAll = async () => {
    try {
      const response = await Axios.fetchAxiosData(config.GetAllReferedUsers, {
        params: {
          search: search || undefined,
          page: pagination.currentPage,
          pageSize: pagination.pageSize,
          sortBy: "createdAt",
          sortOrder: sortOrder,
          startDate: startDate,
          endDate: endDate,
        },
      });
      if(response.data && response.data.records ) {
        setUserData(response.data.records);
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
          await Axios.deleteAxiosData(config.ReferedUsersAction + record._id);
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
      await Axios.patchAxiosData(config.ReferedUsersAction + id, {
        action_taken: checked,
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
      title: "Referred Person",
      key: "refered_person",
      align: "left",
      width: "35%",
      render: (record) => {
        return (
          <div>
            <div>{record.refer_name}</div>
            <div>{record.refer_phone}</div>
            <div>{record.refer_email}</div>
          </div>
        );
      },
    },
    {
      title: "Referred By",
      key: "refered_by",
      align: "left",
      width: "35%",
      render: (record) => {
        const { name, phone, email, country_code } = record.user_id || {};
        return (
          <div>
            <div>{name}</div>
            <div>{country_code + phone}</div>
            <div>{email}</div>
          </div>
        );
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      align: "middle",
      key: "action",
      width: "10%",
      render: (_, record) => (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Switch
            checkedChildren="Complete"
            unCheckedChildren="Pending"
            checked={record.action_taken}
            onChange={(checked) => handleSwitchChange(checked, record._id)}
            style={{ marginRight: "0.5rem" }}
          />
          <DeleteFilled
            type="primary"
            style={{ color: "red" }}
            onClick={() => handleDelete(record)}
          />
        </div>
      ),
    },
  ];
  return (
    <>
      <Row justify={"start"}>
        <h4 style={{ fontWeight: "bold" }} className="textblue">
          Referral List
        </h4>
      </Row>
      <Row justify="end">
      <Col span={5}>
            <RangePicker
              format="DD/MM/YYYY"
              disabledDate={disabledDate}
              onChange={handleDateRangeChange}
              style={{marginRight: "0.5rem" }}
              defaultValue={[dayjs().subtract(180, "day"), dayjs()]}
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
  );
};

export default ReferedUsers;
