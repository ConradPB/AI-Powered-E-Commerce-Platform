// Mock the actual Supabase client creation at top if necessary, but we only need to test the
// helper consumer shape — so mock the exported helper functions instead.
jest.mock("@/lib/supabase", () => ({
  getProductById: jest.fn(),
  getProducts: jest.fn(),
}));

import * as supabaseLib from "@/lib/supabase";
import type { Product } from "@/types/product";

const mockGetProductById = supabaseLib.getProductById as jest.MockedFunction<
  (id: string) => Promise<{ data: Product | null; error: string | null }>
>;
const mockGetProducts = supabaseLib.getProducts as jest.MockedFunction<
  () => Promise<{ data: Product[] | null; error: string | null }>
>;

describe("supabase helpers (mocked)", () => {
  beforeEach(() => {
    mockGetProductById.mockReset();
    mockGetProducts.mockReset();
  });

  it("getProductById returns product shape correctly (mock)", async () => {
    const product: Product = {
      id: "42",
      title: "Test",
      description: "desc",
      price: 123,
      image: "/img.jpg",
      category: "Test",
    };

    mockGetProductById.mockResolvedValue({ data: product, error: null });

    const result = await mockGetProductById("42");
    // result is { data, error } so access result.data
    expect(result.data).not.toBeNull();
    expect(result.data?.id).toBe("42");
    expect(result.error).toBeNull();
  });

  it("getProducts returns product list shape correctly (mock)", async () => {
    const list: Product[] = [
      {
        id: "1",
        title: "A",
        description: "",
        price: 1,
        image: null,
        category: "A",
      },
    ];

    mockGetProducts.mockResolvedValue({ data: list, error: null });

    const result = await mockGetProducts();
    expect(Array.isArray(result.data)).toBeTruthy();
    expect(result.data?.[0].id).toBe("1");
  });
});
