from flask import Flask, request, jsonify
import requests
import tempfile
import os
import glob
import pandas as pd

# Importa o motor de processamento do seu main.py
from main import processar_arquivo 

app = Flask(__name__)

# ==========================================================
# MOTOR DE DADOS: Acha o arquivo CSV mais recente da pasta
# ==========================================================
arquivos_csv = glob.glob('*.csv')

if not arquivos_csv:
    print("❌ AVISO: Nenhum arquivo .csv encontrado na pasta!")
    print("Por favor, cole o Extrato da InfinitePay aqui e reinicie a API.")
    df_extrato = pd.DataFrame() # Cria um dataframe vazio para a API não quebrar
else:
    # Pega o arquivo que foi modificado/baixado mais recentemente
    csv_mais_recente = max(arquivos_csv, key=os.path.getctime)
    print(f"📄 Carregando o banco de dados atualizado: {csv_mais_recente}")
    
    try:
        df_extrato = pd.read_csv(csv_mais_recente, sep=',')
        
        # Mapeamento dinâmico de colunas (proteção caso a InfinitePay mude a ordem)
        colunas_renomeadas = {}
        
        if 'Identificador' in df_extrato.columns:
            colunas_renomeadas['Identificador'] = 'ID_Transacao'
            
        if 'Origem - Nome' in df_extrato.columns:
            colunas_renomeadas['Origem - Nome'] = 'Pagador'
            
        if 'Valor (R$)' in df_extrato.columns:
            colunas_renomeadas['Valor (R$)'] = 'Valor'
            
        if colunas_renomeadas:
            df_extrato = df_extrato.rename(columns=colunas_renomeadas)
            
        # Limpeza do campo valor (Transformar string "10,00" em número decimal 10.00)
        if 'Valor' in df_extrato.columns:
            df_extrato['Valor'] = df_extrato['Valor'].astype(str).str.replace(',', '.').astype(float)
            
        print("✅ Dados da Tesouraria carregados e formatados com sucesso!")
        
    except Exception as e:
        print(f"❌ Erro ao formatar o CSV. Detalhe: {e}")
        df_extrato = pd.DataFrame()


# ==========================================================
# ROTA DA API DE VALIDAÇÃO
# ==========================================================
@app.route('/api/validar-pix', methods=['POST'])
def validar_pix():
    dados = request.get_json()
    url_imagem = dados.get('comprovanteUrl')
    
    if not url_imagem:
        return jsonify({"erro": "Nenhuma URL fornecida"}), 400

    # Bloqueio de segurança: Se não achou o CSV na inicialização, avisa o Front-end
    if df_extrato.empty:
         return jsonify({
             "status": "ERRO", 
             "mensagem": "Planilha da Tesouraria não encontrada no servidor."
         }), 500

    caminho_temp = None
    try:
        # 1. Faz o download da imagem do Firebase Storage local
        print(f"📥 Baixando comprovante: {url_imagem[:50]}...")
        resposta = requests.get(url_imagem)
        resposta.raise_for_status()
        
        extensao = '.pdf' if '.pdf' in url_imagem.lower() else '.jpg'
        
        with tempfile.NamedTemporaryFile(delete=False, suffix=extensao) as temp_file:
            temp_file.write(resposta.content)
            caminho_temp = temp_file.name

        # 2. Roda o motor OCR no arquivo baixado
        print("🔍 Analisando imagem...")
        status, mensagem = processar_arquivo(caminho_temp, df_extrato)
        
        # 3. Limpa o arquivo temporário do HD
        os.remove(caminho_temp)
        
        print(f"Resultado: {status} - {mensagem}")
        return jsonify({
            "status": status,
            "mensagem": mensagem
        })

    except Exception as e:
        # Garante que o arquivo temporário seja apagado mesmo se der erro no OCR
        if caminho_temp and os.path.exists(caminho_temp):
            os.remove(caminho_temp)
            
        print(f"❌ Erro interno no OCR: {str(e)}")
        return jsonify({"status": "ERRO", "mensagem": str(e)}), 500

if __name__ == '__main__':
    # Roda a API na porta 5000
    app.run(port=5000, debug=True)