import { useEffect, useState } from "react";
import CONSTANTS from "../../constant/Constants";
import axios from "axios";
import dayjs from "dayjs";
import {
  Row,
  Col,
  Input,
  Pagination,
  Table,
  notification,
  Modal,
  Select,
  DatePicker,
} from "antd";
import {
  ArrowUpOutlined,
} from "@ant-design/icons";
const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;
import config from "../../config/config";
import useAxiosFetch from "../../hooks/useAxiosFetch";
import { useAuth } from "../../context/authProvider";

const AuditLogs = () => {
  const { userid } = useAuth();
  const { data: privileges } = useAxiosFetch(
    config.GetIndividualPrivilegs +
      userid +
      "/" +
      CONSTANTS.PRIVILEGE.PROGRAMME.ADMIN.AUDIT_LOGS.id
  );
  const [auditData, setAuditData] = useState([]);
  const [moduleCode, setModuleCode] = useState(CONSTANTS.MODULE_TYPE.ADMIN);
  const [method, setMethod] = useState("ALL");
  const [search, setSearch] = useState(undefined);
  const [sortOrder, setSortOrder] = useState(1);
  const [loading,setLoading]=useState(true);
  const [startDate, setStartDate] = useState(
    dayjs().subtract(30, "day").startOf("day").toISOString()
  );
  const [endDate, setEndDate] = useState(dayjs().endOf("day").toISOString());
  const [pagination, setPagination] = useState({
    totalRecords: 0,
    pageSize: 10,
    totalPages: 0,
    currentPage: 1,
    nextPage: null,
    prevPage: null,
  });

  useEffect(() => {
    fetchAll();
  }, [
    pagination.currentPage,
    pagination.pageSize,
    sortOrder,
    moduleCode,
    method,
    startDate,
    endDate,
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch();
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [search]);

  const fetchAll = async () => {
    try {
      const response = await axios.get(
        moduleCode === CONSTANTS.MODULE_TYPE.ADMIN
          ? `${config.ApiBaseUrl}${config.GetAllAdminAuditLogs}`
          : `${config.ApiBaseUrl}${config.GetAllGeneralUsersAuditLogs}`,
        {
          params: {
            search: search || undefined,
            page: pagination.currentPage,
            pageSize: pagination.pageSize,
            sortBy: "updatedAt",
            sortOrder: sortOrder,
            method: method,
            startDate: startDate,
            endDate: endDate,
          },
        }
      );

      setAuditData(response.data.data.records);
      const {
        totalRecords,
        totalPages,
        currentPage,
        nextPage,
        prevPage,
        pageSize,
      } = response.data.data.pagination;

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
      if (error?.request?.status === 401) {
        notification.error({
          message: error?.response?.data?.error,
          description: "Please contact system admin !",
        });
      }
    }
  };

  const onSearch = async () => {
     fetchAll();
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

  const formatJson = (jsonObject) => {
    const jsonString = JSON.stringify(jsonObject, null, 2);
    return jsonString
    // return jsonString.length > 100 ? jsonString.substring(0, 100) + '...' : jsonString;
  };
  const parseJson = (jsonString) => {
    try {
      return JSON.parse(jsonString);
    } catch (e) {
      return {};
    }
  };
  

  const columns = [
    {
      title: "S.No",
      dataIndex: "_id",
      key: "_id",
      width: "5%",
      align: "center",
      render: (_, record, index) => {
        return (pagination.currentPage - 1) * pagination.pageSize + index + 1;
      },
    },
    {
      title: "Name",
      dataIndex: ["user_id", "name"],
      key: ["user_id", "name"],
      width: "10%",
      align: "left",
    },
    {
      title: "Method",
      dataIndex: "method",
      key: "method",
      width: "5%",
      align: "left",
      render: (text) => {
        switch (text) {
          case 'PATCH':
            return 'Edit';
          case 'DELETE':
            return 'Delete';
          case 'POST':
            return 'Add';
          default:
            return "-";
        }
      },
    },
    {
      title: "Program name",
      dataIndex: "program_name",
      key: "program_name",
      width: "10%",
      align: "left",
    },
    {
      title: (
        <div>
          Updated At
          {
            <ArrowUpOutlined
              style={{ marginLeft: 12, fontSize: "1rem" }}
              onClick={handleSortChange}
              rotate={sortOrder === -1 ? 0 : 180}
            />
          }
        </div>
      ),
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: "10%",
      align: "left",
      render: (text, record) => dayjs(record.dob).format("DD/MM/YYYY"),
    },
    {
      title: "Old Record",
      dataIndex: "old_record",
      key: "old_record",
      width: "25%",
      align: "left",
      render: (text) => {
        const jsonObject = parseJson(text);
        return <div style={{ 
          whiteSpace: 'pre-wrap', 
          // overflow: 'hidden', 
          // textOverflow: 'ellipsis', 
          // maxHeight: '200px' 
        }}>{formatJson(jsonObject)}</div>;
      },
    },
    {
      title: "New Record",
      dataIndex: "new_record",
      key: "new_record",
      width: "25%",
      align: "left",
      render: (text) => {
        const jsonObject = parseJson(text);
        return <div style={{ 
          whiteSpace: 'pre-wrap', 
        }}>{formatJson(jsonObject)}</div>;
      },  
    },
  
  ];

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

  return (
    <>
      <div style={{ padding: "1rem" }}>
        <Row justify={"start"}>
          <h4 style={{ fontWeight: "bold" }} className="textblue">History Report</h4>
        </Row>

        <Row justify="end" style={{marginBottom:"1rem"}}>
         
          <Col >
            <Select
              allowClear
              placeholder="Select Module"
              style={{ width: "180px",marginRight: "0.5rem" }}
              onChange={(value) => {
                setModuleCode(value);
              }}
              defaultValue={CONSTANTS.MODULE_TYPE.ADMIN}
            >
              <Option
                value={CONSTANTS.MODULE_TYPE.ADMIN}
                key={CONSTANTS.MODULE_TYPE.ADMIN}
              >
                Admin
              </Option>
              {/* <Option
                value={CONSTANTS.MODULE_TYPE.GENERAL}
                key={CONSTANTS.MODULE_TYPE.GENERAL}
              >
                General
              </Option> */}
            </Select>
          </Col>
          <Col>
            <Select
              allowClear
              placeholder="Select Method"
              style={{ width: "180px", marginRight: "0.5rem" }}
              options={[
                { value: "ALL", label: "All" },
                // { value: "POST", label: "Post" },
                { value: "PATCH", label: "Edit" },
                { value: "DELETE", label: "Delete" },
              ]}
              defaultValue="ALL"
              onChange={(value) => {
                setMethod(value);
              }}
            />
          </Col>
          <Col span={5}>
            <RangePicker
              format="DD/MM/YYYY"
              disabledDate={disabledDate}
              onChange={handleDateRangeChange}
              style={{marginRight: "0.5rem" }}
              defaultValue={[dayjs().subtract(30, "day"), dayjs()]}
            />
          </Col>
          <Col span={4}>
            <Search
              placeholder="Search"
              onSearch={onSearch}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              enterButton
            />
          </Col>
        </Row>
        <Table
          bordered
          columns={columns}
          dataSource={auditData}
          size="small"
          rowKey={(record) => record._id}
          pagination={false}
          align="right"
          // loading={loading}
          style={{
            marginBottom: "1rem",
            // overflowX: "auto",
            // maxWidth: "100vw",
          }}
          scroll={{
            x: 1000,
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
      </div>
    </>
  );
};

export default AuditLogs;
