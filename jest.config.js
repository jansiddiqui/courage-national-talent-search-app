/** @type {import('jest').Config} */
const config = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.test.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: {
          esModuleInterop: true,
          allowSyntheticDefaultImports: true,
          strict: false,
          resolveJsonModule: true,
        },
      },
    ],
  },
  transformIgnorePatterns: [
    // Transform uuid since it uses ESM in this version
    "/node_modules/(?!uuid/)",
  ],
  clearMocks: true,
  resetModules: true,
};

module.exports = config;

