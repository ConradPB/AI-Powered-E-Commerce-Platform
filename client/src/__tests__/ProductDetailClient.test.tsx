import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ProductDetailClient from "@/components/ProductDetailClient";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import type { Product } from "@/types/product";

describe("ProductDetailClient", () => {
  const mockProduct: Product = {
    id: "1",
    title: "Test Product",
    description: "This is a test product",
    price: 49.99,
    image: "https://placehold.co/400x300",
    category: "Test",
  };

  function renderWithStore(ui: React.ReactNode) {
    // make sure cart is clean for each test
    store.dispatch({ type: "cart/clearCart" });
    return render(<Provider store={store}>{ui}</Provider>);
  }

  it("renders product details correctly", () => {
    renderWithStore(<ProductDetailClient product={mockProduct} />);
    expect(screen.getByText("Test Product")).toBeInTheDocument();
    expect(screen.getByText("This is a test product")).toBeInTheDocument();
    expect(screen.getByText("$49.99")).toBeInTheDocument();
  });

  it("dispatches addToCart when Add to cart is clicked", () => {
    renderWithStore(<ProductDetailClient product={mockProduct} />);
    const addButton = screen.getByRole("button", { name: /Add to cart/i });
    fireEvent.click(addButton);

    const items = store.getState().cart.items;
    const added = items.find((it) => String(it.id) === mockProduct.id);
    expect(added).toBeTruthy();
    expect(added?.quantity).toBeGreaterThanOrEqual(1);
  });

  it("renders recommendations when initialRecs are provided", () => {
    const recs: Product[] = [
      {
        id: "2",
        title: "Rec 1",
        price: 10,
        image: null,
        description: "",
        category: "Test",
      },
      {
        id: "3",
        title: "Rec 2",
        price: 20,
        image: null,
        description: "",
        category: "Test",
      },
    ];

    renderWithStore(
      <ProductDetailClient product={mockProduct} initialRecs={recs} />
    );
    expect(screen.getByText("Rec 1")).toBeInTheDocument();
    expect(screen.getByText("Rec 2")).toBeInTheDocument();
  });
});
