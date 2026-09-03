import { CheckoutPixCobranca } from "../types/checkoutPix";
import { CheckoutFormData } from "../components/checkout/checkoutSchema";

const STORAGE_KEY_UNIFICADO = "aderido_checkout_session";
const STORAGE_TTL_MINUTES = 35;

export interface CheckoutState {
  selecionadas: string[];
  cobrancaPix: CheckoutPixCobranca | null;
  sessaoCheckoutId: string | null;
  formData: CheckoutFormData | null;
  modalAberto: boolean;
}

const defaultState: CheckoutState = {
  selecionadas: [],
  cobrancaPix: null,
  sessaoCheckoutId: null,
  formData: null,
  modalAberto: false,
};

export const checkoutStorage = {
  get(): CheckoutState {
    try {
      const itemStr = localStorage.getItem(STORAGE_KEY_UNIFICADO);
      if (!itemStr) return defaultState;

      const item = JSON.parse(itemStr);
      const now = new Date();

      if (now.getTime() > item.expiry) {
        localStorage.removeItem(STORAGE_KEY_UNIFICADO);
        return defaultState;
      }

      return item.value as CheckoutState;
    } catch {
      localStorage.removeItem(STORAGE_KEY_UNIFICADO);
      return defaultState;
    }
  },

  update(partialState: Partial<CheckoutState>): void {
    try {
      const currentState = this.get();
      const newState: CheckoutState = { ...currentState, ...partialState };

      const now = new Date();
      const item = {
        value: newState,
        expiry: now.getTime() + STORAGE_TTL_MINUTES * 60000,
      };

      localStorage.setItem(STORAGE_KEY_UNIFICADO, JSON.stringify(item));
    } catch {
      // Ignora erro
    }
  },

  clear(): void {
    try {
      localStorage.removeItem(STORAGE_KEY_UNIFICADO);
    } catch {
      // Ignora
    }
  },
};
