// ============================================================================
// ARQUIVO: frontend/src/setupTests.ts
// ============================================================================
import "@testing-library/jest-dom/vitest";

// Mock mínimo do Storage para testes que importam a configuração Firebase.
vi.mock("firebase/storage", () => ({
  getStorage: vi.fn(() => ({})),
  connectStorageEmulator: vi.fn(),
  ref: vi.fn(),
  uploadBytes: vi.fn(),
  uploadBytesResumable: vi.fn(),
  getDownloadURL: vi.fn(),
}));
