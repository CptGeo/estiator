import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import eslint_extend from "./eslint_extend.js";
import pluginQuery from "@tanstack/eslint-plugin-query";

export default [
  { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"] },
  { languageOptions: { globals: globals.browser } },
  { ignores: ["node_modules", "dist"] },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginQuery.configs["flat/recommended"],
  pluginReact.configs.flat.recommended,
  {
    settings: {
      react: {
        version: "detect", // Automatically detect the React version
      },
    },
  },
  // here all rules can be overriden
  eslint_extend,
];
