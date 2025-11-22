# Características Detalladas

Esta guía detalla todas las características disponibles en el Canvas Infinito.

## 📐 Minimap

El minimap es una vista miniatura del canvas completo que facilita la navegación en diagramas grandes.

### Características
- **Vista en tiempo real**: Muestra todas las figuras y conexiones actualizadas automáticamente
- **Viewport visual**: Rectángulo azul que indica el área visible actual
- **Navegación interactiva**: Click y arrastre para mover rápidamente el viewport
- **Cálculo automático de bounds**: Se ajusta al contenido del canvas
- **Posición fija**: Esquina inferior derecha, no interfiere con el trabajo

### Uso
1. El minimap aparece automáticamente cuando hay figuras en el canvas
2. Click en cualquier parte del minimap para centrar el viewport en esa posición
3. Arrastra el rectángulo azul para moverte por el canvas

### Código
```tsx
<Minimap
  state={canvasState.state}
  viewportWidth={containerWidth}
  viewportHeight={containerHeight}
  onViewportChange={(panX, panY) => {
    canvasState.updateSettings({ panX, panY });
  }}
/>
```

## 🔧 Toolbar de Alineación

Herramienta visual para alinear y distribuir figuras seleccionadas.

### Operaciones de Alineación

#### Alinear a la Izquierda
Alinea todas las figuras seleccionadas al borde izquierdo de la figura más a la izquierda.

#### Alinear a la Derecha
Alinea todas las figuras seleccionadas al borde derecho de la figura más a la derecha.

#### Alinear Arriba
Alinea todas las figuras seleccionadas al borde superior de la figura más alta.

#### Alinear Abajo
Alinea todas las figuras seleccionadas al borde inferior de la figura más baja.

#### Centrar Horizontalmente
Centra todas las figuras horizontalmente respecto al grupo completo.

#### Centrar Verticalmente
Centra todas las figuras verticalmente respecto al grupo completo.

### Operaciones de Distribución

#### Distribuir Horizontalmente
Distribuye 3 o más figuras con espaciado uniforme en el eje horizontal.
Las figuras de los extremos permanecen fijas.

#### Distribuir Verticalmente
Distribuye 3 o más figuras con espaciado uniforme en el eje vertical.
Las figuras de los extremos permanecen fijas.

### Requisitos
- **Alineación**: Mínimo 2 figuras seleccionadas
- **Distribución**: Mínimo 3 figuras seleccionadas

### Ejemplo de Uso
```tsx
// Alinear figuras seleccionadas a la izquierda
const selectedFigures = canvasState.state.figures.filter(f =>
  canvasState.selection.ids.includes(f.id)
);

const alignedFigures = alignFigures(selectedFigures, 'left');

alignedFigures.forEach(fig => {
  canvasState.updateFigure(fig.id, { x: fig.x, y: fig.y });
});
```

## 📋 Clipboard

Sistema de portapapeles para copiar, cortar y pegar figuras.

### Operaciones

#### Copiar (`Ctrl/Cmd + C`)
- Copia las figuras seleccionadas al portapapeles interno
- No modifica el canvas
- Puede copiar múltiples figuras a la vez

#### Pegar (`Ctrl/Cmd + V`)
- Pega las figuras del portapapeles
- Las figuras se crean con un offset de `{x: 20, y: 20}` respecto a las originales
- Genera nuevos IDs automáticamente
- Los anchors se regeneran automáticamente

#### Cortar (`Ctrl/Cmd + X`)
- Copia las figuras al portapapeles
- Elimina las figuras originales del canvas
- Útil para mover figuras de un lugar a otro

### Características
- **Memoria persistente**: El clipboard mantiene los datos entre operaciones
- **Duplicación inteligente**: Las conexiones NO se copian (solo figuras)
- **Offset automático**: Evita que las figuras pegadas queden exactamente encima

### Código Interno
```tsx
const clipboard = useClipboard({
  onCopy: (data) => {
    console.log('Copied:', data);
  },
  onPaste: (data) => {
    if (data && Array.isArray(data)) {
      data.forEach((fig: Figure) => {
        const duplicated = duplicateFigure(fig);
        canvasState.addFigure(duplicated);
      });
    }
  }
});
```

## ⌨️ Atajos de Teclado Completos

### Edición
| Atajo | Acción |
|-------|--------|
| `Ctrl/Cmd + Z` | Deshacer |
| `Ctrl/Cmd + Y` o `Ctrl/Cmd + Shift + Z` | Rehacer |
| `Delete` o `Backspace` | Eliminar selección |
| `Esc` | Deseleccionar todo |

