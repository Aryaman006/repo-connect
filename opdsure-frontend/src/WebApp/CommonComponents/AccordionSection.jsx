import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faArrowUpRightFromSquare} from "@fortawesome/free-solid-svg-icons"

const AccordionSection = ({
  title1,
  title2,
  subtitle1,
  subtitle2,
  imageSrc1,
  imageSrc2,
  accordionData1,
  accordionData2,
  accordionId1,
  accordionId2,
  cardlink1,
  cardlink2,
  cardId1,
  cardId2
}) => {
  return (
    <>
      <style>
        {`
    .flip-card {
background-color: transparent;
width: 100%;
max-width: 100%;
height: 100%;
perspective: 1000px;

}

.flip-card-inner {
position: relative;
width: 100%;
height: 100%;
text-align: center;
transition: transform 0.8s;
transform-style: preserve-3d;
}

.flip-card:hover .flip-card-inner {
transform: rotateY(180deg);
}

.flip-card-front, .flip-card-back {
box-shadow: 0 8px 14px 0 rgba(0,0,0,0.2);
position: absolute;
display: flex;
flex-direction: column;
justify-content: center;
width: 100%;
height: 100%;
-webkit-backface-visibility: hidden;
backface-visibility: hidden;
}

.flip-card-front {
background: linear-gradient(120deg, #deefff 60%, #86bcef 88%, #86bcef 40%, #5dadec9a 48%);
color: #5dadec;
}

.flip-card-back {
background: linear-gradient(120deg, #86bcef 30%, #5dadec 88%, #deefff 40%, #86bcef 78%);
color: white;
transform: rotateY(180deg);
}

.title {
font-size: 1.5em;
font-weight: 900;
text-align: center;
margin: 0;
}

.accordion-button {
font-size: 16px;
}

.accordion-body {
font-size: 14px;
}


@media (max-width: 768px) {
.flip-card {
  max-width: 100%;
  height: 200px;
  margin: 2rem 2rem;
}

.title {
  font-size: 1.2em; 
}

.accordion-button {
  font-size: 14px; 
}

.accordion-body {
  font-size: 12px; 
}

.flip-card-front img,
.flip-card-back img {
  max-width: 100%;
  height: auto;
}
.row{
  flex-direction: column;
}

.col-lg-4, .col-lg-6, .col-md-4, .col-md-6 {
  flex: 1 0 100%;
  max-width: 100%;
  padding: 0.5rem;
}

.col-8, .col-12 {
  flex: 1 0 100%;
  max-width: 100%;
}
}

  `}
    </style>
      <div className="row d-flex justify-content-center my-5" id={cardId1}>
      
        <div className="col-lg-4 col-md-4 col-10">
       
          <div className="flip-card">
            <div className="flip-card-inner">
              <div className="flip-card-front">
                <img src={imageSrc1} alt="template" className="img-fluid" />
              </div>
                 <Link to={cardlink1} target="_blank" className="flip-card-back">
                    <p className="title px-3">{subtitle1} now <FontAwesomeIcon icon={faArrowUpRightFromSquare} /></p>
                  </Link>
            </div>
          </div>
        </div>
        <div className="col-lg-6 col-md-6 col-12 bg-transparent">
          <h2 className="fw-600 text-5dadec mb-4 text-lg-start text-center fs-28">{title1}</h2>
          <div className="accordion" id={accordionId1}>
            {accordionData1?.map((faq, index) => (
              <div className="accordion-item bg-transparent" key={faq.id}>
                <h2 className="accordion-header">
                  <button
                    className={`accordion-button ${
                      index === 0 ? "" : "collapsed"
                    }`}
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#${accordionId1}-collapse${index}`}
                    aria-expanded={index === 0 ? "true" : "false"}
                    aria-controls={`${accordionId1}-collapse${index}`}
                  >
                    <span className="text-243572 fw-700 fs-18px">{faq.question}</span>
                  </button>
                </h2>
                <div
                  id={`${accordionId1}-collapse${index}`}
                  className={`accordion-collapse collapse ${
                    index === 0 ? "show" : ""
                  }`}
                  data-bs-parent={`#${accordionId1}`}
                >
                  <div className="accordion-body">{faq.answer}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <hr className="col-9 my-3 mx-auto text-243572"/>
      {title2 && (
        <>
      <div className="row d-flex justify-content-center my-5" id={cardId2}>
        <div className="col-lg-6 col-md-6 col-12 bg-transparent ">
          <h2 className="fw-600 text-5dadec mb-4 text-lg-start text-center fs-28">{title2}</h2>
          <div className="accordion" id={accordionId2}>
            {accordionData2?.map((faq, index) => (
              <div className="accordion-item bg-transparent" key={faq.id}>
                <h2 className="accordion-header">
                  <button
                    className={`accordion-button ${
                      index === 0 ? "" : "collapsed"
                    }`}
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#${accordionId2}-collapse${index}`}
                    aria-expanded={index === 0 ? "true" : "false"}
                    aria-controls={`${accordionId2}-collapse${index}`}
                  >
                    <span className="text-243572 fw-700 fs-18px">{faq.question}</span>
                  </button>
                </h2>
                <div
                  id={`${accordionId2}-collapse${index}`}
                  className={`accordion-collapse collapse ${
                    index === 0 ? "show" : ""
                  }`}
                  data-bs-parent={`#${accordionId2}`}
                >
                  <div className="accordion-body">{faq.answer}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
       
      
            <div className="col-lg-4 col-md-4 col-10">
              <div className="flip-card">
                <div className="flip-card-inner">
                  <div className="flip-card-front">
                    <img src={imageSrc2} alt="template" className="img-fluid my-lg-0 my-md-0 my-5" />
                  </div>
                  <Link to={cardlink2} target="_blank" className="flip-card-back">
                    <p className="title px-3">{subtitle2} now <FontAwesomeIcon icon={faArrowUpRightFromSquare} /></p>
                  </Link>
                </div>
              </div>
              </div>
              
      </div>
      <hr className="col-9 my-3 mx-auto text-243572"/>
      </>
       )}
       
    </>
  );
};

export default AccordionSection;
