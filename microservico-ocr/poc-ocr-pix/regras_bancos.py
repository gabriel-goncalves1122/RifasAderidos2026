import re

def extrair_id_base(texto_limpo):
    """Caça o ID usando a Regra de Ouro do Banco Central (A Máquina do Tempo)"""
    candidatos = re.findall(r'(?=(E[a-zA-Z0-9]{31}))', texto_limpo)
    for candidato in candidatos:
        trecho_ano = candidato[9:13].replace('O', '0').replace('o', '0').replace('I', '1')
        if trecho_ano.startswith('202'):
            return candidato
    return None

def faxina_extrema(texto):
    """Destrói caracteres invisíveis, mantendo apenas Letras, Números e £/€"""
    return re.sub(r'[^a-zA-Z0-9£€]', '', texto)

# --- FUNÇÕES ORIGINAIS ---
def leitor_c6_bank(texto_bruto):
    return extrair_id_base(faxina_extrema(texto_bruto).replace("£", "E").replace("€", "E"))

def leitor_nubank(texto_bruto):
    return extrair_id_base(faxina_extrema(texto_bruto))

def leitor_sicoob(texto_bruto):
    return extrair_id_base(faxina_extrema(texto_bruto))

def leitor_santander(texto_bruto):
    return extrair_id_base(faxina_extrema(texto_bruto))

def leitor_itau(texto_bruto):
    return extrair_id_base(faxina_extrema(texto_bruto))

def leitor_mercado_pago(texto_bruto):
    return extrair_id_base(faxina_extrema(texto_bruto).replace("£", "E").replace("€", "E"))

# --- NOVOS BANCOS ---
def leitor_picpay(texto_bruto):
    # A faxina_extrema já resolve o problema do ID quebrado em duas linhas
    return extrair_id_base(faxina_extrema(texto_bruto))

def leitor_bb(texto_bruto):
    # Trata o bug da Libra no BB
    return extrair_id_base(faxina_extrema(texto_bruto).replace("£", "E").replace("€", "E"))

def leitor_caixa(texto_bruto):
    # O motor já vai ler a página 2, a faxina_extrema faz o resto
    return extrair_id_base(faxina_extrema(texto_bruto))

def leitor_inter(texto_bruto):
    return extrair_id_base(faxina_extrema(texto_bruto))

# --- ROTEADOR INTELIGENTE ---
ROTEADOR_LEITORES = {
    "C6_BANK": leitor_c6_bank,
    "NUBANK": leitor_nubank,
    "ITAU": leitor_itau,
    "SICOOB": leitor_sicoob,
    "SANTANDER": leitor_santander,
    "MERCADO_PAGO": leitor_mercado_pago,
    "PICPAY": leitor_picpay,
    "BANCO_DO_BRASIL": leitor_bb,
    "CAIXA": leitor_caixa,
    "INTER": leitor_inter
}

def identificar_banco(texto_bruto):
    texto_upper = texto_bruto.upper()
    
    if "C6" in texto_upper or "C6BANK" in texto_upper: return "C6_BANK"
    elif "NUBANK" in texto_upper or "NU PAGAMENTOS" in texto_upper: return "NUBANK"
    elif "ITAÚ" in texto_upper or "ITAU" in texto_upper: return "ITAU"
    elif "SICOOB" in texto_upper: return "SICOOB"
    elif "SANTANDER" in texto_upper: return "SANTANDER"
    elif "PICPAY" in texto_upper: return "PICPAY"
    elif "BANCO DO BRASIL" in texto_upper or "BCO DO BRASIL" in texto_upper: return "BANCO_DO_BRASIL"
    elif "CAIXA" in texto_upper or "CEF" in texto_upper: return "CAIXA"
    elif "INTER" in texto_upper or "SINTER" in texto_upper: return "INTER"
    
    return "MERCADO_PAGO"