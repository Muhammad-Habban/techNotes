import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "./authSlice";
import { useRefreshMutation } from "./authApiSlice";
import usePersist from "../../hooks/usePersist";
import { Link, Outlet } from "react-router-dom";

const PersistLogin = () => {
  console.log("INSIDE PERSIST");
  const token = useSelector(selectCurrentToken);
  console.log(token);
  const effectRan = useRef(false);
  const [trueSuccess, setTrueSuccess] = useState(false);
  const [refresh, { isSuccess, isError, isUninitialized, isLoading, error }] =
    useRefreshMutation();
  const [persist] = usePersist();
  useEffect(() => {
    if (effectRan.current === true || process.env.NODE_ENV !== "development") {
      const verifyRefreshToken = async () => {
        try {
          const response = await refresh();
          const { accessToken } = response.data;
          console.log(accessToken);
          setTrueSuccess(true);
        } catch (err) {
          console.log(err);
        }
      };
      if (!token && persist) {
        verifyRefreshToken();
      }
    }
    return () => (effectRan.current = true);
    // eslint-disable-next-line
  }, []);
  let content;
  if (!persist) {
    console.log("No persist");
    content = <Outlet />;
  } else if (isLoading) {
    content = <p>...LOADING</p>;
  } else if (isSuccess && trueSuccess) {
    console.log("SUCCESS");
    content = <Outlet />;
  } else if (isError) {
    console.log("error");
    content = (
      <p className="errmsg">
        {`${error?.message} - `}
        <Link to="/login">Please Login Again</Link>
      </p>
    );
  } else if (persist && isUninitialized) {
    console.log("UNINIT");
    console.log(isUninitialized);
    content = <Outlet />;
  }
  return content;
};

export default PersistLogin;
