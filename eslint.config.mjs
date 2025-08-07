import js from "@eslint/js";
import globals from "globals";

export default [
  js.configs.recommended,
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.mocha,
        expect: "readonly",
        page: "readonly",
        xlsx: "readonly",
        excelFileRowID: "readonly",
        pageClassName: "readonly",
        element: "readonly"
      }
    },
    rules: {
      "indent": ["error", 2],
      "quotes": ["error", "single"],
      "semi": ["error", "always"],
      "no-unused-vars": ["warn", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }],
      "no-console": "off", // Allow console.log in automation scripts
      "no-debugger": "error",
      "no-trailing-spaces": "error",
      "eol-last": "error",
      "comma-dangle": ["error", "never"],
      "object-curly-spacing": ["error", "always"],
      "array-bracket-spacing": ["error", "never"],
      "keyword-spacing": ["error", { "before": true, "after": true }],
      "space-before-blocks": "error",
      "brace-style": ["error", "1tbs"],
      "camelcase": ["warn", { "properties": "never" }],
      "no-var": "error",
      "prefer-const": "error",
      "no-case-declarations": "warn",
      "no-dupe-class-members": "warn"
    }
  },
  {
    ignores: [
      "node_modules/**",
      "reports/**",
      "allure-results/**",
      "allure-report/**",
      "logs/**",
      "dist/**",
      "build/**",
      "coverage/**",
      "*.tmp",
      "*.temp",
      ".tmp/**",
      ".temp/**"
    ]
  }
];
