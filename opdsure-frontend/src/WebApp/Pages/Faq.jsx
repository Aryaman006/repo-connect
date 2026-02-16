import { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../../config/config';

const Faq = () => {
  const [faqs, setFaqs] = useState([]);

  useEffect(() => {
    axios.get(`${config.ApiBaseUrl}${config.GetAllFAQs}`)
      .then(response => {
        setFaqs(response.data.data.records);
      })
      .catch(error => {
        console.error('There was an error fetching the FAQs!', error);
      });
  }, []);

  const firstAccordionFaqs = faqs.slice(0, 5);
  const secondAccordionFaqs = faqs.slice(5);

  return (
    <div className='container'>
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <h1><strong>FAQ</strong></h1>
        <p>Positive feedback from existing clients</p>
      </div>

      <div className="accordion" id="accordionOne">
        {firstAccordionFaqs?.map((faq, index) => (
          <div className="accordion-item" key={faq.id}>
            <h2 className="accordion-header">
              <button
                className={`accordion-button ${index === 0 ? '' : 'collapsed'}`}
                type="button"
                data-bs-toggle="collapse"
                data-bs-target={`#collapse${index}`}
                aria-expanded={index === 0 ? 'true' : 'false'}
                aria-controls={`collapse${index}`}
              >
                {faq.question}
              </button>
            </h2>
            <div
              id={`collapse${index}`}
              className={`accordion-collapse collapse ${index === 0 ? 'show' : ''}`}
              data-bs-parent="#accordionOne"
            >
              <div className="accordion-body">
                {faq.answer}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* <div style={{ marginTop: "5rem", display: "flex", justifyContent: "flex-start", alignItems: "center", gap: "4rem", flexWrap: "wrap" }}>
        <img src={OurPartner} alt="Our Partner" />
        <img src={pharmEasy} alt="PharmEasy" />
        <img src={mediPay} alt="MediPay" />
        <img src={heathians} alt="Healthians" />
        <img src={payMe} alt="PayMe" />
        <img src={techLane} alt="TechLane" />
      </div> */}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "4rem", marginLeft: "1rem" }}>
        <h5 >FAQ</h5>
      </div>

      {secondAccordionFaqs.length > 0 && (
        <div className="accordion" id="accordionTwo" style={{ marginBottom: "2rem" }}>
          {secondAccordionFaqs?.map((faq, index) => (
            <div className="accordion-item" key={faq.id}>
              <h2 className="accordion-header">
                <button
                  className={`accordion-button ${index === 0 ? '' : 'collapsed'}`}
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#collapse${index + 5}`}
                  aria-expanded={index === 0 ? 'true' : 'false'}
                  aria-controls={`collapse${index + 5}`}
                >
                  {faq.question}
                </button>
              </h2>
              <div
                id={`collapse${index + 5}`}
                className={`accordion-collapse collapse ${index === 0 ? 'show' : ''}`}
                data-bs-parent="#accordionTwo"
              >
                <div className="accordion-body">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Faq;
