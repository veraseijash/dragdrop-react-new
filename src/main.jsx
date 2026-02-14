import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

import 'bootstrap/dist/css/bootstrap.min.css'

// ✅ estilos de Tippy (OBLIGATORIOS)
import 'tippy.js/dist/tippy.css'
import 'tippy.js/themes/light.css'

import './assets/styles/main.css'
import './assets/icohv/style.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
