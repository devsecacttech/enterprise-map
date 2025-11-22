# Guía de Integración Técnica

Esta guía detalla cómo integrar el Canvas Infinito en diferentes tipos de aplicaciones.

## 📋 Tabla de Contenidos

- [Integración Básica](#integración-básica)
- [Integración con State Management](#integración-con-state-management)
- [Eventos y Callbacks](#eventos-y-callbacks)
- [Persistencia de Datos](#persistencia-de-datos)
- [Configuración Avanzada](#configuración-avanzada)
- [Ejemplos de Uso](#ejemplos-de-uso)

## Integración Básica

### React (TypeScript)

```tsx
import AdminDashboard from './components/AdminDashboard'

function App() {
  return <AdminDashboard />
}

export default App
```

### React (JavaScript)

Si necesitas usar JavaScript en lugar de TypeScript, simplemente elimina los tipos:

```jsx
import AdminDashboard from './components/AdminDashboard'

function App() {
  return <AdminDashboard />
}

export default App
```

### Integración en aplicación existente

```tsx
import { AdminDashboard } from './components/AdminDashboard'

function MyExistingApp() {
  return (
    <div className="my-app">
      <header>Mi Header</header>
      <main>
        <AdminDashboard />
      </main>
      <footer>Mi Footer</footer>
    </div>
  )
}
```

## Integración con State Management

### Con Redux

```tsx
import { useDispatch, useSelector } from 'react-redux'
import { useCanvasState } from './hooks/useCanvasState'
import InfiniteCanvas from './components/InfiniteCanvas'

function CanvasWithRedux() {
  const dispatch = useDispatch()
  const savedState = useSelector(state => state.canvas)

  const canvasState = useCanvasState(savedState)

  // Sincronizar con Redux
  useEffect(() => {
    dispatch({ type: 'CANVAS_UPDATE', payload: canvasState.state })
  }, [canvasState.state, dispatch])

  return (
    <InfiniteCanvas
      state={canvasState.state}
      selection={canvasState.selection}
      onAddFigure={(figure) => {
        canvasState.addFigure(figure)
        dispatch({ type: 'FIGURE_ADDED', payload: figure })
      }}
      // ... otros props
    />
  )
}
```

### Con Zustand

```tsx
import create from 'zustand'
import { CanvasState } from './types'

interface CanvasStore extends CanvasState {
  addFigure: (figure: Figure) => void
  updateFigure: (id: string, updates: Partial<Figure>) => void
  // ... otros métodos
}

const useCanvasStore = create<CanvasStore>((set) => ({
  figures: [],
  connections: [],
  settings: {
    zoom: 1,
    panX: 0,
    panY: 0,
    gridEnabled: true,
    gridSize: 20,
    snapToGrid: false
  },
  addFigure: (figure) => set((state) => ({
    figures: [...state.figures, figure]
  })),
  updateFigure: (id, updates) => set((state) => ({
    figures: state.figures.map(f => f.id === id ? { ...f, ...updates } : f)
  })),
  // ... otros métodos
}))

function CanvasWithZustand() {
  const canvasState = useCanvasStore()

  return (
    <InfiniteCanvas
      state={{
        figures: canvasState.figures,
        connections: canvasState.connections,
        settings: canvasState.settings
      }}
      onAddFigure={canvasState.addFigure}
      onUpdateFigure={canvasState.updateFigure}
      // ... otros props
    />
  )
}
```

### Con Context API

```tsx
import { createContext, useContext, ReactNode } from 'react'
import { useCanvasState } from './hooks/useCanvasState'

const CanvasContext = createContext(null)

export function CanvasProvider({ children }: { children: ReactNode }) {
  const canvasState = useCanvasState()

  return (
    <CanvasContext.Provider value={canvasState}>
      {children}
    </CanvasContext.Provider>
  )
}

export function useCanvas() {
  const context = useContext(CanvasContext)
  if (!context) throw new Error('useCanvas must be used within CanvasProvider')
  return context
}

// Uso
function App() {
  return (
    <CanvasProvider>
      <MyCanvasApp />
    </CanvasProvider>
  )
}

function MyCanvasApp() {
  const canvasState = useCanvas()

  return (
    <InfiniteCanvas
      state={canvasState.state}
      selection={canvasState.selection}
      // ... props
    />
  )
}
```

## Eventos y Callbacks

### Escuchar todos los eventos

```tsx
import AdminDashboard from './components/AdminDashboard'

function App() {
  const handleExport = (json: string) => {
    console.log('Canvas exportado:', json)
    // Enviar a servidor
    fetch('/api/canvas/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: json
    })
  }

  const handleImport = (json: string) => {
    console.log('Canvas importado:', json)
    // Procesar importación
  }

  return (
    <AdminDashboard
      onExport={handleExport}
      onImport={handleImport}
    />
  )
}
```

### Callbacks personalizados con InfiniteCanvas

```tsx
import { useCanvasState } from './hooks/useCanvasState'
import InfiniteCanvas from './components/InfiniteCanvas'

function CustomCanvas() {
  const canvasState = useCanvasState()

  return (
    <InfiniteCanvas
      state={canvasState.state}
      selection={canvasState.selection}
      onAddFigure={(figure) => {
        console.log('Figura agregada:', figure)
        canvasState.addFigure(figure)
        // Analytics
        analytics.track('figure_created', { type: figure.type })
      }}
      onUpdateFigure={(id, updates) => {
        console.log('Figura actualizada:', id, updates)
        canvasState.updateFigure(id, updates)
      }}
      onDeleteFigure={(id) => {
        console.log('Figura eliminada:', id)
        if (confirm('¿Seguro que quieres eliminar esta figura?')) {
          canvasState.deleteFigure(id)
        }
      }}
      onAddConnection={(connection) => {
        console.log('Conexión creada:', connection)
        canvasState.addConnection(connection)
      }}
      onUpdateConnection={(id, updates) => {
        console.log('Conexión actualizada:', id, updates)
        canvasState.updateConnection(id, updates)
      }}
      onDeleteConnection={(id) => {
        console.log('Conexión eliminada:', id)
        canvasState.deleteConnection(id)
      }}
      onSetSelection={(selection) => {
        console.log('Selección cambiada:', selection)
        canvasState.setSelection(selection)
      }}
      onUpdateSettings={(settings) => {
        console.log('Configuración actualizada:', settings)
        canvasState.updateSettings(settings)
      }}
    />
  )
}
```

## Persistencia de Datos

### LocalStorage

```tsx
import { useEffect } from 'react'
import { useCanvasState } from './hooks/useCanvasState'
import InfiniteCanvas from './components/InfiniteCanvas'

const STORAGE_KEY = 'canvas-state'

function PersistentCanvas() {
  const canvasState = useCanvasState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : undefined
  })

  // Auto-guardar cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      localStorage.setItem(STORAGE_KEY, canvasState.exportState())
    }, 5000)

    return () => clearInterval(interval)
  }, [canvasState])

  // Guardar al desmontar
  useEffect(() => {
    return () => {
      localStorage.setItem(STORAGE_KEY, canvasState.exportState())
    }
  }, [canvasState])

  return (
    <InfiniteCanvas
      state={canvasState.state}
      // ... props
    />
  )
}
```

### API Backend

```tsx
import { useEffect, useState } from 'react'
import { useCanvasState } from './hooks/useCanvasState'

function BackendCanvas({ canvasId }: { canvasId: string }) {
  const [loading, setLoading] = useState(true)
  const canvasState = useCanvasState()

  // Cargar desde servidor
  useEffect(() => {
    async function loadCanvas() {
      try {
        const response = await fetch(`/api/canvas/${canvasId}`)
        const data = await response.json()
        canvasState.importState(JSON.stringify(data))
      } catch (error) {
        console.error('Error cargando canvas:', error)
      } finally {
        setLoading(false)
      }
    }

    loadCanvas()
  }, [canvasId])

  // Auto-guardar con debounce
  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (!loading) {
        await fetch(`/api/canvas/${canvasId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: canvasState.exportState()
        })
      }
    }, 2000)

    return () => clearTimeout(timeout)
  }, [canvasState.state, canvasId, loading])

  if (loading) return <div>Cargando...</div>

  return (
    <InfiniteCanvas
      state={canvasState.state}
      // ... props
    />
  )
}
```

### IndexedDB

```tsx
import { openDB } from 'idb'

