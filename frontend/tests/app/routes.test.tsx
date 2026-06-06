// ============================================================================
// ARQUIVO: frontend/tests/app/routes.test.tsx
// ============================================================================
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import { AppRoutes } from "@/app/routes";

vi.mock("firebase/auth", () => ({
  onAuthStateChanged: vi.fn(),
}));

vi.mock("@/shared/config/firebase", () => ({
  auth: {},
}));

vi.mock("@/features/auth/pages/LoginPage", () => ({
  LoginPage: () => <div>Pagina de Login</div>,
}));

vi.mock("@/features/auth/pages/RegisterPage", () => ({
  RegisterPage: () => <div>Pagina de Registro</div>,
}));

vi.mock("@/views/pages/DashboardPage", () => ({
  DashboardPage: () => <div>Dashboard</div>,
}));

describe("Rotas da aplicação", () => {
  it("Deve renderizar LoginPage em /login", () => {
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <AppRoutes />
      </MemoryRouter>,
    );

    expect(screen.getByText("Pagina de Login")).toBeInTheDocument();
  });
});
