import React from "react";
import { useGetUsersQuery } from "./userApiSlice";
import User from "./User";

function UsersList() {
  const {
    data: users,
    isError,
    isSuccess,
    isLoading,
    error,
  } = useGetUsersQuery();
  let content;
  if (isLoading) content = <p>Loading...</p>;
  if (isError) content = <p className="errmsg">{error?.data?.message}</p>;
  if (isSuccess) {
    const { ids } = users;
    const tableContents = ids?.length
      ? ids.map((id) => {
          <User key={id} userId={id} />;
        })
      : null;
    content = (
      <table className="table table--user">
        <thead className="table__thead">
          <tr>
            <th scope="col" className="table__th user__username">
              UserName
            </th>
            <th scope="col" className="table__th user__roles">
              Roles
            </th>
            <th scope="col" className="table__th user__edit">
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

export default UsersList;
