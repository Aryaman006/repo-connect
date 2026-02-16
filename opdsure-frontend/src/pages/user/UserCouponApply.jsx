// import React, { useState, useEffect } from "react";
// import { Button, Input, Space, notification, Form, Col, Row } from "antd";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faArrowRightLong } from "@fortawesome/free-solid-svg-icons";
// import { useLocation } from "react-router-dom";
// import config, { CONFIG_OBJ } from "../../config/config";
// import { Axios } from "../../axios/axiosFunctions";
// import { useNavigate } from "react-router-dom";
// import CONSTANTS from "../../constant/Constants";
// import { useGeneralUser } from "../../context/generalUserProvider";
// import axios from "axios";

// const UserCouponApply = () => {
//   const [form] = Form.useForm();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { setName, setEmail, setMobile, setPlanPurchaseStatus,setFirstPlanPurchase} = useGeneralUser();
//   const { plan_values, health_plan_values } = location.state || {};
//   const [coupon_code, setCoupon_code] = useState("")
//   const [user, setUser] = useState()
//   const [paymentPrice, setPaymentPrice] = useState({
//     plan_price: 0,
//     coupon_discount: 0,
//     gst: 0,
//   });

//   const isHealthPlan = !!health_plan_values;

//   useEffect(() => {
//     GetPlanPrice();
//   }, [plan_values, coupon_code, isHealthPlan]);

//   useEffect(()=> {
//     GetUserProfile()
//   },[])

//   const CouponSubmit = async (values) => {
//     setCoupon_code(values.coupon_code)
//   };

//   const GetUserProfile = async() => {
//     const resp = await Axios.fetchAxiosData(config.GetProfile)
//     setUser(resp.data)
//   }

//   const GetPlanPrice = async () => {
//     try {
//       let params = {
//         order_for: isHealthPlan ? CONSTANTS.PAYMENT.ORDER_FOR.HEALTH_TEST : CONSTANTS.PAYMENT.ORDER_FOR.PLAN,
//         coupon_code: coupon_code
//       };

//       if (isHealthPlan) {
//         params.health_plan_id = health_plan_values;
//       } else {
//         params.plan_id = plan_values?.plan_id;
//         params.membership_id = plan_values?.membership_id;
//       }

//       // let res = await Axios.fetchAxiosData(config.GetPlanPrice, {params});
//       let res = await axios.get(config.GetPlanPrice, {params});

//       if (res.status===200) {
//         setPaymentPrice({
//           plan_price: res.data.data.plan_price,
//           coupon_discount: res.data.data.coupon_discount,
//           gst: res.data.data.gst,
//         });
//       }
//       else if(res.status===400){
//         notification.error({
//           message: res.message
//         })
//       }
//     } catch (error) {
//       notification.error({
//         message: error.response.data.message,
//       });
//       setTimeout(()=>{setCoupon_code("");form.resetFields();},3000);

//     }
//   };

//   const initPayment = (data) => {
//     const options = {
//       key: config.razorpay_key,
//       amount: data.amount,
//       currency: data.currency,
//       name: plan_values?.plan_name,
//       order_id: data.id,
//       prefill: {
//         name: user.name,
//         contact: user.phone,
//         email: user.email
//       },
//       handler: async (response) => {
//         try {
//           const res = await Axios.postAxiosData(config.VerifyPayment, response);
//           if (res.success) {
//             notification.success({
//               message: "Payment verified successfully",
//             })
//             if(isHealthPlan){
//             navigate("/fill-test-details",{ replace:true});
//             }
//             else{
//               navigate("/user/paymentsuccess",{ replace:true});
//             }
//           }

//         } catch (error) {
//           console.log("Payment verification error:", error);
//           notification.error({
//             message: "Payment verification failed",
//           });
//         }
//       },
//       theme: {
//         color: "#3267FF",
//       },
//     };
//     const rzp1 = new window.Razorpay(options);
//     rzp1.open();
//   };

//   const handlePay = async () => {
//     try {
//       let params = {
//         order_for: isHealthPlan ? CONSTANTS.PAYMENT.ORDER_FOR.HEALTH_TEST : CONSTANTS.PAYMENT.ORDER_FOR.PLAN,
//         coupon_code: coupon_code
//       };

