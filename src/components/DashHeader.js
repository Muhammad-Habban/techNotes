import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSetlogOutMutation } from "../features/auth/authApiSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileCirclePlus,
  faFilePen,
  faUserGear,
  faUserPlus,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import useAuth from "../hooks/useAuth";
const DASH_REGEX = /^\/dash(\/)?$/;
const NOTES_REGEX = /^\/dash\/notes(\/)?$/;
const USERS_REGEX = /^\/dash\/users(\/)?$/;

const DashHeader = () => {
  const { isManager, isAdmin } = useAuth();
  const [setlogOut, { isError, isLoading, isSuccess, error }] =
    useSetlogOutMutation();

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const onNewNoteClicked = () => {
    navigate("/dash/notes/new");
  };
  const onNotesClicked = () => {
    navigate("/dash/notes");
  };
  const onNewUserClicked = () => {
    navigate("/dash/users/new");
  };
  const onUsersClicked = () => {
    navigate("/dash/users");
  };

  useEffect(() => {
    if (isSuccess) {
      navigate("/");
    }
  }, [isSuccess, navigate]);

  let dashClass = null;
  if (
    !DASH_REGEX.test(pathname) &&
    !USERS_REGEX.test(pathname) &&
    !NOTES_REGEX.test(pathname)
  ) {
    dashClass = "dash-header__container--small";
  }

  let newNoteButton = null;
  if (NOTES_REGEX.test(pathname)) {
    newNoteButton = (
      <button
        className="icon-button"
        title="New Note"
        onClick={onNewNoteClicked}
      >
        <FontAwesomeIcon icon={faFileCirclePlus} />
      </button>
    );
  }

  let newUserButton = null;
  if (USERS_REGEX.test(pathname)) {
    newUserButton = (
      <button
        className="icon-button"
        title="New User"
        onClick={onNewUserClicked}
      >
        <FontAwesomeIcon icon={faUserPlus} />
      </button>
    );
  }

  let userButton = null;
  if (isManager || isAdmin) {
    if (!USERS_REGEX.test(pathname) && pathname.includes("/dash")) {
      userButton = (
        <button className="icon-button" title="Users" onClick={onUsersClicked}>
          <FontAwesomeIcon icon={faUserGear} />
        </button>
      );
    }
  }

  let notesButton = null;
  if (!NOTES_REGEX.test(pathname) && pathname.includes("/dash")) {
    notesButton = (
      <button className="icon-button" title="Notes" onClick={onNotesClicked}>
        <FontAwesomeIcon icon={faFilePen} />
      </button>
    );
  }

  const logOutButton = (
    <button className="icon-button" title="Logout" onClick={setlogOut}>
      <FontAwesomeIcon icon={faRightFromBracket} />
    </button>
  );
  let buttonContent = null;
  if (isLoading) {
    buttonContent = <p>...Loading</p>;
  } else {
    buttonContent = (
      <>
        {newNoteButton}
        {newUserButton}
        {notesButton}
        {userButton}
        {logOutButton}
      </>
    );
  }
  const errClass = isError ? "errmsg" : "offscreen";
  return (
    <>
      <p className={errClass}>{error?.data?.message}</p>
      <header className={`dash-header ${dashClass}`}>
        <div className="dash-header__container">
          <Link to="/dash">
            <h1 className="dash-header__title">techNotes</h1>
          </Link>
        </div>
        <nav>{buttonContent}</nav>
      </header>
    </>
  );
};

export default DashHeader;
