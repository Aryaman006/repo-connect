import React,{useEffect} from 'react';
import { NavLink } from 'react-router-dom'; 
import thankYou from "../Assets/thankYou.gif"
const ThankYouPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0); // Scroll to top on component mount
      }, []);
  return (
    <div style={styles.container} className='bg-gradient-light'>
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="thank-you text-center">
          <img 
              src={thankYou} // Use the imported GIF
              alt="Thank You Icon" 
              style={styles.image} 
            />
            <h1 className="display-4 text-243572" style={styles.heading}>Thank You!</h1>
            <hr className="my-4 text-5dadec" />
            <p className="lead">
              Thank you for submitting your details! We've received your information and will be in touch with you shortly.
            </p>
            <div>
              <NavLink className="btn btn-md bg-4a68b1 text-eeeeee" to="/homepage">Homepage</NavLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: "2rem",
  },
  image: {
    maxWidth: '120px', // Adjust as needed
    // marginBottom: '20px',
  },
  heading: {
    fontWeight: 400,
    marginTop: '10px',
  },
};

export default ThankYouPage;
