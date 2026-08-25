import { CheckoutPixCobranca } from "../types/checkoutPix";

const CHECKOUT_CACHE_KEY = "@SistemaRifas:checkout_ativo";

export interface CheckoutSessaoCache {
  cobrancaPix: CheckoutPixCobranca;
  numerosRifas: string[];
}

export function salvarCheckoutSessaoCache(sessao: CheckoutSessaoCache): void {
  try {
    localStorage.setItem(CHECKOUT_CACHE_KEY, JSON.stringify(sessao));
  } catch (error) {
    console.warn("Erro ao salvar cache de checkout:", error);
  }
}

export function limparCheckoutSessaoCache(): void {
  try {
    localStorage.removeItem(CHECKOUT_CACHE_KEY);
  } catch (error) {
    console.warn("Erro ao limpar cache de checkout:", error);
  }
}

export function obterCheckoutSessaoCache(): CheckoutSessaoCache | null {
  try {
    const salvo = localStorage.getItem(CHECKOUT_CACHE_KEY);
    if (!salvo) return null;

    const sessao = JSON.parse(salvo) as CheckoutSessaoCache;

    if (!sessao.cobrancaPix || !sessao.cobrancaPix.expiraEm) {
      limparCheckoutSessaoCache();
      return null;
    }

    const expiracaoMs = new Date(sessao.cobrancaPix.expiraEm).getTime();
    if (Number.isNaN(expiracaoMs) || Date.now() > expiracaoMs) {
      limparCheckoutSessaoCache();
      return null;
    }

    return sessao;
  } catch (error) {
    console.warn("Erro ao ler cache de checkout:", error);
    limparCheckoutSessaoCache();
    return null;
  }
}
