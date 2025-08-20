"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useAppDispatch } from "@/redux/hooks";
import { addToCart } from "@/redux/cartSlice";
import type { Product } from "@/types/product";

export type ProductDetailClientProps = {
  product: {
    id: string;
    title: string;
    price: number;
    image: string | null;
  };
  /** New preferred prop */
  recommendations?: Product[];
  /** Back-compat: older usage can still pass this */
  initialRecs?: Product[];
  /** Optional async fetcher if you want client-side fetching */
  fetchRecs?: (id: string, count?: number) => Promise<Product[]>;
};

export default function ProductDetailClient({
  product,
  recommendations,
  initialRecs,
  fetchRecs,
}: ProductDetailClientProps) {
  const dispatch = useAppDispatch();

  // normalize incoming recs
  const seeded = useMemo(
    () => recommendations ?? initialRecs ?? [],
    [recommendations, initialRecs]
  );
  const [recs, setRecs] = useState<Product[]>(seeded);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (!product || !fetchRecs) return;

    if (recs.length === 0) {
      fetchRecs(product.id, 4)
        .then((r) => setRecs(r ?? []))
        .catch(() => setRecs([]));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id, fetchRecs]);

  function handleAdd(qty = 1) {
    setAdding(true);
    dispatch(
      addToCart({
        id: product.id,
        title: product.title,
        price: product.price,
        image: imgSrc,
        quantity: qty,
      })
    );
    setTimeout(() => setAdding(false), 250);
  }

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
      {/* Left: image */}
      <div className="relative w-full h-[420px] rounded-lg overflow-hidden shadow">
        <Image
          src={imgSrc}
          alt={product.title || "Product image"}
          fill
          style={{ objectFit: "cover" }}
          priority
        />
      </div>

      {/* Right: info */}
      <div>
        <h1 className="text-2xl font-bold">{product.title}</h1>
        <p className="text-indigo-600 text-xl font-semibold mb-4">
          ${product.price.toFixed(2)}
        </p>

        <p className="text-gray-700 mb-6">
          A high-quality product — description to come later.
        </p>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleAdd(1)}
            disabled={adding}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md shadow hover:bg-indigo-700 transition"
          >
            {adding ? "Adding..." : "Add to cart"}
          </button>

          <a
            href="/cart"
            className="border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50"
          >
            Go to cart
          </a>
        </div>

        {/* Recommendations */}
        <section className="mt-10">
          <h3 className="text-lg font-semibold mb-3">You might also like</h3>
          {recs.length === 0 ? (
            <p className="text-sm text-gray-500">No recommendations yet.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {recs.map((r) => {
                const rImg = r.image ?? "/fallback-image.jpg";
                return (
                  <a
                    key={String(r.id)}
                    href={`/product/${r.id}`}
                    className="bg-white rounded-md shadow-sm overflow-hidden hover:shadow transition block"
                  >
                    <div className="relative w-full h-28">
                      <Image
                        src={rImg}
                        alt={r.title || "Recommended product"}
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                    <div className="p-2">
                      <h4 className="text-sm font-medium truncate">
                        {r.title}
                      </h4>
                      <p className="text-xs text-indigo-600">
                        ${r.price.toFixed(2)}
                      </p>
                    </div>
                  </a>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
