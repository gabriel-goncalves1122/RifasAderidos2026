import { Router } from "express";
import multer from "multer";
import { rifasController } from "../controllers/rifasController";
import { validateToken } from "../middlewares/authMiddleware";

const router = Router();

// Configuração do Multer para guardar a imagem temporariamente na memória RAM
// antes de mandarmos para a nuvem do Firebase
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // Limite de 5MB por foto de comprovante
});

// Rota GET: Buscar rifas do usuário logado
// Passamos pelo 'validateToken' primeiro para barrar intrusos
router.get("/minhas-rifas", validateToken, rifasController.getMinhasRifas);

// Rota POST: Finalizar a venda
// Usamos o upload.single('comprovante') para dizer ao express ler o arquivo anexado
router.post(
  "/vender",
  validateToken,
  upload.single("comprovante"),
  rifasController.processarVenda,
);

export default router;
