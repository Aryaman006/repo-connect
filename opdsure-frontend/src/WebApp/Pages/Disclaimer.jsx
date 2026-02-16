import React,{useState,useEffect} from 'react'
import {Axios} from '../../axios/axiosFunctions'
import config from '../../config/config'
const Disclaimer = () => {

  const [disclaimer, setDisclaimer] = useState("");
  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top on component mount
  }, []);
  const fetchCountStats = async () => {
    const response = await Axios.fetchAxiosData(config.GetFileSize);
    setDisclaimer(response?.data[0]?.disclaimer);
  };

  useEffect(() => {
    fetchCountStats();
  }, []);

  return (
   <>
    <div className="container-fluid" style={{minHeight:"100vh"}}>
        <div className="row justify-content-center d-flex">
          <div className="col-10 my-5 text-center">
            <h1 className="fw-600 fs-32px pb-5 ">Disclaimer</h1>
            <div className="fw-400 fs-18px text-start" dangerouslySetInnerHTML={{ __html: disclaimer }}>
            </div>
          </div>
        </div>
      </div>
   </>
  )
}

export default Disclaimer