const DB_NAME = 'canvas-db'
const STORE_NAME = 'canvases'

async function saveCanvas(id: string, state: string) {
  const db = await openDB(DB_NAME, 1, {
    upgrade(db) {
      db.createObjectStore(STORE_NAME)
    }
  })
  await db.put(STORE_NAME, state, id)
}

async function loadCanvas(id: string): Promise<string | undefined> {
  const db = await openDB(DB_NAME, 1)
  return await db.get(STORE_NAME, id)
}

function IndexedDBCanvas({ canvasId }: { canvasId: string }) {
  const canvasState = useCanvasState()

  useEffect(() => {
    loadCanvas(canvasId).then(saved => {
      if (saved) canvasState.importState(saved)
    })
  }, [canvasId])

  useEffect(() => {
    const interval = setInterval(() => {
      saveCanvas(canvasId, canvasState.exportState())
    }, 5000)

    return () => clearInterval(interval)
  }, [canvasState, canvasId])

  return <InfiniteCanvas state={canvasState.state} /* ... */ />
}
```

## Configuración Avanzada

### Configuración inicial personalizada

```tsx
import { useCanvasState } from './hooks/useCanvasState'

function CustomizedCanvas() {
  const canvasState = useCanvasState({
    figures: [
      {
        id: 'initial-1',
        type: 'rectangle',
        x: 100,
        y: 100,
        width: 200,
        height: 150,
        zIndex: 0,
        meta: { label: 'Inicio', color: '#4a9eff' },
        anchors: []
      }
    ],
    connections: [],
    settings: {
      zoom: 1.5,
      panX: 200,
      panY: 100,
      gridEnabled: true,
      gridSize: 25,
      snapToGrid: true
    }
  })

  return <InfiniteCanvas state={canvasState.state} /* ... */ />
}
```

### Extensión de tipos de figuras

```tsx
// Actualizar src/types.ts
export type FigureType = 'rectangle' | 'square' | 'circle' | 'triangle'

