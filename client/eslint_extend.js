export default {
  rules: {
    "no-console": "off",
    "react/react-in-jsx-scope": "off",
    "no-multiple-empty-lines": [
      "error",
      {
        max: 1, // Maximum number of consecutive blank lines
        maxEOF: 1, // Maximum number of newlines at the end of the file
        maxBOF: 0, // Maximum number of newlines at the beginning of the file
      },
    ],
    "key-spacing": [
      "error",
      {
        beforeColon: false,
        afterColon: true,
        mode: "strict",
      },
    ],
    "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" } ],
    "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" } ],
    "no-trailing-spaces": "warn"
  },
};
