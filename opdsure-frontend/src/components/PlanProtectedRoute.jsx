import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from "../context/authProvider";
import { useGeneralUser } from '../context/generalUserProvider';
import  CONSTANTS  from "../constant/Constants";

const PlanProtectedRoute = ({ allowedRole, children }) => {
  const { token, role } = useAuth();
  const {planPurchaseStatus,firstPlanPurchase} = useGeneralUser();
  const location = useLocation();
  return token ? (
    allowedRole === Number(role) ? (
      firstPlanPurchase==CONSTANTS.FIRST_PURCHASE.TRUE ? (
        <Outlet />
      ) : (
        <Navigate to="/user/plans" state={{ from: location }} replace />
      )
    ) : (
      <Navigate to="/unauthorized" state={{ from: location }} replace />
    )
  ) : (
    <Navigate to="/user/login" state={{ from: location }} replace />
  );
  // return token ? (
  //   allowedRole === Number(role) ? (
  //       planPurchaseStatus==1 ? (
  //       <Outlet />
  //     ) : (
  //       <Navigate to="/user/plans" state={{ from: location }} replace />
  //     )
  //   ) : (
  //     <Navigate to="/unauthorized" state={{ from: location }} replace />
  //   )
  // ) : (
  //   <Navigate to="/user/login" state={{ from: location }} replace />
  // );
};

export default PlanProtectedRoute;
