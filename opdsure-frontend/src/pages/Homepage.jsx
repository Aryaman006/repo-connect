import { NavLink } from "react-router-dom";
import { Button } from "antd";

export default function Homepage() {
  return (<>
    <Button><NavLink to="/admin/login">Admin Login</NavLink></Button>
    <br/>
    <Button><NavLink to="/user/login">Subscriber Login</NavLink></Button>
    <br/>
    <Button><NavLink to="/hr/login">HR Login</NavLink></Button>
    </>
  )
}
