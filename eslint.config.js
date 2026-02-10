import prettier from "eslint-config-prettier";

export default [
  {
    ignores: [
      "coverage/",
      "dist/",
      "examples/",
      "test/",
      "node_modules/",
      "types/",
      "src/services/http.js"
    ],
  },
  {
    files: ["src/**/*.js"],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: "module",
      globals: {
        URL: "readonly",
        URLSearchParams: "readonly",
        Buffer: "readonly",
        process: "readonly",
        fetch: "readonly"
      }
    },
    rules: {
      "no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
      "no-console": "off",
      "prefer-const": "error",
      "no-var": "error",
      "eqeqeq": ["error", "always", { "null": "ignore" }],
      "no-throw-literal": "error",
      "prefer-promise-reject-errors": "error"
    }
  },
  prettier
];