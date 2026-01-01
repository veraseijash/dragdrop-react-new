import { BrowserRouter, Routes, Route } from "react-router-dom";
import IniPage from "./pages/dashboard/IniPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/init/:id" element={<IniPage />} />
      </Routes>
    </BrowserRouter>
  );
}

