import { createSlice } from "@reduxjs/toolkit";
import catalogData from "../../catalog.json"

export const catalogSlice = createSlice({
  name: "catalog",
  initialState: {
    catalogData
  },
  reducers: {
    setNewCatalog(state, action) {
      state.catalogData = action.payload;
  },
  },
});

export const { setNewCatalog } = catalogSlice.actions;
export default catalogSlice.reducer;
