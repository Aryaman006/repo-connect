import React, { useState, useEffect } from "react";
import {Axios} from "../axios/axiosFunctions";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  AppstoreOutlined,
  SettingOutlined,
  TagsOutlined,
  TeamOutlined,
  FileTextOutlined,
  FileSearchOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
  LogoutOutlined,
  DashboardOutlined,
  ContactsOutlined,
  GiftOutlined,
  GooglePlusOutlined,
  LinkedinOutlined,
} from "@ant-design/icons";
import { createSearchParams, useNavigate, NavLink } from "react-router-dom";
import { faStethoscope,faFlaskVial,faMedal,faFileContract,faIndustry,faUserTie, faQ } from "@fortawesome/free-solid-svg-icons";
import { faUser, faFile, faFileLines } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Layout, Menu, notification, theme } from "antd";
import config, { CONFIG_OBJ } from "../config/config";
import opdlogo from "../assets/OPD-Logo.svg";
import { useAuth } from "../context/authProvider";
import CONSTANTS from "../constant/Constants";
import { useManagementUser } from "../context/managementUserProvider";
import { useAdminUser } from "../context/adminUserProvider";
import ProfileCard from "./ProfileCard";
import WalletCard from "./Wallet"
import NotificationCard from "./Notification";
const { Header, Sider, Content } = Layout;

