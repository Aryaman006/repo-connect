import { Table, Card, Form, Row, Col, Input, Button, notification } from "antd";
import CONSTANTS from "../../constant/Constants";
import { Axios } from "../../axios/axiosFunctions";
import config from "../../config/config";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

const Refer = () => {
  const [form] = Form.useForm();
  const [refer,setRefer] = useState([]);
  const fetchAll = async () => {
    const resp = await Axios.fetchAxiosData(config.GetReferedUsersUser);
    setRefer(resp.data.records);
  }
  useEffect(()=>{fetchAll()},[]);

  const onFinish = async (values) => {
    try {
      values.refer_phone = "+91" + values.refer_phone;
      const resp = await Axios.postAxiosData(config.ReferNewUser, values);
      if(resp.success){
        notification.success({
          message: "Referred Successfully",
        });
      } else {
        notification.error({
          message: resp.message,
        });
      }
      form.resetFields();
      fetchAll();
    } catch (error) {
      notification.error({
        message: "Something went wrong",
      });
    }
  };
  const columns = [
    {
      title: "S.No",
      dataIndex: "_id",
      key: "_id",
      width: "10%",
      align: "center",
      render: (_, record, index) => {
        return index + 1 + ".";
      },
    },
    {
      title: 'Name',
      dataIndex: 'refer_name',
      align: "center",
      key: 'refer_name',
    },
    {
      title: 'Mobile',
      dataIndex: 'refer_phone',
      align: "center",
      key: 'refer_phone',
    },
    {
      title: 'Email',
      dataIndex: 'refer_email',
      align: "center",
      key: 'refer_email',
    },
    {
      title: 'Time',
      dataIndex: 'createdAt',
      key: 'createdAt',
      align: "center",
      render: (record) => dayjs(record).format("DD/MM/YYYY")
    },
  ];

  return (
    // <>
    //   <h5
    //     className="text-purple text-center"
    //     style={{ marginBottom: "1.5rem" }}
    //   >
    //     Refer Your Friend
    //   </h5>
    //   <Card style={{ width: "50%", margin: "auto" }}>
    //     <Form
    //       colon={false}
    //       layout="vertical"
    //       labelAlign="left"
    //       form={form}
    //       name="basic"
    //       onFinish={onFinish}
    //       autoComplete="on"
    //       className=""
    //     >
    //       <Row gutter={16}>
    //         <Col span={12} xs={24} sm={12} md={12} lg={6}>
    //           <Form.Item label="Designation Id" name="_id" hidden>
    //             <Input />
    //           </Form.Item>
    //         </Col>
    //       </Row>

    //       <Row>
    //         <Col span={24}>
    //           <Form.Item
    //             label="Name"
    //             name="refer_name"
    //             rules={[
    //               {
    //                 required: true,
    //                 message: "Please enter name !",
    //               },
    //               {
    //                 max: 200,
    //                 message: "Max length 200 char",
    //               },
    //               {
    //                 pattern: CONSTANTS.REGEX.PERSON_NAME,
    //                 message: "Special character not allowed",
    //               },
    //             ]}
    //           >
    //             <Input placeholder="Refer your friend" />
    //           </Form.Item>
    //         </Col>
    //       </Row>
    //       <Row>
    //         <Col span={24}>
    //           <Form.Item
    //             label="Mobile Number"
    //             name="refer_phone"
    //             rules={[
    //               {
    //                 required: true,
    //                 message: "Please enter mobile number",
    //               },
    //               {
    //                 pattern: CONSTANTS.REGEX.MOBILE,
    //                 message: "Invalid mobile number",
    //               },
    //             ]}
    //           >
    //             <Input
    //               addonBefore="+91"
    //               placeholder="Enter mobile number"
    //               style={{ width: "50%" }}
    //             />
    //           </Form.Item>
    //         </Col>
    //       </Row>
    //       <Row>
    //         <Col span={24}>
    //           <Form.Item
    //             label="Email"
    //             name="refer_email"
    //             rules={[
    //               {
    //                 required: false,
    //               },
    //               {
    //                 max: 200,
    //                 message: "Max length 200 char",
    //               },
    //               {
    //                 type: "email",
    //                 message: "Invalid email",
    //               },
    //             ]}
    //           >
    //             <Input placeholder="Enter email" />
    //           </Form.Item>
    //         </Col>
    //       </Row>

    //       <Row justify="center" style={{ paddingTop: "1rem" }}>
    //         <Col>
    //           <Form.Item>
    //             <div>
    //               <Button type="primary" htmlType="submit" className="me-3">
    //                 Refer
    //               </Button>
    //               <Button
    //                 danger
    //                 htmlType="button"
    //                 onClick={() => form.resetFields()}
    //                 className="me-3 btn-secondary"
    //               >
    //                 Cancel
    //               </Button>
    //             </div>
    //           </Form.Item>
    //         </Col>
    //       </Row>
    //     </Form>
    //   </Card>
    //   {/* <Card style={{ width: "50%", margin: "2rem auto" }}>
    //   <div style={{ maxHeight: "calc(2 * 300px)", overflowY: "auto", padding: "1rem" }}>
    //   <h5 className="text-center text-purple">Referral List</h5>
    //   <Row gutter={[16, 16]} style={{ width: "100%" }}>
        
    //     {refer.map((user, index) => (
    //       <Col span={8} key={index}>
    //         <Card 
    //           hoverable 
    //           style={{ 
    //             width: "100%", 
    //             height: "200px", 
    //             position: "relative",
    //             boxSizing: "border-box"
    //           }}
    //         >
    //           <p><strong>Name:</strong> {user.refer_name}</p>
    //           <p><strong>Email:</strong> {user.refer_email}</p>
    //           <p><strong>Phone:</strong> {user.refer_phone}</p>

    //           <div style={{ position: "absolute", bottom: "10px", right: "10px", fontWeight: "bold" }}>
    //             {index + 1}
    //           </div>
    //         </Card>
    //       </Col>
    //     ))}
    //   </Row>
    // </div>
    // </Card> */}
    // {refer.length >0 && <Card style={{ width: "50%", margin: "2rem auto" }}>
    //   <h5 className="text-center text-purple">Referral List</h5>
    //   {/* <div style={{ maxHeight: "calc(2 * 200px + 2rem)", overflowY: "auto", padding: "1rem" }}>
    //     <ol style={{ paddingLeft: "1rem" }}>
    //       {refer.map((user, index) => (
    //         <li key={index} 
    //         // style={{ marginBottom: "1rem", borderBottom: "1px solid #e8e8e8", paddingBottom: "1rem" }}
    //         style={{
    //           marginBottom: "1rem",
    //           borderBottom: "1px solid #e8e8e8",
    //           paddingBottom: "1rem",
    //           textAlign: "center",
    //           display: "flex",
    //           flexDirection: "column",
    //           alignItems: "center",
    //           justifyContent: "center"
    //         }}
    //         >
    //           <p><strong>Name:</strong> {user.refer_name}</p>
    //           <p><strong>Email:</strong> {user.refer_email}</p>
    //           <p><strong>Phone:</strong> {user.refer_phone}</p>
    //         </li>
    //       ))}
    //     </ol>
    //   </div> */}
    //   <Table
    //      bordered
    //      columns={columns}
    //      dataSource={refer}
    //      size="small"
    //      rowKey={(record) => record._id}
    //      pagination={{ pageSize: 10 }}
    //      align="right"
    //      style={{
    //        marginBottom: "1rem",
    //      }}
    //   />
    // </Card>}
    
    // </>

    <>
  <h5 className="text-purple text-center" style={{ marginBottom: "1.5rem" }}>
    Refer Your Friend
  </h5>
  <Card style={{ width: "100%", maxWidth: "600px", margin: "auto" }}>
    <Form
      colon={false}
      layout="vertical"
      labelAlign="left"
      form={form}
      name="basic"
      onFinish={onFinish}
      autoComplete="on"
    >
      <Row gutter={16}>
        <Col xs={24} sm={24} md={12} lg={6}>
          <Form.Item label="Designation Id" name="_id" hidden>
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} sm={24} md={12} lg={12}>
          <Form.Item
            label="Name"
            name="refer_name"
            rules={[
              { required: true, message: "Please enter name!" },
              { max: 200, message: "Max length 200 char" },
              { pattern: CONSTANTS.REGEX.PERSON_NAME, message: "Special character not allowed" },
            ]}
          >
            <Input placeholder="Refer your friend" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} sm={24} md={12} lg={12}>
          <Form.Item
            label="Mobile Number"
            name="refer_phone"
            rules={[
              { required: true, message: "Please enter mobile number" },
              { pattern: CONSTANTS.REGEX.MOBILE, message: "Invalid mobile number" },
            ]}
          >
            <Input addonBefore="+91" placeholder="Enter mobile number" style={{ width: "100%" }} />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} sm={24} md={12} lg={12}>
          <Form.Item
            label="Email"
            name="refer_email"
            rules={[
              { required: false },
              { max: 200, message: "Max length 200 char" },
              { type: "email", message: "Invalid email" },
            ]}
          >
            <Input placeholder="Enter email" />
          </Form.Item>
        </Col>
      </Row>

      <Row justify="center" style={{ paddingTop: "1rem" }}>
        <Col>
          <Form.Item>
            <div>
              <Button type="primary" htmlType="submit" className="me-3">
                Refer
              </Button>
              <Button danger htmlType="button" onClick={() => form.resetFields()} className="me-3 btn-secondary">
                Cancel
              </Button>
            </div>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  </Card>

  {refer.length > 0 && (
    <Card style={{ width: "100%", maxWidth: "600px", margin: "2rem auto" }}>
      <h5 className="text-center text-purple">Referral List</h5>
      <Table
        bordered
        columns={columns}
        dataSource={refer}
        size="small"
        rowKey={(record) => record._id}
        pagination={{ pageSize: 10 }}
        align="right"
        style={{ marginBottom: "1rem" }}
      />
    </Card>
  )}
    </>

  );
  // return (
  //   <>
  //   <h5 className="text-purple text-center" style={{marginBottom:"1.5rem"}}>Refer Your Friend</h5>
  //   <Card style={{width:"50%", margin:"auto"}}>
  //     <Form
  //       colon={false}
  //       layout="vertical"
  //       labelAlign="left"
  //       form={form}
  //       name="basic"
  //       onFinish={onFinish}
  //       autoComplete="on"
  //       className=""
  //     >
  //       <Row gutter={16}>
  //         <Col span={12}>
  //           <Form.Item label="Designation Id" name="_id" hidden>
  //             <Input />
  //           </Form.Item>
  //         </Col>
  //       </Row>

  //       <Row>
  //         <Col span={24}>
  //           <Form.Item
  //             label="Name"
  //             name="refer_name"
  //             rules={[
  //               {
  //                 required: true,
  //                 message: "Please enter name !",
  //               },
  //               {
  //                 max: 200,
  //                 message: "Max length 200 char",
  //               },
  //               {
  //                 pattern: CONSTANTS.REGEX.PERSON_NAME,
  //                 message: "Special character not allowed",
  //               },
  //             ]}
  //           >
  //             <Input placeholder="Refer your friend" />
  //           </Form.Item>
  //         </Col>
  //       </Row>
  //       <Row>
  //         <Col span={24}>
  //           <Form.Item
  //             label="Mobile Number"
  //             name="refer_phone"
  //             rules={[
  //               {
  //                 required: true,
  //                 message: "Please enter mobile number",
  //               },
  //               {
  //                 pattern: CONSTANTS.REGEX.MOBILE,
  //                 message: "Invalid mobile number",
  //               },
  //             ]}
  //           >
  //             <Input addonBefore="+91" placeholder="Enter mobile number" style={{width:"50%"}} />
  //           </Form.Item>
  //         </Col>
  //       </Row>
  //       <Row>
  //         <Col span={24}>
  //           <Form.Item
  //             label="Email"
  //             name="refer_email"
  //             rules={[
  //               {
  //                 required: false,
  //               },
  //               {
  //                 max: 200,
  //                 message: "Max length 200 char",
  //               },
  //               {
  //                 type: "email",
  //                 message: "Invalid email",
  //               },
  //             ]}
  //           >
  //             <Input placeholder="Enter email" />
  //           </Form.Item>
  //         </Col>
  //       </Row>

  //       <Row justify="center" style={{ paddingTop: "1rem" }}>
  //         <Col>
  //           <Form.Item>
  //             <div>
  //               <Button type="primary" htmlType="submit" className="me-3">
  //                 Refer
  //               </Button>
  //               <Button
  //                 danger
  //                 htmlType="button"
  //                 onClick={() => form.resetFields()}
  //                 className="me-3 btn-secondary"
  //               >
  //                 Cancel
  //               </Button>
  //             </div>
  //           </Form.Item>
  //         </Col>
  //       </Row>
  //     </Form>
  //   </Card>
  //   </>
  // );
};

export default Refer;
