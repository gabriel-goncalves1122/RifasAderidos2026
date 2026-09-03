// ============================================================================
// ARQUIVO: frontend/tests/features/secretaria/membros/components/detalhesAderido/FormEditarAderido.test.tsx
// ============================================================================
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { FormEditarAderido } from "@/features/secretaria/membros/components/detalhesAderido/FormEditarAderido";

const aderidoMock = {
  id: "ADERIDO_001",
  id_aderido: "ADERIDO_001",
  nome: "Gabriel Sampaio",
  email: "gabriel@email.com",
  telefone: "35999998888",
  cpf: "11122233344",
  curso: "ENGENHARIA DE COMPUTAÇÃO",
  genero: "Masculino",
  data_nascimento: "2003-01-01",
  dataNascimento: "2003-01-01",
  cargo: "aderido",
  modalidade_adesao: "completo",
  status_cadastro: "ativo",
  total_arrecadado: 150,
  rifas_vendidas: 15,
  meta_vendas: 150,
  uid: "UID_001",
} as any;

const formMock = {
  nome: "Gabriel Sampaio",
  email: "gabriel@email.com",
  telefone: "35999998888",
  cpf: "11122233344",
  curso: "ENGENHARIA DE COMPUTAÇÃO",
  genero: "Masculino",
  data_nascimento: "2003-01-01",
  cargo: "aderido",
} as any;

function renderFormEditarAderido(overrides?: {
  aderido?: any;
  form?: any;
  onChange?: any;
}) {
  const props = {
    aderido: overrides?.aderido || aderidoMock,
    form: overrides?.form || formMock,
    onChange: overrides?.onChange || vi.fn(),
  };

  render(<FormEditarAderido {...props} />);

  return props;
}

describe("Componente: FormEditarAderido", () => {
  it("Deve exibir status e modalidade como indicadores compactos", () => {
    renderFormEditarAderido();

    expect(screen.getByText("Status: Ativo")).toBeInTheDocument();
    expect(screen.getByText("Modalidade: Aderido completo")).toBeInTheDocument();
  });

  it("Deve organizar o formulário por seções", () => {
    renderFormEditarAderido();

    expect(screen.getByText("Contato")).toBeInTheDocument();
    expect(screen.getByText("Dados pessoais")).toBeInTheDocument();
    expect(screen.getByText("Vínculo")).toBeInTheDocument();
  });

  it("Deve renderizar os campos principais do formulário", () => {
    renderFormEditarAderido();

    expect(screen.getByLabelText(/nome/i)).toHaveValue("Gabriel Sampaio");
    expect(screen.getByLabelText(/e-mail/i)).toHaveValue("gabriel@email.com");
    expect(screen.getByLabelText(/cpf/i)).toHaveValue("111.222.333-44");
    expect(screen.getByLabelText(/telefone/i)).toHaveValue("(35) 99999-8888");
    expect(screen.getByLabelText(/data de nascimento/i)).toHaveValue(
      "2003-01-01",
    );
    expect(screen.getByLabelText(/gênero/i)).toHaveValue("Masculino");
  });

  it("Deve chamar onChange ao editar o nome", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    renderFormEditarAderido({ onChange });

    const campoNome = screen.getByLabelText(/nome/i);

    await user.clear(campoNome);
    await user.type(campoNome, "Ana");

    expect(onChange).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledWith("nome", expect.any(String));
  });

  it("Deve chamar onChange com CPF limpo ao editar CPF", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    renderFormEditarAderido({ onChange });

    const campoCpf = screen.getByLabelText(/cpf/i);

    await user.clear(campoCpf);
    await user.type(campoCpf, "22233344455");

    expect(onChange).toHaveBeenCalledWith("cpf", expect.any(String));
  });

  it("Deve chamar onChange com telefone limpo ao editar telefone", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    renderFormEditarAderido({ onChange });

    const campoTelefone = screen.getByLabelText(/telefone/i);

    await user.clear(campoTelefone);
    await user.type(campoTelefone, "35988887777");

    expect(onChange).toHaveBeenCalledWith("telefone", expect.any(String));
  });

  it("Nao deve renderizar modalidade e status como campos bloqueados", () => {
    renderFormEditarAderido();

    expect(screen.queryByLabelText(/modalidade/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/status/i)).not.toBeInTheDocument();
  });

  it("Deve alertar quando o curso salvo não existir na lista padronizada", () => {
    renderFormEditarAderido({
      form: {
        ...formMock,
        curso: "CURSO LEGADO",
      },
    });

    expect(
      screen.getByText(/não existe na lista padronizada/i),
    ).toBeInTheDocument();
  });
});
