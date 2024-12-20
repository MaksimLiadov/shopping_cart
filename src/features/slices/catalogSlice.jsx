import { createSlice } from "@reduxjs/toolkit";
import catalogData from "../../catalog.json";

export const catalogSlice = createSlice({
  name: "catalog",
  initialState: {
    catalogData,
    orderBuilder: {},
  },
  reducers: {
    setNewCatalog(state, action) {
      state.catalogData = action.payload;
    },
    setNewOrderBuilder(state, action) {
      state.orderBuilder = action.payload;
    },
  },
});

export const { setNewCatalog, setNewOrderBuilder } = catalogSlice.actions;
export default catalogSlice.reducer;
