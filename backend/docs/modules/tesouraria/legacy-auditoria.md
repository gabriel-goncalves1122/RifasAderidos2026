# Legacy De Auditoria

## Objetivo

Documentar o isolamento do fluxo antigo de auditoria OCR/IA/manual dentro de
`modules/tesouraria/legacy/auditoria`.

Esse codigo continua atendendo os endpoints `/auditorias/*`, mas nao deve ser
usado como base para novas features de Pix ou tesouraria.

## Arquivos Envolvidos

| Area | Arquivos |
| --- | --- |
| Implementacao legacy | `modules/tesouraria/legacy/auditoria/auditoriaService.ts` |
| Controllers legacy | `modules/tesouraria/legacy/auditoria/auditoriaController.ts` |
| Rotas legacy | `modules/tesouraria/legacy/auditoria/auditoriaRoutes.ts` |
| OCR | `modules/tesouraria/legacy/auditoria/ocrLogic/*` |
| Wrappers compativeis | `modules/auditoria/*` |

## Fluxo

```txt
/auditorias/*
  -> modules/auditoria/auditoriaRoutes.ts
    -> modules/tesouraria/legacy/auditoria/auditoriaRoutes.ts
      -> auditoriaController
        -> AuditoriaService
          -> Firestore / Storage / OCR local
```

## Imports E Dependencias

| Import | Uso |
| --- | --- |
| `firebase-admin` | Firestore, Storage e batch updates. |
| `NotificacoesService` | Notificar aderido quando comprovante e recusado. |
| `enviarEmailRecibo` | Enviar recibo quando aprovacao manual ocorre. |
| `OcrService` | Processar comprovantes em lote via OCR local. |
| `Bilhete` | Tipar documentos de rifas auditadas. |
| `validateToken` | Autenticar chamadas de auditoria. |
| `requireTesourariaOrAdmin` | Restringir avaliacao manual/IA a cargos autorizados. |

## Funcoes E Metodos

| Nome | Responsabilidade | Entrada | Saida | Observacoes |
| --- | --- | --- | --- | --- |
| `listarPendentes()` | Buscar bilhetes pendentes. | Firestore `bilhetes` | `Bilhete[]` | Usado por `/auditorias/pendentes`. |
| `auditarLoteIA()` | Processar comprovantes pendentes com OCR. | Config `extrato_csv` e comprovantes | Contadores de resultado | Mantido como legado operacional. |
| `processarDecisaoManual()` | Aprovar ou rejeitar rifas manualmente. | Numeros, decisao, motivo | `void` | Atualiza status, notifica e envia email quando aplicavel. |
| `salvarExtratoCsv()` | Persistir CSV usado pela auditoria IA. | Texto CSV | `void` | Salva em `configuracoes/sistema`. |
| `extrairCaminhoStorage()` | Extrair path de Storage a partir da URL. | URL Firebase Storage | Path ou `null` | Usado ao apagar comprovante recusado. |

## Wrappers Compativeis

Os arquivos em `modules/auditoria` sao wrappers pequenos:

| Wrapper | Delegacao |
| --- | --- |
| `auditoriaRoutes.ts` | Exporta rotas legacy. |
| `auditoriaController.ts` | Exporta controller legacy. |
| `auditoriaService.ts` | Exporta service legacy. |
| `ocrLogic/*` | Reexporta servicos OCR legacy. |

Eles existem para preservar imports e endpoints antigos enquanto o codigo real
fica isolado em `tesouraria/legacy`.

## Regras E Cuidados

- Codigo novo de Pix nao deve importar `legacy/auditoria`.
- Nao misturar OCR/IA/manual com `PixTransacoesService`.
- Manter `/auditorias/pendentes`, `/auditorias/avaliar`,
  `/auditorias/auditar-lote` e `/auditorias/extrato` funcionando.
- Nao remover wrappers sem atualizar rotas, testes e consumidores.
- Nao expor logs com comprovantes, dados sensiveis ou conteudo integral de CSV.

## Testes Relacionados

- `backend/functions/tests/auditoria/auditoriaRoutes.spec.ts`
- `backend/functions/tests/auditoria/auditoriaController.spec.ts`
- `backend/functions/tests/auditoria/auditoriaService.spec.ts`
