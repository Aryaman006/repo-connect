import React, { useEffect, useState } from "react";
import useAxiosFetch from "../hooks/useAxiosFetch";
import {
  Upload,
  Button,
  Table,
  Row,
  Col,
  Card,
  Form,
  Select,
  notification,
  Input,
  Tooltip,
  Modal
} from "antd";
import config from "../config/config";
import * as XLSX from "xlsx";
import { UploadOutlined, DownloadOutlined, CheckSquareOutlined,PaperClipOutlined,DeleteOutlined  } from "@ant-design/icons";
import { faSquare } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Axios } from "../axios/axiosFunctions";
import CONSTANTS from "../constant/Constants";
import AntTable  from "../components/AntTable";
import exportFunction from "../utils/export";
import dayjs from "dayjs";
import axios from "axios";
const {Option} = Select;
const CorpoEmpBulkUpload = ({handleReset}) => {
  // for search functionality
  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
  // Columns configuration
  const columns = [
    {
      title: "S.No",
      dataIndex: "S.No",
      width: "5%",
      align: "center",
    },
    {
      title: "Emp ID",
      dataIndex: "EmpId",
      width: "10%",
      align: "left",
    },
    {
      title: "Name",
      dataIndex: "Name",
      width: "10%",
      align: "left",
    },
    {
      title: "D.O.B",
      dataIndex: "Dob",
      width: "10%",
      align: "left",
      render: (text,record)=>{
        return dayjs(record?.Dob).format("DD/MM/YYYY")
      }
    },
    {
      title: "Gender",
      dataIndex: "Gender",
      width: "5%",
      align: "left",
      render: (gender) => {
        const genderMap = {
          1: "Male",
          2: "Female",
          3: "Other",
        };
        const genderKey = Number(gender);
        return genderMap[genderKey] || "Unknown";
      },
    },
    {
      title: "Department",
      dataIndex: "Department",
      width: "10%",
      align: "left",
    },
    {
      title: "Designation",
      dataIndex: "Designation",
      width: "10%",
      align: "left",
    },
    {
      title: "Country Code",
      dataIndex: "countryCode",
      width: "5%",
      align: "left",
    },
    {
      title: "Mobile",
      dataIndex: "Mobile",
      width: "10%",
      align: "left",
    },
    {
      title: "Email",
      dataIndex: "Email",
      width: "10%",
      align: "left",
    },
    {
      title: "Address",
      dataIndex: "Address",
      width: "10%",
      align: "left",
    },
    {
      title: "Bank",
      dataIndex: "Bank",
      width: "10%",
      align: "left",
    },
    {
      title: "Status",
      dataIndex: "Status",
      width: "5%",
      align: "left",
      render: (Status) => {
        return Status == 1 ? "Active" : "Inactive";
      },
    },
  ];
 
  const FailedColumns = [
    {
      title: "S.No",
      // render: (text, record, index) => <p className="my-auto">{index + 1}</p>,
      render: (text, record, index) => {
        const calculatedIndex = (currentPage - 1) * 10 + index + 1;
        return <p className="text-center my-auto">{calculatedIndex}.</p>
      },
      // render: (_, record, index) => {
      //   return (currentPage - 1) *pageSize + index + 1;
      // },
      width: "5%",
      align: "center",
    },
    {
      title: "Emp ID",
      dataIndex: "employeeId",
      width: "10%",
      align: "left",
    },
    {
      title: "Name",
      dataIndex: "name",
      width: "10%",
      align: "left",
    },
    {
      title: "Email",
      dataIndex: "email",
      width: "10%",
      align: "left",
    },
    {
      title: "Mobile",
      dataIndex: "phone",
      width: "10%",
      align: "left",
    },
    {
      title: "Reason",
      dataIndex: "reason",
      width: "10%",
      align: "left",
    },
  ]
  // State variables
  const [form] = Form.useForm();
  const [jsonData, setJsonData] = useState([]);
  const [organization, setOrganization] = useState(null);
  const [plans,setPlans] = useState([]);
  const [selectedPlan,setSelectedPlan] = useState(null);
  const [memberShipOptions, setMembershipOptions] = useState([]);
  const [selectedMemberShipOptions, setSelectedMembershipOptions] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedData, setSelectedData] = useState([]);
  const [submittedRowKeys, setSubmittedRowKeys] = useState([]);
  const [fromRow, setFromRow] = useState(null);
  const [toRow, setToRow] = useState(null);
  const [corporateId, setCorporateId] = useState(null);
  const [failedBulk, setFailedBulk] = useState([]);
  const [showFailedModal, setShowFailedModal] = useState(false);
  const [selectAllToggle, setSelectAllToggle] = useState(false); 
  const [currentPage, setCurrentPage] = useState(1);
  const [currentpageSize, setCurrentpageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [fileName, setFileName] = useState("");
  // Fetch corporate data
  const { data: corpoData } = useAxiosFetch(
    config.GetAllCorpo + "?pageSize=1000"
  );
  const fetchPlans = async () => {
    try {
      if(organization != null){
        const resp = await axios.get(config.GetPlanData,
          {params: { pageSize: 1000,
            subscriberTypeFilter: CONSTANTS.SUBSCRIBER_TYPE.CORPORATE,
            ...(organization != "null" && { corporateFilter: organization })
   },
      })
      console.log("resp",resp.data.data.records);
      setPlans(resp.data.data.records)
      }
     
    } catch (error) {
      console.log("failed to fetch plans")
    }
  };
  const filterMembeshipOptions = () => {
    const temp = plans?.find((plan) => plan._id == selectedPlan );
    const filteredTemp = temp?.membership_options?.filter(t => t.charges > 0 );
    setMembershipOptions(filteredTemp);
  }
  
  useEffect(() => {
    fetchPlans();
  }, [organization]);
  useEffect(()=>{
    filterMembeshipOptions();
  },[selectedPlan])
  // Row selection
  const rowSelection = {
    selectedRowKeys: selectedRowKeys , 
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys); 
      setSelectedData(selectedRows);
    },
    getCheckboxProps: (record) => ({
      disabled: submittedRowKeys.includes(record.key),
    }),
    columnTitle: (
      <p
        className="p-2 m-0"
        onClick={() => handleSelectAll()}
        disabled={jsonData?.length === 0} 
      >
        {selectAllToggle ? <CheckSquareOutlined /> : <FontAwesomeIcon icon={faSquare} />}
      </p>
    ),
  };

  const handleSelectAll = () => {
    if (selectAllToggle) {
      setSelectedRowKeys([]);
      setSelectedData([]);
    } else {
      const allKeys = jsonData?.map((data) => data.key);
      setSelectedRowKeys(allKeys);
      setSelectedData(jsonData);
    }
    setSelectAllToggle(!selectAllToggle);
  };

 
  // Handle file upload 

