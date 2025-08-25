import cartReducer, {
  addToCart,
  removeFromCart,
  updateQuantity,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
  type CartItem,
  type CartState,
} from "@/redux/cartSlice";

describe("cartSlice reducer", () => {
  const initialState: CartState = { items: [] };

  const sampleItem: CartItem = {
    id: "1",
    title: "Sample Product",
    price: 100,
    image: "sample.jpg",
    quantity: 1,
  };

  it("should return the initial state", () => {
    expect(cartReducer(undefined, { type: "" })).toEqual(initialState);
  });

  it("should handle addToCart (new item)", () => {
    const nextState = cartReducer(initialState, addToCart(sampleItem));
    expect(nextState.items).toHaveLength(1);
    expect(nextState.items[0]).toEqual(sampleItem);
  });

  it("should handle addToCart (increase quantity if exists)", () => {
    const stateWithItem: CartState = { items: [sampleItem] };
    const nextState = cartReducer(
      stateWithItem,
      addToCart({ ...sampleItem, quantity: 2 })
    );
    expect(nextState.items[0].quantity).toBe(3);
  });

  it("should handle removeFromCart", () => {
    const stateWithItem: CartState = { items: [sampleItem] };
    const nextState = cartReducer(stateWithItem, removeFromCart("1"));
    expect(nextState.items).toHaveLength(0);
  });

  it("should handle updateQuantity", () => {
    const stateWithItem: CartState = { items: [sampleItem] };
    const nextState = cartReducer(
      stateWithItem,
      updateQuantity({ id: "1", quantity: 5 })
    );
    expect(nextState.items[0].quantity).toBe(5);
  });

  it("should handle increaseQuantity", () => {
    const stateWithItem: CartState = { items: [sampleItem] };
    const nextState = cartReducer(stateWithItem, increaseQuantity("1"));
    expect(nextState.items[0].quantity).toBe(2);
  });

  it("should handle decreaseQuantity (when quantity > 1)", () => {
    const stateWithItem: CartState = {
      items: [{ ...sampleItem, quantity: 3 }],
    };
    const nextState = cartReducer(stateWithItem, decreaseQuantity("1"));
    expect(nextState.items[0].quantity).toBe(2);
  });

  it("should not decreaseQuantity below 1", () => {
    const stateWithItem: CartState = { items: [sampleItem] };
    const nextState = cartReducer(stateWithItem, decreaseQuantity("1"));
    expect(nextState.items[0].quantity).toBe(1);
  });

  it("should handle clearCart", () => {
    const stateWithItem: CartState = { items: [sampleItem] };
    const nextState = cartReducer(stateWithItem, clearCart());
    expect(nextState.items).toHaveLength(0);
  });
});
