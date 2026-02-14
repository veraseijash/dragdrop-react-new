import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/home/Index";
import IniPage from "./pages/dashboard/IniPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ✅ Página inicial */}
        <Route path="/" element={<Index />} />

        {/* Tu editor */}
        <Route path="/editor/:id" element={<IniPage />} />
      </Routes>
    </BrowserRouter>
  );
}

