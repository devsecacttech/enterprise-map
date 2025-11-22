# Ejemplos de Uso

Este documento contiene ejemplos prácticos de cómo usar el Canvas Infinito.

## 📝 Ejemplo 1: Aplicación Básica

```tsx
import AdminDashboard from './components/AdminDashboard'

function App() {
  return <AdminDashboard />
}

export default App
```

## 🔄 Ejemplo 2: Con Auto-guardado

```tsx
import { useEffect } from 'react'
import AdminDashboard from './components/AdminDashboard'

function AutoSaveApp() {
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  const handleExport = (json: string) => {
    localStorage.setItem('canvas-state', json)
    setLastSaved(new Date())
  }

  return (
    <div>
      {lastSaved && (
        <div style={{ padding: '10px', background: '#2d2d30', color: '#969696' }}>
          Último guardado: {lastSaved.toLocaleTimeString()}
        </div>
      )}
      <AdminDashboard onExport={handleExport} />
    </div>
  )
}
```

## 🎨 Ejemplo 3: Canvas Personalizado con Temas

```tsx
import { useState } from 'react'
import { useCanvasState } from './hooks/useCanvasState'
import InfiniteCanvas from './components/InfiniteCanvas'

function ThemedCanvas() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')
  const canvasState = useCanvasState()

  const themeColors = {
    light: {
      background: '#ffffff',
      figureColor: '#007acc',
      connectionColor: '#000000'
    },
    dark: {
      background: '#1e1e1e',
      figureColor: '#4a9eff',
      connectionColor: '#007acc'
    }
  }

  return (
    <div style={{ background: themeColors[theme].background, height: '100vh' }}>
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        Toggle Theme
      </button>
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
    </div>
  )
}
```

## 🔌 Ejemplo 4: Integración con API

```tsx
import { useEffect, useState } from 'react'
import { useCanvasState } from './hooks/useCanvasState'
import InfiniteCanvas from './components/InfiniteCanvas'
import { Figure, Connection } from './types'

interface ApiResponse {
  id: string
  name: string
  data: {
    figures: Figure[]
    connections: Connection[]
  }
}

function ApiCanvas({ projectId }: { projectId: string }) {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const canvasState = useCanvasState()

  // Cargar desde API
  useEffect(() => {
    async function loadProject() {
      try {
        const response = await fetch(`/api/projects/${projectId}`)
        const data: ApiResponse = await response.json()

        canvasState.importState(JSON.stringify({
          figures: data.data.figures,
          connections: data.data.connections,
          settings: canvasState.state.settings
        }))
      } catch (error) {
        console.error('Error loading project:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProject()
  }, [projectId])

  // Auto-guardar con debounce
  useEffect(() => {
    if (loading) return

    const timeout = setTimeout(async () => {
      setSaving(true)
      try {
        await fetch(`/api/projects/${projectId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            data: {
              figures: canvasState.state.figures,
              connections: canvasState.state.connections
            }
          })
        })
      } catch (error) {
        console.error('Error saving:', error)
      } finally {
        setSaving(false)
      }
    }, 2000)

    return () => clearTimeout(timeout)
  }, [canvasState.state, projectId, loading])

  if (loading) {
    return <div>Cargando proyecto...</div>
  }

  return (
    <div>
      {saving && <div style={{ position: 'fixed', top: 10, right: 10 }}>Guardando...</div>}
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
    </div>
  )
}
```

## 📊 Ejemplo 5: Diagrama de Flujo Automatizado

```tsx
import { useCanvasState } from './hooks/useCanvasState'
import InfiniteCanvas from './components/InfiniteCanvas'
import { Figure, Connection } from './types'

