# Diagrama 2: Fluxo Completo de Checkout Pix

Este diagrama ilustra o ciclo de vida completo de uma reserva e pagamento Pix, cobrindo a jornada ideal, cancelamentos manuais, e o comportamento do sistema quando o app é suspenso (ex: troca de abas para ir ao app do banco).

```mermaid
sequenceDiagram
    autonumber
    
    actor Usuario
    participant LocalStorage as LocalStorage<br/>(Persistência TTL)
    participant Componentes as MinhasRifasTab / <br/>CheckoutModal
    participant Hooks as useRifasSelection /<br/>useCheckoutPixFlow
    participant Backend as Tesouraria Backend
    participant Firebase as Firestore /<br/>Transactions
    participant MP as Mercado Pago

    %% 1. SELEÇÃO DE RIFAS
    rect rgb(234, 243, 239)
        note right of Usuario: Fase 1: Seleção de Rifas
        Usuario->>Componentes: Clica nas rifas desejadas
        Componentes->>Hooks: alternarSelecaoRifa(numero)
        Hooks->>LocalStorage: setItem('checkout_rifas_selecionadas', [numeros])
        Usuario->>Componentes: Clica em "Vender Selecionadas"
        Componentes->>Hooks: push('checkout')
        Hooks->>LocalStorage: setItem('checkout_modal_aberto', "true")
    end

    %% 2. PREENCHIMENTO E GERAÇÃO DO PIX
    rect rgb(255, 247, 224)
        note right of Usuario: Fase 2: Geração do Pagamento
        Usuario->>Componentes: Preenche Formulário e "Gerar Pagamento"
        Componentes->>LocalStorage: setItem('checkout_form_data', dados)
        Componentes->>Hooks: gerarCobrancaPix(dados)
        Hooks->>Backend: POST /tesouraria/checkout/pix
        
        Backend->>Firebase: Transaction: valida disponibilidade das rifas
        Firebase-->>Backend: OK
        Backend->>Firebase: Transaction: reserva rifas, cria transação
        Firebase-->>Backend: Transação Criada
        
        Backend->>MP: Criar cobrança Pix
        MP-->>Backend: Retorna Copia e Cola / QR Code
        
        Backend-->>Hooks: { id, status: 'aguardando_pagamento', copiaECola, ... }
        Hooks->>LocalStorage: setItem('checkout_cobranca_pix', cobranca)
        Hooks-->>Componentes: Atualiza UI com QR Code
    end

    %% 3. POLLING E MUDANÇA DE TELA (APP SUSPENSO)
    rect rgb(246, 248, 247)
        note right of Usuario: Fase 3: Troca de Abas e Polling
        Hooks->>Backend: Inicia Polling (setInterval a cada 10s): GET /pix/{id}
        Usuario->>Componentes: Clica em "Copiar Pix copia-e-cola"
        Componentes-->>Usuario: Pix copiado! (Abre app do banco)
        note right of Usuario: iOS suspende a aba do navegador
        
        Usuario->>Usuario: (No App do Banco) Pode pagar, desistir ou demorar
        
        note right of Usuario: Usuário volta ao navegador
        note left of Componentes: iOS recarrega a página do zero (Memory Pressure)
        Componentes->>LocalStorage: getItem('checkout_modal_aberto')
        LocalStorage-->>Componentes: "true" -> Reabre modal
        Componentes->>LocalStorage: getItem('checkout_form_data')
        LocalStorage-->>Componentes: dados restaurados
        Componentes->>LocalStorage: getItem('checkout_cobranca_pix')
        LocalStorage-->>Componentes: cobranca restaurada
        Hooks->>Backend: Retoma Polling (GET /pix/{id})
    end

    %% 4. CENÁRIOS DE RESOLUÇÃO
    rect rgb(253, 240, 240)
        note right of Usuario: Fase 4: Cenários de Resolução

        %% Cenario A: Sucesso
        opt Cenário A: Usuário Pagou
            MP->>Backend: Webhook (payment.updated)
            Backend->>Firebase: Transaction: aprova transação, libera bilhetes pagos
            Hooks->>Backend: Polling GET /pix/{id}
            Backend-->>Hooks: status: 'pago'
            Hooks->>LocalStorage: removeItem (todos os states do checkout)
            Hooks-->>Componentes: onSuccess() -> Invalida cache e fecha modal
            Componentes-->>Usuario: Confirmação de Sucesso
        end

        %% Cenario B: Cancelamento Manual no Modal
        opt Cenário B: Cancelamento Manual 
            Usuario->>Componentes: Clica no X ou Fechar
            Componentes->>Hooks: cancelarCobrancaPix()
            Hooks->>Backend: POST /tesouraria/checkout/pix/{id}/cancelar
            Backend->>MP: Cancela cobrança no MP
            Backend->>Firebase: Transaction: cancela transação, libera rifas
            Hooks->>LocalStorage: removeItem ('checkout_cobranca_pix')
            Hooks-->>Componentes: Atualiza UI para recomeçar
        end

        %% Cenario C: Expirado pelo Tempo / Webhook de Recusa
        opt Cenário C: Pagamento Expirado ou Recusado pelo MP
            MP->>Backend: Webhook (payment.updated -> cancelled/rejected)
            Backend->>Firebase: Transaction: libera bilhetesNaTransacao
            Hooks->>Backend: Polling GET /pix/{id}
            Backend-->>Hooks: status: 'cancelado' (ou 'expirado')
            Hooks->>LocalStorage: removeItem ('checkout_cobranca_pix')
            Hooks-->>Componentes: Exibe aviso (Opcional: Botão "Tentar Novamente")
        end
    end
```
