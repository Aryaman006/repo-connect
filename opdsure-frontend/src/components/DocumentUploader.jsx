import React, { useCallback, useMemo, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { MinusCircleOutlined,CloudUploadOutlined,EyeOutlined } from "@ant-design/icons";
import { v4 as uuidv4 } from "uuid";
import config from "../config/config";
import {Axios} from "../axios/axiosFunctions";
import { notification, Modal } from "antd";


const DocumentUploader = ({ onFilesChange, imageprop,alttext }) => {
  const [files, setFiles] = useState([]);
  const [fileSize, setFileSize] = useState(0);
  const [fileType, setFileType] = useState([]);
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewModal, setPreviewModal] = useState(false);

    const getFileDetails = async () => {
      try {
        const response = await Axios.fetchAxiosData(config.GetFileSize); 
        setFileSize(response?.data[0].docSize); 
        setFileType(response?.data[0].file_type);
      } catch (error) {
        console.log(error, "file details error");
      }
    };
    
    useEffect(() => {
      getFileDetails();
    }, []);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 5) {
      notification.error({
        message: "Maximum 5 files can be uploaded",
      });
      return;
    }
    const remainingSlots = 5 - files.length;
    const updatedFiles = acceptedFiles.slice(0, remainingSlots).filter(file => {
      const fileExtension = file.name.split('.').pop().toLowerCase();
      const isValidType = fileType.includes(fileExtension);       
      const isValidSize = file.size <= fileSize *1024;

      if (!isValidType) {
        notification.error({
          message: "Invalid file type",
        })
      }

      if (!isValidSize) {
        notification.error({
          message: "Invalid file size",
        })
      }

       if (isValidType && isValidSize && !previewUrl) {
        const reader = new FileReader();
        reader.onload = () => {
          setPreviewUrl(reader.result);
        };
        reader.readAsDataURL(file);
      }

      return isValidType && isValidSize;
    }).map((file) => ({
      file,
      id: uuidv4(),
    }));

    setFiles((prevFiles) => [...prevFiles, ...updatedFiles]);
    onFilesChange((prevFiles) => [...prevFiles, ...updatedFiles]);
  }, [onFilesChange, fileType, fileSize, previewUrl]);

  const handleRemoveFile = (id) => {
    const filteredFiles = files.filter((file) => file.id !== id);
    setFiles(filteredFiles);
    onFilesChange(filteredFiles);
  };

  
  const handleView = (file) => {
    const fileExtension = file?.file?.name.toLowerCase().split('.').pop();
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file?.file);
    if (fileExtension === 'pdf') {
      window.open(previewUrl,"_blank", "noreferrer"); 
    } else {
      setPreviewModal(true);
    }
  };
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: true,
  });

  const filesList = useMemo(
    () =>
      files.map((file) => (
        <li key={file.id} className="text-primary">
          <span className="textblue">{file.file.name}</span>
          <span onClick={() => handleView(file)} className="text-decoration-underline ms-1">View</span>
          <MinusCircleOutlined
            className="text-danger ms-1 me-4"
            onClick={() => handleRemoveFile(file.id)}
          />
        </li>
      )),
    [files]
  );

  return (
    <div className="text-decoration-none border-2 p-1 m-2 text-center rounded-3"
    style={{ cursor: "pointer", borderStyle: "dashed", borderColor: "#d3d3d3" }}>
      <div {...getRootProps({ className: "dropzone" })} className="mb-2">
        <input {...getInputProps()} />
        <div>
          {imageprop && <img src={imageprop} alt={alttext}  width={100} height={100}/>}
          {imageprop && <p><CloudUploadOutlined className="fs-4 textblue mt-2"/></p>}
          <p className="textblue mt-3">Drag and drop files here, or click to select files</p>
        </div>
      </div>
      {previewUrl && (
        
        <Modal 
          open={previewModal}
          centered
          okText="Close"
          onCancel={() => setPreviewModal(false)}
          onOk={() => setPreviewModal(false)}
        >
             <img src={previewUrl} alt="Preview" className="preview-image img-fluid" />         
        </Modal>
      )}
     
      <aside>
        <ol className="d-flex flex-wrap">{filesList}</ol>
      </aside>
      {/* <p className="text-primary"><span className="text-danger">*</span>Only {fileType} files are allowed</p> */}

    </div>
    
  );
};

export default DocumentUploader

