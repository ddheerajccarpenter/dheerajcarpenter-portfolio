import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // In Next.js 15 + React 19, setState in effect for mounting and controlled resets
      // is standard for client components. Turn off compiler warning.
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/incompatible-library": "off",
      "react-hooks/exhaustive-deps": "off",
      // Allow standard <img> for dynamic user-uploaded blob previews and admin thumbnails
      "@next/next/no-img-element": "off",
      // Unused variables should not fail or pollute the lint output
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
]);

export default eslintConfig;
