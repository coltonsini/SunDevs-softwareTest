import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Cartelera from './Cartelera.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Cartelera />
  </StrictMode>,
)