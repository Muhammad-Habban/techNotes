import React from "react";
import useAuth from "../../hooks/useAuth";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const RequireAuth = ({ allowedRoles }) => {
  console.log("INSIDE AUTH");
  const location = useLocation();
  const { roles } = useAuth();
  console.log(roles);
  const content = roles.some((role) => allowedRoles.includes(role)) ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
  return content;
};

export default RequireAuth;
