# Changelog

Todos los cambios notables de este proyecto serán documentados en este archivo.

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
