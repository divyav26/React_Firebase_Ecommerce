import { createSlice, PayloadAction } from '@reduxjs/toolkit';


interface CartItem {
  id: string;
  name: string;
  price: number;
  img: string;
  quantity: number;
  discountedPrice: number;
  costPrice: number;
}

interface CartState {
  items: CartItem[];
  subprice: number;
  totalQuantity: number;
  totalPrice: number;
}

const initialState: CartState = {
  items: [],
  subprice: 0,
  totalQuantity: 0,
  totalPrice: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const item = action.payload;
      const existingItem = state.items.find((i) => i.id === item.id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...item, quantity: 1 });
      }

      state.totalQuantity += 1;
      state.subprice += item.price;
      state.totalPrice += item.discountedPrice;
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      const itemId = action.payload;
      const itemIndex = state.items.findIndex((i) => i.id === itemId);

      if (itemIndex !== -1) {
        const item = state.items[itemIndex];
        state.totalQuantity -= item.quantity;
        state.subprice -= item.price * item.quantity;
        state.totalPrice -= item.discountedPrice * item.quantity;
        state.items.splice(itemIndex, 1);
      }
    },
    increment: (state, action: PayloadAction<string>) => {
      const itemId = action.payload;
      const item = state.items.find((i) => i.id === itemId);

      if (item) {
        item.quantity += 1;
        state.totalQuantity += 1;
        state.subprice += item.price;
        state.totalPrice += item.discountedPrice;
      }
    },
    decrement: (state, action: PayloadAction<string>) => {
      const itemId = action.payload;
      const item = state.items.find((i) => i.id === itemId);

      if (item && item.quantity > 1) {
        item.quantity -= 1;
        state.totalQuantity -= 1;
        state.subprice -= item.price;
        state.totalPrice -= item.discountedPrice;
      } else if (item) {
        state.items = state.items.filter((i) => i.id !== itemId);
        state.totalQuantity -= 1;
        state.subprice -= item.price;
        state.totalPrice -= item.discountedPrice;
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.subprice = 0;
      state.totalPrice = 0;
    },
  },
});

export const { addToCart, removeFromCart, increment, decrement, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
