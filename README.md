# Admin Dashboard - Canvas Infinito Interactivo

Panel de administración con canvas infinito e interactivo para crear diagramas, flujos y mapas visuales con figuras conectables.

## 🚀 Características

### Layout y Controles
- **4 zonas principales**: Barra superior fija, panel izquierdo plegable, panel derecho plegable, canvas central
- **Barra superior**: Iconos de accesos directos con tooltips y accesibilidad por teclado
- **Panel izquierdo**: Biblioteca de figuras (rectángulo y cuadrado) con drag & drop
- **Panel derecho**: Editor de propiedades para figuras seleccionadas
- **Paneles plegables**: Con animaciones suaves y estados ARIA

### Canvas Infinito
- **Pan ilimitado**: Arrastre con espaciador o arrastre del fondo
- **Zoom**: Ctrl+scroll o pinch (0.1x - 5x)
- **Coordenadas absolutas**: Sistema de coordenadas globales persistibles
- **Grid opcional**: Cuadrícula visual con snap-to-grid configurable
- **Alto rendimiento**: Optimizado para 500 nodos y 1000 conexiones

### Figuras
- **Tipos disponibles**: Rectángulo y cuadrado (personalizables)
- **Drag & drop**: Desde panel izquierdo al canvas
- **Selección**: Individual y múltiple (shift+clic)
- **Movimiento**: Arrastre con actualización de conexiones en tiempo real
- **Puntos de unión**: Anchors en cada lado (configurable N por lado)
- **Propiedades editables**: Nombre, tamaño, color, posición

### Conexiones (Flechas)
- **Creación intuitiva**: Clic en anchor → arrastrar → soltar en anchor destino
- **Preview dinámico**: Vista previa durante la creación
- **Tipos de ruta**: Ortogonal, curva o recta
- **Anclaje dinámico**: Se actualiza automáticamente cuando las figuras se mueven
- **Puntos intermedios**: Doble clic en la línea para crear puntos de control
- **Edición**: Arrastrar puntos intermedios para ajustar trayectoria
- **Re-conexión**: Arrastrar extremos a otros anchors

### Interacciones
- **Mouse**:
  - Clic para seleccionar
  - Doble clic para editar o crear puntos intermedios
  - Arrastre para mover
  - Espaciador + arrastre para pan
  - Ctrl+scroll para zoom
- **Teclado**:
  - `Delete/Backspace`: Eliminar selección
  - `Esc`: Deseleccionar
  - `Ctrl/Cmd+Z`: Deshacer
  - `Ctrl/Cmd+Y`: Rehacer
  - `Ctrl/Cmd+C`: Copiar selección
  - `Ctrl/Cmd+V`: Pegar
  - `Ctrl/Cmd+X`: Cortar
  - `Ctrl/Cmd+A`: Seleccionar todo
  - `Espacio`: Modo pan temporal

### 🆕 Características Avanzadas (v1.1.0)

#### Minimap
- **Vista miniatura** del canvas completo en la esquina inferior derecha
- Muestra todas las figuras y conexiones en tiempo real
- **Viewport visual** resaltado en azul
- **Click y arrastre** para navegación rápida por el canvas
- Actualización automática con el contenido

#### Toolbar de Alineación
- Aparece automáticamente cuando seleccionas **2 o más figuras**
- **Alineación**: Izquierda, derecha, arriba, abajo, centro horizontal, centro vertical
- **Distribución**: Espaciado uniforme horizontal o vertical (requiere 3+ figuras)
- Posicionado en la parte superior central para fácil acceso
- Iconos visuales intuitivos para cada operación

#### Clipboard y Duplicación
- **Copiar** (`Ctrl/Cmd+C`): Copia figuras seleccionadas
- **Pegar** (`Ctrl/Cmd+V`): Pega con offset automático
- **Cortar** (`Ctrl/Cmd+X`): Corta y elimina del canvas
- Las figuras duplicadas mantienen todas las propiedades excepto ID

#### Selección Mejorada
- **Seleccionar todo** (`Ctrl/Cmd+A`): Selecciona todas las figuras
- Selección múltiple con indicador visual
- Contador de elementos seleccionados

### ✨ Mejoras UX (v1.2.0)

#### Snap-to-Anchor Inteligente
- **Detección automática**: Las conexiones se ajustan automáticamente a anchors cercanos (radio de 20px)
- **Feedback visual**: Highlight verde pulsante cuando te acercas a un anchor
- **Animación suave**: El highlight crece y pulsa para guiar al usuario
- **Precisión mejorada**: No necesitas hacer clic exactamente en el anchor

#### Tooltips Contextuales
- **Delay inteligente**: Aparecen después de 3 segundos de hover
- **Reseteo por movimiento**: Se ocultan automáticamente si mueves el mouse
- **Información clara**: Nombre y descripción de cada elemento
- **Animación elegante**: Fade-in desde la izquierda

#### Iconos Profesionales
- **Librería lucide-react**: Iconos SVG modernos y escalables
- **Totalmente personalizables**: Tamaño, color y stroke configurables
- **Alta calidad**: Diseño consistente y profesional
- **Iconos actuales**:
  - 📐 **RectangleHorizontal**: Para crear rectángulos
  - ⬜ **Square**: Para crear cuadrados

