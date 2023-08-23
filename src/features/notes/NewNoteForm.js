import React, { useEffect, useState } from "react";
import { useAddNewNoteMutation } from "./noteApiSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
const TITLE_REGEX = /^[A-z' '.0-9!@#$%]{4,20}$/;
const TEXT_REGEX = /^[A-z' '.0-9!@#$%]{4,150}$/;
const NewNoteForm = ({ users }) => {
  console.log(users);
  const allUserNames = Array.from(users, (user) => user.username);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [validTitle, setValidTitle] = useState(false);
  const [validText, setValidText] = useState(false);
  const [username, setUserName] = useState("");
  const navigate = useNavigate();
  const onTitleChanged = (e) => setTitle(e.target.value);
  const onTextChanged = (e) => setText(e.target.value);
  const onUserOptionSelected = (e) => setUserName(e.target.value);
  const [createNote, { isError, isLoading, isSuccess, error }] =
    useAddNewNoteMutation();

  useEffect(() => {
    setValidTitle(TITLE_REGEX.test(title));
  }, [title]);
  useEffect(() => {
    setValidText(TEXT_REGEX.test(text));
  }, [text]);
  useEffect(() => {
    if (isSuccess) {
      setText("");
      setTitle("");
      setUserName("");
      setValidText(false);
      setValidTitle(false);
      navigate("/dash/notes");
    }
  }, [isSuccess, navigate]);
  let canSave;
  canSave = validText && validText && username && !isLoading;
  const options = allUserNames.map((username) => {
    return (
      <option key={username} value={username}>
        {username}
      </option>
    );
  });
  const onNoteSaveClicked = async (e) => {
    e.preventDefault();
    if (canSave) {
      await createNote({ username, title, text });
    }
  };

  const errClass = isError ? "errmsg" : "";
  const validTitleClass = validTitle ? "" : "form__input--incomplete";
  const validTextClass = validText ? "" : "form__input--incomplete";

  const content = (
    <>
      <p className={errClass}>{error?.data?.message}</p>

      <form className="form" onSubmit={onNoteSaveClicked}>
        <div className="form__title-row">
          <h2>New Note</h2>
          <div className="form__action-buttons">
            <button
              type="submit"
              className="icon-button"
              title="Save"
              disabled={!canSave}
            >
              <FontAwesomeIcon icon={faSave} />
            </button>
          </div>
        </div>
        <label className="form__label" htmlFor="title">
          Title:
        </label>
        <input
          className={`form__input ${validTitleClass}`}
          id="title"
          name="title"
          type="text"
          autoComplete="off"
          value={title}
          onChange={onTitleChanged}
        />

        <label className="form__label" htmlFor="text">
          Text:
        </label>
        <textarea
          className={`form__input form__input--text ${validTextClass}`}
          id="text"
          name="text"
          value={text}
          onChange={onTextChanged}
        />

        <label
          className="form__label form__checkbox-container"
          htmlFor="username"
        >
          ASSIGNED TO:
        </label>
        <select
          id="username"
          name="username"
          className="form__select"
          size="5"
          value={username}
          onChange={onUserOptionSelected}
        >
          {options}
        </select>
      </form>
    </>
  );
  return content;
};

export default NewNoteForm;
