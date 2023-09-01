import React from "react";
import { useSelector } from "react-redux";
import { selectAllUsers } from "../users/userApiSlice";
import NewNoteForm from "./NewNoteForm";

const NewNote = () => {
  const users = useSelector(selectAllUsers);
  const content = users ? <NewNoteForm users={users} /> : <p>...LOADING</p>;

  return content;
};

export default NewNote;