import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

      {/* 🔴 ESTE ES EL QUE FALTABA */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick={false}
        pauseOnHover
        draggable={false}
        theme="light"
      />
    </BrowserRouter>
  );
}