//       if (isHealthPlan) {
//         params.health_plan_id = health_plan_values;
//       } else {
//         params.plan_id = plan_values?.plan_id;
//         params.membership_id = plan_values?.membership_id;
//       }
//       const res = await Axios.postAxiosData(config.CreateOrder, {...params});
//       if (res.success) {
//         if (res.data.amount) {
//           initPayment(res.data);
//         } else {
//           let profile = await Axios.fetchAxiosData(config.GetProfile);
//           const userName = profile.data.name;
//           const userEmail = profile.data.email;
//           const userMobile = profile.data.country_code + profile.data.phone;
//           const plan = profile.data.plan.purchased;
//           const firstPlanPurchase = profile.data.first_plan_purchase;
//           setName(userName);
//           setEmail(userEmail);
//           setMobile(userMobile);
//           setPlanPurchaseStatus(plan?1:0);
//           setFirstPlanPurchase(firstPlanPurchase?firstPlanPurchase:false);
//           if(firstPlanPurchase === CONSTANTS.FIRST_PURCHASE.TRUE){
//             navigate("/user/dashboard",{replace:true});
//           } else {
//             navigate("/user/plans",{replace:true});
//           }
//         }
//       }
//     } catch (error) {
//       console.log("Error creating order:", error);
//       notification.error({
//         message: "Failed to create order",
//       });
//     }
//   };
//   return (
//     <div className="container">
//       <div className="row d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
//         <div className="col-6 rounded-3 border border-1 mx-auto p-3 m-5" style={{ minHeight: "70%" }}>
//           <div className="row border-bottom py-3">
//             <div className="col-12">
//               <h4 className="text-primary fw-medium">Payment Details</h4>
//               <p>Complete your purchase now to enjoy our exclusive products and services.</p>
//               <p className="text-primary text-capitalize">{plan_values?.selectedCard?.name}</p>
//             </div>
//           </div>

//           <div className="row my-2">
//             <div className="col-12">
//               <Form
//               form={form}
//                 onFinish={CouponSubmit}
//                 style={{
//                   width: "100%",
//                   marginTop: "auto"
//                 }}
//                 >
//                 <Row>
//                   <Col span={20}>
//                   <Form.Item
//                     name="coupon_code"
//                   >
//                     <Input
//                       placeholder="Enter Coupon Code"
//                     />
//                   </Form.Item>
//                   </Col>
//                   <Col span={4}>
//                   <Form.Item>
//                     <Button type="primary" htmlType="submit" style={{width: "100%"}}>Apply</Button>
//                   </Form.Item>
//                   </Col>
//               </Row>
//               </Form>
//             </div>
//           </div>
//           <div className="row border border-1 rounded-3 pt-3 mx-auto" style={{ lineHeight: "0.3", width: "100%" }}>
//             <div className="col-12 mb-2">
//               <p className="fw-bold">Sub Total</p>
//             </div>
//             <div className="col-12 d-flex">
//               <div className="col-6">
//                 <p className="fw-lighter">Plan Price</p>
//               </div>
//               <div className="col-6 text-end ">
//                 <p className="fw-light">&#8377;{(paymentPrice.plan_price).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
//               </div>
//             </div>
//             <div className="col-12 d-flex">
//               <div className="col-6">
//                 <p className="fw-medium">Coupon Discount</p>
//               </div>
//               <div className="col-6 text-end text-success">
//                 <p className="fw-light">-&#8377;{(paymentPrice.coupon_discount).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
//               </div>
//             </div>
//             <div className="col-12 d-flex">
//               <div className="col-6">
//                 <p className="fw-medium">Net Amt.</p>
//               </div>
//               <div className="col-6 text-end">
//                 <p className="fw-light">&#8377;{(paymentPrice.plan_price - paymentPrice.coupon_discount).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
//               </div>
//             </div>
//             <div className="col-12 d-flex">
//               <div className="col-6">
//                 <p className="fw-medium">GST(18)%</p>
//               </div>
//               <div className="col-6 text-end">
//                 <p className="fw-light">&#8377;{(paymentPrice.gst).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
//               </div>
//             </div>
//             <hr />
//             <div className="col-12 d-flex">
//               <div className="col-6">
//                 <p className="fw-bold">Total</p>
//               </div>
//               <div className="col-6 text-end">
//                 <p className="fw-bold">
//                   &#8377;{(paymentPrice.plan_price - paymentPrice.coupon_discount + paymentPrice.gst).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//                 </p>
//               </div>
//             </div>
//           </div>