const handleUpload = (file) => {
    if (file.file.status == "error") return;
    setFileName(file.file.name); 
  const reader = new FileReader();
  reader.readAsArrayBuffer(file?.fileList[0]?.originFileObj);
  reader.onload = (e) => {
    const data = e.target.result;
    const workbook = XLSX.read(data, { type: 'array',cellDates: true });
    const worksheet = workbook.Sheets[workbook?.SheetNames[0]];
    const sheetData = XLSX.utils.sheet_to_json(worksheet, { raw: false });

    const dataWithKeys = sheetData?.map((data) => {
      const rowKey = crypto.randomUUID();
      data.key = rowKey;

      return data;
    });

    const filteredData = dataWithKeys.filter((row) => {
      return Object.values(row).some((cellValue) => cellValue !== '');
    });

    const formattedData = filteredData?.map((data) => ({
      key: data.key,
      ...data
    }));

    setJsonData(formattedData);
  };
};


  // Handle range selection
  const handleSelectRange = () => {
    if (!fromRow || !toRow || isNaN(parseInt(fromRow)) || isNaN(parseInt(toRow)) || fromRow >= toRow) {
      notification.error({ message: "Invalid range. Please select valid rows!" });
      return;
    }
    const selectedKeys = [];
    for (let i = fromRow - 1; i < toRow; i++) {
      if (jsonData[i]) {
        selectedKeys.push(jsonData[i].key);
      }
    }
    setSelectedRowKeys(selectedKeys);
    setSelectedData(jsonData.filter((data) => selectedKeys.includes(data.key)));
  };


  const handleDownload = async () => {
    try {
      const headers = [
        "S.No",
        "EmpId",
        "Name",
        "Dob",
        "Gender",
        "Department",
        "Designation",
        "countryCode",
        "Mobile",
        "Email",
        "Address",
        "Bank",
        "Status"
      ];
      exportFunction.exportToExcelOnlyHeader(headers, "CorporateEmp")
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };
  // Handle bulk upload of selected data
  const handleBulkUpload = async () => {
    if (!corporateId) {
      notification.error({ message: "Please select an organization!" });
      return;
    }
    
    const payload = {
        corporate: corporateId,
        plan: selectedPlan,
        membership: selectedMemberShipOptions,
        employee_details: selectedData?.map((data) => ({
        employeeId: data?.EmpId,
        name: data?.Name,
        email: data?.Email,
        designation: data?.Designation,
        bank_name: data?.Bank,
        department: data?.Department,
        address: data?.Address,
        dob: new Date(data?.Dob).toISOString(),
        gender: Number(data?.Gender),
        phone: data?.Mobile,
        country_code: `+${data?.countryCode}`,
        status: Number(data?.Status),
      })),
    };
    try {
      const response = await Axios.postAxiosData(config.BulkUpload, payload);
      setFailedBulk(response?.data?.failedInsertions);
      if (response.success === true) {
        notification.success({ message: "Bulk Upload Successful", 
          description:
          response?.data?.failed_inserts !== 0 ? (
            <span>
              {`${response?.data?.failed_inserts} records failed to upload, `}
              <a
                onClick={() => setShowFailedModal(true)}
                style={{ cursor: "pointer", textDecoration: "underline" }}
              >
                Click here
              </a>
            </span>
          ) : (
            ""
          ),
        });
        setSelectedMembershipOptions(null);
        setMembershipOptions([]);
        setSelectedPlan(null);
        setPlans([]);
      } else {
        notification.error({ message: "Bulk Upload Failed" });
      }
    } catch (error) {
      console.error("Error during bulk upload:", error);
      notification.error({ message: "Error during bulk upload" });
    }
  };

  // delete bulk upload
  const handleDeleteBulk = async (corporateId) => {
      const response = await Axios.deleteAxiosData(config.DeleteFailedBulkUpload+corporateId);
      if (response.success === true) {
        notification.success({ message: "Bulk upload deleted successfully" });
      } else {
        notification.error({ message: "Failed to delete bulk upload" });
      }
  }

  const handlePageSizeChange = (size) => {
    setCurrentpageSize(size);
  };
  
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const handleCancel = () =>{
    setJsonData([]);
    form.resetFields();
    setSelectedMembershipOptions(null);
    setMembershipOptions([]);
    setSelectedPlan(null);
    setPlans([]);
    handleReset();
  }
  const truncatedFileName = fileName.length > 15 ? `${fileName.slice(0, 15)}...` : fileName;

  return (
    <>
      <Card
        style={{
          width: "100%",
          margin: "auto",
          backgroundColor: "#FAFAFA",
          marginTop: "2.5rem",
        }}
      >
        <Row justify={"start"}>
          <h4
            style={{
              fontWeight: "bold",
              marginTop: "1rem",
              marginBottom: "3rem",
            }}
            className="textblue"
          >
            Add Corporate Subscriber Details
          </h4>
        </Row>
        <Form form={form}>
        <Row>
          <Col span={12} justify={"start"}>
            <Form.Item
              label="Organization"
              name="corporate"
              rules={[
                {
                  required: true,
                  message: "Please select organization !",
                },
              ]}
            >
              <Select
                placeholder="Select Organization"
                style={{ width: "100%" }}
                onChange={(value) => {setCorporateId(value);setOrganization(value)}}
                allowClear
                showSearch
                optionFilterProp="children"
                filterOption={filterOption}
              >
                {corpoData?.records?.map((corpo) => (
                  <Select.Option
                    key={corpo._id}
                    value={corpo._id}
                    label={corpo.name}
                  >
                    {corpo.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row>
                 
                 <Col span={12}>
                   <Form.Item
                     label="Plan"
                     name="plan"
                     rules={[
                       {
                         required: true,
                         message: "Please select plan !",
                       },
                     ]}
                     labelCol={{ span: 5, offset: 0 }}
                   >
                      <Select
                       placeholder="Select Plan"                      
                       style={{ width: "100%" }}
                       onChange={(value)=>{setSelectedPlan(value)}}
                     >
                       {plans?.map((plan) => (
                         <Option
                           key={plan._id}
                           value={plan._id}
                           label={plan.name}
                         >
                           {plan.name}
                         </Option>
                       ))}
                     </Select>
                   </Form.Item>
                 </Col>
             
               </Row>
               <Row>
               <Col span={12}>
                   <Form.Item
                     label="Membership"
                     name="membership"
                     rules={[
                       {
                         required: true,
                         message: "Please select membership !",
                       },
                     ]}
                    //  labelCol={{ span: 5, offset: 2 }}
                   >
                      <Select
                       placeholder="Select Membership"
                      
                       style={{ width: "100%" }}
                       onChange={(value)=>{setSelectedMembershipOptions(value)}}
                     >
                       {memberShipOptions?.map((memb) => (
                         <Option
                           key={memb.membership_id}
                           value={memb.membership_id}
                           label={memb.membership_label}
                         >
                           {memb.membership_label}
                         </Option>
                       ))}
                     </Select>
                   </Form.Item>
                 </Col>
               </Row>
        <Row gutter={16} className="mb-3">
          <Col span={5}>
            <Button
              type="primary"
              style={{ width: "100%" }}
              onClick={handleDownload}
            >
              <DownloadOutlined />
              Download Sample File
            </Button>
          </Col>
          <Col span={4}>
            <Upload
              onChange={handleUpload}
              onRemove={() => setJsonData([])}
              maxCount={1}
              accept=".xls, .xlsx"
              showUploadList={false}
            >
              <Tooltip placement="top" title={!corporateId ? <span>First Select organization</span>:""} arrow>
              <Button type="primary" style={{ width: "100%" }} disabled={!corporateId}>
                <UploadOutlined /> Upload File
              </Button>
              </Tooltip>         
            </Upload>
            {fileName && (
        <div className="text-success text-truncate" style={{ marginTop: '8px', display: 'flex', alignItems: 'center' }}>
          <PaperClipOutlined style={{ marginRight: '8px' }} />
          <span>{truncatedFileName}</span>
          <DeleteOutlined  onClick={() => { setJsonData([]);setFileName("");}}  style={{ marginLeft: '8px', cursor: 'pointer' }} />
        </div>
      )}         
          </Col>
        </Row>

        <Row gutter={16} className="mb-3">
          <Col span={4}>
            <Input
              allowClear
              placeholder="From Row"
              value={fromRow}
              onChange={(e) => setFromRow(e.target.value)}
            />
          </Col>
          <Col span={4}>
            <Input
              allowClear
              placeholder="To Row"
              value={toRow}
              onChange={(e) => setToRow(e.target.value)}
            />
          </Col>
          <Col span={4}>
            <Button type="primary" onClick={handleSelectRange} disabled={setJsonData === "" || fromRow > toRow || !fromRow || !toRow}>
              Select Range
            </Button>
          </Col>
        </Row>
      <div style={{ color: 'red' }}>
          <ul>
            <li>Gender options for Male: 1, Female: 2, Others: 3.</li>
            <li>Date of birth format DD/MM/YYYY.</li>
            <li>For active users: 1 and for inactive users: 0.</li>
          </ul>
      </div>
        <Table
          dataSource={jsonData}
          columns={columns}
          rowSelection={{
            type: "checkbox",
            ...rowSelection,
          }}
          bordered
          size="small"
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ["10", "25", "50", "100"],
          }}
        />
       
        <Row justify="center" style={{ paddingTop: "1rem" }}>
          <Col>
            <Form.Item>
              <div>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="me-3"
                  onClick={handleBulkUpload}
                >
                  Submit
                </Button>
                <Button
                  danger
                  htmlType="button"
                  onClick={() => {
                   handleCancel();
                  }}
                  
                  className="me-3"
                >
                  Cancel
                </Button>
              </div>
            </Form.Item>
          </Col>
        </Row>
        </Form>
      </Card>

      <Modal
        title="Failed Records"
        open={showFailedModal}
        onOk={() => handleDeleteBulk(corporateId)}
        onCancel={() => setShowFailedModal(false)}
        width={800}
        okText="Delete All"
      >
        <div className="container">
          <div className="row">
            <div className="col-12">
            <AntTable columns={FailedColumns} data={failedBulk} size="small"  onChange={handlePageChange} 
          current={currentPage}
          total={total}
          pageSize={currentpageSize}
          onShowSizeChange={handlePageSizeChange}/>
            </div>
          </div>
        </div>
     
      </Modal>
    </>
  );
};

export default CorpoEmpBulkUpload;
