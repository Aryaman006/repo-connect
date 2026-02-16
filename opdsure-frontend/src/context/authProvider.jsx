import axios from "axios";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import config from "../config/config";

const AuthContext = createContext({
  token: "",
  userid: "",
  userType: "",
  role:"",
  subscriberType:"",
  resetDefaultPassword:"",
  corporate:"",
  setToken: () => {},
  setUserid: () => {},
  setSubscriberType: () => {},
  setRole: () => {},
  clearAuthContext: () => {},
  setUserType: () => {},
  setResetDefaultPassword: () => {},
  setCorporate: () => {},
});

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [userid, setUserid] = useState(localStorage.getItem("user_id") || "");
  const [userType, setUserType] = useState(localStorage.getItem("user_type") || "");
  const [subscriberType, setSubscriberType] = useState(localStorage.getItem("subscriberType") || "");
  const [role, setRole] = useState(localStorage.getItem("role") || "");
  const [resetDefaultPassword, setResetDefaultPassword] = useState(localStorage.getItem("reset_default_password") || "");
  const [corporate, setCorporate] = useState(localStorage.getItem("corporate") || "");

  useEffect(() => {
    axios.defaults.baseURL = config.ApiBaseUrl;

    if (token) {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
      axios.defaults.headers.common.user_id = userid;

      localStorage.setItem("token", token);
      localStorage.setItem("user_id", userid);
      localStorage.setItem("user_type", userType);
      localStorage.setItem("subscriber_type", subscriberType);
      localStorage.setItem("role", role);
      localStorage.setItem("corporate", corporate);
      localStorage.setItem("reset_default_password", resetDefaultPassword);
    } else {
      delete axios.defaults.headers.common.Authorization;
      delete axios.defaults.headers.common.user_id;

      localStorage.removeItem("token");
      localStorage.removeItem("user_id");
      localStorage.removeItem("user_type");
      localStorage.removeItem("subscriber_type");
      localStorage.removeItem("role");
      localStorage.removeItem("corporate");
      localStorage.removeItem("reset_default_password");
    }
  }, [token, userid, userType,role,subscriberType,resetDefaultPassword,corporate]);

  const clearAuthContext = () => {
    setToken("");
    setUserid("");
    setUserType("");
    setRole("");
    setCorporate("");
    setSubscriberType(""),
    setResetDefaultPassword(""),
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_type");
    localStorage.removeItem("subscriber_type");
    localStorage.removeItem("role");
    localStorage.removeItem("corporate");
    localStorage.removeItem("reset_default_password");
  };

  const contextValue = useMemo(
    () => ({
      token,
      userid,
      userType,
      role,
      corporate,
      subscriberType,
      resetDefaultPassword,
      setToken,
      setResetDefaultPassword,
      setUserid,
      setSubscriberType,
      setUserType,
      setRole,
      clearAuthContext,
      setCorporate,
    }),
    [token, userid, userType, role,subscriberType,resetDefaultPassword,corporate]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;
