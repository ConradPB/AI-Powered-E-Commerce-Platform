import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ProductCard from "@/components/ProductCard";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import type { Product } from "@/types/product";

describe("ProductCard", () => {
  const product: Product = {
    id: "1",
    title: "Test Product",
    price: 19.99,
    image: "/test.jpg",
    description: "A test product",
    category: "Test",
  };

  function renderWithRedux(ui: React.ReactNode) {
    store.dispatch({ type: "cart/clearCart" });
    return render(<Provider store={store}>{ui}</Provider>);
  }

  it("renders product info", () => {
    renderWithRedux(<ProductCard product={product} />);
    expect(screen.getByText("Test Product")).toBeInTheDocument();
    expect(screen.getByText("$19.99")).toBeInTheDocument();
  });

  it("dispatches addToCart on button click", () => {
    renderWithRedux(<ProductCard product={product} />);
    fireEvent.click(screen.getByLabelText(/Add Test Product to cart/i));
    // confirm item exists in store
    const items = store.getState().cart.items;
    expect(items.some((i) => i.title === product.title)).toBeTruthy();
  });
});
