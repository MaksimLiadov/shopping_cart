import { createSlice } from "@reduxjs/toolkit";

export const basketSlice = createSlice({
    name: "basket",
    initialState: {
        basketItems: [],
    },
    reducers: {
        addProduct(state, action) {
            const { product, amount } = action.payload;
            const { name: productName, price: productPrice } = product;
            const existingProduct = state.basketItems.find((item) => item.productName === productName);
            if (existingProduct) {
                existingProduct.amount += amount;
            } else {
                state.basketItems.push({ productName, productPrice, amount });
            }
        },
        removeProduct(state, action) {
            const productName = action.payload.rowData.productName;
            state.basketItems = state.basketItems.filter((item) => item.productName !== productName);
        },
        removeAllProduct(state) {
            state.basketItems = [];
        },
    },
});

export const { addProduct, removeProduct, removeAllProduct } = basketSlice.actions;
export default basketSlice.reducer;