//           <Button type="primary" className="my-3" onClick={handlePay} block>
//             Pay Now <FontAwesomeIcon icon={faArrowRightLong} />
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserCouponApply;

import React, { useState, useEffect } from "react";
import { Button, Input, Space, notification, Form, Col, Row } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightLong } from "@fortawesome/free-solid-svg-icons";
import { useLocation } from "react-router-dom";
import config, { CONFIG_OBJ } from "../../config/config";
import { Axios } from "../../axios/axiosFunctions";
import { useNavigate } from "react-router-dom";
import CONSTANTS from "../../constant/Constants";
import { useGeneralUser } from "../../context/generalUserProvider";
import axios from "axios";

const UserCouponApply = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    setName,
    setEmail,
    setMobile,
    setPlanPurchaseStatus,
    setFirstPlanPurchase,
  } = useGeneralUser();
  const { plan_values, health_plan_values } = location.state || {};
  const [coupon_code, setCoupon_code] = useState("");
  const [user, setUser] = useState();
  const [paymentPrice, setPaymentPrice] = useState({
    plan_price: 0,
    coupon_discount: 0,
    gst: 0,
  });

  const isHealthPlan = !!health_plan_values;

  useEffect(() => {
    GetPlanPrice();
  }, [plan_values, coupon_code, isHealthPlan]);

  useEffect(() => {
    GetUserProfile();
  }, []);

  const CouponSubmit = async (values) => {
    setCoupon_code(values.coupon_code);
  };

  const GetUserProfile = async () => {
    const resp = await Axios.fetchAxiosData(config.GetProfile);
    setUser(resp.data);
  };

  const GetPlanPrice = async () => {
    try {
      let params = {
        order_for: isHealthPlan
          ? CONSTANTS.PAYMENT.ORDER_FOR.HEALTH_TEST
          : CONSTANTS.PAYMENT.ORDER_FOR.PLAN,
        coupon_code: coupon_code,
      };

      if (isHealthPlan) {
        params.health_plan_id = health_plan_values;
      } else {
        params.plan_id = plan_values?.plan_id;
        params.membership_id = plan_values?.membership_id;
      }

      let res = await axios.get(config.GetPlanPrice, { params });

      if (res.status === 200) {
        setPaymentPrice({
          plan_price: res.data.data.plan_price,
          coupon_discount: res.data.data.coupon_discount,
          gst: res.data.data.gst,
        });
      } else if (res.status === 400) {
        notification.error({
          message: res.message,
        });
      }
    } catch (error) {
      notification.error({
        message: error.response.data.message,
      });
      setTimeout(() => {
        setCoupon_code("");
        form.resetFields();
      }, 3000);
    }
  };

  const initPayment = (data) => {
    const options = {
      key: config.razorpay_key,
      amount: data.amount,
      currency: data.currency,
      name: plan_values?.plan_name,
      order_id: data.id,
      prefill: {
        name: user.name,
        contact: user.phone,
        email: user.email,
      },
      handler: async (response) => {
        try {
          const res = await Axios.postAxiosData(config.VerifyPayment, response);
          if (res.success) {
            notification.success({
              message: "Payment verified successfully",
            });
            if (isHealthPlan) {
              navigate("/fill-test-details", { replace: true });
            } else {
              navigate("/user/paymentsuccess", { replace: true });
            }
          }
        } catch (error) {
          console.log("Payment verification error:", error);
          notification.error({
            message: "Payment verification failed",
          });
        }
      },
      theme: {
        color: "#3267FF",
      },
    };
    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  const handlePay = async () => {
    try {
      let params = {
        order_for: isHealthPlan
          ? CONSTANTS.PAYMENT.ORDER_FOR.HEALTH_TEST
          : CONSTANTS.PAYMENT.ORDER_FOR.PLAN,
        coupon_code: coupon_code,
      };

      if (isHealthPlan) {
        params.health_plan_id = health_plan_values;
      } else {
        params.plan_id = plan_values?.plan_id;
        params.membership_id = plan_values?.membership_id;
      }
      const res = await Axios.postAxiosData(config.CreateOrder, { ...params });
      if (res.success) {
        if (res.data.amount) {
          initPayment(res.data);
        } else {
          let profile = await Axios.fetchAxiosData(config.GetProfile);
          const userName = profile.data.name;
          const userEmail = profile.data.email;
          const userMobile = profile.data.country_code + profile.data.phone;
          const plan = profile.data.plan.purchased;
          const firstPlanPurchase = profile.data.first_plan_purchase;
          setName(userName);
          setEmail(userEmail);
          setMobile(userMobile);
          setPlanPurchaseStatus(plan ? 1 : 0);
          setFirstPlanPurchase(firstPlanPurchase ? firstPlanPurchase : false);
          if (firstPlanPurchase === CONSTANTS.FIRST_PURCHASE.TRUE) {
            navigate("/user/dashboard", { replace: true });
          } else {
            navigate("/user/plans", { replace: true });
          }
        }
      }
    } catch (error) {
      console.log("Error creating order:", error);
      notification.error({
        message: "Failed to create order",
      });
    }
  };

  return (
    <div className="container">
      <div
        className="row justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <div
          className="col-12 col-md-8 col-lg-6 rounded-3 border border-1 mx-auto p-3 m-5"
          style={{ minHeight: "70%" }}
        >
          <div className="row border-bottom py-3">
            <div className="col-12">
              <h4 className="text-primary fw-medium">Payment Details</h4>
              <p>
                Complete your purchase now to enjoy our exclusive products and
                services.
              </p>
              <p className="text-primary text-capitalize">
                {plan_values?.selectedCard?.name}
              </p>
            </div>
          </div>

          <div className="row my-2">
            <div className="col-12">
              <Form
                form={form}
                onFinish={CouponSubmit}
                style={{ width: "100%" }}
              >
                <Row>
                  <Col xs={12} md={8}>
                    <Form.Item name="coupon_code">
                      <Input placeholder="Enter Coupon Code" />
                    </Form.Item>
                  </Col>
                  <Col xs={12} md={4}>
                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        style={{ width: "100%", marginLeft: "10px" }}
                      >
                        Apply
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </div>
          </div>

          <div className="row border border-1 rounded-3 pt-3 mx-auto">
            <div className="col-12 mb-2">
              <p className="fw-bold">Sub Total</p>
            </div>
            <div className="col-12 d-flex justify-content-between">
              <div>
                <p className="fw-lighter">Plan Price</p>
              </div>
              <div>
                <p className="fw-light">
                  &#8377;
                  {paymentPrice.plan_price.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
            </div>
            <div className="col-12 d-flex justify-content-between">
              <div>
                <p className="fw-medium">Coupon Discount</p>
              </div>
              <div>
                <p className="fw-light text-success">
                  -&#8377;
                  {paymentPrice.coupon_discount.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
            </div>
            <div className="col-12 d-flex justify-content-between">
              <div>
                <p className="fw-medium">Net Amt.</p>
              </div>
              <div>
                <p className="fw-light">
                  &#8377;
                  {(
                    paymentPrice.plan_price - paymentPrice.coupon_discount
                  ).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
            </div>
            <div className="col-12 d-flex justify-content-between">
              <div>
                <p className="fw-medium">GST(18)%</p>
              </div>
              <div>
                <p className="fw-light">
                  &#8377;
                  {paymentPrice.gst.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
            </div>
            <hr />
            <div className="col-12 d-flex justify-content-between">
              <div>
                <p className="fw-bold">Total</p>
              </div>
              <div>
                <p className="fw-bold">
                  &#8377;
                  {(
                    paymentPrice.plan_price -
                    paymentPrice.coupon_discount +
                    paymentPrice.gst
                  ).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
            </div>
          </div>

          <Button type="primary" className="my-3" onClick={handlePay} block>
            Pay Now <FontAwesomeIcon icon={faArrowRightLong} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserCouponApply;
