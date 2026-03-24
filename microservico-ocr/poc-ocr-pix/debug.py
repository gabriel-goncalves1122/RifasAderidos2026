from motor_ocr import extrair_texto_arquivo
import os

# Atualize os nomes dos arquivos exatos que estão na sua pasta 'comprovantes'
arquivos_novos = {
    "PICPAY": "comprovantes/r1e7lKjcfoQ5EiS74VXTM2UO4HV2_1773324345582.pdf",
    "BANCO_DO_BRASIL": "comprovantes/SPMIPtMRo7dOJI77ZMZf6CBqCY62_1773345026662.jpeg",
    "CAIXA": "comprovantes/83Eg3fpnN7V1mmw7V1Y8n3EpRL33_1773359605316.pdf",
    "INTER": "comprovantes/OhfkF7sDlzN0g90xPMFWKnwhPwE2_1774219192456.jpg"
}

for banco, caminho in arquivos_novos.items():
    print(f"\n{'='*25} TEXTO BRUTO {banco} {'='*25}")
    if not os.path.exists(caminho):
        print(f"❌ Arquivo não encontrado: {caminho}")
        continue
        
    try:
        # Pela nossa nova lógica do motor_ocr, isso vai forçar
        # o tratamento de Preto e Branco e o OCR na imagem.
        texto = extrair_texto_arquivo(caminho)
        print(texto)
        
        # Visão simplificada para facilitar a localização visual do ID
        texto_limpo = texto.replace("\n", "").replace(" ", "")
        print(f"\n--- Visão do Robô (Sem espaços e quebras) ---")
        print(texto_limpo) 
        
    except Exception as e:
        print(f"Erro ao ler {banco}: {e}")