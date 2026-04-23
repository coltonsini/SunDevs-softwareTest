import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Cartelera from './Cartelera.tsx'
import './resetStyles.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Cartelera />
  </StrictMode>,
)