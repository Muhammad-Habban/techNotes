import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const noteadapter = createEntityAdapter({});
const initialState = noteadapter.getInitialState();

export const noteApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotes: builder.query({
      query: () => "/notes",
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      transformResponse: (responseData) => {
        const loadedNotes = responseData.map((note) => {
          note.id = note._id;
          return note;
        });
        return noteadapter.setAll(initialState, loadedNotes);
      },
      providesTags: (result, error, args) => {
        if (result?.ids) {
          return [
            { type: "Note", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Note", id })),
          ];
        } else {
          return [{ type: "Note", id: "LIST" }];
        }
      },
    }),
    addNewNote: builder.mutation({
      query: (initialData) => ({
        url: "/notes",
        method: "POST",
        body: {
          ...initialData,
        },
      }),
      invalidatesTags: [{ type: "Note", id: "LIST" }],
    }),
    updateNote: builder.mutation({
      query: (initialData) => ({
        url: "/notes",
        method: "PATCH",
        body: {
          ...initialData,
        },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Note", id: arg.id }],
    }),
    deleteNote: builder.mutation({
      query: ({ id }) => ({
        url: "/notes",
        method: "DELETE",
        body: {
          id,
        },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Note", id: arg.id }],
    }),
  }),
});

export const {
  useGetNotesQuery,
  useAddNewNoteMutation,
  useDeleteNoteMutation,
  useUpdateNoteMutation,
} = noteApiSlice;

export const selectNoteResult = noteApiSlice.endpoints.getNotes.select();

const selectNoteData = createSelector(
  selectNoteResult,
  (notesData) => notesData.data
);

export const {
  selectAll: selectAllNotes,
  selectById: selectNoteById,
  selectIds: selectNotesIds,
} = noteadapter.getSelectors((state) => selectNoteData(state) ?? initialState);
