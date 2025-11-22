import './TopBar.css';

interface TopBarProps {
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onExport: () => void;
  onImport: () => void;
  onClear: () => void;
  onToggleGrid: () => void;
  gridEnabled: boolean;
  onToggleSnap: () => void;
  snapEnabled: boolean;
}

export default function TopBar({
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onExport,
  onImport,
  onClear,
  onToggleGrid,
  gridEnabled,
  onToggleSnap,
  snapEnabled
}: TopBarProps) {
  return (
    <div className="top-bar" role="toolbar" aria-label="Barra de herramientas principal">
      <div className="top-bar-section">
        <button
          className="top-bar-button"
          onClick={onUndo}
          disabled={!canUndo}
          title="Deshacer (Ctrl+Z)"
          aria-label="Deshacer"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 7v6h6" />
            <path d="M21 17a9 9 0 00-9-9 9 9 0 00-6 2.3L3 13" />
          </svg>
        </button>

        <button
          className="top-bar-button"
          onClick={onRedo}
          disabled={!canRedo}
          title="Rehacer (Ctrl+Y)"
          aria-label="Rehacer"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 7v6h-6" />
            <path d="M3 17a9 9 0 019-9 9 9 0 016 2.3l3 2.7" />
          </svg>
        </button>
      </div>

      <div className="top-bar-divider" />

      <div className="top-bar-section">
        <button
          className={`top-bar-button ${gridEnabled ? 'active' : ''}`}
          onClick={onToggleGrid}
          title="Mostrar/ocultar cuadrícula"
          aria-label="Toggle grid"
          aria-pressed={gridEnabled}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
          </svg>
        </button>

        <button
          className={`top-bar-button ${snapEnabled ? 'active' : ''}`}
          onClick={onToggleSnap}
          title="Ajustar a cuadrícula"
          aria-label="Toggle snap to grid"
          aria-pressed={snapEnabled}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 3v18M3 12h18M8 8l-4-4M16 8l4-4M8 16l-4 4M16 16l4 4" />
          </svg>
        </button>
      </div>

      <div className="top-bar-divider" />

      <div className="top-bar-section">
        <button
          className="top-bar-button"
          onClick={onImport}
          title="Importar estado"
          aria-label="Importar"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
          </svg>
        </button>

        <button
          className="top-bar-button"
          onClick={onExport}
          title="Exportar estado"
          aria-label="Exportar"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
          </svg>
        </button>

        <button
          className="top-bar-button danger"
          onClick={onClear}
          title="Limpiar canvas"
          aria-label="Limpiar todo"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
          </svg>
        </button>
      </div>

      <div className="top-bar-title">
        Canvas Infinito - Admin Dashboard
      </div>
    </div>
  );
}
