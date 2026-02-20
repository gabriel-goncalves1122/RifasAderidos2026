import { BrowserRouter } from "react-router-dom";
// Ajustado para buscar dentro da pasta routes
import { AppRoutes } from "./routes/routes.tsx";

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
