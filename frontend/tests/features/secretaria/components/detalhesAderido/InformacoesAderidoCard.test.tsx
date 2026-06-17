import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { InformacoesAderidoCard } from "@/features/secretaria/components/detalhesAderido/InformacoesAderidoCard";
import type { AderidoSecretaria } from "@/features/secretaria/types";

const aderido: AderidoSecretaria = {
  id: "ADERIDO_001",
  nome: "gABRIEL da SILVA",
  email: "gabriel@teste.com",
  telefone: "35999999999",
  cpf: "12345678900",
  curso: "ENGENHARIA DE COMPUTAÇÃO",
  genero: "Masculino",
  data_nascimento: "2000-01-01",
  cargo: "aderido",
  status_cadastro: "ativo",
  modalidade_adesao: "completo",
};

describe("InformacoesAderidoCard", () => {
  it("Deve agrupar os dados em um único card hierárquico", () => {
    render(<InformacoesAderidoCard aderido={aderido} />);

    const card = screen.getByTestId("informacoes-aderido-card");

    expect(card).toBeInTheDocument();
    expect(within(card).getByText("Contato")).toBeInTheDocument();
    expect(within(card).getByText("Dados pessoais")).toBeInTheDocument();
    expect(within(card).getByText("Vínculo")).toBeInTheDocument();
    expect(within(card).getByText("Gabriel da Silva")).toBeInTheDocument();
    expect(within(card).getByText("123.456.789-00")).toBeInTheDocument();
    expect(within(card).getByText("(35) 99999-9999")).toBeInTheDocument();
  });

  it("Deve mostrar dados ausentes como não informados", () => {
    render(
      <InformacoesAderidoCard
        aderido={{
          ...aderido,
          telefone: "",
          cpf: "",
          curso: "",
        }}
      />,
    );

    const card = screen.getByTestId("informacoes-aderido-card");

    expect(within(card).getAllByText("Não informado").length).toBeGreaterThan(0);
  });
});
