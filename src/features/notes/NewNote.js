import React from "react";
import { useSelector } from "react-redux";
import { selectAllUsers } from "../users/userApiSlice";
import NewNoteForm from "./NewNoteForm";

const NewNote = () => {
  const users = useSelector(selectAllUsers);
  let content;
  if (!users?.length) content = <p>Not Currently Available</p>;
  else content = <NewNoteForm users={users} />;

  return content;
};

export default NewNote;
