// ============================================================================
// ARQUIVO: frontend/tests/mocks/firebase.mock.ts
// ============================================================================

export const mockAuth = {
  currentUser: {
    uid: "user-test",
    email: "teste@unifei.br",
    getIdToken: vi.fn().mockResolvedValue("fake-token"),
  },
  signOut: vi.fn().mockResolvedValue(undefined),
};

export const mockDb = {};

export const mockStorage = {};
