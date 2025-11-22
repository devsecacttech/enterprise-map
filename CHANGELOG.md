# Changelog

Todos los cambios notables de este proyecto serán documentados en este archivo.

## [1.2.0] - 2025-11-22

### ✨ Añadido

- **Snap-to-Anchor Inteligente**: Sistema de ajuste automático de conexiones
  - Detección automática de anchors cercanos (radio de 20px)
  - Feedback visual con highlight verde pulsante
  - Animación suave que crece y pulsa para guiar al usuario
  - Mejora significativa en la precisión de conexión

- **Tooltips Contextuales**: Información al hacer hover
  - Delay inteligente de 3 segundos antes de mostrar
  - Se ocultan automáticamente al mover el mouse
  - Muestran nombre y descripción de cada elemento
  - Animación elegante con fade-in desde la izquierda
  - Implementado con hook personalizado `useTooltip`

- **Iconos Profesionales con lucide-react**:
  - Integración de librería moderna de iconos SVG
  - `RectangleHorizontal`: Icono para crear rectángulos
  - `Square`: Icono para crear cuadrados
  - Totalmente personalizables (tamaño, color, stroke)
  - Alta calidad con diseño consistente

### 🐛 Corregido

- **Canvas con altura completa**: Solucionado problema de canvas "partido"
  - Agregado `display: flex` y `flexDirection: column` al contenedor
  - Implementado `minHeight: 0` y `minWidth: 0` para prevenir overflow
  - Canvas ahora ocupa correctamente todo el espacio vertical

- **Visibilidad de iconos**: Sistema de iconos simplificado
  - Eliminado CSS complejo con `:has()` que causaba problemas
  - Iconos ahora se muestran correctamente en todos los navegadores
  - Mejor compatibilidad cross-browser

- **Errores TypeScript**: Compilación sin errores
  - Corregido error `NodeJS.Timeout` en useTooltip
  - Cambiado a `number` type para window.setTimeout
  - Eliminadas importaciones no utilizadas
  - Build limpio sin warnings

### 🔧 Mejorado

- Layout flex optimizado para mejor responsividad
- CSS limpiado y simplificado
- Hot Module Replacement (HMR) funcionando correctamente
- Documentación actualizada con v1.2.0

### 📚 Documentación

- README actualizado con características v1.2.0
- Sección de Snap-to-Anchor documentada
- Sección de Tooltips documentada
- Sección de Iconos documentada
- CHANGELOG con todas las versiones

## [1.1.0] - 2025-11-22

### Añadido

- **Minimap**: Vista miniatura del canvas para navegación rápida
  - Muestra todas las figuras y conexiones en miniatura
  - Viewport visual resaltado
  - Click y arrastre para navegar
  - Se posiciona en la esquina inferior derecha

- **Toolbar de Alineación**: Herramientas de alineación y distribución
  - Alinear a la izquierda, derecha, arriba, abajo
  - Centrar horizontal y verticalmente
  - Distribuir horizontal y verticalmente
  - Aparece automáticamente cuando se seleccionan 2+ figuras
  - Posicionado en la parte superior central

- **Menú Contextual**: Menú de botón derecho (preparado para futuras opciones)
  - Sistema de items con shortcuts
  - Separadores visuales
  - Cierre automático al hacer click fuera

- **Clipboard Avanzado**: Copiar, cortar y pegar figuras
  - `Ctrl/Cmd + C`: Copiar figuras seleccionadas
  - `Ctrl/Cmd + V`: Pegar figuras
  - `Ctrl/Cmd + X`: Cortar figuras
  - Las figuras pegadas aparecen con offset automático

- **Seleccionar Todo**: Atajo para seleccionar todas las figuras
  - `Ctrl/Cmd + A`: Seleccionar todas las figuras del canvas

- **Utilidades de Exportación**:
  - Función para exportar a SVG
  - Función para exportar a PNG
  - Funciones de alineación y distribución
  - Cálculo de bounding box
  - Duplicación inteligente de figuras

- **Hooks Personalizados**:
  - `useSelectionBox`: Para selección múltiple por área (preparado)
  - `useKeyboardShortcuts`: Manejo centralizado de shortcuts
  - `useClipboard`: Sistema de clipboard interno

### Mejorado

- AdminDashboard ahora incluye todas las nuevas funcionalidades
- Shortcuts de teclado más robustos y completos
- Mejor organización del código en módulos
- Documentación expandida

### Técnico

- Nuevos archivos:
  - `src/hooks/useCanvasInteractions.ts`
  - `src/utils/export.ts`
  - `src/components/Minimap.tsx`
  - `src/components/AlignmentToolbar.tsx`
  - `src/components/ContextMenu.tsx`
  - Y sus respectivos archivos CSS

## [1.0.0] - 2025-11-22

### Añadido

- Implementación inicial del panel admin con canvas infinito
- Layout responsive con 4 zonas
- Canvas infinito con pan y zoom
- Sistema de figuras (rectángulo y cuadrado)
- Puntos de unión (anchors) configurables
- Conexiones dinámicas entre figuras
- Edición de conexiones con puntos intermedios
- Selección individual y múltiple
- Panel de propiedades editable
- Undo/Redo (20 pasos)
- Export/Import JSON
- Grid opcional con snap-to-grid
- Controles de teclado completos
- Accesibilidad (ARIA)
- Documentación completa
