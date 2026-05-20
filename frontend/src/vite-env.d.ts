// ============================================================================
// ARQUIVO: frontend/src/vitest.d.ts
// ============================================================================

/// <reference types="vitest/globals" />
/// <reference types="@testing-library/jest-dom" />

// Permite imports diretos de CSS com noUncheckedSideEffectImports ativo.
declare module "*.css";

// Permite imports de imagens usadas pela aplicação.
declare module "*.png";
declare module "*.jpg";
declare module "*.jpeg";
declare module "*.svg";
declare module "*.webp";
