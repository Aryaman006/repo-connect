import { createContext, useContext, useEffect, useMemo, useState } from "react";

const ManagementUserContext = createContext({
  manUserDesignation: "",
  manUserName: "",
  manUserEmail: "",
  manUserMobile: "",
  setManUserDesignation: () => {},
  setManUserName: () => {},
  setManUserEmail: () => {},
  setManUserMobile: () => {},
  clearManagementUserContext: () => {}
});

const ManagementUserProvider = ({ children }) => {
  const [manUserDesignation, setManUserDesignation] = useState(localStorage.getItem("manUserDesignation") || "");
  const [manUserName, setManUserName] = useState(localStorage.getItem("manUserName") || "");
  const [manUserEmail, setManUserEmail] = useState(localStorage.getItem("manUserEmail") || "");
  const [manUserMobile, setManUserMobile] = useState(localStorage.getItem("manUserMobile") || "");

  useEffect(() => {
    localStorage.setItem("manUserName", manUserName);
    localStorage.setItem("manUserEmail", manUserEmail);
    localStorage.setItem("manUserMobile", manUserMobile);
    localStorage.setItem("manUserDesignation", manUserDesignation);
  }, [manUserName, manUserEmail, manUserMobile, manUserDesignation]);

  const clearManagementUserContext = () => {
    setManUserName("");
    setManUserEmail("");
    setManUserMobile("");
    setManUserDesignation("");
    localStorage.removeItem("manUserName");
    localStorage.removeItem("manUserEmail");
    localStorage.removeItem("manUserMobile");
    localStorage.removeItem("manUserDesignation");
  };

  const contextValue = useMemo(
    () => ({
      manUserDesignation,
      manUserName,
      manUserEmail,
      manUserMobile,
      setManUserDesignation,
      setManUserName,
      setManUserEmail,
      setManUserMobile,
      clearManagementUserContext
    }),
    [manUserDesignation, manUserName, manUserEmail, manUserMobile]
  );

  return (
    <ManagementUserContext.Provider value={contextValue}>
      {children}
    </ManagementUserContext.Provider>
  );
};

export const useManagementUser = () => useContext(ManagementUserContext);

export default ManagementUserProvider;
