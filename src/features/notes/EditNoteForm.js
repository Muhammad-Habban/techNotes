import React, { useEffect, useState } from "react";
import { useDeleteNoteMutation, useUpdateNoteMutation } from "./noteApiSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import useAuth from "../../hooks/useAuth";

const TITLE_REGEX = /^[A-z' '.0-9!@#$%]{4,20}$/;
const TEXT_REGEX = /^[A-z' '.0-9!@#$%]{4,150}$/;
const EditNoteForm = ({ note, users }) => {
  // STATES
  const { isManager, isAdmin } = useAuth();
  const [title, setTitle] = useState(note.title);
  const [text, setText] = useState(note.text);
  const [username, setUserName] = useState(note.username);
  const [completed, setCompleted] = useState(note.completed);
  const [validTitle, setValidTitle] = useState(false);
  const [validText, setValidText] = useState(false);
  // NAVIGATE
  const navigate = useNavigate();
  //EVENT HANDLERS
  const onTitleChanged = (e) => setTitle(e.target.value);
  const onTextChanged = (e) => setText(e.target.value);
  const onUserNameChange = (e) => setUserName(e.target.value);
  const onCompletedChange = (e) => setCompleted((prev) => !prev);
  //RTK QUERY
  const [updateNote, { isError, isLoading, isSuccess, error }] =
    useUpdateNoteMutation();
  const [
    deleteNote,
    {
      isError: isDelError,
      isLoading: isDelLoading,
      isSuccess: isDelSuccess,
      error: delError,
    },
  ] = useDeleteNoteMutation();
  // useEffects
  useEffect(() => {
    setValidTitle(TITLE_REGEX.test(title));
  }, [title]);
  useEffect(() => {
    setValidText(TEXT_REGEX.test(text));
  }, [text]);

  useEffect(() => {
    if (isSuccess || isDelSuccess) {
      setText("");
      setTitle("");
      setUserName("");
      setValidText(false);
      setValidTitle(false);
      navigate("/dash/notes");
    }
  }, [isSuccess, isDelSuccess, navigate]);
  let canSave = validText && validTitle && username && !isLoading;
  const onSubmitClicked = async () => {
    if (canSave) {
      await updateNote({ id: note.id, username, text, title, completed });
    }
  };
  const onDeleteClicked = async () => {
    await deleteNote({ id: note.id });
  };

  const options = users.map((user) => {
    return (
      <option key={user.username} value={user.username}>
        {user.username}
      </option>
    );
  });
  const errClass = isError || isDelError ? "errmsg" : "offscreen";
  const validTitleClass = !validTitle ? "form__input--incomplete" : "";
  const validTextClass = !validText ? "form__input--incomplete" : "";

  const errContent = (error?.data?.message || delError?.data?.message) ?? "";
  const content = (
    <>
      <p className={errClass}>{errContent}</p>

      <form className="form" onSubmit={(e) => e.preventDefault()}>
        <div className="form__title-row">
          <div className="form__action-buttons">
            <button
              className="icon-button"
              title="Save"
              onClick={onSubmitClicked}
              disabled={!canSave}
            >
              <FontAwesomeIcon icon={faSave} />
            </button>
            {(isManager || isAdmin) && (
              <button
                className="icon-button"
                title="Delete"
                onClick={onDeleteClicked}
              >
                <FontAwesomeIcon icon={faTrashCan} />
              </button>
            )}
          </div>
        </div>
        <label className="form__label" htmlFor="note-title">
          Title:
        </label>
        <input
          className={`form__input ${validTitleClass}`}
          id="note-title"
          name="title"
          type="text"
          autoComplete="off"
          value={title}
          onChange={onTitleChanged}
        />

        <label className="form__label" htmlFor="note-text">
          Text:
        </label>
        <textarea
          className={`form__input form__input--text ${validTextClass}`}
          id="note-text"
          name="text"
          value={text}
          onChange={onTextChanged}
        />
        <div className="form__row">
          <div className="form__divider">
            <label
              className="form__label form__checkbox-container"
              htmlFor="note-completed"
            >
              WORK COMPLETE:
              <input
                className="form__checkbox"
                id="note-completed"
                name="completed"
                type="checkbox"
                checked={completed}
                onChange={onCompletedChange}
              />
            </label>

            <label
              className="form__label form__checkbox-container"
              htmlFor="note-username"
            >
              ASSIGNED TO:
            </label>
            <select
              id="note-username"
              name="username"
              className="form__select"
              value={username}
              onChange={onUserNameChange}
            >
              {options}
            </select>
          </div>
        </div>
      </form>
    </>
  );
  return content;
};

export default EditNoteForm;
