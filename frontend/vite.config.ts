// ============================================================================
// ARQUIVO: frontend/vite.config.ts
// ============================================================================
import path from "node:path";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      // Evita imports relativos frágeis dentro de tests/features/*.
      "@": path.resolve(__dirname, "./src"),
      "@tests": path.resolve(__dirname, "./tests"),
    },
  },

  test: {
    globals: true,
    environment: "happy-dom",
    setupFiles: "./src/setupTests.ts",
    include: ["tests/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["node_modules", "dist", "coverage", "tests/e2e/**"],
    clearMocks: true,
    restoreMocks: true,
  },

  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          "vendor-mui": ["@mui/material", "@mui/icons-material", "@emotion/react", "@emotion/styled"],
          "vendor-firebase": ["firebase"],
          "vendor-framer": ["framer-motion"],
          "vendor-utils": ["axios", "yup", "papaparse", "clsx", "tailwind-merge", "phosphor-react", "recharts"]
        },
      },
    },
  },
});
