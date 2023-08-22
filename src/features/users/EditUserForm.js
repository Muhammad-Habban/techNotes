import React, { useEffect, useState } from "react";
import { useDeleteUserMutation, useUpdateUserMutation } from "./userApiSlice";
import { useNavigate } from "react-router-dom";
import { Roles } from "../../config/Roles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faSave } from "@fortawesome/free-solid-svg-icons";

const USER_REGEX = /^[A-z]{3,20}$/;
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/;
const EditUserForm = ({ user }) => {
  const [updateUser, { isError, isLoading, isSuccess, error }] =
    useUpdateUserMutation();
  const [
    deleteUser,
    {
      isError: isDelError,
      isLoading: isDelLoading,
      isSuccess: isDelSuccess,
      error: delError,
    },
  ] = useDeleteUserMutation();

  const [username, setUserName] = useState(user.username);
  const [password, setPassword] = useState("");
  const [roles, setRoles] = useState(user.roles);
  const [validUserName, setValidUserName] = useState(false);
  const [validPassword, setValidPassword] = useState(false);
  const [active, setActive] = useState(user.active);
  const navigate = useNavigate();
  useEffect(() => {
    setValidPassword(PWD_REGEX.test(password));
  }, [password]);

  useEffect(() => {
    setValidUserName(USER_REGEX.test(username));
  }, [username]);

  useEffect(() => {
    if (isSuccess || isDelSuccess) {
      setUserName("");
      setPassword("");
      setRoles([]);
      navigate("/dash/users");
    }
  }, [isSuccess, isDelSuccess, navigate]);

  const onUserNameChange = (e) => setUserName(e.target.value);
  const onPasswordChange = (e) => setPassword(e.target.value);
  const onActiveChange = (e) => setActive((prev) => !prev);
  const onRolesChanged = (e) => {
    const values = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setRoles(values);
  };
  let canSave;
  if (password)
    canSave = validPassword && validUserName && roles?.length && !isLoading;
  else canSave = validUserName && roles?.length && !isLoading;

  const onUserEditClicked = async () => {
    if (canSave) {
      if (password) await updateUser({ username, password, roles, active });
      else await updateUser({ username, roles, active });
    }
  };

  const options = Object.values(Roles).map((role) => {
    return (
      <options key={user} value={user}>
        {role}
      </options>
    );
  });

  const onDeleteUserClicked = async () => {
    await deleteUser({ id: user.id });
  };

  const errClass = isError || isDelError ? "errmsg" : "";
  const validUserClass = validUserName ? "" : "form__input--incomplete";
  const validPwdClass =
    validPassword && password ? "" : "form__input--incomplete";
  const validRolesClass = Boolean(roles.length)
    ? ""
    : "form__input--incomplete";
  const errorContent = error?.data?.message || delError?.data?.message;
  const content = (
    <>
      <p className={errClass}>{errorContent}</p>
      <form className="form" onSubmit={(e) => e.preventDefault()}>
        <div className="form__title-row">
          <h2>Edit User</h2>
          <div className="form__action-buttons">
            <button
              className="icon-button"
              title="Save"
              onClick={onUserEditClicked}
              disabled={!canSave}
            >
              <FontAwesomeIcon icon={faSave} />
            </button>
            <button
              className="icon-button"
              title="Delete"
              onClick={onDeleteUserClicked}
            >
              <FontAwesomeIcon icon={faTrashCan} />
            </button>
          </div>
        </div>
        <label className="form__label" htmlFor="username">
          Username: <span className="nowrap">[3-20 letters]</span>
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

        <label className="form__label" htmlFor="password">
          Password: <span className="nowrap">[empty = no change]</span>{" "}
          <span className="nowrap">[4-12 chars incl. !@#$%]</span>
        </label>
        <input
          className={`form__input ${validPwdClass}`}
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={onPasswordChange}
        />

        <label
          className="form__label form__checkbox-container"
          htmlFor="user-active"
        >
          ACTIVE:
          <input
            className="form__checkbox"
            id="user-active"
            name="user-active"
            type="checkbox"
            checked={active}
            onChange={onActiveChange}
          />
        </label>

        <label className="form__label" htmlFor="roles">
          ASSIGNED ROLES:
        </label>
        <select
          id="roles"
          name="roles"
          className={`form__select ${validRolesClass}`}
          multiple={true}
          size="3"
          value={roles}
          onChange={onRolesChanged}
        >
          {options}
        </select>
      </form>
    </>
  );
  return content;
};

export default EditUserForm;
