# Documentacao Tecnica Do Backend

## Objetivo

Esta pasta documenta o codigo backend do `sistema-rifas`.

Os arquivos aqui explicam o estado real da implementacao: contratos de API,
fluxos internos, responsabilidades das camadas, imports importantes, funcoes
principais e testes relacionados. Esta documentacao complementa os `AGENTS.md`,
que continuam sendo guias de decisao para agentes e futuras mudancas.

## Modulos Documentados

| Modulo | Documento | Estado |
| --- | --- | --- |
| Tesouraria | [modules/tesouraria/README.md](modules/tesouraria/README.md) | Documentado |

## Padrao De Documentacao

Cada modulo deve seguir este formato:

```txt
# Nome Do Documento

## Objetivo
O que este pedaco do backend faz.

## Arquivos Envolvidos
Lista curta dos arquivos principais.

## Fluxo
Como a requisicao ou operacao passa pelas camadas.

## Imports E Dependencias
Imports importantes e por que existem.

## Funcoes E Metodos
Tabela com nome, responsabilidade, entrada, saida e observacoes.

## Regras E Cuidados
Contratos, compatibilidade, auth, Firestore e limites.

## Testes Relacionados
Arquivos de teste que protegem esse comportamento.
```

## Como Usar

- Leia o `README.md` do modulo para entender o dominio.
- Leia `api.md` antes de alterar endpoints, middlewares ou payloads.
- Leia `services.md` antes de alterar regra de negocio ou consultas Firestore.
- Leia documentos de `legacy` antes de mover ou reaproveitar codigo antigo.

## Limites

Documentacao nao substitui testes nem autorizacao para mudancas sensiveis.
Nao altere Firebase rules, Auth, `.env`, credenciais ou integracoes externas
apenas porque um documento menciona esses pontos.
