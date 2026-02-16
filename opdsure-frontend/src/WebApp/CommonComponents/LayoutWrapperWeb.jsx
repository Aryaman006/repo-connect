import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from './Footer';

const LayoutWrapperWeb = () => {
  return (
    <>
    <Navbar/>
    <Outlet />
    <Footer/>   
    </>
  );
};
export default LayoutWrapperWeb;
