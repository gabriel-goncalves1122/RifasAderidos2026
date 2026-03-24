import pytesseract
from PIL import Image, ImageEnhance
from pdf2image import convert_from_path
import fitz  # PyMuPDF para a extração "na mão"

def tratar_imagem_para_ocr(img):
    """Tratamento extremo (Preto e Branco) para destruir fundos coloridos."""
    img_cinza = img.convert('L')
    realcador = ImageEnhance.Contrast(img_cinza)
    return realcador.enhance(3.0)

def extrair_texto_arquivo(caminho_arquivo):
    try:
        if caminho_arquivo.lower().endswith('.pdf'):
            # =========================================================
            # O DESVIO DE ROTA: Isolamento do SICOOB ("By Hand")
            # =========================================================
            doc = fitz.open(caminho_arquivo)
            texto_nativo = ""
            for pagina in doc:
                texto_nativo += pagina.get_text()
            
            # Se o texto nativo acusar que é do Sicoob, nós abortamos o OCR!
            # Lemos os dados direto da matriz do PDF, ignorando o fundo azul.
            if "SICOOB" in texto_nativo.upper():
                return texto_nativo
            
            # =========================================================
            # FLUXO NORMAL: Para Caixa, Santander, etc. (OCR)
            # =========================================================
            texto_completo = ""
            paginas = convert_from_path(caminho_arquivo, dpi=300)
            for img in paginas:
                img_limpa = tratar_imagem_para_ocr(img)
                texto_completo += pytesseract.image_to_string(img_limpa) + "\n"
            return texto_completo
            
        else:
            # É imagem JPG/PNG, vai direto pro OCR
            img = Image.open(caminho_arquivo)
            img_limpa = tratar_imagem_para_ocr(img)
            return pytesseract.image_to_string(img_limpa)
            
    except Exception as e:
        raise Exception(f"Erro na leitura do arquivo: {e}")