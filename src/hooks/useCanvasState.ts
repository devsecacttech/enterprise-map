import { useState, useCallback, useRef } from 'react';
import { CanvasState, Figure, Connection, Selection } from '../types';
import { updateFigureAnchors } from '../utils/geometry';

const MAX_HISTORY = 20;

interface UseCanvasStateReturn {
  state: CanvasState;
  selection: Selection;
  addFigure: (figure: Figure) => void;
  updateFigure: (id: string, updates: Partial<Figure>) => void;
  deleteFigure: (id: string) => void;
  addConnection: (connection: Connection) => void;
  updateConnection: (id: string, updates: Partial<Connection>) => void;
  deleteConnection: (id: string) => void;
  setSelection: (selection: Selection) => void;
  updateSettings: (settings: Partial<CanvasState['settings']>) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  exportState: () => string;
  importState: (json: string) => void;
  clearCanvas: () => void;
}

export function useCanvasState(initialState?: Partial<CanvasState>): UseCanvasStateReturn {
  const [state, setState] = useState<CanvasState>({
    figures: [],
    connections: [],
    settings: {
      zoom: 1,
      panX: 0,
      panY: 0,
      gridEnabled: true,
      gridSize: 20,
      snapToGrid: false,
    },
    ...initialState
  });

  const [selection, setSelection] = useState<Selection>({
    type: null,
    ids: []
  });

  const history = useRef<CanvasState[]>([state]);
  const historyIndex = useRef(0);

  const saveHistory = useCallback((newState: CanvasState) => {
    history.current = history.current.slice(0, historyIndex.current + 1);
    history.current.push(newState);

    if (history.current.length > MAX_HISTORY) {
      history.current.shift();
    } else {
      historyIndex.current++;
    }
  }, []);

  const addFigure = useCallback((figure: Figure) => {
    setState(prev => {
      const newState = {
        ...prev,
        figures: [...prev.figures, {
          ...figure,
          anchors: updateFigureAnchors(figure)
        }]
      };
      saveHistory(newState);
      return newState;
    });
  }, [saveHistory]);

  const updateFigure = useCallback((id: string, updates: Partial<Figure>) => {
    setState(prev => {
      const newFigures = prev.figures.map(f => {
        if (f.id === id) {
          const updated = { ...f, ...updates };
          return {
            ...updated,
            anchors: updateFigureAnchors(updated)
          };
        }
        return f;
      });

      const newConnections = prev.connections.map(conn => {
        const sourceFigure = newFigures.find(f => f.id === conn.source.figureId);
        const targetFigure = conn.target ? newFigures.find(f => f.id === conn.target?.figureId) : null;

        if (sourceFigure && (conn.source.figureId === id || conn.target?.figureId === id)) {
          const points = [...conn.points];

          if (conn.source.figureId === id) {
            const sourceAnchor = sourceFigure.anchors.find(a => a.id === conn.source.anchorId);
            if (sourceAnchor) {
              points[0] = { x: sourceAnchor.x, y: sourceAnchor.y };
            }
          }

          if (conn.target && targetFigure && conn.target.figureId === id) {
            const targetAnchor = targetFigure.anchors.find(a => a.id === conn.target?.anchorId);
            if (targetAnchor) {
              points[points.length - 1] = { x: targetAnchor.x, y: targetAnchor.y };
            }
          }

          return { ...conn, points };
        }

        return conn;
      });

      const newState = {
        ...prev,
        figures: newFigures,
        connections: newConnections
      };
      saveHistory(newState);
      return newState;
    });
  }, [saveHistory]);

  const deleteFigure = useCallback((id: string) => {
    setState(prev => {
      const newState = {
        ...prev,
        figures: prev.figures.filter(f => f.id !== id),
        connections: prev.connections.filter(c =>
          c.source.figureId !== id && c.target?.figureId !== id
        )
      };
      saveHistory(newState);
      return newState;
    });

    if (selection.type === 'figure' && selection.ids.includes(id)) {
      setSelection({ type: null, ids: [] });
    }
  }, [selection, saveHistory]);

  const addConnection = useCallback((connection: Connection) => {
    setState(prev => {
      const newState = {
        ...prev,
        connections: [...prev.connections, connection]
      };
      saveHistory(newState);
      return newState;
    });
  }, [saveHistory]);

  const updateConnection = useCallback((id: string, updates: Partial<Connection>) => {
    setState(prev => {
      const newState = {
        ...prev,
        connections: prev.connections.map(c =>
          c.id === id ? { ...c, ...updates } : c
        )
      };
      saveHistory(newState);
      return newState;
    });
  }, [saveHistory]);

  const deleteConnection = useCallback((id: string) => {
    setState(prev => {
      const newState = {
        ...prev,
        connections: prev.connections.filter(c => c.id !== id)
      };
      saveHistory(newState);
      return newState;
    });

    if (selection.type === 'connection' && selection.ids.includes(id)) {
      setSelection({ type: null, ids: [] });
    }
  }, [selection, saveHistory]);

  const updateSettings = useCallback((settings: Partial<CanvasState['settings']>) => {
    setState(prev => ({
      ...prev,
      settings: { ...prev.settings, ...settings }
    }));
  }, []);

  const undo = useCallback(() => {
    if (historyIndex.current > 0) {
      historyIndex.current--;
      setState(history.current[historyIndex.current]);
    }
  }, []);

  const redo = useCallback(() => {
    if (historyIndex.current < history.current.length - 1) {
      historyIndex.current++;
      setState(history.current[historyIndex.current]);
    }
  }, []);

  const exportState = useCallback(() => {
    return JSON.stringify(state, null, 2);
  }, [state]);

  const importState = useCallback((json: string) => {
    try {
      const newState = JSON.parse(json) as CanvasState;
      setState(newState);
      saveHistory(newState);
    } catch (error) {
      console.error('Error importing state:', error);
    }
  }, [saveHistory]);

  const clearCanvas = useCallback(() => {
    const newState: CanvasState = {
      figures: [],
      connections: [],
      settings: state.settings
    };
    setState(newState);
    saveHistory(newState);
    setSelection({ type: null, ids: [] });
  }, [state.settings, saveHistory]);

  return {
    state,
    selection,
    addFigure,
    updateFigure,
    deleteFigure,
    addConnection,
    updateConnection,
    deleteConnection,
    setSelection,
    updateSettings,
    undo,
    redo,
    canUndo: historyIndex.current > 0,
    canRedo: historyIndex.current < history.current.length - 1,
    exportState,
    importState,
    clearCanvas
  };
}
