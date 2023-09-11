import React from "react";
import Note from "./Note";
import { useGetNotesQuery } from "./noteApiSlice";
import useAuth from "../../hooks/useAuth";
function NotesList() {
  const { username, isManager, isAdmin } = useAuth();
  const {
    data: notes,
    isError,
    isSuccess,
    isLoading,
    error,
  } = useGetNotesQuery(null, {
    pollingInterval: 15000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });
  let content;
  if (isLoading) content = <p>Loading...</p>;
  if (isError) content = <p className="errmsg">{error?.data?.message}</p>;
  if (isSuccess) {
    const { ids, entities } = notes;
    let filterIds;
    if (isManager || isAdmin) {
      filterIds = [...ids];
    } else {
      filterIds = ids.filter(
        (noteId) => entities[noteId].user.username === username
      );
    }
    const tableContents = ids?.length
      ? filterIds.map((id) => <Note key={id} noteId={id} />)
      : null;
    content = (
      <table className="table table--notes">
        <thead className="table__head">
          <tr>
            <th scope="col" className="table__th note__status">
              Status
            </th>
            <th scope="col" className="table__th note__created">
              Created
            </th>
            <th scope="col" className="table__th note__updated">
              Updated
            </th>
            <th scope="col" className="table__th note__title">
              Title
            </th>
            <th scope="col" className="table__th note__username">
              Owner
            </th>
            <th scope="col" className="table__th note__edit">
              Edit
            </th>
          </tr>
        </thead>
        <tbody>{tableContents}</tbody>
      </table>
    );
  }
  return content;
}

export default NotesList;
