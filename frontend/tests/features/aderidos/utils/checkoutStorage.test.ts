import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { checkoutStorage, CheckoutState } from "@/features/aderidos/utils/checkoutStorage";

describe("checkoutStorage", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const defaultState: CheckoutState = {
    selecionadas: [],
    cobrancaPix: null,
    sessaoCheckoutId: null,
    formData: null,
    modalAberto: false,
  };

  it("Deve salvar e recuperar os dados do localStorage se não expirar", () => {
    const data: Partial<CheckoutState> = {
      sessaoCheckoutId: "SESSAO_123",
      modalAberto: true,
    };

    checkoutStorage.update(data);
    const recuperado = checkoutStorage.get();

    expect(recuperado.sessaoCheckoutId).toBe("SESSAO_123");
    expect(recuperado.modalAberto).toBe(true);
  });

  it("Deve retornar estado default se não houver nada no localStorage", () => {
    const recuperado = checkoutStorage.get();
    expect(recuperado).toEqual(defaultState);
  });

  it("Deve retornar estado default se o tempo de expiração tiver passado", () => {
    // Seta um tempo base
    const tempoInicial = new Date(2026, 0, 1, 12, 0, 0).getTime();
    vi.setSystemTime(tempoInicial);

    checkoutStorage.update({
      sessaoCheckoutId: "SESSAO_EXPIRA",
    });

    // Avança 36 minutos no tempo (o TTL é 35 minutos = 35 * 60 * 1000)
    vi.advanceTimersByTime(36 * 60 * 1000);

    const recuperado = checkoutStorage.get();
    
    // Deve retornar default e limpar o storage pois expirou
    expect(recuperado).toEqual(defaultState);
    expect(localStorage.getItem("aderido_checkout_session")).toBeNull();
  });

  it("Deve limpar os dados do localStorage ao chamar clear()", () => {
    checkoutStorage.update({
      sessaoCheckoutId: "SESSAO_123",
    });

    expect(checkoutStorage.get().sessaoCheckoutId).toBe("SESSAO_123");

    checkoutStorage.clear();

    expect(checkoutStorage.get()).toEqual(defaultState);
  });
});
