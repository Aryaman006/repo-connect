import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AdminUserContext = createContext({
  adminUserName: "",
  adminUserEmail: "",
  adminUserMobile: "",
  setAdminUserName: () => {},
  setAdminUserEmail: () => {},
  setAdminUserMobile: () => {},
  clearAdminUserContext: () => {}
});

const AdminUserProvider = ({ children }) => {
  const [adminUserName, setAdminUserName] = useState(localStorage.getItem("adminUserName") || "");
  const [adminUserEmail, setAdminUserEmail] = useState(localStorage.getItem("adminUserEmail") || "");
  const [adminUserMobile, setAdminUserMobile] = useState(localStorage.getItem("adminUserMobile") || "");

  useEffect(() => {
    localStorage.setItem("adminUserName", adminUserName);
    localStorage.setItem("adminUserEmail", adminUserEmail);
    localStorage.setItem("adminUserMobile", adminUserMobile);
  }, [adminUserName, adminUserEmail, adminUserMobile]);

  const clearAdminUserContext = () => {
    setAdminUserName("");
    setAdminUserEmail("");
    setAdminUserMobile("");
    localStorage.removeItem("adminUserName");
    localStorage.removeItem("adminUserEmail");
    localStorage.removeItem("adminUserMobile");
  };

  const contextValue = useMemo(
    () => ({
      adminUserName,
      adminUserEmail,
      adminUserMobile,
      setAdminUserName,
      setAdminUserEmail,
      setAdminUserMobile,
      clearAdminUserContext
    }),
    [adminUserName, adminUserEmail, adminUserMobile]
  );

  return (
    <AdminUserContext.Provider value={contextValue}>
      {children}
    </AdminUserContext.Provider>
  );
};

export const useAdminUser = () => useContext(AdminUserContext);

export default AdminUserProvider;
