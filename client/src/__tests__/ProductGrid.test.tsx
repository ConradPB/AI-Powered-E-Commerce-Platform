jest.mock("@/lib/supabase", () => ({
  getProducts: jest.fn(),
}));

import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import ProductGrid from "@/components/ProductGrid";
import * as supabaseLib from "@/lib/supabase";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import type { Product } from "@/types/product";

const mockGetProducts = supabaseLib.getProducts as jest.MockedFunction<
  () => Promise<{ data: Product[] | null; error: string | null }>
>;

const renderWithProvider = (ui: React.ReactElement) =>
  render(<Provider store={store}>{ui}</Provider>);

describe("ProductGrid", () => {
  const mockProducts: Product[] = [
    {
      id: "1",
      title: "Mock Product",
      description: "Mock description",
      price: 10,
      image: null,
      category: "Test",
    },
    {
      id: "2",
      title: "Another Product",
      description: "Second mock",
      price: 20,
      image: null,
      category: "Test",
    },
  ];

  beforeEach(() => {
    mockGetProducts.mockReset();
  });

  it("renders static title while loading", async () => {
    mockGetProducts.mockResolvedValueOnce({ data: [], error: null });

    await act(async () => {
      renderWithProvider(<ProductGrid />);
    });

    expect(screen.getByText(/Featured Products/i)).toBeInTheDocument();
  });

  it("renders products after fetching", async () => {
    mockGetProducts.mockResolvedValueOnce({ data: mockProducts, error: null });

    await act(async () => {
      renderWithProvider(<ProductGrid />);
    });

    await waitFor(() => {
      expect(screen.getByText("Mock Product")).toBeInTheDocument();
      expect(screen.getByText("Another Product")).toBeInTheDocument();
    });
  });

  it("renders empty grid if fetch fails", async () => {
    // silence console.error for this test
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});

    mockGetProducts.mockResolvedValueOnce({ data: null, error: "failed" });

    await act(async () => {
      renderWithProvider(<ProductGrid />);
    });

    await waitFor(() => {
      expect(screen.queryByText("Mock Product")).not.toBeInTheDocument();
    });

    spy.mockRestore();
  });
});
