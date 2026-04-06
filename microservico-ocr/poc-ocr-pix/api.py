# ==========================================================
# ARQUIVO: microservico-ocr/poc-ocr-pix/api.py
# ==========================================================
from flask import Flask, request, jsonify
from flask_cors import CORS # Adicionado para permitir chamadas do React
import requests
import tempfile
import os
import glob
import pandas as pd
from main import processar_arquivo 

app = Flask(__name__)
CORS(app) # Libera o acesso para o seu Frontend local

def carregar_extrato_atualizado():
    """Busca o CSV da InfinitePay mais recente."""
    arquivos_csv = glob.glob('extratos/*.csv') # Busca na pasta organizada
    if not arquivos_csv:
        return pd.DataFrame()
    
    csv_mais_recente = max(arquivos_csv, key=os.path.getctime)
    try:
        # Lendo com tratamento de decimal brasileiro
        df = pd.read_csv(csv_mais_recente)
        
        # Mapeamento oficial baseado no seu código anterior
        mapa = {
            'Identificador': 'ID_Transacao',
            'Origem - Nome': 'Pagador',
            'Valor (R$)': 'Valor'
        }
        df = df.rename(columns={k: v for k, v in mapa.items() if k in df.columns})
        
        if 'Valor' in df.columns:
            df['Valor'] = df['Valor'].astype(str).str.replace(',', '.').astype(float)
        
        return df
    except Exception as e:
        print(f"❌ Erro ao carregar CSV: {e}")
        return pd.DataFrame()

@app.route('/api/validar-pix', methods=['POST'])
def validar_pix():
    # Recarrega o extrato a cada chamada para garantir dados novos sem reiniciar a API
    df_extrato = carregar_extrato_atualizado()
    
    dados = request.get_json()
    url_imagem = dados.get('comprovanteUrl')
    
    if not url_imagem:
        return jsonify({"status": "ERRO", "mensagem": "URL ausente"}), 400

    if df_extrato.empty:
         return jsonify({"status": "ERRO", "mensagem": "Extrato CSV não encontrado."}), 500

    caminho_temp = None
    try:
        # Download do Firebase Storage
        resposta = requests.get(url_imagem)
        extensao = '.pdf' if '.pdf' in url_imagem.lower() else '.jpg'
        
        with tempfile.NamedTemporaryFile(delete=False, suffix=extensao) as temp:
            temp.write(resposta.content)
            caminho_temp = temp.name

        # Processamento usando o seu motor_ocr e regras_bancos
        status, mensagem = processar_arquivo(caminho_temp, df_extrato)
        
        os.remove(caminho_temp)
        return jsonify({"status": status, "mensagem": mensagem})

    except Exception as e:
        if caminho_temp and os.path.exists(caminho_temp): os.remove(caminho_temp)
        return jsonify({"status": "ERRO", "mensagem": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000)