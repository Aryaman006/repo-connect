import { createContext, useContext, useEffect, useMemo, useState } from "react";

const GeneralUserContext = createContext({
  name: "",
  email: "",
  mobile: "",  
  planPurchaseStatus:"",
  firstPlanPurchase:"",
  setName: () => {},
  setEmail: () => {},
  setMobile: () => {},
  setPlanPurchaseStatus: () => {},
  setFirstPlanPurchase: () => {},
  clearUserContext: () => {}
});

const GeneralUserProvider = ({ children }) => {
  const [name, setName] = useState(localStorage.getItem("name") || "");
  const [email, setEmail] = useState(localStorage.getItem("email") || "");
  const [mobile, setMobile] = useState(localStorage.getItem("mobile") || "");
  const [planPurchaseStatus, setPlanPurchaseStatus] = useState(localStorage.getItem("planPurchaseStatus") || "");
  const [firstPlanPurchase, setFirstPlanPurchase] = useState(localStorage.getItem("firstPlanPurchase") || "");

  useEffect(() => {
    localStorage.setItem("name", name);
    localStorage.setItem("email", email);
    localStorage.setItem("mobile", mobile);
    localStorage.setItem("planPurchaseStatus", planPurchaseStatus);
    localStorage.setItem("firstPlanPurchase", firstPlanPurchase);
  }, [name, email, mobile, planPurchaseStatus,firstPlanPurchase]);

  const clearUserContext = () => {
    setName("");
    setEmail("");
    setMobile("");
    setPlanPurchaseStatus("");
    setFirstPlanPurchase("");
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    localStorage.removeItem("mobile");
    localStorage.removeItem("planPurchaseStatus");
    localStorage.removeItem("firstPlanPurchase");
  };

  const contextValue = useMemo(
    () => ({
      name,
      email,
      mobile,
      planPurchaseStatus,
      firstPlanPurchase,
      setName,
      setEmail,
      setMobile,
      setPlanPurchaseStatus,
      setFirstPlanPurchase,
      clearUserContext
    }),
    [ name, email, mobile, planPurchaseStatus,firstPlanPurchase ]
  );

  return (
    <GeneralUserContext.Provider value={contextValue}>
      {children}
    </GeneralUserContext.Provider>
  );
};

export const useGeneralUser = () => useContext(GeneralUserContext);

export default GeneralUserProvider;
