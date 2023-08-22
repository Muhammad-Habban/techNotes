import React, { useEffect, useState } from "react";
import { useAddNewUserMutation } from "./userApiSlice";
import { useNavigate } from "react-router-dom";
import { Roles } from "../../config/Roles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
//REGEX - Regular Expression to validate username and password
// Username can only contain [A-z] and characters must be of length 3-20
const USER_REGEX = /^[A-z]{3,20}$/;
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/;
const NewUserForm = () => {
  const [createUser, { isError, isLoading, isSuccess, error }] =
    useAddNewUserMutation();
  const [username, setUserName] = useState("");
  const [validUserName, setValidUserName] = useState(false);
  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [roles, setRoles] = useState(["Employee"]);
  const navigate = useNavigate();
  const onUserNameChange = (e) => setUserName(e.target.value);
  const onPasswordChange = (e) => setPassword(e.target.value);
  const onRolesChanged = (e) => {
    const values = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setRoles(values);
  };

  useEffect(() => {
    setValidUserName(USER_REGEX.test(username));
  }, [username]);
  useEffect(() => {
    setValidPassword(PWD_REGEX.test(password));
  }, [password]);

  useEffect(() => {
    if (isSuccess) {
      setUserName("");
      setPassword("");
      setRoles(["Employee"]);
      navigate("/dash/users");
    }
  }, [isSuccess, navigate]);

  let canSave = validPassword && validUserName && roles.length && !isLoading;

  const onUserSaveClickede = async (e) => {
    e.preventDefault();
    if (canSave) {
      await createUser({ username, password, roles });
    }
  };

  const errClass = isError ? "errmsg" : "";
  const validUserClass = validUserName ? "" : "form__input--incomplete";
  const validPwdClass = validPassword ? "" : "form__input--incomplete";
  const validRolesClass = Boolean(roles.length)
    ? ""
    : "form__input--incomplete";

  const options = Object.values(Roles).map((role) => {
    return (
      <option key={role} value={role}>
        {role}
      </option>
    );
  });

  const content = (
    <>
      <p className={errClass}>{error?.data?.message}</p>
      <form className="form" onSubmit={onUserSaveClickede}>
        <div className="form__title-row">
          <h2>New User</h2>
          <div className="form__action-buttons">
            <button
              type="submit"
              className="icon-button"
              disabled={!canSave}
              title="Save"
            >
              <FontAwesomeIcon icon={faSave} />
            </button>
          </div>
        </div>
        <label className="form-label" htmlFor="username">
          Username : <span className="nowrap">[3-20 characters]</span>
        </label>
        <input
          className={`form__input ${validUserClass}`}
          id="username"
          name="username"
          type="text"
          autoComplete="off"
          value={username}
          onChange={onUserNameChange}
        />
        <label className="form-label" htmlFor="password">
          password :{" "}
          <span className="nowrap">[4-12 characters include : !@#$%]</span>
        </label>
        <input
          className={`form__input ${validPwdClass}`}
          id="password"
          name="password"
          type="text"
          autoComplete="off"
          value={password}
          onChange={onPasswordChange}
        />
        <label className="form-label" htmlFor="roles">
          ASSIGNED ROLES :
        </label>
        <select
          id="roles"
          name="roles"
          className={`form__select ${validRolesClass}`}
          multiple={true}
          size="3"
          onChange={onRolesChanged}
        >
          {options}
        </select>
      </form>
    </>
  );

  return content;
};

export default NewUserForm;
