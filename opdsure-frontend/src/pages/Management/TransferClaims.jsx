import React, { useState, useEffect } from "react";
import {
  notification,
  Row,
  Col,
  DatePicker,
  Select,
  Input,
  Typography,
  Button,
  Modal,
  Form,
} from "antd";
import { CheckSquareOutlined } from "@ant-design/icons";
import { faSquare } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AntTable from "../../components/AntTable";
import { Axios } from "../../axios/axiosFunctions";
import { Link } from "react-router-dom";
import config from "../../config/config";
import CONSTANTS from "../../constant/Constants";
import { Utils } from "../../utils";
import dayjs from "dayjs";
import GetManagmentUserClaimInternalStatus from "../../utils/GetManagmentUserClaimStatus";

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Search } = Input;
const { Text } = Typography;

const TransferClaims = () => {
  const internalDesignation = Number(localStorage.getItem("designation"));

  const claimsColumns = [
    {
      title: "S.No",
      render: (text, record, index) => {
        const calculatedIndex = (currentPage - 1) * 10 + index + 1;
        return <p className="text-center my-auto">{calculatedIndex}.</p>;
      },
    },
    {
      title: "Claim ID",
      sorter: (a, b) => a.claim_id.localeCompare(b.claim_id),
      render: (text, record) => (
        <Link
          to={`/management/claim-details/${record?._id}/?page=${currentPage}`}
        >
          <p className="text-primary text-decoration-underline my-auto">
            {record?.claim_id}
          </p>
        </Link>
      ),
    },
    {
      title: "Raised Date",
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      render: (text, record) => (
        <p className="text-center my-auto">
          {Utils.DateFormat(record?.createdAt)}
        </p>
      ),
    },
    {
      title: "Name",
      sorter: (a, b) =>
        (a.member_id?.name || "").localeCompare(b.member_id?.name || ""),
      dataIndex: ["member_id", "name"],
    },
    {
      title: "Doctor's Name",
      sorter: (a, b) => (a.doc_name || "").localeCompare(b.doc_name || ""),
      render: (text, record) => (
        <p className="text-center my-auto text-capitalize">
          {record?.doc_name}
        </p>
      ),
    },
    {
      title: "Hospital / Clinic Name",
      sorter: (a, b) => (a.hospital || "").localeCompare(b.hospital || ""),
      render: (text, record) => (
        <p className="text-center my-auto text-capitalize">
          {record?.hospital}
        </p>
      ),
    },
    {
      title: "Act. Bill Amt.",
      sorter: (a, b) => a.bill_amount - b.bill_amount,
      render: (text, record) => (
        <p className="text-center my-auto">
          {record?.bill_amount.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
      ),
    },
    {
      title: "Claimable Amt.",
      sorter: (a, b) => a.claimable_amount - b.claimable_amount,
      render: (text, record) => (
        <p className="text-center my-auto">
          {record?.claimable_amount.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
      ),
    },
    {
      title: "Status",
      sorter: (a, b) => a.internal_status - b.internal_status,
      align: "center",
      render: (text, record) => {
        const status = GetManagmentUserClaimInternalStatus(
          record?.internal_status,
          record?.resubmission,
          internalDesignation
        );
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div>{status}</div>
            {record.internal_status ===
              CONSTANTS.CLAIM_STATUS.STATUS.APPROVED &&
              record.claim_closure_Date && (
                <span style={{ marginTop: "0.5rem" }}>
                  {dayjs(record.claim_closure_Date).format("DD/MM/YYYY")}
                </span>
              )}
          </div>
        );
      },
    },
    {
      title: "Assigned To",
      sorter: (a, b) =>
        (getVerifierNameById(a?.assigned_to_verifier) || "").localeCompare(
          getVerifierNameById(b?.assigned_to_verifier) || ""
        ),
      align: "center",
      render: (text, record) => (
        <p className="my-auto text-capitalize">
          {getVerifierNameById(record?.assigned_to_verifier)}
        </p>
      ),
      width: "10%",
    },
    {
      title: "Action",
      align: "center",
      render: (text, record) => (
        <Button
          size="small"
          hidden={selectedData.length !== 0}
          type="primary"
          onClick={() => handleTransfer(record)}
        >
          Transfer
        </Button>
      ),
      width: "5%",
    },
  ];

  const [claimsData, setClaimsData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentpageSize, setCurrentpageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [verifiers, setVerifiers] = useState([]);
  const [form] = Form.useForm();
  const [isBulkTransfer, setIsBulkTransfer] = useState(false);

  const fetchclaimsData = async () => {
    const response = await Axios.fetchAxiosData(config.GetClaimsManagement, {
      params: {
        page: currentPage,
        pageSize: currentpageSize,
      },
    });
    const filteredRecords = response?.data?.records.filter(
      (record) => record.internal_status === 0 || record.internal_status === 6
    );
    setClaimsData(
      filteredRecords.map((record) => ({ ...record, key: record._id }))
    );
    setTotal(filteredRecords?.length);
  };

  useEffect(() => {
    fetchclaimsData();
  }, [currentPage]);

  const handlePageSizeChange = (size) => {
    setCurrentpageSize(size);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const fetchVerifiers = async () => {
    try {
      const response = await Axios.fetchAxiosData(config.GetVerifierList);
      setVerifiers(response.data);
    } catch (error) {
      console.error("Error fetching verifiers:", error);
    }
  };

  const getVerifierNameById = (id) => {
    const verifier = verifiers?.find((verifier) => verifier._id === id);
    return verifier ? verifier.name : "";
  };

  const handleTransfer = (record) => {
    setSelectedClaim(record);
    form.setFieldsValue({
      assignedVerifier: getVerifierNameById(
        record.assigned_to_verifier || null
      ),
      selectedClaim: record.claim_id,
    });
    setIsBulkTransfer(false);
    setIsModalVisible(true);
  };

  const handleBulkTransfer = () => {
    if (selectedData.length === 0) return;
    setSelectedClaim(null);
    setIsBulkTransfer(true);
    setIsModalVisible(true);
  };

  useEffect(() => {
    fetchVerifiers();
  }, []);

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();

      if (isBulkTransfer) {
        const bulkTransferData = selectedData.map((data) => ({
          claim_id: data._id,
          verifier_id: values.verifier_id,
        }));
        const response = await Axios.postAxiosData(
          config.TransferClaim,
          bulkTransferData
        );

        if (response.success) {
          notification.success({ message: "Claims Transferred Successfully!" });
          fetchclaimsData();
        } else {
          notification.error({ message: "Failed to transfer claims." });
        }
      } else {
        const response = await Axios.postAxiosData(config.TransferClaim, [
          { verifier_id: values.verifier_id, claim_id: selectedClaim._id },
        ]);

        if (response.success) {
          notification.success({ message: "Claim Transferred Successfully!" });
          fetchclaimsData();
        } else {
          notification.error({ message: "Failed to transfer claim." });
        }
      }

      setIsModalVisible(false);
    } catch (error) {
      console.error("Error during transfer:", error);
    }
  };

  const handleModalCancel = () => {
    form.resetFields();
    setIsModalVisible(false);
  };

  const filteredVerifiers = verifiers?.filter(
    (verifier) => verifier._id !== selectedClaim?.assigned_to_verifier
  );

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectAllToggle, setSelectAllToggle] = useState(false);
  const [selectedData, setSelectedData] = useState([]);

  const rowSelection = {
    type: "checkbox",
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys);
      setSelectedData(selectedRows);
    },

    columnTitle: (
      <p
        className="p-2 m-0"
        onClick={() => handleSelectAll()}
        disabled={claimsData?.length === 0}
      >
        {selectAllToggle ? (
          <CheckSquareOutlined className="fs-5" />
        ) : (
          <FontAwesomeIcon icon={faSquare} size="lg" />
        )}
      </p>
    ),
  };

  const handleSelectAll = () => {
    if (selectAllToggle) {
      setSelectedRowKeys([]);
      setSelectedData([]);
    } else {
      const allKeys = claimsData?.map((data) => data.key);
      setSelectedRowKeys(allKeys);
      setSelectedData(claimsData);
    }
    setSelectAllToggle(!selectAllToggle);
  };

  return (
    <>
      <div className="container">
      <div className="between row d-flex justify-content-between">
          <div className="col-2">
          <h5>Transfer Claims</h5>
          </div>
          <div className="col-2 text-end">
          <p>
            <span className="text-danger">*</span>Amount in &#8377;
          </p>
          </div>
          
        </div>
        <Row justify="start" style={{ margin: "10px 0" }}>
          <Button
            type="primary"
            hidden={selectedData.length === 0}
            onClick={handleBulkTransfer}
          >
            Transfer Selected Claims
          </Button>
        </Row>
        <div className="row">
          <AntTable
            columns={claimsColumns}
            data={claimsData}
            onChange={handlePageChange}
            current={currentPage}
            total={total}
            pageSize={currentpageSize}
            onShowSizeChange={handlePageSizeChange}
            rowSelection={rowSelection}
          />
        </div>
        
      </div>

      <Modal
        title={isBulkTransfer ? "Bulk Transfer Claims" : "Transfer Claim"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        centered
        footer={[
          <Button key="back" onClick={handleModalCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleModalOk}>
            {isBulkTransfer ? "Transfer All" : "Transfer"}
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          {!isBulkTransfer ? (
            <>
              <Form.Item label="Claim ID" name="selectedClaim">
                <Input
                  type="text"
                  style={{ width: "100%" }}
                  disabled
                  value={selectedClaim?.claim_id}
                />
              </Form.Item>
              <Form.Item label="Assigned Verifier" name="assignedVerifier">
                <Input
                  type="text"
                  style={{ width: "100%" }}
                  disabled
                  value={getVerifierNameById(
                    selectedClaim?.assigned_to_verifier || ""
                  )}
                />
              </Form.Item>
            </>
          ) : (
            ""
          )}

          <Form.Item
            label="Select Verifier to Transfer"
            name="verifier_id"
            rules={[{ required: true, message: "Please select a verifier." }]}
          >
            <Select
              allowClear
              placeholder="Select Verifier to transfer"
              style={{ width: "100%" }}
            >
              {filteredVerifiers?.map((verifier) => (
                <Option key={verifier._id} value={verifier._id}>
                  {verifier.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default TransferClaims;
