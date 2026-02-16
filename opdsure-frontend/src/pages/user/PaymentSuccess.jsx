import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import { LoadingOutlined } from '@ant-design/icons';
import { useGeneralUser } from '../../context/generalUserProvider';
import axios from 'axios';
import { config } from '@fortawesome/fontawesome-svg-core';
import CONFIG from "../../config/config";
const PaymentSuccess = () => {
  const [counter, setCounter] = useState(5);
  const { setName, setEmail, setMobile, setPlanPurchaseStatus,setFirstPlanPurchase} = useGeneralUser();
  const navigate = useNavigate();
  useEffect(()=>{
    const fetch = async () => {
      try {
        const response = await axios.get(`${CONFIG.ApiBaseUrl}${CONFIG.GetProfile}`);
        const userName = response.data.data.name;        
        const userEmail = response.data.data.email;        
        const userMobile = response.data.data.country_code + response.data.data.phone;        
        const plan = response.data.data.plan.purchased; 
        const firstPlanPurchase = response.data.data.first_plan_purchase;
        setName(userName);
        setEmail(userEmail);
        setMobile(userMobile);
        setPlanPurchaseStatus(plan?1:0); 
        setFirstPlanPurchase(firstPlanPurchase?firstPlanPurchase:false);
      } catch (error) {
        localStorage.clear();
        sessionStorage.clear();
        navigate("/user/login", { replace:true })
      }    
    };
    fetch();
    
  },[])
  useEffect(() => {
    const timer =
    counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
    return () => clearInterval(timer);
  }, [counter]);

  return (
    <div className="container-fluid bg-light-blue">
      <div className="row justify-content-center d-flex align-items-center mx-auto" style={{height:'100vh'}}>
      
        <div className="col-lg-6 col-md-12 col-12 text-center">
          <FontAwesomeIcon icon={faCircleCheck} size='2xl'  style={{color: "#63E6BE",}} className=' display-1 text-center mb-3' />
          <h3 className='text-center text-capitalize mx-auto textblue display-lg-3 display-md-4 display-6 fw-bolder mb-3'>Payment Successful !</h3>
          <p className='text-center text-capitalize text-secondary mx-auto text-wrap'>Thank you for your payment.</p>
          {counter > 0 ? (
              <div className="d-flex justify-content-center align-items-center">
              <p className="text-center text-decoration-underline">
               <LoadingOutlined className="me-3" />Redirecting to Dashboard in {counter}s
              </p>
              </div>
            ) : (
             navigate("/user/dashboard", { replace:true })
            )}
        </div>
      </div>
    </div>
  )
}
export default PaymentSuccess