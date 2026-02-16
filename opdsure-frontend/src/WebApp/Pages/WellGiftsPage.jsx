import React,{useState,useEffect,useRef} from 'react'
import {Axios} from '../../axios/axiosFunctions'
import config from '../../config/config'
import GetStartedTodayForm from '../CommonComponents/GetStartedTodayForm';
import wellgiftsBanner from '../Assets/wellgiftsBanner.png';
// import backgroundImg from "../Assets/bgWellnessGifts.svg";
import backgroundImg from "../Assets/Vector 3.png";
import linesWellnessGifts from "../Assets/linesWellnessGifts.svg";
import tickicon from "../Assets/check.svg";
const WellGiftsPage = () => {
  const formRef = useRef(null);
  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top on component mount
  }, []);

  const wellnessCardDetails =[
    {
       title:"OPDSure’s Wellness Health Card",
       plans:[
        {
          plans_title:"Individual OPD Card",
          plans_benefits:[
            "INR 3,000 benefits",
            "1 member",
          ],          
          plans_price:"INR 1,999"
        },
        {
          plans_title:"Family OPD Card",
          plans_benefits:[
            "INR 5,000 benefits",
            "4 member",
          ],          
          plans_price:"INR 2,999"
        },
        {
          plans_title:"Parents OPD Card",
          plans_benefits:[
            "INR 5,000 benefits",
            "2 member",
          ],          
          plans_price:"INR 2,999"
        },
        
       ],
    },
    {
      title:"OPDSure Subscription Plans",
      plans:[
       {
         plans_title:"Festival",
         plans_benefits:[
           "3 months",
           "2,250 benefits",
         ],          
         plans_price:"INR 500"
       },
       {
         plans_title:"Festival-Pro",
         plans_benefits:[
           "3 months",
           "INR 4,500 benefits",
           
         ],          
         plans_price:"INR 1,000"
       },
       {
         plans_title:"Festival-Pro+",
         plans_benefits:[
           "3 months",
           "INR 8,250 benefits",
         ],          
         plans_price:"INR 2,500"
       },
       
      ],
   },
   {
    title:"Mental Wellness Online OPD",
    plans:[
     {
       plans_title:"Unlimited Consultations",
       plans_benefits:[
         "90-day validity",
       ],          
       plans_price:"INR 999"
     },
     {
       plans_title:"Access to Psychiatrists & Psychotherapists",
       plans_benefits:[
         "Helps with depression, anxiety, trauma, and more",
       ],          
       plans_price:""
     },
     {
       plans_title:"Normalize Mental Health Support",
       plans_benefits:[
         "Provides coping tools and a gentle reminder",
       ],          
       plans_price:""
     },
     
    ],
 },
 {
  title:"Unlimited Online Doctor Consultations",
  plans:[
   {
     plans_title:"Gift Price",
     plans_benefits:[
       "12-month validity",
     ],          
     plans_price:"INR 1,999"
   },
   {
     plans_title:"Unlimited Consultations",
     plans_benefits:[
       "Access to 30+ specialist doctors 24/7",
     ],          
     plans_price:""
   },
   {
     plans_title:"Family Plan",
     plans_benefits:[
       "4 Members",
     ],          
     plans_price:""
   },
   
  ],
},
{
  title:"Online Yoga Learning",
  plans:[
   {
     plans_title:"Basic Yoga",
     plans_benefits:[
       "12 sessions",
     ],          
     plans_price:"INR 3,000"
   },
   {
     plans_title:"Advanced Yoga",
     plans_benefits:[
       "12 sessions",
     ],          
     plans_price:"INR 4,000"
   },
   {
     plans_title:"Therapeutic Yoga",
     plans_benefits:[
       "12 sessions",
     ],          
     plans_price:"INR 4,500"
   },
   
  ],
},
{
  title:"Meditation & Pranayama",
  plans:[
   {
     plans_title:"Meditation",
     plans_benefits:[
       "20 sessions",
     ],          
     plans_price:"INR 5,000"
   },
   {
     plans_title:"Pranayama",
     plans_benefits:[
       "10 sessions",
     ],          
     plans_price:"INR 3,500"
   },
  
  ],
},
  ]

  const getcardwidth = () => {
    if(window.innerWidth <= 768) {
      return "18rem";
    }
    else {
      return "22rem";
    }
  }

  return (
  <>
  <div className="container-fluid p-0">
        <div className="row m-0">
            <div className="col-12 p-0">
              <img src={wellgiftsBanner} alt="banner" className='img-fluid w-100 '/>
            </div>
        </div>
        <div className="row py-3 p-0 m-0">
          <div className="col-12 px-0">
          <p className='text-center fs-32px fw-700 '>Choose the Optimal Employee Wellness Gifts</p>
          </div>
        </div>
        {wellnessCardDetails?.map ((item, index) => {
          return (
            <div className="row d-flex justify-content-center align-items-center py-3 m-0" key={index}>
              
              <div className="col-10 shadow-lg px-0 position-relative">
                <img src={linesWellnessGifts} alt="lines for decoration" className='img-fluid w-25 h-100 position-absolute bottom-0 end-0 d-lg-block d-md-block d-none' />
              <img src={backgroundImg} alt="background img" className='img-fluid w-75 position-absolute bottom-0 start-0 d-lg-block d-md-block d-none' style={{height:"90%"}} />
                <p className='text-center fw-600 fs-24px py-4'>{item.title}</p>
                <div className="row d-flex justify-content-center ">
                  {item?.plans?.map ((plan, indexx) => {
                    return (
                      <div key={indexx} className="col-3 card mx-3 rounded-4 bg-f5f5f5 border-0 p-4 mb-4" style={{width:getcardwidth()}}
                      onClick={() => {
                        // Scroll to the GetStartedTodayForm
                        if (formRef.current) {
                          const offset = formRef.current.getBoundingClientRect().top + window.scrollY - 80; // Adjust for 5rem
                          window.scrollTo({ top: offset, behavior: 'smooth' });
                        }
                      }}
                      >
                        <div className="row">
                          <div className="col-12">
                            <p className='text-center text-4d4d4d fw-600 fs-20px mb-0'>{plan?.plans_title}</p>
                            <p className='text-center text-4d4d4d fw-500 fs-18px'>{plan?.plans_price}</p>
                            <hr />
                          </div>
                          <div className="col-12">
                            <ul className='list-unstyled'>
                              {plan?.plans_benefits?.map ((benefit, indexxxx) => {
                                return (
                                  <li className='fw-400 fs-14px text-justify' key={indexxxx}><img
                                  src={tickicon}
                                  alt="points icon"
                                  className="me-2"
                                />{benefit}</li>
                                )
                              })}
                            </ul>
                          </div>
                          <div className="col-12">
                           
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )
        })}
    <div ref={formRef}>
      <GetStartedTodayForm />
    </div>
  </div>
  </>
  )
}

export default WellGiftsPage
