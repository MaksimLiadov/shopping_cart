import { configureStore } from "@reduxjs/toolkit";
import catalogReducer from "../features/slices/catalogSlice";
import basketReduser from "../features/slices/basketSlice";

export const store = configureStore({
    reducer: {
        catalog: catalogReducer,
        basket: basketReduser
    },
});
