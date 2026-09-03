# Documentacao Tecnica Do Frontend

## Objetivo

Esta pasta documenta o codigo frontend do `sistema-rifas`.

Os arquivos aqui explicam o estado real da implementacao: arquitetura, fluxos,
contratos de API consumidos, responsabilidades dos modulos, componentes
principais e testes relacionados. Complementam os `AGENTS.md`, que continuam
sendo guias de decisao para agentes e futuras mudancas.

## Modulos Documentados

| Modulo | Documento | Estado |
| --- | --- | --- |
| Arquitetura | [arquitetura.md](arquitetura.md) | Documentado |
| Aderidos | [modulos/aderidos.md](modulos/aderidos.md) | Documentado |
| Tesouraria | [modulos/tesouraria.md](modulos/tesouraria.md) | Documentado |
| Auth | [modulos/auth.md](modulos/auth.md) | Documentado |
| Secretaria | [modulos/secretaria.md](modulos/secretaria.md) | Documentado |
| Premios | [modulos/premios.md](modulos/premios.md) | Documentado |
| Shared | [modulos/shared.md](modulos/shared.md) | Documentado |
| Estilos | [padroes/estilos.md](padroes/estilos.md) | Documentado |
| Testes | [padroes/testes.md](padroes/testes.md) | Documentado |

## Padrao De Documentacao

Cada documento de modulo deve seguir este formato:

```txt
# Nome Do Modulo

## Objetivo
O que este modulo faz.

## Arquivos Envolvidos
Tabela das areas e arquivos principais.

## Fluxo
Como os dados ou interacoes percorrem os componentes.

## Imports E Dependencias
Dependencias-chave e por que existem.

## Componentes E Hooks
Tabela com nome, responsabilidade, props principais.

## Regras E Cuidados
Contratos, performance, seguranca e armadilhas.

## Testes Relacionados
Arquivos de teste que protegem esse comportamento.
```

## Como Usar

- Leia o README do modulo para entender o dominio.
- Leia `arquitetura.md` antes de mudar a estrutura de pastas ou rotas.
- Leia `padroes/estilos.md` antes de adicionar estilos.
- Leia `padroes/testes.md` antes de escrever ou modificar testes.

## Limites

Documentacao nao substitui testes nem configuracao de CI. Nao altere
autenticacao, Firebase config, `.env` ou integracoes externas apenas porque
um documento menciona esses pontos.
