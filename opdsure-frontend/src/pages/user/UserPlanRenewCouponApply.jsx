import React, { useState, useEffect } from "react";
import { Button, Input, Space, notification, Form, Col, Row } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightLong } from "@fortawesome/free-solid-svg-icons";
import { useLocation } from "react-router-dom";
import config, { CONFIG_OBJ } from "../../config/config";
import { Axios } from "../../axios/axiosFunctions";
import { useNavigate } from "react-router-dom";
import CONSTANTS from "../../constant/Constants";
import axios from "axios";

const UserPlanRenewCouponApply = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const { plan_values, health_plan_values } = location.state || {};
  const [coupon_code, setCoupon_code] = useState("")
  const [paymentPrice, setPaymentPrice] = useState({
    plan_price: 0,
    coupon_discount: 0,
    gst: 0,
  });

  const isHealthPlan = !!health_plan_values;

  useEffect(() => {
    GetPlanPrice();
  }, [plan_values, coupon_code, isHealthPlan]);

  const CouponSubmit = async (values) => {
    setCoupon_code(values.coupon_code)
  };

  
  const GetPlanPrice = async () => {
    try {
      let params = {
        order_for: CONSTANTS.PAYMENT.ORDER_FOR.PLAN_RENEW,
        coupon_code: coupon_code
      };
     
      if (isHealthPlan) {
        params.health_plan_id = health_plan_values;
      } else {
        params.plan_id = plan_values?.plan_id;
        params.membership_id = plan_values?.membership_id;
      }
     
      let res = await axios.get(config.GetPlanRenewPrice, {params});

      if (res.status===200) {
        setPaymentPrice({
          plan_price: res.data.data.plan_price,
          coupon_discount: res.data.data.coupon_discount,
          gst: res.data.data.gst,
        });
      }
      else if(res.status===400){
        notification.error({
          message: res.message
        })
      }
    } catch (error) {
      notification.error({
        message: error.response.data.message,
      });
      setTimeout(()=>{setCoupon_code("");form.resetFields();},3000);
      
    }
  };

  const initPayment = (data) => {
    const options = {
      key: config.razorpay_key,
      amount: data.amount,
      currency: data.currency,
      name: plan_values?.plan_name,
      order_id: data.id,
      handler: async (response) => {
        try {
          const res = await Axios.postAxiosData(config.VerifyPlanRenewPayment, response);
          if (res.success) {
            notification.success({
              message: "Payment successful",
            })
            if(isHealthPlan){
            navigate("/user/dashboard");
            }
            else{
              navigate("/user/paymentsuccess");
            }
          }

        } catch (error) {
          notification.error({
            message: "Payment failed",
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
        order_for: CONSTANTS.PAYMENT.ORDER_FOR.PLAN_RENEW,
        coupon_code: coupon_code
      };
     
      if (isHealthPlan) {
        params.health_plan_id = health_plan_values;
      } else {
        params.plan_id = plan_values?.plan_id;
        params.membership_id = plan_values?.membership_id;
      }
     
      const res = await Axios.postAxiosData(config.CreatePlanRenewOrder, {...params});
      if (res.success) {
        if (res.data.amount) {
          initPayment(res.data);
        } else {
          navigate("/user/dashboard");
        }
      }
    } catch (error) {
     
      notification.error({
        message: "Failed to create order",
      });
    }
  };
  return (
    <div className="container">
      <div className="row d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <div className="col-6 rounded-3 border border-1 mx-auto p-3 m-5" style={{ minHeight: "70%" }}>
          <div className="row border-bottom py-3">
            <div className="col-12">
              <h4 className="text-primary fw-medium">Payment Details upgrade</h4>
              <p>Complete your purchase now to enjoy our exclusive products and services.</p>
              <p className="text-primary text-capitalize">{plan_values?.selectedCard?.name}</p>
            </div>
          </div>

          <div className="row my-2">
            <div className="col-12">
              <Form
              form={form}
                onFinish={CouponSubmit}
                style={{
                  width: "100%",
                  marginTop: "auto"
                }}
                >
                <Row>
                  <Col span={20}>
                  <Form.Item
                    name="coupon_code"
                  >
                    <Input
                      placeholder="Enter Coupon Code"
                    />
                  </Form.Item>
                  </Col>
                  <Col span={4}>
                  <Form.Item>
                    <Button type="primary" htmlType="submit" style={{width: "100%"}}>Apply</Button>
                  </Form.Item>
                  </Col>
              </Row>
              </Form>
            </div>
          </div>
          <div className="row border border-1 rounded-3 pt-3 mx-auto" style={{ lineHeight: "0.3", width: "100%" }}>
            <div className="col-12 mb-2">
              <p className="fw-bold">Sub Total</p>
            </div>
            <div className="col-12 d-flex">
              <div className="col-6">
                <p className="fw-lighter">Plan Price</p>
              </div>
              <div className="col-6 text-end ">
                <p className="fw-light">&#8377;{(paymentPrice.plan_price)?.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
            </div>
            <div className="col-12 d-flex">
              <div className="col-6">
                <p className="fw-medium">Coupon Discount</p>
              </div>
              <div className="col-6 text-end text-success">
                <p className="fw-light">-&#8377;{(paymentPrice.coupon_discount)?.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
            </div>
            <div className="col-12 d-flex">
              <div className="col-6">
                <p className="fw-medium">Net Amt.</p>
              </div>
              <div className="col-6 text-end">
                <p className="fw-light">&#8377;{(paymentPrice.plan_price - paymentPrice.coupon_discount)?.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
            </div>
            <div className="col-12 d-flex">
              <div className="col-6">
                <p className="fw-medium">GST(18)%</p>
              </div>
              <div className="col-6 text-end">
                <p className="fw-light">&#8377;{(paymentPrice.gst)?.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
            </div>
            <hr />
            <div className="col-12 d-flex">
              <div className="col-6">
                <p className="fw-bold">Total</p>
              </div>
              <div className="col-6 text-end">
                <p className="fw-bold">
                  &#8377;{(paymentPrice.plan_price - paymentPrice.coupon_discount + paymentPrice.gst)?.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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

export default UserPlanRenewCouponApply;