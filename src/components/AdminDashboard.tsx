import { useState, useCallback } from 'react';
import TopBar from './TopBar';
import LeftPanel from './LeftPanel';
import RightPanel from './RightPanel';
import InfiniteCanvas from './InfiniteCanvas';
import { useCanvasState } from '../hooks/useCanvasState';
import { Figure } from '../types';
import './AdminDashboard.css';

export interface AdminDashboardProps {
  onExport?: (json: string) => void;
  onImport?: (json: string) => void;
}

export default function AdminDashboard({ onExport, onImport }: AdminDashboardProps) {
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);

  const canvasState = useCanvasState();

  const handleExport = useCallback(() => {
    const json = canvasState.exportState();
    onExport?.(json);

    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `canvas-state-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [canvasState, onExport]);

  const handleImport = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const json = event.target?.result as string;
          canvasState.importState(json);
          onImport?.(json);
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }, [canvasState, onImport]);

  const selectedFigure = canvasState.selection.type === 'figure' && canvasState.selection.ids.length === 1
    ? canvasState.state.figures.find(f => f.id === canvasState.selection.ids[0])
    : undefined;

  const handleUpdateSelectedFigure = useCallback((updates: Partial<Figure>) => {
    if (selectedFigure) {
      canvasState.updateFigure(selectedFigure.id, updates);
    }
  }, [selectedFigure, canvasState]);

  return (
    <div className="admin-dashboard">
      <TopBar
        onUndo={canvasState.undo}
        onRedo={canvasState.redo}
        canUndo={canvasState.canUndo}
        canRedo={canvasState.canRedo}
        onExport={handleExport}
        onImport={handleImport}
        onClear={canvasState.clearCanvas}
        onToggleGrid={() => canvasState.updateSettings({
          gridEnabled: !canvasState.state.settings.gridEnabled
        })}
        gridEnabled={canvasState.state.settings.gridEnabled}
        onToggleSnap={() => canvasState.updateSettings({
          snapToGrid: !canvasState.state.settings.snapToGrid
        })}
        snapEnabled={canvasState.state.settings.snapToGrid}
      />

      <div className="dashboard-body">
        <LeftPanel
          isOpen={leftPanelOpen}
          onToggle={() => setLeftPanelOpen(!leftPanelOpen)}
        />

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

        <RightPanel
          isOpen={rightPanelOpen}
          onToggle={() => setRightPanelOpen(!rightPanelOpen)}
          selectedFigure={selectedFigure}
          onUpdateFigure={handleUpdateSelectedFigure}
        />
      </div>
    </div>
  );
}
