import { useState, useRef, useEffect } from "react";
import { Menu, Button, Layout, Drawer } from "antd";
import { MenuOutlined } from "@ant-design/icons";

import OPDlogo from "../Assets/opdsure-Logo.svg";
import { Link, useNavigate } from "react-router-dom";
import CONSTANTS from "../../constant/Constants";
import { HashLink } from "react-router-hash-link";

import phone from "../Assets/phone.png";
import chevronDown from "../Assets/ChevronDown.png";

const { Header } = Layout;

const Navbar = () => {
  const navigate = useNavigate();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [currentModal, setCurrentModal] = useState(null);

  // Refs to handle clicks outside modals
  const servicesModalRef = useRef(null);
  const resourcesModalRef = useRef(null);

  useEffect(() => {
    // Function to handle click outside of modals
    const handleClickOutside = (event) => {
      if (servicesModalRef.current && !servicesModalRef.current.contains(event.target) &&
          resourcesModalRef.current && !resourcesModalRef.current.contains(event.target)) {
        setCurrentModal(null);
      }
    };

    // Attach event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDrawerOpen = () => {
    if(drawerVisible) {
      setDrawerVisible(false);
    }
    else {
    setDrawerVisible(true);
    }
  };

  const handleDrawerClose = () => {
    setDrawerVisible(false);
  };

  const handleModalClose = () => {
    setCurrentModal(null);
    setDrawerVisible(false);
  };

  const handleTabHover = (modalType) => {
    setCurrentModal(modalType);
    setDrawerVisible(false);
  };

  const handleMouseLeave = () => {
    // Optionally close the modal if not hovered over
    // setCurrentModal(null);
  };

  const handleServicesClick = () => {
    // if(currentModal === "services") {
    // setCurrentModal(null);
    // setDrawerVisible(false);
    // }
    // else {
    // setCurrentModal("services");
    // }
    navigate("/services")
  };

  const handleResourcesClick = () => {
    if(currentModal === "resources") {
    setCurrentModal(null);
    setDrawerVisible(false);
    }
    else {
    setCurrentModal("resources");
    }
  };
  
  const JoinUsItems = [
    {
      key: "only-for-doctors",
      label: (
        <Link to="/Join-us" className="text-243572 text-decoration-none fw-500 fs-16px" onClick={() => { setCurrentModal(null); setDrawerVisible(false);}}>
          Only For Doctors
        </Link>
      ),
    },
    {
      key: "careers",
      label: (
        <Link to="/careers" className="text-243572 text-decoration-none fw-500 fs-16px" onClick={() => { setCurrentModal(null); setDrawerVisible(false);}}>
          Careers
        </Link>
      ),
    }
  ];

  const retailPlanItems = [
    {
      key: "retail-plans",
      label: (
        <Link to="/subscription-plans" className="text-243572 text-decoration-none fw-500 fs-16px" onClick={() => {setCurrentModal(null); setDrawerVisible(false);}}>
          Retail Plans
        </Link>
      ),
    },
    {
      key: "corporate-plans",
      label: (
        <Link to="/health-plans" className="text-243572 text-decoration-none fw-500 fs-16px" onClick={() => {setCurrentModal(null); setDrawerVisible(false);}}>
          Health Checkups Plans
        </Link>
      ),
    },
  ];
  const corporatePlanItems = [
    {
      key: "corporate-plans",
      label: (
        <Link to="/employee-health-wellness" className="text-243572 text-decoration-none fw-500 fs-16px" onClick={() => {setCurrentModal(null); setDrawerVisible(false);}}>
          Employee Health And Wellness Program
        </Link>
      ),
    },
    {
      key: "wellness-gifts",
      label: (
        <Link to="/wellness-gifts" className="text-243572 text-decoration-none fw-500 fs-16px" onClick={() => {setCurrentModal(null); setDrawerVisible(false);}}>
          Wellness Gifts
        </Link>
      ),
    },
  ];

  const ServiceItems = [
    {
      key: "in-clinic-consultation",
      label: (
        <Link to="/services#in-clinic-consultation"  className="col-lg-2 col-4 text-center text-decoration-none" onClick={() => {setCurrentModal(null); setDrawerVisible(false)}}>
          In Clinic Consultation         
        </Link>
      ),
    },
    {
      key: "Online-Consultation",
      label: (
        <Link to="/user/register" className="col-lg-2 col-4 text-center text-decoration-none" onClick={() => {setCurrentModal(null); setDrawerVisible(false)}}>
          Online Consultation
      </Link>
      ),
    },
    {
      key: "Online-diagnostics",
      label: (
        <Link to="/services#diagnostics" className="col-lg-2 col-4 text-center text-decoration-none" onClick={() => {setCurrentModal(null); setDrawerVisible(false)}}>
          Diagnostics
      </Link>
      ),
    },
    {
      key: "pharmacy",
      label: (
        <Link to="/services#pharmacy" className="col-lg-2 col-4 text-center text-decoration-none" onClick={() => {setCurrentModal(null); setDrawerVisible(false)}}>
          Pharmacy
      </Link>
      ),
    },
    {
      key: "services-health-card",
      label: (
        <Link to="/services#health-card" className="col-lg-2 col-4 text-center text-decoration-none" onClick={() => {setCurrentModal(null); setDrawerVisible(false)}}>
         Health Card
      </Link>
      ),
    },
    {
      key: "services-health-checkup",
      label: (
        <Link to="/services#health-checkup" className="col-lg-2 col-4 text-center text-decoration-none" onClick={() => {setCurrentModal(null); setDrawerVisible(false)}}>
          Health Checkup
      </Link>
      ),
    },
    {
      key: "Services Ambulance",
      label: (
        <Link to="/services#ambulance" className="col-lg-2 col-4 text-center text-decoration-none" onClick={() => {setCurrentModal(null); setDrawerVisible(false)}}>
         Ambulance
      </Link>
      ),
    },
    {
      key: "Gym Fitness",
      label: (
        <Link to="/services#gym-fitness" className="col-lg-2 col-4 text-center text-decoration-none" onClick={() => {setCurrentModal(null); setDrawerVisible(false)}}>
         Gym Fitness
      </Link>
      ),
    },
    {
      key: "Services Mental Wellness",
      label: (
        <Link to="/services#mental-wellness" className="col-lg-2 col-4 text-center text-decoration-none" onClick={() => {setCurrentModal(null); setDrawerVisible(false)}}>
         Mental Wellness
      </Link>
      ),
    },
    {
      key: "Services Special Education",
      label: (
        <Link to="/services#special-education" className="col-lg-2 col-4 text-center text-decoration-none" onClick={() => {setCurrentModal(null); setDrawerVisible(false)}}>
         Special Education
      </Link>
      ),
    },
    {
      key: "Services Vaccination",
      label: (
        <Link to="/services#vaccination" className="col-lg-2 col-4 text-center text-decoration-none" onClick={() => {setCurrentModal(null); setDrawerVisible(false)}}>
         Vaccination
      </Link>
      ),
    },
    {
      key: "Services Yoga",
      label: (
        <Link to="/services#yoga" className="col-lg-2 col-4 text-center text-decoration-none" onClick={() => {setCurrentModal(null); setDrawerVisible(false)}}>
         Yoga
      </Link>
      ),
    },
  ];

  const ResourceItems = [
    {
      key: "blogs",
      label: (
        <Link to="/blogs" className="text-243572 text-decoration-none fw-500 fs-16px" onClick={() => {setCurrentModal(null); setDrawerVisible(false);}}>
          Blogs
        </Link>
      ),
    },
    {
      key: "media",
      label: (
        <Link to="/media" className="text-243572 text-decoration-none fw-500 fs-16px" onClick={() => {setCurrentModal(null); setDrawerVisible(false);}}>
          Media
        </Link>
      ),
    },
    {
      key: "events",
      label: (
        <Link to="/events" className="text-243572 text-decoration-none fw-500 fs-16px" onClick={() => {setCurrentModal(null); setDrawerVisible(false);}}>
          Events
        </Link>
      ),
    },
  ];

  const menuItems = [
    {
      key: "home",
      label: (
        <Link to="/homepage" className="text-243572 text-decoration-none fw-500 fs-16px" onClick={() => { setCurrentModal(null); setDrawerVisible(false);}}>
          Home
        </Link>
      ),
    },
    {
      key: "about",
      label: (
        <Link to="/about-us" className="text-243572 text-decoration-none fw-500 fs-16px"  onClick={() =>  {setCurrentModal(null); setDrawerVisible(false);}}>
          About Us
        </Link>
      ),
    },
    {
      key: "corporateplans",
      label: (
        <span className="text-243572 text-decoration-none fw-500 fs-16px" onMouseEnter={() => setCurrentModal(null)}  onClick={() =>  setCurrentModal(null)}>
          Corporate Plans <img src={chevronDown} alt="down icon" />
        </span>
      ),
      children: corporatePlanItems,
    },
    {
      key: "retailplans",
      label: (
        <span className="text-243572 text-decoration-none fw-500 fs-16px" onMouseEnter={() => setCurrentModal(null)}  onClick={() =>  {setCurrentModal(null);}}>
          Retail Plans <img src={chevronDown} alt="down icon" />
        </span>
      ),
      children: retailPlanItems,
    },
    {
      key: "services",
      label: (
        <span
          className="text-243572 text-decoration-none fw-500 fs-16px"
          // onMouseEnter={() => handleTabHover('services')}
          // onMouseLeave={handleMouseLeave}
          onClick={handleServicesClick}
        >
          Services <img src={chevronDown} alt="down icon" />
        </span>
      ),
      children: ServiceItems
    },
   
    
    {
      key: "resources",
      label: (
        <span
          className="text-243572 text-decoration-none fw-500 fs-16px"
          // onMouseEnter={() => handleTabHover('resources')}
          // onMouseLeave={handleMouseLeave}
          onClick={handleResourcesClick}
        >
          Resources <img src={chevronDown} alt="down icon" />
        </span>
      ),
      children: ResourceItems,
    },
    {
      key: "JoinUs",
      label: (
        <span className="text-243572 text-decoration-none fw-500 fs-16px"  
        // onClick={() => { setCurrentModal(null); setDrawerVisible(false);}}
        >
          Join Us <img src={chevronDown} alt="down icon" />
        </span>
      ),
      children:JoinUsItems,
    },
    {
      key: "contactus",
      label: (
        <span className="text-243572 text-decoration-none fw-500 fs-16px"  
        // onClick={() => { setCurrentModal(null); setDrawerVisible(false);}}
        >
         <p className="my-auto mx-2 text-243572">
            <img src={phone} alt="phone icon" width={15} /> {CONSTANTS.COMPANY_DETAILS.HELPLINE_NO}
          </p>
        </span>
      )
    },
  ];

  const getModalWidth = () => {
    if (window.innerWidth < 576) return '70vw'; 
    if (window.innerWidth < 768) return '70vw'; 
    if (window.innerWidth < 992) return '70vw'; 
    if (window.innerWidth < 1200) return '100vw'; 
    return '100vw';
  };

  const getModalResourcesWidth = () => {
    if (window.innerWidth < 576) return '70vw'; 
    if (window.innerWidth < 768) return '70vw'; 
    if (window.innerWidth < 992) return '70vw'; 
    if (window.innerWidth < 1200) return '45vw'; 
    return '45vw';
  }

  return (
    <>
      <style>
        {`
           .ant-modal-content {
            padding: 0 !important;
          }
             .ant-layout-header{
             padding: 0 2rem !important;
            }
        `}
      </style>
      <Header
        className="bg-white d-xl-block d-lg-block d-md-none d-none sticky-top flex-wrap"
        style={{ borderBottom: "1px solid #e8e8e8" }}
      >
        <div
          className="container-fluid"
          style={{ display: "flex", alignItems: "center" }}
        >
          <Link to="/"><img
            src={OPDlogo}
            alt="logo"
            style={{ height: "4.2rem", marginRight: "1rem", width: "auto" }}
          /></Link>
          <Menu
            mode="horizontal"
            items={menuItems}
            style={{ flex: 1 }}
          />

          <Button
            className="login-button textblue fw-600 fs-14px"
            style={{ borderColor: "#486ab3" }}
            onClick={() => navigate("/user/login")}
          >
            Login
          </Button>
        </div>
      </Header>
      <Header className="bg-white d-xl-none d-lg-none d-md-block d-block sticky-top">
        <div
          className="d-flex align-items-center justify-content-between"
          style={{ marginLeft: "auto" }}
        >
          <div>
          <Link to="/"><img
              className="img-fluid"
              src={OPDlogo}
              alt="logo"
              style={{ height: "3.6rem", width: "auto", marginRight: "1rem" }}
            /></Link>
          </div>
          <div className="d-flex align-items-center">
            {/* <img src={phone} alt="phone icon" width={12} className="img-fluid" />
            <p className="my-auto mx-2 text-243572 fs-12px">
              {CONSTANTS.COMPANY_DETAILS.HELPLINE_NO}
            </p> */}
            <Button
              type="text"
              onClick={handleDrawerOpen}
              style={{ color: "#486ab3" }}
            >
              <MenuOutlined />
            </Button>
          </div>
        </div>
      </Header>
      <Drawer
        title="Menu"
        placement="right"
        onClose={handleDrawerClose}
        open={drawerVisible}
        closable={true}
      >
        <Menu
          mode="inline"
          items={menuItems}
          style={{ borderRight: 0 }}
        />
        <Button
          className="login-button textblue col-6 mt-3"
          style={{ borderColor: "#486ab3" }}
          onClick={() => navigate("/user/login")}
        >
          Login
        </Button>
      </Drawer>
      {/* <Modal
        open={currentModal === 'services'}
        onCancel={handleModalClose}
        footer={null}
        closable={false}
        width={getModalWidth()}
        style={{ top: 70, borderRadius: 0 }}
        ref={servicesModalRef}
      >
        <div className="container-fluid bg-gradient-lightR">
         
          <div className="row d-flex align-items-center justify-content-center pt-5 pb-lg-3 pb-1">
            <HashLink to="/services#in-clinic-consultation"  className="col-lg-2 col-4 text-center text-decoration-none">
              <img src={servicesSquare1} alt="services" className="img-fluid img-box-shadow rounded-3" onClick={{handleModalClose}}/>          
            </HashLink>
            <HashLink to="/user/register" className="col-lg-2 col-4 text-center text-decoration-none">
              <img src={servicesSquare14} alt="services" className="img-fluid img-box-shadow rounded-3" onClick={handleModalClose}/>             
            </HashLink>
            <HashLink to="/services#diagnostics" className="col-lg-2 col-4 text-center text-decoration-none">
              <img src={servicesSquare13} alt="services" className="img-fluid img-box-shadow rounded-3" onClick={handleModalClose}/>             
            </HashLink>
            <HashLink to="/services#pharmacy" className="col-lg-2 col-4 text-center text-decoration-none">
              <img src={servicesSquare7} alt="services" className="img-fluid img-box-shadow rounded-3" onClick={handleModalClose}/>
             </HashLink>
         
            <HashLink to="/services#health-card" className="col-lg-2 col-4 my-2 text-center text-decoration-none">
              <img src={servicesSquare9} alt="services" className="img-fluid img-box-shadow rounded-3" onClick={handleModalClose}/>
            </HashLink>
            <HashLink to="/services#health-checkup" className="col-lg-2 col-4 my-2 text-center text-decoration-none">
              <img src={servicesSquare10} alt="services" className="img-fluid img-box-shadow rounded-3" onClick={handleModalClose}/>            
            </HashLink>
          </div>

          <div className="row d-flex align-items-center justify-content-center pt-lg-3 pt-md-3 pt-1 pb-5">
          

            <HashLink to="/services#ambulance" className="col-lg-2 col-4 my-2 text-center text-decoration-none">
              <img src={servicesSquare4} alt="services" className="img-fluid img-box-shadow rounded-3" onClick={handleModalClose}/>            
            </HashLink>

            <HashLink to="/services#gym-fitness" className="col-lg-2 col-4 my-2 text-center text-decoration-none">
              <img src={servicesSquare15} alt="services" className="img-fluid img-box-shadow rounded-3" onClick={handleModalClose}/>            
            </HashLink>

            <HashLink to="/services#mental-wellness" className="col-lg-2 col-4 my-2 text-center text-decoration-none">
              <img src={servicesSquare3} alt="services" className="img-fluid img-box-shadow rounded-3" onClick={handleModalClose}/>            
            </HashLink>

            <HashLink to="/services#special-education" className="col-lg-2 col-4 my-2 text-center text-decoration-none">
              <img src={servicesSquare5} alt="services" className="img-fluid img-box-shadow rounded-3" onClick={handleModalClose}/>            
            </HashLink>

            <HashLink to="/services#vaccination" className="col-lg-2 col-4 my-2 text-center text-decoration-none">
              <img src={servicesSquare8} alt="services" className="img-fluid img-box-shadow rounded-3" onClick={handleModalClose}/>
            </HashLink>
            
            <HashLink to="/services#yoga"  className="col-lg-2 col-4 my-2 text-center text-decoration-none">
              <img src={servicesSquare6} alt="services" className="img-fluid img-box-shadow rounded-3" onClick={handleModalClose}/>
            </HashLink>
          </div>
        </div>
      </Modal>
      <Modal
        open={currentModal === 'resources'}
        onCancel={handleModalClose}
        footer={null}
        closable={false}
        width={getModalResourcesWidth()}
        style={{ top: 70 }}
        className="rounded-3"
        ref={resourcesModalRef}
      >
        <div className="container-fluid bg-gradient-lightR">
          <div className="row d-flex align-items-center justify-content-center py-5 mx-auto">
          
            <Link to="/blogs" className="col-lg-3 col-md-3 col-5 my-2 text-center mx-2 text-decoration-none">
              <img src={servicesSquare16} alt="services" className="img-fluid img-box-shadow rounded-3" onClick={handleModalClose}/>
              </Link>
                     
            <Link to="/media" className="text-decoration-none col-lg-3 col-md-3 col-5 my-2 text-center mx-2">
              <img src={servicesSquare17} alt="services" className="img-fluid img-box-shadow rounded-3" onClick={handleModalClose}/>
              </Link>
            
            <Link to="/events" className="col-lg-3 col-md-3 col-5 my-2 text-center mx-2 text-decoration-none">
              <img src={servicesSquare18} alt="services" className="img-fluid img-box-shadow rounded-3" onClick={handleModalClose} />
              </Link>
           
          </div>
        </div>
      </Modal> */}
    </>
  );
};

export default Navbar;
