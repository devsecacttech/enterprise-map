import { Figure } from '../types';
import './RightPanel.css';

interface RightPanelProps {
  isOpen: boolean;
  onToggle: () => void;
  selectedFigure?: Figure;
  onUpdateFigure: (updates: Partial<Figure>) => void;
}

export default function RightPanel({
  isOpen,
  onToggle,
  selectedFigure,
  onUpdateFigure
}: RightPanelProps) {
  return (
    <div className={`right-panel ${isOpen ? 'open' : 'collapsed'}`}>
      <button
        className="panel-toggle"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Contraer panel derecho' : 'Expandir panel derecho'}
        title={isOpen ? 'Contraer panel' : 'Expandir panel'}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          {isOpen ? (
            <path d="M9 18l6-6-6-6" />
          ) : (
            <path d="M15 18l-6-6 6-6" />
          )}
        </svg>
      </button>

      {isOpen && (
        <>
          <div className="panel-header">
            <h2>Propiedades</h2>
          </div>

          <div className="panel-content">
            {selectedFigure ? (
              <div className="properties-form">
                <div className="form-group">
                  <label htmlFor="figure-label">Etiqueta</label>
                  <input
                    id="figure-label"
                    type="text"
                    value={selectedFigure.meta.label}
                    onChange={(e) => onUpdateFigure({
                      meta: { ...selectedFigure.meta, label: e.target.value }
                    })}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="figure-type">Tipo</label>
                  <input
                    id="figure-type"
                    type="text"
                    value={selectedFigure.type}
                    disabled
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="figure-x">X</label>
                    <input
                      id="figure-x"
                      type="number"
                      value={Math.round(selectedFigure.x)}
                      onChange={(e) => onUpdateFigure({ x: Number(e.target.value) })}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="figure-y">Y</label>
                    <input
                      id="figure-y"
                      type="number"
                      value={Math.round(selectedFigure.y)}
                      onChange={(e) => onUpdateFigure({ y: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="figure-width">Ancho</label>
                    <input
                      id="figure-width"
                      type="number"
                      min="20"
                      value={Math.round(selectedFigure.width)}
                      onChange={(e) => onUpdateFigure({ width: Number(e.target.value) })}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="figure-height">Alto</label>
                    <input
                      id="figure-height"
                      type="number"
                      min="20"
                      value={Math.round(selectedFigure.height)}
                      onChange={(e) => onUpdateFigure({ height: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="figure-color">Color</label>
                  <div className="color-input-wrapper">
                    <input
                      id="figure-color"
                      type="color"
                      value={selectedFigure.meta.color}
                      onChange={(e) => onUpdateFigure({
                        meta: { ...selectedFigure.meta, color: e.target.value }
                      })}
                    />
                    <input
                      type="text"
                      value={selectedFigure.meta.color}
                      onChange={(e) => onUpdateFigure({
                        meta: { ...selectedFigure.meta, color: e.target.value }
                      })}
                      pattern="^#[0-9A-Fa-f]{6}$"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="figure-z">Z-Index</label>
                  <input
                    id="figure-z"
                    type="number"
                    value={selectedFigure.zIndex}
                    onChange={(e) => onUpdateFigure({ zIndex: Number(e.target.value) })}
                  />
                </div>
              </div>
            ) : (
              <div className="empty-state">
                <p>Selecciona una figura para editar sus propiedades</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
