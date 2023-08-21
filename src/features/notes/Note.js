import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectNoteById } from "./noteApiSlice";
import { selectUserById } from "../users/userApiSlice";

const Note = ({ noteId }) => {
  const navigate = useNavigate();
  const note = useSelector((state) => selectNoteById(state, noteId));
  //   console.log(note.user);
  //   const userId = note.user;
  //   console.log(userId);
  //   const user = useSelector((state) => selectUserById(state, userId));
  //   console.log(user);
  if (note) {
    const handleEdit = () => navigate(`/dash/notes/${noteId}`);
    const created = new Date().toLocaleString("en-US", {
      day: "numeric",
      month: "long",
    });
    const updated = new Date().toLocaleString("en-US", {
      day: "numeric",
      month: "long",
    });
    // let owner;
    // if (user) {
    //   owner = user.username;
    // } else {
    //   owner = "Owner Not Found";
    // }
    return (
      <tr>
        <td className="table__cell note__status">
          {note.completed ? (
            <span className="note__status--completed">Completed</span>
          ) : (
            <span className="note__status--open">Open</span>
          )}
        </td>
        <td className="table__cell note__created">{created}</td>
        <td className="table__cell note__updated">{updated}</td>
        <td className="table__cell note__title">{note.title}</td>
        <td className="table__cell note__username">{note.user}</td>
        <td className="table__cell">
          <button className="icon-button table__button" onClick={handleEdit}>
            <FontAwesomeIcon icon={faPenToSquare} />
          </button>
        </td>
      </tr>
    );
  } else return null;
};

export default Note;