### Clipboard
| Atajo | Acción |
|-------|--------|
| `Ctrl/Cmd + C` | Copiar selección |
| `Ctrl/Cmd + V` | Pegar |
| `Ctrl/Cmd + X` | Cortar selección |
| `Ctrl/Cmd + A` | Seleccionar todo |

### Navegación
| Atajo | Acción |
|-------|--------|
| `Espacio + Drag` | Pan (mover viewport) |
| `Ctrl/Cmd + Scroll` | Zoom in/out |

### Notas
- Los atajos **NO funcionan** cuando hay un `<input>` o `<textarea>` con foco
- En Mac usa `Cmd`, en Windows/Linux usa `Ctrl`
- La detección de plataforma es automática

## 🎯 Exportación Avanzada

### Exportar a JSON
```tsx
const json = canvasState.exportState();
// Incluye: figures, connections, settings
```

### Exportar a SVG
```tsx
import { exportToSVG, downloadFile } from './utils/export';

const svgContent = exportToSVG(
  canvasState.state.figures,
  canvasState.state.connections,
  { width: 1000, height: 800 }
);

downloadFile(svgContent, 'mi-diagrama.svg', 'image/svg+xml');
```

### Exportar a PNG
```tsx
import { exportToPNG } from './utils/export';

const svgElement = document.querySelector('svg');
if (svgElement) {
  await exportToPNG(svgElement, 'mi-diagrama.png', 2); // 2x resolution
}
```

## 🔍 Menú Contextual (Preparado)

El sistema de menú contextual está implementado y listo para agregar opciones personalizadas.

### Estructura
```tsx
interface ContextMenuItem {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  shortcut?: string;
  divider?: boolean;
}
```

### Ejemplo de Uso Futuro
```tsx
setContextMenu({
  position: { x: e.clientX, y: e.clientY },
  items: [
    {
      label: 'Copiar',
      onClick: () => clipboard.copy(selectedFigures),
      shortcut: 'Ctrl+C'
    },
    {
      label: 'Pegar',
      onClick: () => clipboard.paste(),
      shortcut: 'Ctrl+V',
      disabled: !clipboard.hasClipboard
    },
    { divider: true },
    {
      label: 'Eliminar',
      onClick: () => deleteSelection(),
      shortcut: 'Del'
    }
  ]
});
```

## 🎨 Utilidades Geométricas

### Calcular Bounding Box
```tsx
import { getBoundingBox } from './utils/export';

const bbox = getBoundingBox(canvasState.state.figures);
// Returns: { minX, minY, maxX, maxY, width, height }
```

### Duplicar Figura
```tsx
import { duplicateFigure } from './utils/export';

const duplicated = duplicateFigure(originalFigure, { x: 50, y: 50 });
canvasState.addFigure(duplicated);
```

### Verificar Punto en Selección
```tsx
import { isPointInSelectionBox, isFigureInSelectionBox } from './utils/export';

const inBox = isPointInSelectionBox({ x: 100, y: 200 }, selectionBox);
const figInBox = isFigureInSelectionBox(figure, selectionBox);
```

## 📊 Mejores Prácticas

### Performance
1. **Evita renderizado innecesario**: Usa `React.memo` en componentes personalizados
2. **Throttle/Debounce**: Para operaciones costosas durante el arrastre
3. **Virtualización**: Para más de 1000 nodos, considera virtualización

### UX
1. **Feedback visual**: Siempre muestra estados de hover y selección
2. **Tooltips**: Agrega tooltips a todas las herramientas
3. **Confirmaciones**: Para operaciones destructivas (eliminar todo)

### Accesibilidad
1. **ARIA labels**: Todos los botones tienen `aria-label`
2. **Navegación por teclado**: Soportada completamente
3. **Estados ARIA**: `aria-expanded`, `aria-pressed`, etc.

## 🔮 Características Futuras Planeadas

- [ ] Selección múltiple por área (drag box)
- [ ] Grupos de figuras
- [ ] Capas (layers)
- [ ] Historial visual de cambios
- [ ] Colaboración en tiempo real
- [ ] Plantillas predefinidas
- [ ] Más tipos de figuras (círculo, triángulo, rombo)
- [ ] Estilos de conexión personalizables
- [ ] Exportación a PDF
- [ ] Modo presentación
