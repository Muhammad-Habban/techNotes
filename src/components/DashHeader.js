import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSetlogOutMutation } from "../features/auth/authApiSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";

const DASH_REGEX = /^\/dash(\/)?$/;
const NOTES_REGEX = /^\/dash\/notes(\/)?$/;
const USERS_REGEX = /^\/dash\/users(\/)?$/;
const DashHeader = () => {
  const [setlogOut, { isError, isLoading, isSuccess, error }] =
    useSetlogOutMutation();

  const navigate = useNavigate();
  const { pathname } = useLocation();
  useEffect(() => {
    if (isSuccess) {
      navigate("/");
    }
  }, [isSuccess, navigate]);

  if (isLoading) {
    return <p>...LOADING</p>;
  }
  if (isError) {
    return <p>Error : {error.data?.message}</p>;
  }

  let dashClass = null;
  if (
    !DASH_REGEX.test(pathname) &&
    !USERS_REGEX.test(pathname) &&
    !NOTES_REGEX.test(pathname)
  ) {
    dashClass = "dash-header__container--small";
  }
  const logOutButton = (
    <button className="icon-button" title="Logout" onClick={setlogOut}>
      <FontAwesomeIcon icon={faRightFromBracket} />
    </button>
  );
  return (
    <header className={`dash-header ${dashClass}`}>
      <div className="dash-header__container">
        <Link to="/dash">
          <h1 className="dash-header__title">techNotes</h1>
        </Link>
      </div>
      <nav>{logOutButton}</nav>
    </header>
  );
};

export default DashHeader;
