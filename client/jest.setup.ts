import "@testing-library/jest-dom";

/**
 * Safe defaults for tests so any module imports that attempt to create
 * a real Supabase client don't blow up in CI where envs may be unspecified.
 */
process.env.NEXT_PUBLIC_SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "http://localhost";
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "anon";
