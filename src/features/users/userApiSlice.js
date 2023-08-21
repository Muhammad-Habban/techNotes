import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const userAdapter = createEntityAdapter({}); // to provide an IDs array, gives us normalize state.

const initialState = userAdapter.getInitialState();

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // creating a hook that we will use to get data from the api, here we are using getUsers, and providing a query from where it will get data
    getUsers: builder.query({
      query: () => "/users",
      // to check the status if the request was successfull and there was no error
      validateStatus: (response, result) => {
        return response.status == 200 && !result.isError;
      },
      // we are just using it because the data obtained from monogoDB has property "_id" but we need "id" for entityBuilder (ig)
      transformResponse: (responeData) => {
        const loadedUsers = responeData.map((user) => {
          user.id = user._id;
          return user;
        });
        // now we need to pass the corrected users to the entity adapter to create entity. (normalize data)
        return userAdapter.setAll(initialState, loadedUsers);
      },
      // we are providing tags to the data fetched by the query because we need it for caching purposes. The data is cached with a tag name and we late can check if the cached data is mutated or not, this is done by the tags provided in the createApi function first, and then later those tags are provided to different data when it is fetched
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "User", id: "LIST" },
            ...result.ids.map((id) => ({ type: "User", id })),
          ];
        } else {
          return [{ type: "User", id: "LIST" }];
        }
      },
    }),
  }),
});

// this is the hook that is provided by RTK Query that we created Above
export const { useGetUsersQuery } = userApiSlice;

// now we will create some selectors, to create them we need to get the result of the Query and then we will apply soome built in redux methods to create soem built in Selectors

export const selectUserResult = userApiSlice.endpoints.getUsers.select();

// now we need to create a seletor that just have the data, the above will have the result, results include "data", "isError", and many more information about the query response

const selectUsersData = createSelector(
  selectUserResult,
  (userResult) => userResult.data
);

// now selectUsersData has the usersData (duh)

// now we need to create some built in selectors by RTK Query

export const {
  selectAll: selectAllUsers,
  selectById: selectUserById,
  selectIds: selectUsersIds,
} = userAdapter.getSelectors((state) => selectUsersData(state) ?? initialState);

// now lets break down what is happening, Well we are destructuring selectors provided by RTK Query or REDUX and renaming them for our convention, and the way we are creating these sleectors is using a getSelectors method that takes in "state" and then we pass the state to the selectUsersData selector. "??" are used that if the state is null then we just pass in the initialState.