// Actualizar src/components/LeftPanel.tsx
const figures = [
  // ... figuras existentes
  {
    type: 'circle' as FigureType,
    label: 'Círculo',
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40">
        <circle cx="20" cy="20" r="15" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
]

// Actualizar src/components/Figure.tsx para renderizar círculos
{figure.type === 'circle' ? (
  <circle
    cx={figure.x + figure.width / 2}
    cy={figure.y + figure.height / 2}
    r={figure.width / 2}
    fill={figure.meta.color}
    fillOpacity={0.3}
    stroke={figure.meta.color}
    strokeWidth={2}
  />
) : (
  <rect /* ... */ />
)}
```

## Ejemplos de Uso

### Diagrama de Flujo

```tsx
function FlowDiagramCanvas() {
  const canvasState = useCanvasState()

  const createFlowNode = (label: string, x: number, y: number) => {
    const figure: Figure = {
      id: `node-${Date.now()}-${Math.random()}`,
      type: 'rectangle',
      x,
      y,
      width: 150,
      height: 80,
      zIndex: 0,
      meta: { label, color: '#4a9eff' },
      anchors: []
    }
    canvasState.addFigure(figure)
    return figure.id
  }

  const connectNodes = (sourceId: string, targetId: string) => {
    const sourceFigure = canvasState.state.figures.find(f => f.id === sourceId)
    const targetFigure = canvasState.state.figures.find(f => f.id === targetId)

    if (sourceFigure && targetFigure) {
      const sourceAnchor = sourceFigure.anchors.find(a => a.position === 'right')
      const targetAnchor = targetFigure.anchors.find(a => a.position === 'left')

      if (sourceAnchor && targetAnchor) {
        const connection: Connection = {
          id: `conn-${Date.now()}-${Math.random()}`,
          source: { figureId: sourceId, anchorId: sourceAnchor.id },
          target: { figureId: targetId, anchorId: targetAnchor.id },
          points: [
            { x: sourceAnchor.x, y: sourceAnchor.y },
            { x: targetAnchor.x, y: targetAnchor.y }
          ],
          style: {
            type: 'orthogonal',
            arrowHead: true,
            strokeWidth: 2,
            color: '#007acc'
          },
          zIndex: 0
        }
        canvasState.addConnection(connection)
      }
    }
  }

  const createSimpleFlow = () => {
    const node1 = createFlowNode('Inicio', 100, 200)
    const node2 = createFlowNode('Proceso', 350, 200)
    const node3 = createFlowNode('Fin', 600, 200)

    // Esperar a que se agreguen los anchors
    setTimeout(() => {
      connectNodes(node1, node2)
      connectNodes(node2, node3)
    }, 100)
  }

  return (
    <div>
      <button onClick={createSimpleFlow}>Crear Flujo Simple</button>
      <InfiniteCanvas state={canvasState.state} /* ... */ />
    </div>
  )
}
```

### Mapa Mental

```tsx
function MindMapCanvas() {
  const canvasState = useCanvasState({
    settings: {
      zoom: 1,
      panX: 0,
      panY: 0,
      gridEnabled: false,
      gridSize: 20,
      snapToGrid: false
    }
  })

  const createCentralNode = () => {
    canvasState.addFigure({
      id: 'central',
      type: 'square',
      x: 300,
      y: 200,
      width: 120,
      height: 120,
      zIndex: 0,
      meta: { label: 'Idea Central', color: '#ff6b6b' },
      anchors: []
    })
  }

  return (
    <div>
      <button onClick={createCentralNode}>Crear Nodo Central</button>
      <InfiniteCanvas state={canvasState.state} /* ... */ />
    </div>
  )
}
```

## 🎯 Tips de Performance

1. **Virtualización**: Para más de 1000 nodos, considera implementar virtualización
2. **Memoización**: Usa `React.memo` en componentes personalizados
3. **Debounce**: Aplica debounce en operaciones costosas
4. **Web Workers**: Para cálculos complejos de rutas

## 🐛 Debugging

```tsx
function DebugCanvas() {
  const canvasState = useCanvasState()

  useEffect(() => {
    console.log('Canvas State:', canvasState.state)
  }, [canvasState.state])

  return (
    <div>
      <pre>{JSON.stringify(canvasState.state, null, 2)}</pre>
      <InfiniteCanvas state={canvasState.state} /* ... */ />
    </div>
  )
}
```

## 📞 Soporte

Para más información o ayuda, consulta el README.md principal o abre un issue en el repositorio.
