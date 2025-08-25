// Mock supabase BEFORE importing the page module (prevents creating a real client)
jest.mock("@/lib/supabase", () => ({
  getProducts: jest.fn(),
}));

import React from "react";
import { render, screen } from "@testing-library/react";
import * as supabaseLib from "@/lib/supabase";
import HomePage from "@/app/page";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import type { Product } from "@/types/product";

// ensure the mock typing matches the real function signature
const mockGetProducts = supabaseLib.getProducts as jest.MockedFunction<
  () => Promise<{ data: Product[] | null; error: string | null }>
>;

describe("Home Page", () => {
  const fakeProducts: Product[] = [
    {
      id: "1",
      title: "Laptop",
      price: 999.99,
      image: "https://placehold.co/400x300",
      description: "",
      category: "General",
    },
    {
      id: "2",
      title: "Headphones",
      price: 99.99,
      image: "https://placehold.co/400x300",
      description: "",
      category: "General",
    },
  ];

  beforeEach(() => {
    mockGetProducts.mockReset();
  });

  it("renders product cards without crashing", async () => {
    // mock the function to resolve to the expected { data, error } shape
    mockGetProducts.mockResolvedValue({ data: fakeProducts, error: null });

    const page = await HomePage();
    render(<Provider store={store}>{page}</Provider>);

    for (const product of fakeProducts) {
      expect(await screen.findByText(product.title)).toBeInTheDocument();
      expect(
        screen.getByText(`$${product.price.toFixed(2)}`)
      ).toBeInTheDocument();
    }
  });

  it("shows error message when products fail to load", async () => {
    mockGetProducts.mockResolvedValue({ data: null, error: "Failed" });

    const page = await HomePage();
    render(<Provider store={store}>{page}</Provider>);

    expect(
      await screen.findByText(/Failed to load products/i)
    ).toBeInTheDocument();
  });
});
