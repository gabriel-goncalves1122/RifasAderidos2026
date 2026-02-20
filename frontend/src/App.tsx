// ============================================================================
// ARQUIVO: App.tsx (Raiz da Aplicação React)
// ============================================================================
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes/routes"; // Remova o .tsx do final no import (boa prática)

// ----------------------------------------------------------------------------
// COMPONENTE PRINCIPAL
// ----------------------------------------------------------------------------
// O App é o ponto de entrada de todo o frontend. O seu único papel aqui é
// abraçar a aplicação com o "BrowserRouter". Ele é o motor que permite trocar
// de tela alterando a URL do navegador sem precisar recarregar a página (Single Page Application).
function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
