import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../slice/CartSlice";
import whishlistReducer from "../slice/whishlistSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    whishlist:whishlistReducer,
  },
});