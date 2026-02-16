import React, { useState } from "react";
import DocumentUploader from "../../components/DocumentUploader";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button, notification, Modal } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { LeftCircleOutlined,ExclamationCircleFilled } from "@ant-design/icons";
import { Axios } from "../../axios/axiosFunctions";
import config, { CONFIG_OBJ_DOC, CONFIG_OBJ } from "../../config/config";
import CONSTANTS from "../../constant/Constants";
import prescription from "../../assets/prescription1.png";
import labtest from "../../assets/labtest.png";
import pharmacy from "../../assets/pharmacy.jfif";
import doctor from "../../assets/doctor.jfif";
const { confirm } = Modal;

const ClaimDocuments = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { values,claim_combination } = location.state || {};
  const queryParams = new URLSearchParams(location.search);
  const action = Number(queryParams.get("action"));
  const [doctorFiles, setDoctorFiles] = useState([]);
  const [prescriptionFiles, setPrescriptionFiles] = useState([]);
  const [pharmacyFiles, setPharmacyFiles] = useState([]);
  const [labFiles, setLabFiles] = useState([]);
  const [labReports, setLabReports] = useState([]);

  const claimvalues ={
    claim_type: 0,
  }

  const handleDocumentSubmit = async () => {
    try {
      const allFiles = [
        { files: doctorFiles, documentType: "fee_receipt" },
        { files: prescriptionFiles, documentType: "prescription" },
        { files: pharmacyFiles, documentType: "pharmacy_receipt" },
        { files: labFiles, documentType: "test_receipt" },
        { files: labReports, documentType: "test_reports" },
      ];

      let requiredDocuments = [];
      if( action && action === CONSTANTS.CLAIM_STATUS.STATUS.CLARIFICATION ){
        requiredDocuments = [];
      }else{
        if (claimvalues.claim_type === 0) {
          requiredDocuments = ["prescription"];
        } else if (values.claim_type === 1) {
          requiredDocuments = ["prescription", "pharmacy_receipt"];
        } else if (values.claim_type === 2) {
          requiredDocuments = ["prescription", "test_receipt"];
        }
      }
     

      const missingDocuments = requiredDocuments.filter(
        (docType) =>
          !allFiles.find((file) => file.documentType === docType).files.length >
          0
      );

      if (missingDocuments.length > 0) {
        missingDocuments.forEach((docType) => {
          notification.error({
            message: `${docType.replace("_", " ")} is Mandatory`,
          });
        });
        return;
      }
      const uploadPromises = allFiles.map(async ({ files, documentType }) => {
        if (files.length > 0) {
          const formData = new FormData();
          files.forEach((file) => {
            formData.append("files", file.file);
          });
         

          const response = await Axios.postAxiosData(
            config.UploadClaim,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              }
            }
          );

          if (response.success) {
            return { documentType, data: response.data };
          } else {
            throw new Error(`Failed to upload ${documentType} documents`);
          }
        }
        return null;
      });

      const results = await Promise.all(uploadPromises);

      const documents = results.reduce((acc, result) => {
        if (result) {
          acc[result.documentType] = result.data;
        }
        return acc;
      }, {});

      handleSave(documents);
    } catch (error) {
      notification.error({
        message: "Failed to upload documents",
      });
    }
  };
 
  const handleSave = async (document) => {
    confirm({
      title: <h4 className="text-center textblue">Confirmation !</h4>,
      content: <div>
        <p>Kindly, reverify all the claim details and uploaded documents as no details will be editable after submission.</p><p> Are you sure you want to submit?</p>
        </div>,
      icon: <ExclamationCircleFilled />,
      centered: true,
      async onOk() {
    try {
      const allvalues = { ...values,claim_combination, ...document };
      console.log(allvalues)
      let result;
     
      const {_id , ...modifiedData} = allvalues;
      if(action===CONSTANTS.CLAIM_STATUS.STATUS.ADDING){
          result = await Axios.postAxiosData(
          config.AddClaim,
          modifiedData,
          // CONFIG_OBJ
        );
      }else{
          result = await Axios.patchAxiosData(
          config.EditClaim + allvalues._id,
          allvalues,
          // CONFIG_OBJ
        );
      }
        if (result.success === true) {
          notification.success({
            message: "Claim " + (action === CONSTANTS.CLAIM_STATUS.STATUS.ADDING ? "submitted" : "re submitted") + " successfully",
          });
      sessionStorage.removeItem("opdClaimForm");
        navigate(`/user/claims/`, { replace: true });
        // window.location.reload();
      } else {
        notification.error({
          message: result.message,
        });
      }
    } catch (err) {
      console.log("Validation failed:", err);
    }
  },
    onCancel() {},
  });
  };

  const backToForm = async () => {
    navigate(`/user/addclaims/?action=${action}`);
  };

  return (
    <>
      <div className="container">
      <div className="d-flex align-items-center gap-3 mb-3">
            <Link onClick={backToForm}>
              <LeftCircleOutlined className=" fs-3 text-purple mb-2" />
            </Link>
           
          </div>
        <div className="row my-0 d-flex justify-content-between">
          <div className="col-lg-3 col-md-6 mb-3">
            <h3 className="text-purple">Upload Documents</h3>
          </div>
        </div>
        <div className="row">
         

        <div className="row mx-auto d-flex justify-content-center mb-4" >
          <div className="col-12 col-lg-4 col-md-6 ">
          <p className="my-auto fs-5 ms-2">
          {(((values.claim_type === 1 || claimvalues.claim_type === 0 || values.claim_type === 2) && action !== CONSTANTS.CLAIM_STATUS.INTERNAL_STATUS.CLARIFICATION ) ? <span className="text-danger me-2">*</span>:"") }Prescription

          </p>
          <DocumentUploader
                    action={action}
                    onFilesChange={(files) => setPrescriptionFiles(files)}
                    imageprop = {prescription}
                    alttext="Prescription icon"
                  />
          </div>
          <div className="col-12 col-lg-4 col-md-6 ">
          <p className="my-auto fs-5 ms-2">
          {( ((values.claim_type === 0) && action !== CONSTANTS.CLAIM_STATUS.INTERNAL_STATUS.CLARIFICATION ) ? <span className="text-danger me-2">*</span>:"") }Doctor Fee Bill               
          </p>

          <DocumentUploader
                    onFilesChange={(files) => setDoctorFiles(files)}
                    imageprop = {doctor}
                    alttext="Doctor icon"
                  />
          </div>
        </div>
 
        <div className="row d-flex justify-content-center  mx-auto">
          <div className="col-12 col-lg-4 col-md-6 ">
          <p className="my-auto fs-5 ms-2">
          {(((values.claim_type === 1 && action !== CONSTANTS.CLAIM_STATUS.INTERNAL_STATUS.CLARIFICATION )  )? <span className="text-danger me-2">*</span>:"")} Pharmacy Bills
          </p>
          <DocumentUploader
                    onFilesChange={(files) => setPharmacyFiles(files)}
                    imageprop = {pharmacy}
                    alttext="Pharmacy icon"
                  />
          </div>
          <div className="col-12 col-lg-4 col-md-6">
          <p className="my-auto fs-5 ms-2">
          {(((values.claim_type === 2 && action !== CONSTANTS.CLAIM_STATUS.INTERNAL_STATUS.CLARIFICATION )) ? <span className="text-danger me-2">*</span>:"")}Diagnostics Reports
          </p>
          <DocumentUploader
                    onFilesChange={(files) => setLabReports(files)}
                    imageprop = {labtest}
                    alttext="Labtest icon"
                  />
          </div>
          <div className="col-12 col-lg-4 col-md-6">
          <p className="my-auto fs-5 ms-2">
          {(((values.claim_type === 2 && action !== CONSTANTS.CLAIM_STATUS.INTERNAL_STATUS.CLARIFICATION )) ? <span className="text-danger me-2">*</span>:"")}Diagnostics Bills
          </p>
          <DocumentUploader
                    onFilesChange={(files) => setLabFiles(files)}
                    imageprop = {labtest}
                    alttext="Labtest icon"
                  />
          </div>
         
        </div>


          <div className="container mt-3">
      <p className="my-2 mb-2">
        <span style={{ display: 'inline', fontWeight: 'bold' }}>Disclaimer - </span>
        <span className="text-danger">&nbsp;All the documents that are uploaded in the OPDSure Application, will be used only for the claim settlement. The uploaded documents will not be used for any other use in any scenario.</span>
      </p>
      <p className="my-2 mb-2">
        <span style={{ display: 'inline', fontWeight: 'bold' }}>Note - </span>
        <span className="text-danger">&nbsp;Prescription is Mandatory.</span>
      </p>
    </div>
          <div className="row d-flex justify-content-end">
            <div className="col-1">
              <Button
                type="primary"
                htmlType="submit"
                className=""
                onClick={handleDocumentSubmit}
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClaimDocuments;
