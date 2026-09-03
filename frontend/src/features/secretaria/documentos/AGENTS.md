# AGENTS.md - Secretaria / Documentos

## Escopo

Esta subfeature lista, cria, edita e visualiza atas, contratos, planilhas,
imagens e outros documentos administrativos.

## Arquitetura

- Componentes recebem dados e callbacks; não acessam API ou Storage.
- `useDocumentosSecretaria` controla filtros, editor e ciclo de vida do preview.
- `documentosSecretariaService` concentra `/admin/documentos`.
- Constantes de áreas/tipos ficam em `constants/`; não misture com types.
- Não crie barrels em subpastas.

## Upload E Preview

- Upload usa multipart autenticado pelo backend, nunca Firebase Web Storage SDK.
- Criação exige arquivo; edição pode manter o arquivo atual.
- O frontend envia somente arquivo e metadados editáveis.
- MIME, tamanho, autor e `storagePath` são derivados/validados no backend.
- Preview usa `GET /admin/documentos/:id/conteudo`, cria `ObjectURL` e o revoga
  ao fechar ou trocar de documento.
- `urlVisualizacao` é apenas fallback para registros legados.
- Limite de arquivo: 25 MB; formatos: PDF, planilha e imagem.

## UI

- Desktop usa grid; mobile usa lista touch-first.
- Busca e área ficam sticky sem cobrir o primeiro card.
- O FAB fica no canto inferior direito e abre PDF, Planilha e Imagem para cima.
- Erros de upload aparecem dentro do modal sem apagar os campos preenchidos.

## Testes

Cubra multipart, erros, criação/edição, preview protegido, revogação de URL,
busca, filtro e ausência de acesso direto ao Storage.
