import React from "react";
import Note from "./Note";
import { useGetNotesQuery } from "./noteApiSlice";
function NotesList() {
  const {
    data: notes,
    isError,
    isSuccess,
    isLoading,
    error,
  } = useGetNotesQuery();
  let content;
  if (isLoading) content = <p>Loading...</p>;
  if (isError) <p className="errmsg">{error?.data?.message}</p>;
  if (isSuccess) {
    const { ids } = notes;
    const tableContents = ids?.length
      ? ids.map((id) => <Note key={id} noteId={id} />)
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
