import React, { useState, useEffect, useRef } from "react";
import {
  Row,
  Col,
  Form,
  Input,
  Button,
  Select,
  notification,
  DatePicker,
  Modal,
} from "antd";
import {
  PlusOutlined,
  CloseOutlined,
  CheckOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
  ExclamationCircleFilled,
  PercentageOutlined,
  LoadingOutlined,
  InfoCircleTwoTone,
} from "@ant-design/icons";
const { TextArea } = Input;
import config, { CONFIG_OBJ, CONFIG_OBJ_DOC } from "../../config/config";
import { Axios } from "../../axios/axiosFunctions";
import dayjs from "dayjs";
const { Option } = Select;
const { confirm } = Modal;
import codes from "country-calling-code";
import { FileUploader } from "react-drag-drop-files";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../context/authProvider";
import {
  capitalizeFirstLetter,
  CapitalizeFirstLetterAndRemoveUnderscore,
  GetRelationString,
} from "../../utils";
import CONSTANTS from "../../constant/Constants";
const fileTypes = ["JPG", "PNG", "JPEG", "PDF"];

const UserFamilyDetailsForm = () => {
  // for smooth passing of cursor
  // for one by one start to end filling of input type
  const { userid } = useAuth();
  const nameRef = useRef(null);
  const relationRef = useRef(null);
  const dobRef = useRef(null);
  const genderRef = useRef(null);
  const countryCodeRef = useRef(null);
  const phoneRef = useRef(null);
  const addressRef = useRef(null);

  // Function to focus on the next input element
  const focusNextInput = (nextRef) => {
    if (nextRef && nextRef.current) {
      nextRef.current.focus();
    }
  };
  // all states
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [formDisabled, setFormDisabled] = useState(true);
  const [memberSaved, setMemberSaved] = useState(false);
  const [memberRecords, setMemberRecords] = useState([]);
  const [memberRecordsUpdate, setMemberRecordsUpdate] = useState([]);
  const [relationList, setRelationList] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFamilyModalOpen, setIsFamilyModalOpen] = useState(false);
  const [isPendingModalOpen, setIsPendingModalOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [filename, setFilename] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [largeFileSize, setLargeFileSize] = useState(false);
  const [updateMemberRecords, setUpdateMemberRecords] = useState([]);

  const showRelationList = {
    0: "SELF",
    1: "FATHER",
    2: "MOTHER",
    3: "SISTER",
    4: "BROTHER",
    5: "SON",
    6: "DAUGHTER",
    7: "WIFE",
    8: "HUSBAND",
    9: "FATHER_IN_LAW",
    10: "MOTHER_IN_LAW",
  };

  //  all functions
  // for document modal
  const showModal = (index) => {
    setEditingIndex(index);
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const showFamilyModal = () => {
    setIsFamilyModalOpen(true);
  };
  const handleFamilyCancel = () => {
    setIsFamilyModalOpen(false);
  };
  // for pending modal open
  const showPendingModal = (index) => {
    setEditingIndex(index);
    setIsPendingModalOpen(true);
  };
  const handlePendingOk = () => {
    setIsPendingModalOpen(false);
  };
  //   for file upload
  const handleFileChange = (newFile) => {
    const file = newFile && newFile.length ? newFile[0] : null;
    setFilename(file?.name);
    setFile(file);
  };

  const dynamicMaxSize = (file_size) => {
    return file_size;
  };

  const getFileSize = async () => {
    try {
      const response = await Axios.fetchAxiosData(config.GetFileSize);
      setFileSize(response.data[0].docSize);
    } catch (error) {
      console.log(error, "file size error");
    }
  };
  const fileSizemb = fileSize / 1024;
  useEffect(() => {
    getFileSize();
  }, []);

  const handleSizeError = (Size) => {
    if (Size > fileSize) {
      setLargeFileSize(true);
      notification.error({
        message: "File size exceeds the maximum allowed size",
      });
    }
  };

  // for document submit

  const handleDocumentSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("files", file);

      const response = await Axios.postAxiosData(config.UploadClaim, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.success) {
        handleOk(response.data);
      } else {
        throw new Error(`Failed to upload documents`);
      }
    } catch (error) {
      console.error("Error uploading documents:", error);
      notification.error({
        message: "Failed to upload documents",
      });
    }
  };

  const handleOk = async (documents) => {
    const updatedMemberRecords = memberRecordsUpdate?.map((record) => ({
      ...record,
    }));

    delete updatedMemberRecords[editingIndex].formDisabled;
    const member = updatedMemberRecords[editingIndex];

    try {
      let payload = {
        member_id: member._id,
        file: documents[0],
      };

      const updatedMember = { ...member };
      delete updatedMember.review_status;
      delete updatedMember.createdAt;
      delete updatedMember.updatedAt;
      delete updatedMember._id;
      delete updatedMember.user_id;
      delete updatedMember.plan_status;
      delete updatedMember.__v;

      const response1 = await Axios.postAxiosData(
        config.EditMember,
        { ...updatedMember, ...payload }
        // CONFIG_OBJ
      );
      if (response1.success === true) {
        setMemberSaved(true);
        setFormDisabled(true);
        setIsModalOpen(false);
        setIsEditing(false);
        fetchUpdateMember();
        notification.success({
          message: "Member details update request raised successfully",
        });
      } else {
        notification.error({ message: "Member Not Updated" });
      }
      setMemberRecords(updatedMemberRecords);
      fetchMemberData();
    } catch (error) {
      notification.error({ message: error.response.data.message });
    }
  };

  useEffect(() => {
    const handleRelationList = async () => {
      const response = await Axios.fetchAxiosData(config.GetRelationList);
      setRelationList(response.data);
    };
    handleRelationList();
  }, []);

  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const updatedMemberRecords = [...memberRecords];
    updatedMemberRecords[index][name] = value;
    setMemberRecords(updatedMemberRecords);
  };

  const handleDateChange = (index, value) => {
    const updatedMemberRecords = [...memberRecords];
    updatedMemberRecords[index].dob = value;
    setMemberRecords(updatedMemberRecords);
  };

  const disableDobHandler = (current) => {
    return current && current > dayjs();
  };

  // for adding member
  const handleAddMember = () => {
    const updatedMemberRecords = memberRecords?.map((record) => ({
      ...record,
      formDisabled: true,
    }));

    const newMemberRecord = {
      name: "",
      relation: "",
      dob: "",
      gender: "",
      country_code: "+91",
      phone: "",
      address: "",
      // formDisabled: false,
    };

    setMemberRecords([...updatedMemberRecords, newMemberRecord]);
    setMemberSaved(false);
    setFormDisabled(false);
  };

  //   for fetching member

  const fetchMemberData = async () => {
    const memberData = await Axios.fetchAxiosData(config.GetMembers);
    setMemberRecords(memberData.data);
  };

  const fetchUpdateMember = async () => {
    const resp = await Axios.fetchAxiosData(config.GetRequestedMember);
    setUpdateMemberRecords(resp.data);
  };

  useEffect(() => {
    fetchMemberData();
    fetchUpdateMember();
  }, []);

  //   for editing member
  const handleEditMember = (index) => {
    setEditingIndex(index);
    setIsEditing(true);

    const updatedMemberRecords = memberRecords?.map((record, i) => ({
      ...record,
      formDisabled: i === index ? false : true,
    }));
    setMemberRecords(updatedMemberRecords);
    setFormDisabled(false); // Disable all other rows for editing
    setMemberSaved(false);
  };
  //   for deleting member
  const handleDeleteMember = async (memberId) => {
    try {
      confirm({
        title: "Do you want to delete these items?",
        icon: <ExclamationCircleFilled />,
        content: "Be sure before deleting, this process is irreversible!",
        async onOk() {
          try {
            const response = await Axios.deleteAxiosData(
              config.DeleteMember + memberId
              // CONFIG_OBJ
            );
            setMemberRecords(
              memberRecords.filter((member) => member._id !== memberId)
            );
            fetchMemberData();
            if (response.success === true) {
              notification.success({ message: "Member Deleted Successfully" });
            } else {
              notification.error({ message: response.message });
            }
          } catch (err) {
            // console.log("error deleting project", err);
          }
        },
        onCancel() {},
      });
    } catch (error) {
      console.log(error);
    }
    fetchMemberData();
  };

  // for reseting member
  const handleResetMember = () => {
    fetchMemberData();
    setIsEditing(false);
    setMemberSaved(true);
    setFormDisabled(true);
  };

  //   for saving new member
  const saveMember = async (index) => {
    const member = memberRecords[index];

    try {
      if (
        !member.name ||
        member.relation === "" ||
        !member.dob ||
        !member.gender ||
        !member.country_code ||
        !member.phone ||
        !member.address
      ) {
        notification.error({ message: "Please fill required fields" });
        return false;
      }

      if (member._id) {
        const updatedMemberRecords = [...memberRecords];
        updatedMemberRecords[index] = { ...member };
        setMemberRecords(updatedMemberRecords);
        setMemberRecordsUpdate(updatedMemberRecords);
        showModal(index);
      } else {
        const response2 = await Axios.postAxiosData(
          config.AddMember,
          member
          // CONFIG_OBJ
        );
        if (response2.success === true) {
          setMemberSaved(true);
          setFormDisabled(true);

          notification.success({
            message: "Member details added successfully",
          });
        } else {
          notification.error({ message: "Member Not added" });
        }
      }
      fetchMemberData();
    } catch (error) {
      notification.error({ message: error.response.data.message });
    }
  };

  // handle relation change
  const handleRelationChange = (index, value) => {
    const updatedMemberRecords = [...memberRecords];

    updatedMemberRecords[index].relation = value;

    setMemberRecords(updatedMemberRecords);
  };

  const handleGenderChange = (index, value) => {
    const updatedMemberRecords = [...memberRecords];
    updatedMemberRecords[index].gender = value;

    setMemberRecords(updatedMemberRecords);
  };
  const genderMap = {
    [CONSTANTS.GENDER.MALE]: "Male",
    [CONSTANTS.GENDER.FEMALE]: "Female",
    [CONSTANTS.GENDER.OTHER]: "Other",
  };
  return (
    <>
      <div className="container-fluid">
        <br />
        <div className="row">
          <Row justify={"end"}>
            <InfoCircleTwoTone
              style={{
                fontSize: "20px",
                cursor: "pointer",
                backgroundColor: "#f0f0f0",
                borderRadius: "50%",
                transition: "background-color 0.3s ease",
              }}
              onClick={showFamilyModal}
            />
          </Row>
          <Modal
            title="Requested to update family member"
            width={1000}
            centered
            open={isFamilyModalOpen}
            onCancel={handleFamilyCancel}
          >
            <div className="table-container">
              <table className="table table-bordered  table-hover table-responsive-sm table-responsive-md table-responsive-lg mt-3">
                <thead className="">
                  <tr className="custom-thead">
                    <th className="form-label responsive-fontsize-table-header text-center custom-thead">
                      S.No.
                    </th>
                    <th className="form-label responsive-fontsize-table-header  text-center custom-thead">
                      {/* <div> */}
                      Name<span style={{ color: "red" }}>*</span>
                      {/* </div> */}
                    </th>
                    <th className="form-label responsive-fontsize-table-header text-center custom-thead">
                      {/* <div> */}
                      Relation<span style={{ color: "red" }}>*</span>
                      {/* </div> */}
                    </th>
                    <th className="form-label responsive-fontsize-table-header text-center custom-thead">
                      D.O.B<span style={{ color: "red" }}>*</span>
                    </th>
                    <th className="form-label responsive-fontsize-table-header  text-center custom-thead">
                      Gender<span style={{ color: "red" }}>*</span>
                    </th>

                    <th
                      className="form-label  responsive-fontsize-table-header text-center lh-0 custom-thead"
                      style={{ whiteSpace: "nowrap" }}
                    >
                      Phone
                      <span style={{ color: "red" }}> *</span>
                    </th>
                    <th
                      className="form-label  responsive-fontsize-table-header text-center custom-thead"
                      style={{ whiteSpace: "nowrap" }}
                    >
                      Address <span style={{ color: "red" }}> *</span>
                    </th>
                    <th className="form-label responsive-fontsize-table-header text-center custom-thead">
                      Plan
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Array?.isArray(updateMemberRecords) &&
                    updateMemberRecords?.map((record, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{record.name}</td>

                        <td>{GetRelationString(record.relation)}</td>
                        <td>{dayjs(record?.dob).format("DD/MM/YYYY")}</td>
                        <td>{genderMap[record.gender] || "Unknown"}</td>
                        <td className="text-center">
                          <span className="d-flex gap-1">
                            {record.country_code + record.phone}
                          </span>
                        </td>
                        <td>{record.address}</td>
                        <td>
                          <p>
                            {record.plan_status === 0
                              ? "Unpaid"
                              : record.plan_status === 1
                              ? "Paid"
                              : ""}
                          </p>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </Modal>

          <div className="table-container">
            <table className="table table-bordered  table-hover table-responsive-sm table-responsive-md table-responsive-lg mt-3">
              <thead className="">
                <tr className="custom-thead">
                  <th className="form-label responsive-fontsize-table-header text-center custom-thead p-1">
                    S.No.
                  </th>
                  <th className="form-label responsive-fontsize-table-header  text-center custom-thead p-1">
                    {/* <div> */}
                    Name<span style={{ color: "red" }}>*</span>
                    {/* </div> */}
                  </th>
                  <th className="form-label responsive-fontsize-table-header  text-center custom-thead p-1">
                    {/* <div> */}
                    Relation<span style={{ color: "red" }}>*</span>
                    {/* </div> */}
                  </th>
                  <th className="form-label responsive-fontsize-table-header text-center custom-thead p-1">
                    D.O.B<span style={{ color: "red" }}>*</span>
                  </th>
                  <th className="form-label responsive-fontsize-table-header text-center custom-thead p-1">
                    Gender<span style={{ color: "red" }}>*</span>
                  </th>

                  <th className="form-label responsive-fontsize-table-header text-center  custom-thead p-1">
                    Phone
                    <span style={{ color: "red" }}> *</span>
                  </th>
                  <th
                    className="form-label responsive-fontsize-table-header text-center custom-thead p-1"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    Address <span style={{ color: "red" }}> *</span>
                  </th>
                  <th className="form-label responsive-fontsize-table-header text-center custom-thead p-1">
                    Plan
                  </th>
                  <th className="form-label responsive-fontsize-table-header  text-center custom-thead p-1">
                    <Button
                      onClick={handleAddMember}
                      className="d-flex justify-content-center align-items-center m-0 p-1 "
                    >
                      <PlusOutlined />
                      Add Member
                    </Button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {Array?.isArray(memberRecords) &&
                  memberRecords?.map((record, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>
                        <Input
                          ref={nameRef}
                          placeholder="Enter Name"
                          type="text"
                          name="name"
                          className="form-control form-control-sm "
                          value={record.name}
                          onChange={(e) => {
                            handleInputChange(index, e);
                          }}
                          required
                          disabled={
                            record.formDisabled ||
                            formDisabled ||
                            record.relation === 0
                          }
                        />
                      </td>

                      <td>
                        <Select
                          name="relation"
                          ref={relationRef}
                          showSearch
                          allowClear
                          placeholder="Select Relation"
                          optionFilterProp="children"
                          filterOption={(input, option) =>
                            option.children
                              .toLowerCase()
                              .includes(input.toLowerCase())
                          }
                          style={{ width: "150px" }}
                          onChange={(value) => {
                            handleRelationChange(index, value);
                            focusNextInput(dobRef);
                          }}
                          value={record.relation}
                          disabled={
                            record.formDisabled ||
                            formDisabled ||
                            record.relation === 0
                          }
                          rules={[
                            {
                              required: true,
                              message: "Please select relation",
                            },
                          ]}
                        >
                          {/* {Object.keys(relationList).filter(key=> key != 0).map((key) => (
                          <Option key={key} value={relationList[key]} style={{width:"100%"}} 
                            disabled={key==0} >
                            {CapitalizeFirstLetterAndRemoveUnderscore(key.toLowerCase())}
                          </Option>
                        ))} */}
                          {Object.keys(relationList)
                            .filter((key) => {
                              if (record.relation == 0) {
                                return true;
                              }
                              return key !== "SELF";
                            })
                            .map((key) => (
                              <Option
                                key={key}
                                value={relationList[key]}
                                style={{ width: "100%" }}
                                disabled={key == "SELF"} // Disable option if key is "0"
                              >
                                {CapitalizeFirstLetterAndRemoveUnderscore(
                                  key.toLowerCase()
                                )}
                              </Option>
                            ))}
                        </Select>
                      </td>
                      <td>
                        <DatePicker
                          ref={dobRef}
                          type="date"
                          name="dob"
                          className="form-control form-control-sm inputTextBlack"
                          value={record.dob ? dayjs(record.dob) : null}
                          placeholder="Select Date"
                          format="DD/MM/YYYY"
                          style={{ width: "100%" }}
                          disabledDate={disableDobHandler}
                          onChange={(e) => {
                            handleDateChange(index, e);
                            focusNextInput(genderRef);
                          }}
                          required
                          disabled={record.formDisabled || formDisabled}
                        />
                      </td>
                      <td>
                        <select
                          ref={genderRef}
                          name="gender"
                          className="form-control form-control-sm"
                          value={record.gender}
                          onChange={(e) => {
                            handleGenderChange(index, e.target.value);
                            focusNextInput(countryCodeRef);
                          }}
                          required
                          disabled={record.formDisabled || formDisabled}
                        >
                          <option value="">Select</option>
                          <option value={1}>Male</option>
                          <option value={2}>Female</option>
                          <option value={3}>Other</option>
                        </select>
                      </td>
                      <td className="text-center">
                        <span className="d-flex gap-1">
                          <Select
                            ref={countryCodeRef}
                            showSearch
                            allowClear
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                              option.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            }
                            value={record.country_code} // Set the selected value from state
                            style={{ width: "5rem" }} // Adjust width as needed
                            onChange={(value) =>
                              handleInputChange(index, {
                                target: { name: "country_code", value },
                              })
                            }
                            // disabled={record.formDisabled || formDisabled || record.relation === 0}
                            disabled
                          >
                            {codes?.map((country) => (
                              <Option
                                key={country.isoCode2}
                                value={country.countryCodes[0]}
                              >
                                {`+${country.countryCodes[0]}`}
                              </Option>
                            ))}
                          </Select>

                          <input
                            ref={phoneRef}
                            type="tel"
                            name="phone"
                            className="form-control form-control-sm"
                            value={record.phone}
                            style={{ width: "7rem" }}
                            onChange={(e) => {
                              handleInputChange(index, e);
                            }}
                            required
                            disabled={
                              record.formDisabled ||
                              formDisabled ||
                              record.relation === 0
                            }
                            maxLength={13}
                          />
                        </span>
                      </td>
                      <td>
                        <TextArea
                          ref={addressRef}
                          placeholder="Address"
                          type="text"
                          name="address"
                          className="form-control form-control-sm"
                          value={record.address}
                          onChange={(e) => {
                            handleInputChange(index, e);
                          }}
                          autoSize={{ minRows: 1, maxRows: 3 }}
                          required
                          disabled={record.formDisabled || formDisabled}
                        />
                      </td>
                      <td>
                        <p>
                          {record.plan_status === 0
                            ? "Unpaid"
                            : record.plan_status === 1
                            ? "Paid"
                            : ""}
                        </p>
                      </td>

                      {!isModalOpen && (
                        <td>
                          <p className="d-flex gap-3 align-items-center  justify-content-center my-auto">
                            {!isEditing && (
                              <>
                                <button
                                  className="border-0 bg-transparent"
                                  disabled={
                                    record.review_status === 0 ||
                                    record.relation === 0
                                  }
                                  // hidden = { record.relation === 0 ? true : false }
                                >
                                  <FontAwesomeIcon
                                    icon={faTrashCan}
                                    style={{
                                      color:
                                        record.review_status === 0 ||
                                        record.relation === 0
                                          ? "grey"
                                          : "red",
                                    }}
                                    onClick={() =>
                                      handleDeleteMember(record._id)
                                    }
                                  />
                                </button>

                                <button
                                  className="border-0 bg-transparent"
                                  disabled={record.review_status === 0}
                                >
                                  <EditOutlined
                                    style={{
                                      color:
                                        record.review_status === 0
                                          ? "grey"
                                          : "blue",
                                    }}
                                    onClick={() => handleEditMember(index)}
                                  />
                                </button>
                              </>
                            )}

                            {!memberSaved &&
                              isEditing &&
                              !record.formDisabled && (
                                // <CloseOutlined
                                //   style={{ color: "red" }}
                                //   onClick={() => handleResetMember(record._id)}
                                // />
                                <Button
                                  style={{ color: "red" }}
                                  onClick={() => handleResetMember(record._id)}
                                  className="d-flex justify-content-center align-items-center m-0 "
                                >
                                  Cancel
                                </Button>
                              )}
                            {!record.formDisabled &&
                              !memberSaved &&
                              !formDisabled &&
                              !isEditing && (
                                <Button
                                  style={{ color: "green" }}
                                  onClick={() => saveMember(index)}
                                  className="d-flex justify-content-center align-items-center m-0 "
                                >
                                  <PlusOutlined />
                                  Add
                                </Button>
                                // <CheckOutlined
                                //   style={{ color: "green" }}
                                //   onClick={() => saveMember(index)}
                                // />
                              )}
                            {!record.formDisabled &&
                              !memberSaved &&
                              !formDisabled &&
                              isEditing && (
                                // <UploadOutlined
                                //   style={{ color: "green" }}
                                //   onClick={() => saveMember(index)}
                                // />
                                <Button
                                  style={{ color: "green" }}
                                  onClick={() => saveMember(index)}
                                  className="d-flex justify-content-center align-items-center m-0 "
                                >
                                  Save
                                </Button>
                              )}
                          </p>
                        </td>
                      )}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* modal for upload documents */}
          <Modal
            title="Upload Documents"
            open={isModalOpen}
            onOk={handleDocumentSubmit}
            onCancel={handleCancel}
            okText="Submit"
          >
            <br />
            <FileUploader
              handleChange={handleFileChange}
              name="file"
              types={fileTypes}
              multiple="false"
              maxSize={dynamicMaxSize}
              onSizeError={handleSizeError}
            />
            <p className="text-primary mt-2">{filename}</p>
            {/* {largeFileSize ? <p>File size exceeds the maximum allowed size</p> : <p>error</p>} */}
            <p style={{ color: "red" }}>* Max file size: {fileSizemb} MB</p>
            <br />
          </Modal>

          <Modal
            title="Member Details"
            open={isPendingModalOpen}
            onOk={handlePendingOk}
            onCancel={handlePendingOk}
          ></Modal>
        </div>
      </div>
    </>
  );
};

export default UserFamilyDetailsForm;
