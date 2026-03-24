import pytesseract
import re
import pandas as pd
from PIL import Image
import os
from pdf2image import convert_from_path # NOVO IMPORT PARA LER PDF

# ==========================================
# 1. LEITORES ESPECÍFICOS POR BANCO
# ==========================================
def extrair_id_base(texto_limpo):
    candidatos = re.findall(r'E[a-zA-Z0-9]{31}', texto_limpo)
    for candidato in candidatos:
        if sum(c.isdigit() for c in candidato) > 10:
            return candidato
    return None

def leitor_c6_bank(texto_bruto):
    texto_limpo = texto_bruto.replace("\n", "").replace(" ", "")
    texto_limpo = texto_limpo.replace("£", "E").replace("€", "E")
    return extrair_id_base(texto_limpo)

def leitor_nubank(texto_bruto):
    texto_limpo = texto_bruto.replace("\n", "").replace(" ", "")
    return extrair_id_base(texto_limpo)

def leitor_sicoob(texto_bruto):
    # Espaço para futuras regras específicas do Sicoob
    texto_limpo = texto_bruto.replace("\n", "").replace(" ", "")
    return extrair_id_base(texto_limpo)

def leitor_santander(texto_bruto):
    # Espaço para futuras regras específicas do Santander
    texto_limpo = texto_bruto.replace("\n", "").replace(" ", "")
    return extrair_id_base(texto_limpo)

def leitor_itau(texto_bruto):
    texto_limpo = texto_bruto.replace("\n", "").replace(" ", "")
    # Tratando aquele erro que vimos no seu log (OCR grudando palavras)
    texto_limpo = texto_limpo.replace("IDdatra", "").replace("IDdatransacao", "")
    return extrair_id_base(texto_limpo)

def leitor_mercado_pago(texto_bruto):
    # O antigo "Genérico" agora é o Mercado Pago
    texto_limpo = texto_bruto.replace("\n", "").replace(" ", "")
    return extrair_id_base(texto_limpo)

# Mapeamento oficial das rotas
ROTEADOR_LEITORES = {
    "C6_BANK": leitor_c6_bank,
    "NUBANK": leitor_nubank,
    "ITAU": leitor_itau,
    "SICOOB": leitor_sicoob,
    "SANTANDER": leitor_santander,
    "MERCADO_PAGO": leitor_mercado_pago
}

# ==========================================
# 2. INTELIGÊNCIA DE ROTEAMENTO
# ==========================================
def identificar_banco(texto_bruto):
    texto_upper = texto_bruto.upper()
    
    if "C6" in texto_upper or "C6BANK" in texto_upper: return "C6_BANK"
    elif "NUBANK" in texto_upper or "NU PAGAMENTOS" in texto_upper: return "NUBANK"
    elif "ITAÚ" in texto_upper or "ITAU" in texto_upper: return "ITAU"
    elif "SICOOB" in texto_upper: return "SICOOB"
    elif "SANTANDER" in texto_upper: return "SANTANDER"
    
    # Se não achar nenhuma das palavras-chave, assume que é Mercado Pago
    return "MERCADO_PAGO"

# ==========================================
# 3. MOTOR DE PROCESSAMENTO INDIVIDUAL
# ==========================================
def processar_arquivo(caminho_arquivo, df_banco):
    """Processa a imagem ou a primeira página do PDF."""
    try:
        # LÓGICA DE PDF AQUI
        if caminho_arquivo.lower().endswith('.pdf'):
            # Transforma a primeira página do PDF em imagem
            paginas = convert_from_path(caminho_arquivo, first_page=1, last_page=1)
            img = paginas[0]
        else:
            # Abre imagem normal
            img = Image.open(caminho_arquivo)
            
        texto_bruto = pytesseract.image_to_string(img)
    except Exception as e:
        return "ERRO", f"Arquivo corrompido ou ilegível. ({e})"

    nome_banco = identificar_banco(texto_bruto)
    
    # Chama o leitor certo baseado no banco identificado
    funcao_leitora = ROTEADOR_LEITORES.get(nome_banco, leitor_mercado_pago)
    id_pix = funcao_leitora(texto_bruto)
    
    if not id_pix:
        return "DIVERGENTE", f"Banco [{nome_banco}]: Nenhum ID válido encontrado pelo OCR."
        
    id_pix_limpo = id_pix.replace('O', '0').replace('o', '0').upper()
    
    match = None
    for index, row in df_banco.iterrows():
        id_banco_limpo = str(row['ID_Transacao']).replace('O', '0').upper()
        if id_banco_limpo == id_pix_limpo:
            match = row
            break
    
    if match is not None:
        return "APROVADO", f"Banco [{nome_banco}] - ID {id_pix[:8]}... | Titular: {match['Pagador']} - R$ {match['Valor']:.2f}"
    else:
        return "DIVERGENTE", f"Banco [{nome_banco}] - ID {id_pix[:8]}... lido, mas NÃO está no extrato!"

# ==========================================
# 4. MOTOR DE PROCESSAMENTO EM LOTE
# ==========================================
def rodar_lote(pasta_alvo, df_banco):
    print("="*80)
    print(f"🚀 INICIANDO AUDITORIA EM LOTE (Pasta: {pasta_alvo})")
    print("="*80)

    if not os.path.exists(pasta_alvo):
        print(f"❌ ERRO: A pasta '{pasta_alvo}' não foi encontrada.")
        return

    # Agora o motor aceita .pdf também
    arquivos = [f for f in os.listdir(pasta_alvo) if f.lower().endswith(('.png', '.jpg', '.jpeg', '.pdf'))]
    
    if len(arquivos) == 0:
        print(f"⚠️ Nenhum arquivo de imagem ou PDF encontrado em '{pasta_alvo}'.")
        return

    relatorio = {"APROVADO": 0, "DIVERGENTE": 0, "ERRO": 0}

    for arquivo in arquivos:
        caminho_completo = os.path.join(pasta_alvo, arquivo)
        status, mensagem = processar_arquivo(caminho_completo, df_banco)
        
        relatorio[status] += 1
        icone = "✅" if status == "APROVADO" else "⚠️" if status == "DIVERGENTE" else "❌"
        print(f"{icone} {arquivo:<40} -> {mensagem}")

    print("\n" + "="*80)
    print("📊 RELATÓRIO FINAL DA TESOURARIA")
    print("="*80)
    print(f"✅ Pagamentos Aprovados : {relatorio['APROVADO']}")
    print(f"⚠️ Comprovantes Divergentes : {relatorio['DIVERGENTE']} (Requer auditoria manual)")
    print(f"❌ Erros de Leitura : {relatorio['ERRO']}")
    print("="*80)

if __name__ == "__main__":
    # Extrato falso. Lembre-se de colocar IDs reais aqui se quiser testar o Match Verde!
    dados_extrato = {
        'Data': ['17/03/2026', '22/03/2026', '23/03/2026'],
        'Pagador': ['Leticia Pereira Gabriel', 'Maria Souza', 'João Silva'],
        'Valor': [50.00, 50.00, 10.00],
        'ID_Transacao': [
            'E31872495202603171631qiXEEFBUsP0', 
            'E18236120202603112014s148f9438ce', # O ID que seu Nubank leu no log anterior!
            'E99999999202603239999999999999XX'
        ]
    }
    df_extrato = pd.DataFrame(dados_extrato)

    PASTA_COMPROVANTES = "comprovantes"
    rodar_lote(PASTA_COMPROVANTES, df_extrato)