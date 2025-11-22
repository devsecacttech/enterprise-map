import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    host: '0.0.0.0', // Permitir acceso desde cualquier IP
    allowedHosts: [
      '.loca.lt', // Permitir todos los subdominios de loca.lt
      '.localhost',
      'localhost'
    ],
    // Para desarrollo, también puedes usar esto para mayor flexibilidad:
    // allowedHosts: 'all'
  }
})
