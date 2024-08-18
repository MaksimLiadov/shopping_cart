import { createSlice } from "@reduxjs/toolkit";
import catalogData from "../../catalog.json"

export const catalogSlice = createSlice({
  name: "catalog",
  initialState: {
    catalogData
  },
  reducers: {
  },
});

export const { } = catalogSlice.actions;
export default catalogSlice.reducer;
