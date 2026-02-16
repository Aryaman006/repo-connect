import React,{useState,useEffect} from 'react'
import {Link} from 'react-router-dom'
import {Button} from 'antd'
import {Axios} from '../../axios/axiosFunctions'
import config from '../../config/config'
import GetStartedTodayForm from '../CommonComponents/GetStartedTodayForm';
import corpBanner from '../Assets/corpwellnessBanner.svg'
import img1 from '../Assets/empWellbeingCorp.svg';
import img2 from '../Assets/doctorAcessCorp.svg';
import img3 from '../Assets/wellnessWheelCorp.svg';
import img4 from '../Assets/onsitecorp.svg';
import img5 from '../Assets/opdsureadvanCorp.svg';
import img6 from '../Assets/provenBenefits.png';

const EmployeeWellnessCorporate = () => {
  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top on component mount
  }, []);

  return (
    <>
      <div className="container-fluid p-0">

        <div className="row m-0">
            <div className="col-12 p-0">
              <img src={corpBanner} alt="banner" className='img-fluid w-100 '/>
            </div>
        </div>
        <div className="row py-4 m-0">
          {/* <div className="col-12 d-flex justify-content-center" style={{margin:"2rem 0"}}>
        
        <Link to="/subscription-plans-corporate" className="text-decoration-none"> <Button size="large" className=" px-4 bg-243673 text-white fw-600 me-5">
           Learn More
         </Button>
         </Link>
         <a
                  href="#getstartedtodayform" className="text-decoration-none"> <Button  size="large" className=" px-4 text-243572 fw-600">
           Get Started
         </Button>
         </a>
       
          </div> */}
          <div className="col-12 p-0">
          <p className='text-center fs-32px fw-700 '>Employee Health And Wellness Program</p>
          <p className='text-center fw-400'>Empowering your workforce, enhancing productivity.</p>
          </div>
        
        </div>

        <div className="row d-flex justify-content-start m-0">
          <div className="col-11">
            <img src={img1} alt="prioritize well being"  className='img-fluid w-100'/>
          </div>
          
        </div>

        <div className="row d-flex justify-content-end m-0">
          <div className="col-11 p-0">
            <img src={img2} alt="corp services"  className='img-fluid w-100'/>
          </div>
        </div>

        <div className="row m-0">
          <div className="col-11 p-0">
            <img src={img3} alt="corp services"  className='img-fluid w-100'/>
          </div>
        </div>

        <div className="row d-flex justify-content-end m-0">
          <div className="col-11 p-0">
            <img src={img4} alt="corp services"  className='img-fluid w-100'/>
          </div>
        </div>

        <div className="row m-0">
          <div className="col-11 p-0">
            <img src={img5} alt="corp services"  className='img-fluid w-100'/>
          </div>
        </div>

        <div className="row d-flex justify-content-end m-0">
          <div className="col-11 p-0">
            <img src={img6} alt="corp services"  className='img-fluid w-100'/>
          </div>
        </div>

        <div id="getstartedtodayform" >
        <GetStartedTodayForm />
        </div>
        
       
      </div>
    </>
  );
};

export default EmployeeWellnessCorporate;
