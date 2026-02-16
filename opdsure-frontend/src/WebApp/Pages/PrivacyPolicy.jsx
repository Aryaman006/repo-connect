import {useEffect} from "react";

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top on component mount
  }, []);
  const privacyPolicyList = [
    {
      id: 1,
      content:
        "OPDSure assumes no liability towards any time delay caused on account of the above factors necessary for review, analysis reporting and third-party service delay outside of our control.",
    },
    {
      id: 2,
      content:
        "OPDSure does not provide medical advice and so the Services offered must not be considered a substitute for professional medical advice, diagnosis or treatment.",
    },
    {
      id: 3,
      content:
        "Do not disregard, delay or avoid obtaining medical advice from a qualified medical and health care professional. Please correlate clinically.",
    },
    {
      id: 4,
      content:
        "OPDSure shall not be responsible in any manner for the authenticity of the Personal Information supplied by the User to OPDSure or any other person acting on behalf of OPDSure.",
    },
    {
      id: 5,
      content:
        "The User is responsible for maintaining the confidentiality of the User’s account access information and password and restricting any unauthorized access and use of Services through the Website.",
    },
    {
      id: 6,
      content:
        "The User shall be responsible for all uses of the User’s account and password, whether or not authorized by the User.",
    },
    {
      id: 7,
      content:
        "The User shall immediately notify OPDSure of any actual or suspected unauthorized use of the User’s account or password.",
    },
    {
      id: 8,
      content:
        "If a User provides (on the Website or in any communication with OPDSure) any information (medical or otherwise) that is false, inaccurate, not current or incomplete (or becomes false, inaccurate, not current or incomplete), or OPDSure has reasonable grounds to suspect that such information is false, inaccurate, not current or incomplete, OPDSure has the right to suspend or terminate such account at its sole discretion and refuse access to the Services, including, but not limited to, the OPDSure Plans.",
    },
    {
      id: 9,
      content:
        "User authorizes OPDSure and its officials to collect the electronic or physical copy of the report from the doctors, hospitals/clinics, pharmacy centers, diagnostic labs or any other healthcare providers and provide the same to the Users.",
    },
  ];

  return (
    <>
      <div className="container-fluid">
        <div className="row justify-content-center d-flex">
          <div className="col-10 my-5 text-center">
            <h1 className="fw-600 fs-32px ">Privacy Policy</h1>
            <p className="fw-400 fs-18px mb-5">Personal Information Terms</p>
            <p className="fw-600 fs-18px text-start">
              Personal information shall be dealt with in accordance with
              OPDSure's Privacy Policy. Furthermore, you agree to the following:
            </p>
            <ul>
              {privacyPolicyList?.map((item) => (
                <li key={item.id} className="fw-400 fs-18px text-start">
                  {item.content}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;
