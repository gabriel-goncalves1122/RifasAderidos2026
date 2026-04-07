# ==========================================================
# ARQUIVO: microservico-ocr/poc-ocr-pix/api.py
# ==========================================================
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import tempfile
import os
import io
import pandas as pd
from main import processar_arquivo 

app = Flask(__name__)
CORS(app)

@app.route('/api/validar-pix', methods=['POST'])
def validar_pix():
    dados = request.get_json()
    url_imagem = dados.get('comprovanteUrl')
    csv_texto = dados.get('extratoCsv') # <-- Agora recebemos o extrato em texto!
    
    if not url_imagem or not csv_texto:
        return jsonify({"status": "ERRO", "mensagem": "Comprovativo ou Extrato CSV ausente na requisição"}), 400

    caminho_temp = None
    try:
        # 1. Lê o CSV diretamente da memória RAM (muito mais rápido e sem ficheiros)
        df_extrato = pd.read_csv(io.StringIO(csv_texto))
        
        # 2. Formata as colunas para o padrão do nosso sistema
        mapa = {
            'Identificador': 'ID_Transacao',
            'Origem - Nome': 'Pagador',
            'Valor (R$)': 'Valor'
        }
        df_extrato = df_extrato.rename(columns={k: v for k, v in mapa.items() if k in df_extrato.columns})
        
        if 'Valor' in df_extrato.columns:
            df_extrato['Valor'] = df_extrato['Valor'].astype(str).str.replace(',', '.').astype(float)

        # 3. Faz o download temporário da imagem do recibo
        resposta = requests.get(url_imagem)
        extensao = '.pdf' if '.pdf' in url_imagem.lower() else '.jpg'
        
        with tempfile.NamedTemporaryFile(delete=False, suffix=extensao) as temp:
            temp.write(resposta.content)
            caminho_temp = temp.name

        # 4. Chama a Inteligência Artificial para cruzar as informações
        status, mensagem = processar_arquivo(caminho_temp, df_extrato)
        
        os.remove(caminho_temp)
        return jsonify({"status": status, "mensagem": mensagem})

    except Exception as e:
        if caminho_temp and os.path.exists(caminho_temp): os.remove(caminho_temp)
        return jsonify({"status": "ERRO", "mensagem": f"Falha interna: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(port=5000)