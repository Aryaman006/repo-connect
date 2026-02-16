import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import arrow from "../Assets/ArrowLeft.png";
import careerBanner from "../Assets/career-banner.png";
import jobsBanner from "../Assets/jobsBanner.jpg";
import { Axios } from "../../axios/axiosFunctions";
import config from "../../config/config";
import {
  Table,
  Button,
  Form,
  Input,
  notification,
  Row,
  Col,
  Select,
  Space,
  InputNumber,
} from "antd";
const {Option} = Select; 
import CONSTANTS from "../../constant/Constants";
import codes from "country-calling-code";
import { FloatButton } from "antd";
import { ArrowUpOutlined } from "@ant-design/icons";
import DocumentUploader from "../../components/DocumentUploader";
import disputeimg from "../../assets/dispute.jfif";
const Careers = () => {
  const [files, setFiles] = useState([]);
  const [applyJobForm] = Form.useForm();
  const [alljobs, setAllJobs] = useState([]);
  const [applyJob, setApplyJob] = useState(false);
  const [jobId, setJobId] = useState(null);
  const [jobTitle, setJobTitle] = useState("");
  const [expandedRowKey, setExpandedRowKey] = useState(null);
  const [showFloatButton, setShowFloatButton] = useState(true);
  const handleScrollToTop = () => {
    try {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      notification.error({
        message: "Scroll Error",
        description:
          "An error occurred while scrolling to the top. Please try again later.",
      });
    }
  };
  const columns = [
    {
      title: "Job Title",
      dataIndex: "title",
      key: "title",
      width: "80%",
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <>
          <div className="d-flex gap-2 justify-content-center">
            <Button
              type="primary"
              onClick={() => {
                handleApplyAction(record._id);
                setJobTitle(record.title);
              }}
            >
              Apply
            </Button>
            <Button
          type="primary"
          onClick={() => handleExpandnew(record.key)} // Expand the row
        >
          View Job Details
        </Button>
          </div>
        </>
      ),
    },
  ];

  const fetchAllJobs = async () => {
    const response = await Axios.fetchAxiosData(config.GetAllJobOpenings);
    const filteredJobs = response?.data?.records.filter(
      (job) => job.status === true
    );
    setAllJobs(filteredJobs);
  };

  useEffect(() => {
    fetchAllJobs();
  }, []);
  const handleExpandnew = (key) => {
    setExpandedRowKey(prevKey => (prevKey === key ? null : key)); // Toggle logic
  };
  const handleViewAction = (url) => {
    window.open(url, "_blank");
  };

  const handleApplyAction = (id) => {
    setApplyJob(true);
    setJobId(id);
    applyJobForm.setFieldsValue({job:id})
    applyJobForm.resetFields();
  };

  const handleCancelApply = () => {
    setApplyJob(false);
    applyJobForm.resetFields();
  };
  const handleDocumentSubmit = async () => {
    try {
      if (files.length > 0) {
        const formData = new FormData();
        files.forEach((file) => {
          formData.append("files", file.file);
        });

        const response = await Axios.postAxiosData(
          config.UploadResume,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.success) {
          return { data: response.data };
        } else {
          // throw new Error(`Failed to upload documents`);
        }
      }
      const uploadPromises = files?.map(async ({ files, documentType }) => {
        if (files.length > 0) {
          const formData = new FormData();
          files.forEach((file) => {
            formData.append("files", file.file);
          });

          const response = await Axios.postAxiosData(
            config.AdminUploadFiles,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          if (response.success) {
            return { documentType, data: response.data.data };
          } else {
            throw new Error(`Failed to upload ${documentType} documents`);
          }
        }
        return null;
      });

      const results = await Promise.all(uploadPromises);
      // const documents = results.reduce((acc, result) => {
      //   if (result) {
      //     acc[result.documentType] = result.data;
      //   }
      //   return acc;
      // }, {});

     
    } catch (error) {
      // notification.error({
      //   message: "Failed to upload documents",
      // });
    }
  };
  const handleApplyFormSubmit = async (values) => {
    const files = await handleDocumentSubmit();
    if (files?.length >= 1) {
      notification.error({
        message: "Max one file can be uploaded",
      });
      return;
    }
    const { mobile, ...value } = values;
    const { country_code, number } = values.mobile;
    const phoneString = `${country_code}${number}`;
    const response = await Axios.postAxiosData(config.PostJobApplication, {
      job: jobId,
      mobile: phoneString,
      ...(files?.data &&
        files?.data?.length > 0 && { resume: files.data[0] }),
      ...value,
    });

    if (response.success === true) {
      notification.success({ message: "Application submitted successfully" });
      setApplyJob(false);
      applyJobForm.resetFields();
    } else {
      notification.error({ message: response.message });
    }
  };

  const handleExpand = (expanded, record) => {
    setExpandedRowKey(expanded ? record.key : null);
  };

  return (
    <>
      <div className="container-fluid bg-gradient-light">
        <div className="row">
          <div className="col-12 text-center p-0">
            <Link to="/homepage">
              <img
                src={arrow}
                alt="arrow for back to homepage"
                className="img-fluid z-5 position-absolute start-0 ms-lg-5 ms-3 arrowSize bg-5dadec mt-3 rounded-circle"
              />
            </Link>
            <img src={jobsBanner} alt="career banner" className="img-fluid" />
          </div>
          <div className="row mt-5">
            <div className="col-11 mx-auto">
              <h2 className="fw-800 text-243572" style={{fontSize:"32px"}}>Job Openings @ OPDSure</h2>
              <p className="text-dark my-4 fw-400">
                At OPDSure, we are dedicated to offering innovative
                technology-driven OPD plans to cover expenses for individuals
                across India. We view our employees as the core of our success,
                with their passion, skills, and dedication fueling our growth.
                If you seek a rewarding career in the healthcare sector, explore
                the opportunities we offer. Click on the available roles to find
                the perfect fit for you, and feel free to reach out to us at
                talentacquisition@opdsure.com for more information.
              </p>
            </div>
          </div>

          <div className="row my-5 d-flex justify-content-center mx-auto">
            <div className="col-lg-10 col-md-10 col-12">
              <Table
                columns={columns}
                dataSource={alljobs?.map((job) => ({
                  ...job,
                  key: job._id,
                }))}
                expandable={{
                  expandedRowRender: (record) => (
                    <div
                      style={{
                        margin: 0,
                      }}
                      dangerouslySetInnerHTML={{ __html: record.description }}
                    ></div>
                  ),
                  rowExpandable: (record) => record.description !== undefined,
                }}
                pagination={false}
                showHeader={false}
                scroll={{ x: 600 }}
                expandedRowKeys={expandedRowKey ? [expandedRowKey] : []}
                onExpand={handleExpand}
              />
            </div>
          </div>

          {applyJob && (
            <div className="row d-flex justify-content-center mx-auto">
              <div className="col-lg-10 col-md-10 col-12 mx-1 bg-243673 p-5 mb-4">
                <h1 className="text-center fw-700 text-white mb-5" style={{fontSize:"24px"}}>
                  Get In Touch With Us
                </h1>
                {/* <h3 className="text-start fw-400 text-white mb-3" style={{fontSize:"20px"}}>Job Profile : {jobTitle}</h3> */}
                <Form
                  form={applyJobForm}
                  onFinish={handleApplyFormSubmit}
                  layout="vertical"
                  initialValues={{
                    mobile: {
                      country_code: "+91",
                    },
                    job: jobId,
                  }}
                  requiredMark={false}
                  style={{maxWidth:"55rem",margin:"auto"}}
                >
                  <Row gutter={20}>
                  <Col lg={6} md={8} xs={16}>
                      <Form.Item
                        name="job"
                        rules={[
                          {
                            required: true,
                            message: "Please select profile",
                          },
                        ]}
                        style={{ width: "100%" }}
                      >
                        <Select placeholder="Job Profile" >
                        {alljobs?.map((option) => (
                        <Option key={option._id} value={option._id}>
                          {option.title}
                        </Option>
                      ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col lg={6} md={10} xs={12}>
                      <Form.Item
                        name="experience"
                        rules={[
                          { required: true, message: "Experience is required" },
                          { type: "number", min: 0, message: "Minimum 0" },
                          { type: "number", max: 99, message: "Maximum 99" },
                        ]}
                      >
                        <InputNumber
                          placeholder="Experience"
                          style={{ width: "100%" }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={20}>
                    <Col lg={6} md={8} xs={24}>
                      <Form.Item
                        name="name"
                        rules={[
                          {
                            required: true,
                            message: "Please enter your name",
                          },
                        ]}
                        
                      >
                        <Input placeholder="Enter your name" />
                      </Form.Item>
                    </Col>
                    <Col lg={6} md={8} xs={24}>
                      <Form.Item
                        name="email"
                        rules={[
                          {
                            required: true,
                            message: "Please enter your email",
                          },
                        ]}
                      >
                        <Input placeholder="Enter your email" />
                      </Form.Item>
                    </Col>
                    <Col lg={6} md={10} xs={24} >
                      <Form.Item style={{ width: "72%"}}>
                        <Space.Compact>
                          <Form.Item
                            name={["mobile", "country_code"]}
                            noStyle
                            rules={[
                              {
                                required: true,
                                message: "Country code is required",
                              },
                              {
                                pattern: CONSTANTS.REGEX.COUNTRY_CODE,
                                message: "Invalid country code",
                              },
                            ]}
                          >
                            <Select
                              className="bg-white rounded-2"
                              showSearch
                              optionFilterProp="children"
                              filterOption={(input, option) =>
                                option.children
                                  .toLowerCase()
                                  .indexOf(input.toLowerCase()) >= 0
                              }
                              placeholder="code"
                              style={{ width: "45%" }}
                              disabled
                            >
                              {codes?.map((country) => (
                                <Select.Option
                                  key={country.isoCode2}
                                  value={country.countryCodes[0]}
                                >
                                  {`+${country.countryCodes[0]}`}
                                </Select.Option>
                              ))}
                            </Select>
                          </Form.Item>
                          <Form.Item
                            name={["mobile", "number"]}
                            noStyle
                            rules={[
                              {
                                required: true,
                                message: "Mobile no. is required",
                              },
                              {
                                pattern: CONSTANTS.REGEX.PHONE,
                                message: "Invalid mobile no.!",
                              },
                            ]}
                          >
                            <Input
                              placeholder="Mobile No."
                              className="mobile-input1"
                              style={{ width: "60%" }}
                            />
                          </Form.Item>
                        </Space.Compact>
                      </Form.Item>
                    </Col>
                   
                    {/* </Row>
                  <Row gutter={16}> */}
                   <br /> 
               <br/>
               <Row>

               
                  <Col lg={24} md={14} xs={14} >
                <p className=" text-white ms-2" >Upload Resume</p>
                    <DocumentUploader
                      onFilesChange={(files) => setFiles(files)}
                      // imageprop={disputeimg}
                      
                    />
                  </Col>
                  </Row>
                  </Row>
                  <Row gutter={16} justify={"start"} className="mt-3">
                    <Col lg={4} md={12} xs={12}>
                      <Button
                        htmlType="submit"
                        block
                        className="bg-5dadec border-0 text-white"
                      >
                        Submit
                      </Button>
                    </Col>
                    <Col lg={4} md={12} xs={12}>
                      <Button
                        
                        onClick={handleCancelApply}
                        block
                        className="bg-5dadec border-0 text-white"
                      >
                        Cancel
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Scroll to Top Button */}
      {showFloatButton && (
        <FloatButton
          icon={<ArrowUpOutlined />}
          tooltip="Scroll to top"
          style={{ right: 60, bottom: 40, backgroundColor: "#5dadec" }}
          onClick={handleScrollToTop}
        />
      )}
    </>
  );
};

export default Careers;
