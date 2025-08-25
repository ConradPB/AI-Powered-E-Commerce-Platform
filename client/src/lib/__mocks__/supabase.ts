import type { Product } from "@/types/product";

const SAMPLE_PRODUCTS: Product[] = [
  {
    id: "1",
    title: "Mock Product",
    description: "A mock product",
    price: 9.99,
    image: "/fallback-image.jpg",
    category: "Mocks",
  },
  {
    id: "2",
    title: "Another Product",
    description: "Another mock product",
    price: 14.5,
    image: "/fallback-image.jpg",
    category: "Mocks",
  },
];

// Return shape consistent with your helpers: { data: T | null, error: string | null }
const getProducts = jest.fn(async () => {
  return { data: SAMPLE_PRODUCTS, error: null } as {
    data: Product[] | null;
    error: string | null;
  };
});

const getProductById = jest.fn(async (id: string) => {
  const p = SAMPLE_PRODUCTS.find((x) => String(x.id) === String(id)) ?? null;
  return { data: p, error: null } as {
    data: Product | null;
    error: string | null;
  };
});

const getRecommendations = jest.fn(async (id: string, count = 4) => {
  const recs = SAMPLE_PRODUCTS.filter((p) => String(p.id) !== String(id)).slice(
    0,
    count
  );
  return { data: recs, error: null } as {
    data: Product[] | null;
    error: string | null;
  };
});

export { getProducts, getProductById, getRecommendations };
