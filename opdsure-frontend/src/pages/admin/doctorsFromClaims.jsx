import { useEffect, useState } from "react";
import CONSTANTS from "../../../src/constant/Constants";
import axios from "axios";
import {
  Row,
  Col,
  Input,
  Pagination,
  Button,
  Table,
  notification,
  Modal,
  Form,
  Card,
  Select,
  Space,
  InputNumber,
} from "antd";
import {
  EditFilled,
  DeleteFilled,
  ArrowUpOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import { PlusOutlined } from "@ant-design/icons";
const { Search, TextArea } = Input;
const { Option } = Select;
const { confirm } = Modal;
import config from "../../../src/config/config";
import useAxiosFetch from "../../../src/hooks/useAxiosFetch";
import { useAuth } from "../../../src/context/authProvider";
import exportFunction from "../../../src/utils/export";
import { Link } from "react-router-dom";

const DoctorFromClaims = () => {
  const {userid} = useAuth();
  const { data : privileges } = useAxiosFetch(config.GetIndividualPrivilegs+userid+"/"+CONSTANTS.PRIVILEGE.PROGRAMME.ADMIN.DOCTORS.id);
  const [form] = Form.useForm();
  const [doctor, setDoctor] = useState([]);
  const [specializationList, setSpecializationList] = useState([]);
  const [doctorData, setDoctorData] = useState([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [sortOrder, setSortOrder] = useState(1);
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
  }, [pagination.currentPage, pagination.pageSize, sortOrder]);

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch();
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [search]);

//   const fetchSpecialization = async()=>{
//      const response = await Axios.fetchAxiosData(config.GetAllSpecialization, {params: { pageSize: 1000 }},)
//      setSpecializationList(response?.data?.records);
//   }

//   useEffect (()=>{
//     fetchSpecialization();
//   },[])

  //fetch all data/read
  const fetchAll = async () => {
    try {
      const response = await axios.get(`${config.ApiBaseUrl}${config.GetDoctorsFromClaims}`, {
        params: {
          search: search || undefined,
          page: pagination.currentPage,
          pageSize: pagination.pageSize,
          sortBy: "name",
          sortOrder: sortOrder,
        },
      });
      
      setDoctor(response.data.data.records);
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
      if(error?.request?.status === 401 ){
        notification.error({
          message: error?.response?.data?.error,
          description: "Please contact system admin !",
        });
      }
    }
  };

  const fetchAllDoctors = async () => {
    try {
      const response = await axios.get(`${config.ApiBaseUrl}${config.GetDoctorsFromClaimsList}`, {
      });
      
      const filteredRecords =
      response?.data?.data?.records?.map((record) => ({
        name: record.name,
        specialization: record.specialization,
        // exp: record.exp,
        hospital: record.hospital,
        mobile: record.mobile,
        // status: GetCorporateStatus(record.status),
      })) || [];
      setDoctorData(filteredRecords);
      setTotal(response?.data?.data?.pagination.totalRecords);
      
    } catch (error) {
      if(error?.request?.status === 401 ){
        notification.error({
          message: error?.response?.data?.error,
          description: "Please contact system admin !",
        });
      }
    }
  };

  useEffect(()=>{
    fetchAllDoctors()
  },[])

//   const GetCorporateStatus = (status) => {
//     switch (status) {
//       case CONSTANTS.STATUS.ACTIVE:
//         return "Active";
//       case CONSTANTS.STATUS.INACTIVE:
//         return "InActive";
//       default:
//         return "Unknown Status";
//     }
//   };

  const pdftitle = "Doctor List From Claims";
  const ExportFileName = "Doctor_List_Claims";

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
    "Name",
    "Mobile No",
    "Specialization",
    "Hospital",
  ];

  const dataWithHeaders = [
    headers,
    ...doctorData?.map((item, index) => [
      index + 1,
      item.name,
      item.mobile,
      item.specialization,
      item.hospital,
    ]),
  ];

  const pdfData = doctorData?.map((item, index) => [
    index + 1,
    item.name,
    item.mobile,
    item.specialization,
    item.hospital,
  ]);

//   const onFinish = async (values) => {
//     confirm({
//       title: isAdding
//         ? "Are you sure you want to save the record?"
//         : "Are you sure you want to modify the record?",
//       icon: <ExclamationCircleFilled />,
//       centered: true,
//       async onOk() {
//         try {
//           if (isAdding && !isEditing) {
//             try {
//               await axios.post(config.AddDoctor, {
//                 name: values.name,
//                 reg_no: values.reg_no,
//                 specialization: values.specialization,
//                 exp: values.exp,
//                 hospital: values.hospital,
//                 address: values.address,
//                 state: values.state,
//                 mobile: values.mobile.number,
//                 country_code: values.mobile.code,
//                 email: values.email,
//                 status: values.status,
//               });
//               form.resetFields();
//               notification.success({
//                 message: "Doctors details added.",
//                 // description: "Successfully",
//               });
//               fetchAll();
//             } catch (error) {
//               notification.error({
//                 message: error.response.data.message,
//                 description: "Try Again !",
//               });
//             }
//           } else if (isEditing && !isAdding) {
//             try {
//               await axios.patch(config.EditDoctor + values._id, {
//                 name: values.name,
//                 reg_no: values.reg_no,
//                 specialization: values.specialization,
//                 exp: values.exp,
//                 hospital: values.hospital,
//                 address: values.address,
//                 state: values.state,
//                 mobile: values.mobile.number,
//                 country_code: values.mobile.code,
//                 email: values.email,
//                 status: values.status,
//               });
//               handleReset();

