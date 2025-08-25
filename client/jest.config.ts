import type { Config } from "jest";
import nextJest from "next/jest";

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig: Config = {
  testEnvironment: "jest-environment-jsdom",
  moduleDirectories: ["node_modules", "<rootDir>/src"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@/lib/supabase$": "<rootDir>/src/__mocks__/supabase.ts",
  },
  testMatch: [
    "**/_tests_/**/*.test.[jt]s?(x)",
    "**/__tests__/**/*.test.[jt]s?(x)",
  ],
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.{ts,tsx}"],
  coverageReporters: ["text", "lcov", "json", "html"], // mutable now
};

export default createJestConfig(customJestConfig);