const Navbar = ({ children }) => {
  const { userType } = useAuth();
  const {manUserMobile,manUserEmail,manUserName,manUserDesignation} = useManagementUser();
  const {adminUserName,adminUserEmail,adminUserMobile} = useAdminUser();
  const [collapsed, setCollapsed] = useState(false);
  const [items, setItems] = useState([]);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const internalDesignation = Number(localStorage.getItem("designation"));

  useEffect(() => {
    if (userType == 3) {
      setItems(userItems);
    } else if (userType == CONSTANTS.MAN_USER_TYPES.GENERAL) {
      setItems(managementItems);
    } else if (userType == CONSTANTS.MAN_USER_TYPES.ADMIN) {
      setItems(adminItems);
    }  else if (userType == 4) {
      setItems(hrItems);
    } else {
      setItems([]);
    }
  }, [userType]); 

  const userItems = [
    {
      key: "1", 
      icon: <DashboardOutlined />,
      label:  (
        <NavLink to="/user/dashboard" className="navlink-no-underline">
        Dashboard
        </NavLink>

      ),
    },
    {
      icon: <FontAwesomeIcon icon={faUser} />,
      label:"Profile",
      children: [
        {
          key: "4",
          icon: <FontAwesomeIcon icon={faUser} />,
          label: (
            <NavLink to="/user/profile" className="navlink-no-underline">        
            View Profile
            </NavLink>
            ),
        },
        {
          key: "6",
          icon:<FontAwesomeIcon icon={faFileLines} />,
          label: (
            <NavLink to="/user/myplan" className="navlink-no-underline">        
            My Plan
            </NavLink>
            ),
        },
        {
          key: "800",
          icon:<FontAwesomeIcon icon={faFileLines} />,
          label: (
            <NavLink to="/user/refer" className="navlink-no-underline">        
            Referral
            </NavLink>
            ),
        },
      ],
    },
   
    {
      key: "2",
      icon: <FontAwesomeIcon icon={faFile} />,
      label: (
        <NavLink to="/user/claims" className="navlink-no-underline">
        Apply for Claim
        </NavLink>
      ),
    },
    {
      key: "30",
      icon: <FontAwesomeIcon icon={faStethoscope} />,
      label: (
        <NavLink to="/user/health-plans" className="navlink-no-underline">  
        Health Check Plans
        </NavLink>
      ),
    },
    {
      key: "3",
      icon: <FontAwesomeIcon icon={faStethoscope} />,
      label: (
        <NavLink to="/user/health-checkups" className="navlink-no-underline">  
        Free Health Tests
        </NavLink>
      ),
    },
  
    {
      key: "5",
      icon: <LogoutOutlined />,
      label: (      
        <NavLink to="/logout/?userType=subscriber" replace={true} className="navlink-no-underline">
          Logout
        </NavLink>
      ),
    },
  ]

  const managementItems = [
    {
      key: "9", 
      icon: <DashboardOutlined />,
      label:  (
        <NavLink to="/management/dashboard" className="navlink-no-underline">
        Dashboard
        </NavLink>

      ),
    },
    {
      key: "6",
      icon: <FontAwesomeIcon icon={faFile} />,
      label: (
        <NavLink to="/management/claims" className="navlink-no-underline">
        Overall Claims
        </NavLink>
        ),
    },
    ...(internalDesignation === CONSTANTS.DESIGNATIONS[2].internal_id ? [
      {
        key: "11",
        icon: <FontAwesomeIcon icon={faFile} />,
        label: (
          <NavLink to="/management/claims-transfer" className="navlink-no-underline">
            Transfer Claims
          </NavLink>
        ),
      }
    ] : []), 
    
    {
      key: "60",
      icon: <FontAwesomeIcon icon={faFile} />,
      label: (
        <NavLink to="/management/claims/disputed" className="navlink-no-underline">
        Disputed Claims
        </NavLink>
        ),
    },
    {
      key:"8",
      icon: <AppstoreOutlined />,
      label: (
        <NavLink to="/management/health-checkups" replace={true} className="navlink-no-underline">
          Free Health Checkup Details
        </NavLink>
      ),
    },
    {
      key: "subscriberList",
      icon: <TeamOutlined />,
      label: (
        <NavLink to="/management/registered-users-empl" replace={true} className="navlink-no-underline">
          Subscriber List
        </NavLink>
      ),
    },
    {
      key: "contact",
      label: "Contact Us",
      icon: <ContactsOutlined />,
      children: [
        {
          key: "CuRetail",
          icon: <FontAwesomeIcon icon={faUserTie} />,
          label: (
            <NavLink
              to="/management/contact-us-retail-empl"
              className="navlink-no-underline"
            >
              Retail
            </NavLink>
          ),
        },
        {
          key: "CuCorpo",
          icon: <TeamOutlined />,
          label: (
            <NavLink to="/management/contact-us-corporate-empl" className="navlink-no-underline">
              Corporate
            </NavLink>
          ),
        },
        {
          key: "CuEmail",
          icon: <FontAwesomeIcon icon={faIndustry} />,
          label: (
            <NavLink
              to="/management/contact-us-email-empl"
              className="navlink-no-underline"
            >
              Email
            </NavLink>
          ),
        },
            
      ],
    },
    {
      key: "7",
      icon: <LogoutOutlined />,
      label: (
        <NavLink to="/logout/?userType=managmentUser" replace={true} className="navlink-no-underline">
          Logout
        </NavLink>
      ),
    },
    
  ]

  const hrItems = [
    {
      key: "41", 
      icon: <DashboardOutlined />,
      label:  (
        <NavLink to="/hr/master/employees" className="navlink-no-underline">
        Employees
        </NavLink>

      ),
    },
    {
      key: "Plan",
      icon:<FontAwesomeIcon icon={faFileLines} />,
      label: (
        <NavLink to="/hr/corporatePlan" replace={true} className="navlink-no-underline">
          Plan
        </NavLink>
      ),
    },
    // {
    //   key: "contact",
    //   label: "Contact Us",
    //   icon: <ContactsOutlined />,
    //   children: [
    //     {
    //       key: "CuRetail",
    //       icon: <FontAwesomeIcon icon={faUserTie} />,
    //       label: (
    //         <NavLink
    //           to="/management/contact-us-retail-empl"
    //           className="navlink-no-underline"
    //         >
    //           Retail
    //         </NavLink>
    //       ),
    //     },
    //     {
    //       key: "CuCorpo",
    //       icon: <TeamOutlined />,
    //       label: (
    //         <NavLink to="/management/contact-us-corporate-empl" className="navlink-no-underline">
    //           Corporate
    //         </NavLink>
    //       ),
    //     },
    //     {
    //       key: "CuEmail",
    //       icon: <FontAwesomeIcon icon={faIndustry} />,
    //       label: (
    //         <NavLink
    //           to="/management/contact-us-email-empl"
    //           className="navlink-no-underline"
    //         >
    //           Email
    //         </NavLink>
    //       ),
    //     },
            
    //   ],
    // },
    {
      key: "7",
      icon: <LogoutOutlined />,
      label: (
        <NavLink to="/logout/?userType=hrUser" replace={true} className="navlink-no-underline">
          Logout
        </NavLink>
      ),
    },
    
  ]

  const adminItems = [
    {
      key: "masters",
      label: "Masters",
      icon: <AppstoreOutlined />,
      children: [
        {
          key: "15",
          icon: <FontAwesomeIcon icon={faUserTie} />,
          label: (
            <NavLink
              to="/admin/master/designation"
              className="navlink-no-underline"
            >
              Designation
            </NavLink>
          ),
        },
        {
          key: "16",
          icon: <TeamOutlined />,
          label: (
            <NavLink to="/admin/master/users" className="navlink-no-underline">
              User Master
            </NavLink>
          ),
        },
        {
          key: "17",
          icon: <FontAwesomeIcon icon={faIndustry} />,
          label: (
            <NavLink
              to="/admin/master/corporate"
              className="navlink-no-underline"
            >
              Corporate
            </NavLink>
          ),
        },
        {
          key: "177",
          icon: <FontAwesomeIcon icon={faIndustry} />,
          label: (
            <NavLink
              to="/admin/master/corporateHR"
              className="navlink-no-underline"
            >
              Corporate HR
            </NavLink>
          ),
        },
           
        {
          key: "18",
          icon: <TeamOutlined />,
          label: (
            <NavLink to="/admin/master/corpoEmp" className="navlink-no-underline">
              Corporate Subscriber
            </NavLink>
          ),
        },
        {
          key: "19",
          icon: <FileTextOutlined />,
          label: (
            <NavLink to="/admin/master/plan" className="navlink-no-underline">
              Plans
            </NavLink>
          ),
        },
        {
          key: "600",
          icon: <FileTextOutlined />,
          label: (
            <NavLink to="/admin/master/healthCheckupPlans" className="navlink-no-underline">
              Health Checkup Plans
            </NavLink>
          ),
        },
        {
          key: "20",
          icon:<FontAwesomeIcon icon={faFlaskVial} />,
          label: (
            <NavLink to="/admin/master/test" className="navlink-no-underline">
              Health Tests
            </NavLink>
          ),
        },
        {
          key: "doctor",
          icon: <FontAwesomeIcon icon={faStethoscope} />,
          label: (
            <NavLink to="/admin/master/doctormain" className="navlink-no-underline">
              Doctors
            </NavLink>
          ),
        },
        {
          key: "specialization",
          icon: <FontAwesomeIcon icon={faStethoscope} />,
          label: (
            <NavLink to="/admin/master/specialization" className="navlink-no-underline">
              specialization
            </NavLink>
          ),
        },
        {
          key: "21",
          icon: <TagsOutlined />,
          label: (
            <NavLink to="/admin/master/coupon" className="navlink-no-underline">
              Coupons
            </NavLink>
          ),
        },
        {
          key: "22",
          icon: <FontAwesomeIcon icon={faFileContract} />,
          label: (
            <NavLink
              to="/admin/master/conditions"
              className="navlink-no-underline"
            >
             Terms & Conditions
            </NavLink>
          ),
        },
        {
          key: "23",
          icon: <SettingOutlined />,
          label: (
            <NavLink to="/admin/master/settings" className="navlink-no-underline">
              System Settings
            </NavLink>
          ),
        },     
        {
          key: "24",
          icon: <SettingOutlined />,
          label: (
            <NavLink to="/admin/master/email-settings" className="navlink-no-underline">
              Email Settings
            </NavLink>
          ),
        },     
        {
          key: "25",
          icon: <FontAwesomeIcon icon={faMedal} />,
          label: (
            <NavLink to="/admin/master/privilege" className="navlink-no-underline">
              Privileges
            </NavLink>
          ),
        },
        
        {
          key: "26",
          icon: <FontAwesomeIcon icon={faQ} />,
          label: (
            <NavLink to="/admin/master/faqs" className="navlink-no-underline">
              FAQ
            </NavLink>
          ),
        },     
       
      ],
    },
    {
      key: "logs",
      label: "Logs",
      icon: <AppstoreOutlined />,
      children: [
        {
          key: "26",
          icon: <FileSearchOutlined />,
          label: (
            <NavLink to="/admin/audit/logs" className="navlink-no-underline">
              History Report
            </NavLink>
          ),
        },     
      ],
    },
    {
      key: "Claims",
      label: "Claims",
      icon: <AppstoreOutlined />,
      children: [
        {
          key: "30",
          icon: <FileTextOutlined />,
          label: (
            <NavLink to="/admin/claims" className="navlink-no-underline">
              Overall Claims
            </NavLink>
          ),
        },     
      ],
    },
    {
      key: "referedUsers",
      icon: <TeamOutlined />,
      label: (
        <NavLink to="/admin/refered-users" replace={true} className="navlink-no-underline">
          Referral List
        </NavLink>
      ),
    },
    {
      key: "approved",
      icon: <TeamOutlined />,
      label: (
        <NavLink to="/admin/approve-updated-users" replace={true} className="navlink-no-underline">
          Approve Members
        </NavLink>
      ),
    },
    // {
    //   key: "DoctorsFromClaims",
    //   icon: <FontAwesomeIcon icon={faStethoscope} />,
    //   label: (
    //     <NavLink to="/admin/doctorfromclaims" replace={true} className="navlink-no-underline">
    //       Doctor From Claims
    //     </NavLink>
    //   ),
    // },
    {
      key: "subscriberList",
      icon: <TeamOutlined />,
      label: (
        <NavLink to="/admin/registered-users" replace={true} className="navlink-no-underline">
          Subscriber List
        </NavLink>
      ),
    },
    {
      key: "7774",
      icon: <GiftOutlined />,
      label: (
        <NavLink to="/admin/coupon-usages" replace={true} className="navlink-no-underline">
          Coupon Usages
        </NavLink>
      ),
    },
    {
      key: "777599",
      icon: <FontAwesomeIcon icon={faStethoscope} />,
      label: (
        <NavLink to="/admin/purchased-free-health-tests" replace={true} className="navlink-no-underline">
          Free Tests Appointments
        </NavLink>
      ),
    },
    {
      key: "7775",
      icon: <FontAwesomeIcon icon={faStethoscope} />,
      label: (
        <NavLink to="/admin/purchased-health-checkups" replace={true} className="navlink-no-underline">
          Purchased Checkups
        </NavLink>
      ),
    },
    {
      key: "contact",
      label: "Contact Us",
      icon: <ContactsOutlined />,
      children: [
        {
          key: "CuRetail",
          icon: <FontAwesomeIcon icon={faUserTie} />,
          label: (
            <NavLink
              to="/admin/contact-us-retail"
              className="navlink-no-underline"
            >
              Retail
            </NavLink>
          ),
        },
        {
          key: "CuCorpo",
          icon: <TeamOutlined />,
          label: (
            <NavLink to="/admin/contact-us-corporate" className="navlink-no-underline">
              Corporate
            </NavLink>
          ),
        },
        {
          key: "CuEmail",
          icon: <FontAwesomeIcon icon={faIndustry} />,
          label: (
            <NavLink
              to="/admin/contact-us-email"
              className="navlink-no-underline"
            >
              Email
            </NavLink>
          ),
        },
             
       
      ],
    },
    
    {
      key: "google-reviews",
      icon: <GooglePlusOutlined />,
      label: (
        <NavLink to="/admin/google-reviews" className="navlink-no-underline">
          Google Reviews
        </NavLink>
      ),
    },
    {
      key: "blogs",
      icon: <AppstoreOutlined />,
      label: (
        <NavLink to="/admin/blogs" className="navlink-no-underline">
          Blogs
        </NavLink>
      ),
    },
    {
      key: "media",
      icon: <AppstoreOutlined />,
      label: (
        <NavLink to="/admin/media" className="navlink-no-underline">
          Media
        </NavLink>
      ),
    },
    {
      key: "events",
      icon: <AppstoreOutlined />,
      label: (
        <NavLink to="/admin/events" className="navlink-no-underline">
          Events
        </NavLink>
      ),
    },
    {
      key: "linkedIn",
      icon: <LinkedinOutlined />,
      label: (
        <NavLink to="/admin/linkedin" className="navlink-no-underline">
          Linkedin
        </NavLink>
      ),
    },
    {

      key: "Application Received",
      icon: <LinkedinOutlined />,
      label: (
        <NavLink to="/admin/application-recieved" className="navlink-no-underline">
          Application Received

          </NavLink>
      ),
    },{
      key: "jobs",
      icon: <LinkedinOutlined />,
      label: (
        <NavLink to="/admin/jobs" className="navlink-no-underline">
          Jobs

        </NavLink>
      ),
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: (
        <NavLink to="/logout/?userType=admin" replace={true} className="navlink-no-underline">
          Logout
        </NavLink>
      ),
    },
  ];

  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setCollapsed(true); // Collapse sidebar on mobile
      } else {
        setCollapsed(false); // Expand sidebar on desktop
      }
    };

    // Initial check and add resize listener
    handleResize();
    window.addEventListener("resize", handleResize);

    // Cleanup the event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Layout hasSider 
    style={{
      minHeight: "100vh",
    }}
    >
      <Sider
        width={250}
        theme="light"
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{
          overflow: "auto",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          height: "100%",
          position: "fixed",
          left: 0,
        }}
        
      >
        <div className="demo-logo-vertical text-center  d-flex justify-content-center align-items-center">
          <img
            src={opdlogo}
            width={60}
            height={60}
            alt="logo"
            className="my-3"
          />
        </div>
        <Menu
          style={{
            height: "100vh",
          }}
          theme="light"
          mode="inline"
          items={items}
        />
      </Sider>
      <Layout style={{ marginLeft: collapsed ? 80 : 250,  }}>
      <Header
          style={{
            background: colorBgContainer,
            height: 50,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
             paddingRight:"1rem",
             paddingLeft:"1rem",
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
            }}
          />
          <div style={{
            display:"flex",
            alignItems:"center",
            justifyContent:"center"
          }}>
          <div style={{
            display:"flex",
            alignItems:"center",
            justifyContent:"center"
            
          }}>
             {
            (userType == 3 ) ?
            (<WalletCard  />):
            null
          }
          <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
          {
            <NotificationCard userType={userType} style={{marginRight:"1rem"}} />
          }
         
          </div>
          {
          (userType == CONSTANTS.MAN_USER_TYPES.ADMIN || userType == CONSTANTS.MAN_USER_TYPES.GENERAL ) ?
          (
            userType == CONSTANTS.MAN_USER_TYPES.GENERAL ?
            <ProfileCard name={manUserName} email={manUserEmail} mobile={manUserMobile} designation={manUserDesignation}/>:
            <ProfileCard name={adminUserName} email={adminUserEmail} mobile={adminUserMobile} designation={null}/>
          )
          :
          null
         
          
          }
</div>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};
export default Navbar;
