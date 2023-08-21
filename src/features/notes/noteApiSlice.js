import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const noteadapter = createEntityAdapter({});
const initialState = noteadapter.getInitialState();

export const noteApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotes: builder.query({
      query: () => "/notes",
      validateStatus: (response, result) => {
        return response.status && !result.isError;
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
          [{ type: "Note", id: "LIST" }];
        }
      },
    }),
  }),
});

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
