import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { selectNoteById } from "./noteApiSlice";
import EditNoteForm from "./EditNoteForm";
import { selectAllUsers } from "../users/userApiSlice";

const EditNote = () => {
  const { id } = useParams();
  const note = useSelector((state) => selectNoteById(state, id));
  const users = useSelector(selectAllUsers);
  const content = note ? (
    <EditNoteForm note={note} users={users} />
  ) : (
    <p>...LOADING</p>
  );
  return content;
};

export default EditNote;
