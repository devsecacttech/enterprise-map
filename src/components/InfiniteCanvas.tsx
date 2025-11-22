import { useRef, useState, useCallback, useEffect } from 'react';
import {
  CanvasState,
  Figure,
  Connection,
  Selection,
  FigureType,
  Point,
  ConnectionEndpoint
} from '../types';
import { snapToGrid, isPointInRect } from '../utils/geometry';
import FigureComponent from './Figure';
import ConnectionComponent from './ConnectionComponent';
import './InfiniteCanvas.css';

interface InfiniteCanvasProps {
  state: CanvasState;
  selection: Selection;
  onAddFigure: (figure: Figure) => void;
  onUpdateFigure: (id: string, updates: Partial<Figure>) => void;
  onDeleteFigure: (id: string) => void;
  onAddConnection: (connection: Connection) => void;
  onUpdateConnection: (id: string, updates: Partial<Connection>) => void;
  onDeleteConnection: (id: string) => void;
  onSetSelection: (selection: Selection) => void;
  onUpdateSettings: (settings: Partial<CanvasState['settings']>) => void;
}

type DragMode = 'pan' | 'figure' | 'connection-start' | 'connection-point' | null;

export default function InfiniteCanvas({
  state,
  selection,
  onAddFigure,
  onUpdateFigure,
  onDeleteFigure,
  onAddConnection,
  onUpdateConnection,
  onDeleteConnection,
  onSetSelection,
  onUpdateSettings
}: InfiniteCanvasProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dragMode, setDragMode] = useState<DragMode>(null);
  const [dragStart, setDragStart] = useState<Point>({ x: 0, y: 0 });
  const [dragFigureId, setDragFigureId] = useState<string | null>(null);
  const [dragConnectionId, setDragConnectionId] = useState<string | null>(null);
  const [dragConnectionPointIndex, setDragConnectionPointIndex] = useState<number>(-1);
  const [tempConnection, setTempConnection] = useState<{
    start: Point;
    end: Point;
    sourceEndpoint: ConnectionEndpoint;
  } | null>(null);
  const [nearbyAnchor, setNearbyAnchor] = useState<{ figureId: string; anchorId: string; position: Point } | null>(null);
  const [spacePressed, setSpacePressed] = useState(false);

  const SNAP_DISTANCE = 20; // Distancia en pixels para snap-to-anchor

  const screenToCanvas = useCallback((screenX: number, screenY: number): Point => {
    if (!svgRef.current) return { x: screenX, y: screenY };

    const rect = svgRef.current.getBoundingClientRect();
    const x = (screenX - rect.left - state.settings.panX) / state.settings.zoom;
    const y = (screenY - rect.top - state.settings.panY) / state.settings.zoom;

    return { x, y };
  }, [state.settings.panX, state.settings.panY, state.settings.zoom]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();

      const delta = -e.deltaY * 0.01;
      const newZoom = Math.max(0.1, Math.min(5, state.settings.zoom + delta));

      const rect = svgRef.current?.getBoundingClientRect();
      if (!rect) return;

      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const newPanX = mouseX - (mouseX - state.settings.panX) * (newZoom / state.settings.zoom);
      const newPanY = mouseY - (mouseY - state.settings.panY) * (newZoom / state.settings.zoom);

      onUpdateSettings({
        zoom: newZoom,
        panX: newPanX,
        panY: newPanY
      });
    }
  }, [state.settings, onUpdateSettings]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return;

    const target = e.target as HTMLElement;

    if (target.closest('.figure') || target.closest('.connection') || target.closest('.anchor')) {
      return;
    }

    if (spacePressed || e.button === 1) {
      setDragMode('pan');
      setDragStart({ x: e.clientX, y: e.clientY });
      e.preventDefault();
    } else {
      onSetSelection({ type: null, ids: [] });
    }
  }, [spacePressed, onSetSelection]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (dragMode === 'pan') {
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;

      onUpdateSettings({
        panX: state.settings.panX + dx,
        panY: state.settings.panY + dy
      });

      setDragStart({ x: e.clientX, y: e.clientY });
    } else if (dragMode === 'figure' && dragFigureId) {
      const figure = state.figures.find(f => f.id === dragFigureId);
      if (!figure) return;

      const canvasPos = screenToCanvas(e.clientX, e.clientY);
      const dx = canvasPos.x - dragStart.x;
      const dy = canvasPos.y - dragStart.y;

      let newX = figure.x + dx;
      let newY = figure.y + dy;

      if (state.settings.snapToGrid) {
        const snapped = snapToGrid({ x: newX, y: newY }, state.settings.gridSize);
        newX = snapped.x;
        newY = snapped.y;
      }

      onUpdateFigure(dragFigureId, { x: newX, y: newY });
      setDragStart(canvasPos);
    } else if (dragMode === 'connection-start' && tempConnection) {
      const canvasPos = screenToCanvas(e.clientX, e.clientY);

      // Buscar anchor cercano para snap
      let closestAnchor: { figureId: string; anchorId: string; position: Point; distance: number } | null = null;

      for (const figure of state.figures) {
        // No permitir conectar al mismo figura de origen
        if (figure.id === tempConnection.sourceEndpoint.figureId) continue;

        for (const anchor of figure.anchors) {
          const dist = Math.sqrt(
            Math.pow(anchor.x - canvasPos.x, 2) + Math.pow(anchor.y - canvasPos.y, 2)
          );

          if (dist < SNAP_DISTANCE && (!closestAnchor || dist < closestAnchor.distance)) {
            closestAnchor = {
              figureId: figure.id,
              anchorId: anchor.id,
              position: { x: anchor.x, y: anchor.y },
              distance: dist
            };
          }
        }
      }

      if (closestAnchor) {
        setNearbyAnchor({
          figureId: closestAnchor.figureId,
          anchorId: closestAnchor.anchorId,
          position: closestAnchor.position
        });
        setTempConnection({ ...tempConnection, end: closestAnchor.position });
      } else {
        setNearbyAnchor(null);
        setTempConnection({ ...tempConnection, end: canvasPos });
      }
    } else if (dragMode === 'connection-point' && dragConnectionId !== null) {
      const connection = state.connections.find(c => c.id === dragConnectionId);
      if (!connection) return;

      const canvasPos = screenToCanvas(e.clientX, e.clientY);
      const newPoints = [...connection.points];
      newPoints[dragConnectionPointIndex] = canvasPos;

      onUpdateConnection(dragConnectionId, { points: newPoints });
    }
  }, [
    dragMode,
    dragStart,
    dragFigureId,
    dragConnectionId,
    dragConnectionPointIndex,
    tempConnection,
    state.figures,
    state.connections,
    state.settings,
    screenToCanvas,
    onUpdateFigure,
    onUpdateConnection,
    onUpdateSettings
  ]);

  const handleMouseUp = useCallback((e: React.MouseEvent) => {
    if (dragMode === 'connection-start' && tempConnection) {
      const canvasPos = screenToCanvas(e.clientX, e.clientY);

      // Usar el anchor cercano si existe
      let targetEndpoint: ConnectionEndpoint | null = null;
      let finalEndPoint = tempConnection.end;

      if (nearbyAnchor) {
        targetEndpoint = {
          figureId: nearbyAnchor.figureId,
          anchorId: nearbyAnchor.anchorId
        };
        finalEndPoint = nearbyAnchor.position;
      }

      const connection: Connection = {
        id: `conn-${Date.now()}-${Math.random()}`,
        source: tempConnection.sourceEndpoint,
        target: targetEndpoint,
        points: [tempConnection.start, finalEndPoint],
        style: {
          type: 'orthogonal',
          arrowHead: true,
          strokeWidth: 2,
          color: '#007acc'
        },
        zIndex: 0
      };

      onAddConnection(connection);
      setTempConnection(null);
      setNearbyAnchor(null);
    }

    setDragMode(null);
    setDragFigureId(null);
    setDragConnectionId(null);
    setDragConnectionPointIndex(-1);
  }, [dragMode, tempConnection, nearbyAnchor, screenToCanvas, onAddConnection]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();

    const figureType = e.dataTransfer.getData('application/figure-type') as FigureType;
    if (!figureType) return;

    const canvasPos = screenToCanvas(e.clientX, e.clientY);

    const defaultSize = figureType === 'square' ? 100 : { width: 150, height: 100 };
    const width = typeof defaultSize === 'number' ? defaultSize : defaultSize.width;
    const height = typeof defaultSize === 'number' ? defaultSize : defaultSize.height;

    let x = canvasPos.x - width / 2;
    let y = canvasPos.y - height / 2;

    if (state.settings.snapToGrid) {
      const snapped = snapToGrid({ x, y }, state.settings.gridSize);
      x = snapped.x;
      y = snapped.y;
    }

    const figure: Figure = {
      id: `fig-${Date.now()}-${Math.random()}`,
      type: figureType,
      x,
      y,
      width,
      height,
      zIndex: state.figures.length,
      meta: {
        label: `${figureType === 'square' ? 'Cuadrado' : 'Rectángulo'} ${state.figures.length + 1}`,
        color: '#4a9eff'
      },
      anchors: []
    };

    onAddFigure(figure);
    onSetSelection({ type: 'figure', ids: [figure.id] });
  }, [state.figures, state.settings, screenToCanvas, onAddFigure, onSetSelection]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  const handleFigureMouseDown = useCallback((figureId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    if (!selection.ids.includes(figureId)) {
      onSetSelection({ type: 'figure', ids: [figureId] });
    }

    setDragMode('figure');
    setDragFigureId(figureId);
    setDragStart(screenToCanvas(e.clientX, e.clientY));
  }, [selection, onSetSelection, screenToCanvas]);

  const handleAnchorMouseDown = useCallback((figureId: string, anchorId: string, anchorPos: Point, e: React.MouseEvent) => {
    e.stopPropagation();

    setDragMode('connection-start');
    setTempConnection({
      start: anchorPos,
      end: anchorPos,
      sourceEndpoint: { figureId, anchorId }
    });
  }, []);

  const handleConnectionPointMouseDown = useCallback((connectionId: string, pointIndex: number, e: React.MouseEvent) => {
    e.stopPropagation();

    setDragMode('connection-point');
    setDragConnectionId(connectionId);
    setDragConnectionPointIndex(pointIndex);

    onSetSelection({ type: 'connectionPoint', ids: [connectionId], pointIndex });
  }, [onSetSelection]);

  const handleConnectionClick = useCallback((connectionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onSetSelection({ type: 'connection', ids: [connectionId] });
  }, [onSetSelection]);

  const handleConnectionDoubleClick = useCallback((connectionId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    const connection = state.connections.find(c => c.id === connectionId);
    if (!connection) return;

    const canvasPos = screenToCanvas(e.clientX, e.clientY);

    const newPoints = [...connection.points];
    let insertIndex = 1;

    for (let i = 0; i < newPoints.length - 1; i++) {
      const p1 = newPoints[i];
      const p2 = newPoints[i + 1];

      const dist1 = Math.sqrt(Math.pow(canvasPos.x - p1.x, 2) + Math.pow(canvasPos.y - p1.y, 2));
      const dist2 = Math.sqrt(Math.pow(canvasPos.x - p2.x, 2) + Math.pow(canvasPos.y - p2.y, 2));
      const distLine = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));

      if (Math.abs(dist1 + dist2 - distLine) < 5) {
        insertIndex = i + 1;
        break;
      }
    }

    newPoints.splice(insertIndex, 0, canvasPos);
    onUpdateConnection(connectionId, { points: newPoints });
  }, [state.connections, screenToCanvas, onUpdateConnection]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' && !spacePressed && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        setSpacePressed(true);
      }

      if ((e.key === 'Delete' || e.key === 'Backspace') && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();

        if (selection.type === 'figure') {
          selection.ids.forEach(id => onDeleteFigure(id));
        } else if (selection.type === 'connection') {
          selection.ids.forEach(id => onDeleteConnection(id));
        } else if (selection.type === 'connectionPoint' && selection.pointIndex !== undefined) {
          const connection = state.connections.find(c => c.id === selection.ids[0]);
          if (connection && connection.points.length > 2) {
            const newPoints = connection.points.filter((_, i) => i !== selection.pointIndex);
            onUpdateConnection(connection.id, { points: newPoints });
          }
        }
      }

      if (e.key === 'Escape') {
        onSetSelection({ type: null, ids: [] });
        setTempConnection(null);
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        setSpacePressed(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [spacePressed, selection, state.connections, onDeleteFigure, onDeleteConnection, onUpdateConnection, onSetSelection]);

  const sortedFigures = [...state.figures].sort((a, b) => a.zIndex - b.zIndex);
  const sortedConnections = [...state.connections].sort((a, b) => a.zIndex - b.zIndex);

  return (
    <div className="infinite-canvas-container">
      <svg
        ref={svgRef}
        className={`infinite-canvas ${spacePressed ? 'panning' : ''}`}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <defs>
          <pattern
            id="grid"
            width={state.settings.gridSize * state.settings.zoom}
            height={state.settings.gridSize * state.settings.zoom}
            patternUnits="userSpaceOnUse"
          >
            <path
              d={`M ${state.settings.gridSize * state.settings.zoom} 0 L 0 0 0 ${state.settings.gridSize * state.settings.zoom}`}
              fill="none"
              stroke="#3e3e42"
              strokeWidth="0.5"
            />
          </pattern>

          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M0,0 L0,6 L9,3 z" fill="#007acc" />
          </marker>
        </defs>

        <g transform={`translate(${state.settings.panX}, ${state.settings.panY}) scale(${state.settings.zoom})`}>
          {state.settings.gridEnabled && (
            <rect
              x={-10000}
              y={-10000}
              width={20000}
              height={20000}
              fill="url(#grid)"
            />
          )}

          {sortedConnections.map(connection => (
            <ConnectionComponent
              key={connection.id}
              connection={connection}
              isSelected={selection.type === 'connection' && selection.ids.includes(connection.id)}
              selectedPointIndex={
                selection.type === 'connectionPoint' &&
                selection.ids.includes(connection.id)
                  ? selection.pointIndex
                  : undefined
              }
              onClick={(e) => handleConnectionClick(connection.id, e)}
              onDoubleClick={(e) => handleConnectionDoubleClick(connection.id, e)}
              onPointMouseDown={(pointIndex, e) => handleConnectionPointMouseDown(connection.id, pointIndex, e)}
            />
          ))}

          {sortedFigures.map(figure => (
            <FigureComponent
              key={figure.id}
              figure={figure}
              isSelected={selection.type === 'figure' && selection.ids.includes(figure.id)}
              onMouseDown={(e) => handleFigureMouseDown(figure.id, e)}
              onAnchorMouseDown={(anchorId, anchorPos, e) => handleAnchorMouseDown(figure.id, anchorId, anchorPos, e)}
            />
          ))}

          {tempConnection && (
            <>
              <line
                x1={tempConnection.start.x}
                y1={tempConnection.start.y}
                x2={tempConnection.end.x}
                y2={tempConnection.end.y}
                stroke="#007acc"
                strokeWidth={2}
                strokeDasharray="5,5"
                opacity={0.6}
              />
              {nearbyAnchor && (
                <g className="nearby-anchor-highlight">
                  <circle
                    cx={nearbyAnchor.position.x}
                    cy={nearbyAnchor.position.y}
                    r={10}
                    fill="none"
                    stroke="#4ade80"
                    strokeWidth={3}
                    opacity={0.8}
                  >
                    <animate
                      attributeName="r"
                      from="8"
                      to="12"
                      dur="0.8s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      from="1"
                      to="0.4"
                      dur="0.8s"
                      repeatCount="indefinite"
                    />
                  </circle>
                  <circle
                    cx={nearbyAnchor.position.x}
                    cy={nearbyAnchor.position.y}
                    r={6}
                    fill="#4ade80"
                    opacity={0.6}
                  />
                </g>
              )}
            </>
          )}
        </g>
      </svg>

      <div className="canvas-info">
        Zoom: {Math.round(state.settings.zoom * 100)}% | Figuras: {state.figures.length} | Conexiones: {state.connections.length}
      </div>
    </div>
  );
}
