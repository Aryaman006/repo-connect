import React from 'react'
import EmpWellCorporateForm from "../HomePageComponents/EmpWellCorporateForm";
import formEmployee from "../Assets/corpBgImg.jpg";
const GetStartedTodayForm = () => {
  return (
    <>
    <div className="container-fluid p-0 mx-0 mt-5 position-relative">

    <div className="row p-0 mx-0">
          <div className="col-12 mt-2 px-0">
          <img
              src={formEmployee}
              alt="background doctor"
              style={{
                backgroundColor: "rgb(0, 0, 120)", // Dark blue
                filter: "brightness(0.3)", // Adjust brightness to make it darker
              }}
              
              className={`img-fluid z-n3 position-absolute w-100 p-0 h-100 object-fit-cover`}
            />
            <EmpWellCorporateForm />
          </div>
        </div>
    </div>
    </>
  )
}

export default GetStartedTodayForm
