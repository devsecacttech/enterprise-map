import { useState } from 'react';
import { FigureType } from '../types';
import './LeftPanel.css';

interface LeftPanelProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function LeftPanel({ isOpen, onToggle }: LeftPanelProps) {
  const [draggedType, setDraggedType] = useState<FigureType | null>(null);

  const handleDragStart = (type: FigureType) => (e: React.DragEvent) => {
    setDraggedType(type);
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('application/figure-type', type);
  };

  const handleDragEnd = () => {
    setDraggedType(null);
  };

  const figures: Array<{ type: FigureType; label: string; icon: JSX.Element }> = [
    {
      type: 'rectangle',
      label: 'Rectángulo',
      icon: (
        <svg width="40" height="30" viewBox="0 0 40 30">
          <rect x="5" y="5" width="30" height="20" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      )
    },
    {
      type: 'square',
      label: 'Cuadrado',
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40">
          <rect x="5" y="5" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      )
    }
  ];

  return (
    <div className={`left-panel ${isOpen ? 'open' : 'collapsed'}`}>
      <button
        className="panel-toggle"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Contraer panel izquierdo' : 'Expandir panel izquierdo'}
        title={isOpen ? 'Contraer panel' : 'Expandir panel'}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          {isOpen ? (
            <path d="M15 18l-6-6 6-6" />
          ) : (
            <path d="M9 18l6-6-6-6" />
          )}
        </svg>
      </button>

      {isOpen && (
        <div className="panel-header">
          <h2>Biblioteca de Figuras</h2>
        </div>
      )}

      <div className="panel-content">
        {figures.map(figure => (
          <div
            key={figure.type}
            className={`figure-item ${draggedType === figure.type ? 'dragging' : ''}`}
            draggable
            onDragStart={handleDragStart(figure.type)}
            onDragEnd={handleDragEnd}
            role="button"
            tabIndex={0}
            aria-label={`Arrastrar ${figure.label}`}
            title={isOpen ? figure.label : undefined}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
              }
            }}
          >
            <div className="figure-icon">
              {figure.icon}
            </div>
            {isOpen && <div className="figure-label">{figure.label}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
