# Guía de Tunneling para Desarrollo

Esta guía explica cómo exponer tu aplicación de desarrollo local a Internet usando diferentes servicios de tunneling.

## 🚇 LocalTunnel

LocalTunnel es una herramienta sencilla para crear túneles HTTP públicos a tu servidor local.

### Instalación

```bash
npm install -g localtunnel
```

### Uso Básico

1. **Inicia tu servidor de desarrollo:**
   ```bash
   npm run dev
   ```
   El servidor se ejecutará en `http://localhost:3000`

2. **En otra terminal, inicia LocalTunnel:**
   ```bash
   lt --port 3000
   ```

3. **LocalTunnel te dará una URL pública:**
   ```
   your url is: https://shy-towns-cheer.loca.lt
   ```

### Uso con Subdominio Personalizado

```bash
lt --port 3000 --subdomain mi-canvas-admin
```

Esto creará: `https://mi-canvas-admin.loca.lt`

**Nota:** Los subdominios personalizados pueden no estar disponibles si están en uso.

### Solución de Problemas

Si ves un error "Host not allowed", la configuración de Vite ya ha sido actualizada para permitir hosts `.loca.lt`.

Solo necesitas:
1. Detener el servidor de desarrollo (`Ctrl+C`)
2. Reiniciar: `npm run dev`
3. Volver a iniciar LocalTunnel: `lt --port 3000`

## 🌐 Ngrok

Ngrok es una alternativa popular a LocalTunnel con más funcionalidades.

### Instalación

Descarga desde [ngrok.com](https://ngrok.com) o:

```bash
# macOS (Homebrew)
brew install ngrok

# Windows (Chocolatey)
choco install ngrok

# Linux (Snap)
snap install ngrok
```

### Uso

```bash
ngrok http 3000
```

### Ventajas de Ngrok
- URLs más estables
- Panel de inspección web
- Replay de requests
- Autenticación HTTP básica
- HTTPS automático

## 🔌 Otras Opciones

### Cloudflare Tunnel (cloudflared)

```bash
# Instalación
npm install -g cloudflared

# Uso
cloudflared tunnel --url http://localhost:3000
```

### Serveo (sin instalación)

```bash
ssh -R 80:localhost:3000 serveo.net
```

## ⚙️ Configuración de Vite

El archivo `vite.config.ts` ya está configurado para permitir tunneling:

```typescript
export default defineConfig({
  server: {
    port: 3000,
    host: '0.0.0.0', // Permitir acceso desde cualquier IP
    allowedHosts: [
      '.loca.lt',   // LocalTunnel
      '.ngrok.io',  // Ngrok (si lo necesitas)
      '.localhost',
      'localhost'
    ]
  }
})
```

### Permitir Todos los Hosts (solo para desarrollo)

Si usas múltiples servicios de tunneling, puedes permitir todos:

```typescript
export default defineConfig({
  server: {
    port: 3000,
    host: '0.0.0.0',
    allowedHosts: 'all' // ⚠️ Solo en desarrollo
  }
})
```

⚠️ **Advertencia:** `allowedHosts: 'all'` solo debe usarse en desarrollo, nunca en producción.

## 🔒 Seguridad

### Consideraciones Importantes

1. **Solo para desarrollo**: Los túneles exponen tu servidor local a Internet
2. **No usar en producción**: Usa hosting apropiado para producción
3. **Datos sensibles**: No expongas APIs con datos reales
4. **Firewall**: Los túneles pueden bypasear firewalls corporativos
5. **Sesiones temporales**: LocalTunnel y similares son para testing temporal

### Mejores Prácticas

- ✅ Usa túneles solo cuando necesites compartir tu trabajo
- ✅ Cierra el túnel cuando termines
- ✅ No compartas URLs de túnel en lugares públicos
- ✅ Usa autenticación si el servicio lo soporta
- ❌ No expongas variables de entorno sensibles
- ❌ No uses en producción

## 📱 Casos de Uso

### Testing en Dispositivos Móviles

```bash
# 1. Inicia tu servidor
npm run dev

# 2. Crea el túnel
lt --port 3000

# 3. Abre la URL en tu móvil
# https://your-subdomain.loca.lt
```

### Compartir con Cliente

```bash
# Usa Ngrok para URLs más profesionales
ngrok http 3000

# Comparte la URL HTTPS con tu cliente
```

### Testing de Webhooks

```bash
# Expone tu servidor para recibir webhooks
lt --port 3000 --subdomain mi-webhook-test
```

## 🐛 Troubleshooting

### Error: "Blocked request. This host is not allowed"

**Solución:** El `vite.config.ts` ya está actualizado. Solo reinicia el servidor:
```bash
# Detener el servidor (Ctrl+C)
# Reiniciar
npm run dev
```

### LocalTunnel no se conecta

**Solución:**
```bash
# Verifica que el puerto esté correcto
lt --port 3000

# Prueba con otro subdominio
lt --port 3000 --subdomain otro-nombre
```

### Error de CORS

Si ves errores de CORS, actualiza `vite.config.ts`:

```typescript
export default defineConfig({
  server: {
    cors: true,
    // ... resto de configuración
  }
})
```

### Ngrok requiere autenticación

Ngrok gratuito requiere registro:
1. Registrarse en [ngrok.com](https://ngrok.com)
2. Obtener tu authtoken
3. Configurar: `ngrok authtoken YOUR_TOKEN`

## 📊 Comparación de Servicios

| Servicio | Gratis | Instalación | URL Personalizada | Inspección | Estabilidad |
|----------|--------|-------------|-------------------|------------|-------------|
| LocalTunnel | ✅ | npm | ⚠️ limitado | ❌ | ⭐⭐⭐ |
| Ngrok | ⚠️ limitado | download | ✅ (pago) | ✅ | ⭐⭐⭐⭐⭐ |
| Cloudflare | ✅ | npm | ✅ | ⚠️ | ⭐⭐⭐⭐ |
| Serveo | ✅ | no requiere | ❌ | ❌ | ⭐⭐ |

## 🚀 Recomendación

Para desarrollo rápido:
- **LocalTunnel**: Rápido y simple
- **Ngrok**: Más profesional y estable

Para producción:
- Usa servicios de hosting apropiados (Vercel, Netlify, etc.)
