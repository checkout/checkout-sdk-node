import prettier from "eslint-config-prettier";

export default [
  {
    ignores: [
      "coverage/",
      "dist/",
      "examples/",
      "test/",
      "node_modules/",
      "types/"
    ],
  },
  {
    files: ["src/**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
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
    }
  },
  prettier
];