function FlowDiagramGenerator() {
  const canvasState = useCanvasState()

  const generateFlowDiagram = () => {
    // Limpiar canvas
    canvasState.clearCanvas()

    // Crear nodos
    const nodes: Figure[] = [
      {
        id: 'start',
        type: 'square',
        x: 100,
        y: 100,
        width: 100,
        height: 100,
        zIndex: 0,
        meta: { label: 'Inicio', color: '#4ade80' },
        anchors: []
      },
      {
        id: 'process1',
        type: 'rectangle',
        x: 100,
        y: 250,
        width: 150,
        height: 80,
        zIndex: 0,
        meta: { label: 'Proceso 1', color: '#60a5fa' },
        anchors: []
      },
      {
        id: 'decision',
        type: 'square',
        x: 100,
        y: 380,
        width: 100,
        height: 100,
        zIndex: 0,
        meta: { label: '¿Continuar?', color: '#fbbf24' },
        anchors: []
      },
      {
        id: 'process2',
        type: 'rectangle',
        x: 300,
        y: 400,
        width: 150,
        height: 80,
        zIndex: 0,
        meta: { label: 'Proceso 2', color: '#60a5fa' },
        anchors: []
      },
      {
        id: 'end',
        type: 'square',
        x: 100,
        y: 530,
        width: 100,
        height: 100,
        zIndex: 0,
        meta: { label: 'Fin', color: '#f87171' },
        anchors: []
      }
    ]

    // Agregar nodos
    nodes.forEach(node => canvasState.addFigure(node))

    // Esperar a que se creen los anchors
    setTimeout(() => {
      const figures = canvasState.state.figures

      // Crear conexiones
      const connections: Array<{ from: string; to: string; label?: string }> = [
        { from: 'start', to: 'process1' },
        { from: 'process1', to: 'decision' },
        { from: 'decision', to: 'process2', label: 'Sí' },
        { from: 'decision', to: 'end', label: 'No' },
        { from: 'process2', to: 'end' }
      ]

      connections.forEach(({ from, to }) => {
        const sourceFig = figures.find(f => f.id === from)
        const targetFig = figures.find(f => f.id === to)

        if (sourceFig && targetFig) {
          const sourceAnchor = sourceFig.anchors.find(a => a.position === 'bottom')
          const targetAnchor = targetFig.anchors.find(a => a.position === 'top')

          if (sourceAnchor && targetAnchor) {
            const conn: Connection = {
              id: `conn-${from}-${to}`,
              source: { figureId: from, anchorId: sourceAnchor.id },
              target: { figureId: to, anchorId: targetAnchor.id },
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
            canvasState.addConnection(conn)
          }
        }
      })
    }, 100)
  }

  return (
    <div>
      <button
        onClick={generateFlowDiagram}
        style={{
          position: 'fixed',
          top: 60,
          left: 10,
          zIndex: 1000,
          padding: '10px 20px',
          background: '#007acc',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Generar Diagrama de Flujo
      </button>

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
    </div>
  )
}
```

## 🎮 Ejemplo 6: Canvas con Controles Externos

```tsx
import { useCanvasState } from './hooks/useCanvasState'
import InfiniteCanvas from './components/InfiniteCanvas'
import TopBar from './components/TopBar'
import './ControlledCanvas.css'

function ControlledCanvas() {
  const canvasState = useCanvasState()

  const zoomIn = () => {
    canvasState.updateSettings({
      zoom: Math.min(5, canvasState.state.settings.zoom + 0.1)
    })
  }

  const zoomOut = () => {
    canvasState.updateSettings({
      zoom: Math.max(0.1, canvasState.state.settings.zoom - 0.1)
    })
  }

  const resetView = () => {
    canvasState.updateSettings({
      zoom: 1,
      panX: 0,
      panY: 0
    })
  }

  const addRandomFigure = () => {
    const types: ('rectangle' | 'square')[] = ['rectangle', 'square']
    const type = types[Math.floor(Math.random() * types.length)]

    canvasState.addFigure({
      id: `fig-${Date.now()}`,
      type,
      x: Math.random() * 500,
      y: Math.random() * 500,
      width: type === 'square' ? 100 : 150,
      height: type === 'square' ? 100 : 100,
      zIndex: canvasState.state.figures.length,
      meta: {
        label: `Figura ${canvasState.state.figures.length + 1}`,
        color: `#${Math.floor(Math.random() * 16777215).toString(16)}`
      },
      anchors: []
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div style={{
        padding: '10px',
        background: '#2d2d30',
        display: 'flex',
        gap: '10px',
        alignItems: 'center'
      }}>
        <button onClick={zoomIn}>Zoom +</button>
        <button onClick={zoomOut}>Zoom -</button>
        <button onClick={resetView}>Reset View</button>
        <button onClick={addRandomFigure}>Agregar Figura Aleatoria</button>
        <button onClick={canvasState.undo} disabled={!canvasState.canUndo}>
          Deshacer
        </button>
        <button onClick={canvasState.redo} disabled={!canvasState.canRedo}>
          Rehacer
        </button>
        <span style={{ marginLeft: 'auto', color: '#969696' }}>
          Zoom: {Math.round(canvasState.state.settings.zoom * 100)}%
        </span>
      </div>

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
    </div>
  )
}
```

## 🚀 Ejecutar los Ejemplos

1. Copia cualquiera de los ejemplos anteriores
2. Reemplaza el contenido de `src/App.tsx`
3. Ejecuta `npm run dev`
4. Abre `http://localhost:3000`

## 📚 Recursos Adicionales

- Ver `INTEGRATION.md` para guías de integración más avanzadas
- Ver `README.md` para la documentación completa
- Ver los archivos de tipos en `src/types.ts` para el API completo
