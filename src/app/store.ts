import { configureStore } from "@reduxjs/toolkit";
import catalogReducer from "../features/slices/catalogSlice";
import basketReduser from "../features/slices/basketSlice";
import userReduser from "../features/slices/userSlice";

export const store = configureStore({
    reducer: {
        catalog: catalogReducer,
        basket: basketReduser,
        user: userReduser
    },
});
