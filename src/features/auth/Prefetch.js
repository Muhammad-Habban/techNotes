import React, { useEffect } from "react";
import { store } from "../../app/store";
import { userApiSlice } from "../users/userApiSlice";
import { noteApiSlice } from "../notes/noteApiSlice";
import { Outlet } from "react-router-dom";
const Prefetch = () => {
  useEffect(() => {
    console.log("Subscribing");
    const notes = store.dispatch(noteApiSlice.endpoints.getNotes.initiate());
    const users = store.dispatch(userApiSlice.endpoints.getUsers.initiate());

    return () => {
      console.log("Unsubscribing");
      notes.unsubscribe();
      users.unsubscribe();
    };
  }, []);
  return <Outlet />;
};

export default Prefetch;
