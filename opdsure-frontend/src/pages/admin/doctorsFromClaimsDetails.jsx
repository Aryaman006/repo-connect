import React from 'react'
import { LeftCircleOutlined } from "@ant-design/icons";
import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Badge, Descriptions, notification } from "antd";
import {Select,Card, Row, Col, Pagination,Button, Table, Input, Modal, Switch,  DatePicker, Form,  Space, InputNumber  } from "antd";
import { Axios } from '../../axios/axiosFunctions';
import config from '../../config/config';


const DoctorsFromClaimsDetails = () => {
    const [details,setDetails] = useState([]);
    const { id } = useParams();

    const fetchAll = async () => {
        try {
         const response = await Axios.fetchAxiosData(config.GetDoctorsFromClaimsDetails+id);
         if(!response.data)return;
        
         setDetails(response.data.records);
           
        } catch (error) {
           notification.error({
            message:"Something went wrong"
           })
        }
      };
    
      useEffect(()=>{fetchAll()},[]);


    const items = [
        {
          key: '1',
          label: 'Name',
          children: details.name,
        },
        {
          key: '2',
          label: 'Email',
          children: details?.email,
          span:2
        },
        {
            key: '3',
            label: 'Mobile No',
            children: details?.mobile,
        },
        {
            key: '4',
            label: 'City',
            children: details?.city,
        },
        {
            key: '5',
            label: 'Pin Code',
            children: details?.pincode,
        },
        {
            key: '6',
            label: 'Specialization',
            children: details?.specialization,
        },
        {
            key: '7',
            label: 'Hospital',
            children: details?.hospital,
            span:2
        },
        {
            key: '8',
            label: 'address',
            children: details?.address,
            span:2
        }
        
      ];


    return (
        <>
                 <div className="d-flex align-items-center gap-3 mb-3">
                <Link to={`/admin/master/doctormain`}>
                 <LeftCircleOutlined className="text-primary fs-3" />
               </Link>           
             </div>
       <Row justify={"start"}>
         <h4 style={{ fontWeight: "bold" }} className="textblue">
           Doctor Profile
         </h4>
       </Row>
       <br/>
       <Row justify="end">
       <Col span={5}>
           
           </Col>
         <Col span={6}>
         </Col>
       </Row>
       <Descriptions bordered items={items} />
       
     </>
     )
}

export default DoctorsFromClaimsDetails