# Guia De Estilos

## Objetivo

Documentar como estilos sao aplicados no frontend: tema MUI global, tokens de
design e o padrao `styles/` por feature.

## Tema Global (MUI)

`src/app/theme.ts` define o tema MUI unificado:

```ts
// Paleta
primary: verdeEscuro (#063D31)
secondary: verdeClaro (#4A7C6F)
background: fundoSuave (#F6F8F7)

// Tipografia
fontFamily: Montserrat (fallback sans-serif)
```

O tema e aplicado via `ThemeProvider` em `main.tsx`. Componentes usam `sx` ou
`styled` com acesso ao tema (`theme.palette.primary.main`, etc.).

## Padrao `styles/` Por Feature

Features podem ter uma pasta `styles/` com objetos sx centralizados:

```txt
styles/
├── colors.ts       → Paleta da feature (ex: colors.verdeEscuro)
├── surfaces.ts     → Papeis, dialogs, cartoes
├── typography.ts   → Titulos, labels, chipStatus(status)
├── components.ts   → Botoes, chips, tabela
└── layout.ts       → Containers, grids, responsivo
```

### Colors

```ts
export const colors = {
  verdeEscuro: "#063D31",
  pretoEsverdeado: "#021B16",
  cinzaTexto: "#526760",
  fundoSuave: "#F6F8F7",
  verdeClaro: "#EAF3EF",
  branco: "#FFFFFF",
};
```

### Surfaces

```ts
export const paper = {
  bgcolor: colors.branco,
  borderRadius: 2,
  boxShadow: "0px 2px 8px rgba(0,0,0,0.08)",
};

export function cartaoResumo(destaque?: boolean) {
  return {
    bgcolor: destaque ? colors.verdeClaro : colors.branco,
    // ...
  };
}
```

### Typography

```ts
export const titulo = { fontWeight: 600, color: colors.verdeEscuro };

export function chipStatus(status: string) {
  return {
    bgcolor: status === "aprovado" ? colors.verdeClaro : "#FFF3E0",
    color: status === "aprovado" ? colors.verdeEscuro : "#E65100",
  };
}
```

### Uso Em Componentes

```tsx
import { colors } from "../../styles/colors";
import { surfaces } from "../../styles/surfaces";
import { typography } from "../../styles/typography";

<Paper sx={{ ...surfaces.paper, ...typography.titulo }}>
  {children}
</Paper>
```

## Regras

- Nao coloque logica de estado ou regra de negocio em `styles/`.
- Nao importe `styles/` de hooks, services ou utils.
- Cores hex literais no JSX so sao aceitas se nao houver token correspondente.
- Funcoes estilo `chipStatus(status)` permitem estilo condicional sem if no JSX.
- Features sem `styles/` podem usar `sx` inline livremente.

## Adicional: Design Tokens (Aderidos)

A feature `aderidos` possui `tokens/` com design tokens inspirados em sistema
de design:

```txt
tokens/
├── colors.ts       → Paleta
├── typography.ts   → Escala tipografica
├── motion.ts       → Transicoes
└── index.ts        → Barrel export
```

Tokens sao valores puros (nao objetos sx). Diferenca:

| Token | styles/ | tokens/ |
| --- | --- | --- |
| Conteudo | Objetos sx prontos para spread | Valores primitivos (cores, espacos) |
| Uso | `sx={{ ...surfaces.paper }}` | `const color = tokens.colors.primary` |
| Abstração | Estilo completo | Apenas o valor |

## Identidade Visual

- **Paleta principal**: verde escuro (#063D31). Nao use azul ou roxo vibrante.
- **Background de pagina**: fundo suave (#F6F8F7).
- **Cards e superficies**: branco com sombra leve.
- **Status**: verde para aprovado, laranja para pendente, vermelho para negado.
- **Tipografia**: Montserrat, pesos 400/500/600/700.

## Testes Relacionados

- `tests/shared/components/*` (testam componentes com estilos aplicados)
- Testes visuais sao feitos via teste de componente (RTL verifica presenca,
  nao cor exata)
