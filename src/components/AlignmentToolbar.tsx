import './AlignmentToolbar.css';

interface AlignmentToolbarProps {
  onAlign: (alignment: 'left' | 'right' | 'top' | 'bottom' | 'center-horizontal' | 'center-vertical') => void;
  onDistribute: (direction: 'horizontal' | 'vertical') => void;
  disabled?: boolean;
}

export default function AlignmentToolbar({
  onAlign,
  onDistribute,
  disabled = false
}: AlignmentToolbarProps) {
  return (
    <div className="alignment-toolbar">
      <div className="toolbar-section">
        <span className="toolbar-label">Alinear:</span>
        <button
          className="toolbar-button"
          onClick={() => onAlign('left')}
          disabled={disabled}
          title="Alinear a la izquierda"
          aria-label="Alinear a la izquierda"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="3" y2="18" />
            <rect x="7" y="6" width="7" height="3" />
            <rect x="7" y="11" width="10" height="3" />
            <rect x="7" y="16" width="5" height="3" />
          </svg>
        </button>

        <button
          className="toolbar-button"
          onClick={() => onAlign('center-horizontal')}
          disabled={disabled}
          title="Centrar horizontalmente"
          aria-label="Centrar horizontalmente"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="6" x2="12" y2="18" />
            <rect x="8" y="6" width="8" height="3" />
            <rect x="6" y="11" width="12" height="3" />
            <rect x="9" y="16" width="6" height="3" />
          </svg>
        </button>

        <button
          className="toolbar-button"
          onClick={() => onAlign('right')}
          disabled={disabled}
          title="Alinear a la derecha"
          aria-label="Alinear a la derecha"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="21" y1="6" x2="21" y2="18" />
            <rect x="10" y="6" width="7" height="3" />
            <rect x="7" y="11" width="10" height="3" />
            <rect x="12" y="16" width="5" height="3" />
          </svg>
        </button>

        <div className="toolbar-divider" />

        <button
          className="toolbar-button"
          onClick={() => onAlign('top')}
          disabled={disabled}
          title="Alinear arriba"
          aria-label="Alinear arriba"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="6" y1="3" x2="18" y2="3" />
            <rect x="6" y="7" width="3" height="7" />
            <rect x="11" y="7" width="3" height="10" />
            <rect x="16" y="7" width="3" height="5" />
          </svg>
        </button>

        <button
          className="toolbar-button"
          onClick={() => onAlign('center-vertical')}
          disabled={disabled}
          title="Centrar verticalmente"
          aria-label="Centrar verticalmente"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="6" y1="12" x2="18" y2="12" />
            <rect x="6" y="8" width="3" height="8" />
            <rect x="11" y="6" width="3" height="12" />
            <rect x="16" y="9" width="3" height="6" />
          </svg>
        </button>

        <button
          className="toolbar-button"
          onClick={() => onAlign('bottom')}
          disabled={disabled}
          title="Alinear abajo"
          aria-label="Alinear abajo"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="6" y1="21" x2="18" y2="21" />
            <rect x="6" y="10" width="3" height="7" />
            <rect x="11" y="7" width="3" height="10" />
            <rect x="16" y="12" width="3" height="5" />
          </svg>
        </button>
      </div>

      <div className="toolbar-divider" />

      <div className="toolbar-section">
        <span className="toolbar-label">Distribuir:</span>
        <button
          className="toolbar-button"
          onClick={() => onDistribute('horizontal')}
          disabled={disabled}
          title="Distribuir horizontalmente"
          aria-label="Distribuir horizontalmente"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="8" width="4" height="8" />
            <rect x="10" y="8" width="4" height="8" />
            <rect x="17" y="8" width="4" height="8" />
            <line x1="7" y1="12" x2="10" y2="12" strokeDasharray="2,2" />
            <line x1="14" y1="12" x2="17" y2="12" strokeDasharray="2,2" />
          </svg>
        </button>

        <button
          className="toolbar-button"
          onClick={() => onDistribute('vertical')}
          disabled={disabled}
          title="Distribuir verticalmente"
          aria-label="Distribuir verticalmente"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="8" y="3" width="8" height="4" />
            <rect x="8" y="10" width="8" height="4" />
            <rect x="8" y="17" width="8" height="4" />
            <line x1="12" y1="7" x2="12" y2="10" strokeDasharray="2,2" />
            <line x1="12" y1="14" x2="12" y2="17" strokeDasharray="2,2" />
          </svg>
        </button>
      </div>
    </div>
  );
}
