import os
import pandas as pd

# Importando nossos módulos locais
from motor_ocr import extrair_texto_arquivo
from regras_bancos import identificar_banco, ROTEADOR_LEITORES, leitor_mercado_pago

def normalizar_id_ocr(id_string):
    """Limpeza agressiva para garantir o Match perfeito entre Pandas e Tesseract."""
    if not id_string: return ""
    id_limpo = str(id_string).strip().upper()
    id_limpo = id_limpo.replace('O', '0').replace('I', '1').replace('L', '1')
    return id_limpo

def processar_arquivo(caminho_arquivo, df_banco):
    try:
        texto_bruto = extrair_texto_arquivo(caminho_arquivo)
    except Exception as e:
        return "ERRO", str(e)

    nome_banco = identificar_banco(texto_bruto)
    funcao_leitora = ROTEADOR_LEITORES.get(nome_banco, leitor_mercado_pago)
    id_pix = funcao_leitora(texto_bruto)
    
    if not id_pix:
        return "DIVERGENTE", f"Banco [{nome_banco}]: Nenhum ID válido encontrado pelo OCR."
        
    id_pix_limpo = normalizar_id_ocr(id_pix)
    
    match = None
    
    # Se o banco de dados carregou vazio (Ex: sem CSV na pasta)
    if df_banco is None or df_banco.empty:
         return "ERRO", "Planilha da tesouraria não carregada na API."

    # Busca na planilha o ID (Tenta as duas colunas caso tenha o formato novo ou velho)
    if 'ID_Transacao' in df_banco.columns:
        for index, row in df_banco.iterrows():
            id_banco_limpo = normalizar_id_ocr(row['ID_Transacao'])
            if id_banco_limpo == id_pix_limpo:
                match = row
                break
    
        if match is not None:
            return "APROVADO", f"Banco [{nome_banco}] - ID {id_pix} | Titular: {match.get('Pagador', 'N/A')} - R$ {match.get('Valor', 0):.2f}"
        else:
            return "DIVERGENTE", f"Banco [{nome_banco}] - ID {id_pix} lido, mas NÃO está no extrato!"