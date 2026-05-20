// ============================================================================
// ARQUIVO: frontend/tests/mocks/storage.mock.ts
// ============================================================================

export const mockStorageRef = "mock-storage-ref";

export const mockUploadBytesResumable = vi.fn();
export const mockGetDownloadURL = vi.fn();
export const mockRef = vi.fn(() => mockStorageRef);
