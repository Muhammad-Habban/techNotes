import React from "react";
import { selectUserById } from "./userApiSlice";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import EditUserForm from "./EditUserForm";

const EditUser = () => {
  const { id } = useParams();
  const user = useSelector((state) => selectUserById(state, id));

  const content = user ? <EditUserForm user={user} /> : <p>...LOADING</p>;

  return content;
};

export default EditUser;
