import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
const LayoutWrapper = () => {
  return (
    <>
    <Navbar>
    <Outlet />
    </Navbar>
     
    </>
  );
};
export default LayoutWrapper;
