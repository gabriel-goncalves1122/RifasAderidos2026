// ============================================================================
// ARQUIVO: backend/functions/src/modules/admin/adminService.ts
// ============================================================================
// Compatibilidade temporária durante a migração para modules/admin/secretaria.
export { secretariaService as adminService } from "./secretaria/secretariaService";
export type {
  DadosNovoAderido,
  DadosAtualizacaoAderido,
} from "./secretaria/secretariaTypes";