#### Canvas Optimizado
- **Altura completa**: El canvas ocupa todo el espacio vertical disponible
- **Layout flex mejorado**: Sin overflow ni problemas de scroll
- **Responsive**: Se adapta perfectamente a diferentes tamaños de pantalla

### Persistencia
- **Undo/Redo**: Hasta 20 pasos
- **Export/Import**: JSON completo del estado
- **Formato de datos**:
  ```json
  {
    "figures": [{
      "id": "fig-123",
      "type": "rectangle",
      "x": 100,
      "y": 200,
      "width": 150,
      "height": 100,
      "zIndex": 0,
      "meta": {
        "label": "Mi Figura",
        "color": "#4a9eff"
      },
      "anchors": [...]
    }],
    "connections": [{
      "id": "conn-456",
      "source": {
        "figureId": "fig-123",
        "anchorId": "fig-123-right-0"
      },
      "target": {
        "figureId": "fig-789",
        "anchorId": "fig-789-left-0"
      },
      "points": [{"x": 250, "y": 250}, {"x": 400, "y": 250}],
      "style": {
        "type": "orthogonal",
        "arrowHead": true,
        "strokeWidth": 2,
        "color": "#007acc"
      },
      "zIndex": 0
    }],
    "settings": {
      "zoom": 1,
      "panX": 0,
      "panY": 0,
      "gridEnabled": true,
      "gridSize": 20,
      "snapToGrid": false
    }
  }
  ```

## 📦 Instalación

```bash
npm install
```

## 🔧 Desarrollo

```bash
npm run dev
```

La aplicación se abrirá en `http://localhost:3000`

## 🏗️ Build

```bash
npm run build
```

Los archivos de producción se generarán en `dist/`

## 📚 Integración

### Como aplicación standalone

```tsx
import AdminDashboard from './components/AdminDashboard'

function App() {
  return <AdminDashboard />
}
```

### Con callbacks personalizados

```tsx
import AdminDashboard from './components/AdminDashboard'

function App() {
  return (
    <AdminDashboard
      onExport={(json) => {
        // Enviar a servidor, localStorage, etc.
        console.log('Estado exportado:', json);
      }}
      onImport={(json) => {
        // Procesar importación
        console.log('Estado importado:', json);
      }}
    />
  )
}
```

### Usando el hook de estado directamente

```tsx
import { useCanvasState } from './hooks/useCanvasState'
import InfiniteCanvas from './components/InfiniteCanvas'

function CustomCanvas() {
  const canvasState = useCanvasState({
    figures: [],
    connections: [],
    settings: {
      zoom: 1,
      panX: 0,
      panY: 0,
      gridEnabled: true,
      gridSize: 20,
      snapToGrid: true
    }
  });

  return (
    <InfiniteCanvas
      state={canvasState.state}
      selection={canvasState.selection}
      onAddFigure={canvasState.addFigure}
      onUpdateFigure={canvasState.updateFigure}
      onDeleteFigure={canvasState.deleteFigure}
      onAddConnection={canvasState.addConnection}
      onUpdateConnection={canvasState.updateConnection}
      onDeleteConnection={canvasState.deleteConnection}
      onSetSelection={canvasState.setSelection}
      onUpdateSettings={canvasState.updateSettings}
    />
  )
}
```

## 🎨 Personalización

### Colores y tema

Edita las variables CSS en `src/index.css` o los archivos `.css` de cada componente.

### Tipos de figuras

Para agregar nuevos tipos de figuras:

1. Actualiza el tipo `FigureType` en `src/types.ts`
2. Agrega la definición en `src/components/LeftPanel.tsx`
3. Personaliza el renderizado en `src/components/Figure.tsx`

### Estilos de conexión

Modifica `src/utils/geometry.ts` para agregar nuevos algoritmos de renderizado de rutas.

## 🎯 Props y API

### AdminDashboard

| Prop | Tipo | Descripción |
|------|------|-------------|
| `onExport` | `(json: string) => void` | Callback al exportar estado |
| `onImport` | `(json: string) => void` | Callback al importar estado |

### useCanvasState Hook

```typescript
const {
  state,           // CanvasState actual
  selection,       // Selección actual
  addFigure,       // Agregar figura
  updateFigure,    // Actualizar figura
  deleteFigure,    // Eliminar figura
  addConnection,   // Agregar conexión
  updateConnection,// Actualizar conexión
  deleteConnection,// Eliminar conexión
  setSelection,    // Cambiar selección
  updateSettings,  // Actualizar configuración
  undo,            // Deshacer
  redo,            // Rehacer
  canUndo,         // Puede deshacer
  canRedo,         // Puede rehacer
  exportState,     // Exportar a JSON
  importState,     // Importar desde JSON
  clearCanvas      // Limpiar todo
} = useCanvasState(initialState?);
```

## 🔒 Accesibilidad

- Navegación por teclado completa
- Atributos ARIA apropiados
- Estados focus visibles
- Tooltips descriptivos
- Etiquetas semánticas

## 🧪 Testing

```bash
npm run lint
```

## 📝 Licencia

MIT

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor abre un issue o pull request.