//               notification.success({
//                 message: "Success",
//                 description: "Record updated.",
//               });
//               fetchAll();
//             } catch (error) {
//               notification.error({
//                 message: "Failed",
//                 description: "Unable to update record",
//               });
//             }
//           }
//         } catch (error) {
//           notification.error({
//             message: "Failed to submit",
//           });
//         }
//       },
//       onCancel() {},
//     });
//   };

//   const handleEdit = (record) => {
//     form.setFieldsValue({
//       _id: record._id,
//       name: record.name,
//       reg_no: record.reg_no,
//       specialization: record.specialization,
//       exp: record.exp,
//       hospital: record.hospital,
//       address: record.address,
//       state: record.state,
//       mobile: { number: record.mobile, code: record.country_code },
//       email: record.email,
//       status: record.status,
//     });
//     setIsEditing(true);
//     setIsAdding(false);
//     window.scrollTo({
//       top: document.documentElement.scrollHeight,
//       behavior: "smooth",
//     });
//   };

  const handleDelete = async (record) => {
    confirm({
      title: "Are you sure you want to delete the record?",
      icon: <ExclamationCircleFilled />,
      centered: true,
      async onOk() {
        try {
          await axios.delete(config.DeleteDoctor + record._id);
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

  // search functionality
  const onSearch = async () => {
    await fetchAll();
  };

  const handleReset = () => {
    setIsAdding(false);
    setIsEditing(false);
    form.resetFields();
  };
  //Pagination
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

  const columns = [
    {
      title: "S.No",
      dataIndex: "_id",
      key: "_id",
      width: "2%",
      align: "center",
      render: (_, record, index) => {
        return (pagination.currentPage - 1) * pagination.pageSize + index + 1;
      },
    },
    {
      title: (
        <div>
          Name
          {
            <ArrowUpOutlined
              style={{ marginLeft: 12, fontSize: "1rem" }}
              onClick={handleSortChange}
              rotate={sortOrder === -1 ? 0 : 180}
            />
          }
        </div>
      ),
      // dataIndex: "name",
      key: "name",
      width: "10%",
      align: "left",
      render: (record) => {
        return <div><Link to={`/admin/doctorfromclaims-details/${record?._id}`}>{record?.name}</Link></div>;
      },
    },
    {
      title: "Mobile No.",
      dataIndex: "mobile",
      key: "reg_no",
      width: "8%",
      align: "left",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: "15%",
      align: "left",
    },
    {
      title: "Specialization",
      dataIndex: "specialization",
      key: "specialization",
      width: "8%",
      align: "left",
    },
    {
      title: "Hospital",
      dataIndex: "hospital",
      key: "hospital",
      width: "10%",
      align: "left",
    },
    {
      title: "Action",
      dataIndex: "action",
      align: "center",
      key: "action",
      width: "8%",
      hidden: (!privileges?.PATCH && !privileges?.DELETE),
      render: (_, record) => (
        <>
          {/* {privileges?.PATCH && <EditFilled
            type="primary"
            style={{
              marginRight: "15px",
              color: "green",
              textAlign: "center",
            }}
            
            onClick={() => handleEdit(record)}
          />} */}
          {privileges?.DELETE && <DeleteFilled
            type="primary"
            style={{ color: "red" }}
            onClick={() => handleDelete(record)}
          />}
        </>
      ),
    },
  ];
  
  return (
    <>
      <div style={{ padding: "1rem" }}>
        {/* <Row justify={"start"}>
          <h4 style={{ fontWeight: "bold" }} className="textblue">Doctor From Claims</h4>
        </Row> */}
        <Row justify="end">
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
        <div className="row d-flex justify-content-between my-4">
                        <div className="col-3">
                          <h5>Doctor List</h5>
                        </div>
                        <div className="col-5 d-flex gap-2 justify-content-end">
                          <div className="col-3">
                            <Button
                              onClick={() => handleExport("excel")}
                              type="primary"
                              size="small"
                              style={{ marginRight: "3rem" }}
                            >
                              Export to Excel
                            </Button>
                          </div>
                          <div className="col-3">
                            <Button
                              onClick={() => handleExport("pdf")}
                              type="primary"
                              size="small"
                            >
                              Export to PDF
                            </Button>
                          </div>
             </div>
        </div>
        <Table
          bordered
          columns={columns}
          dataSource={doctor}
          size="small"
          rowKey={(record) => record._id}
          pagination={false}
          align="right"
          //   scroll={{
          //     y: 400,
          //   }}
          //   sticky={{ offsetHeader: 0 }}
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
       
      </div>
    </>
  );
};

export default DoctorFromClaims;
