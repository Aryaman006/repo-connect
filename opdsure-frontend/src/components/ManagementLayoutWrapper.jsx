import { Outlet } from "react-router-dom";
import ManagementNavbar from "./ManagementNavbar";
const LayoutWrapper = () => {
  return (
    <>
    <ManagementNavbar>
    <Outlet />
    </ManagementNavbar>
     
    </>
  );
};
export default LayoutWrapper;
