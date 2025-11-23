import { useState } from 'react';
import { FigureType } from '../types';
import { useTooltip } from '../hooks/useTooltip';
import './LeftPanel.css';

// Iconos SVG personalizados
const RectangleIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="5" width="18" height="14" rx="2" />
  </svg>
);

const SquareIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" />
  </svg>
);

interface LeftPanelProps {
  isOpen: boolean;
  onToggle: () => void;
}

interface FigureItemProps {
  figure: { type: FigureType; label: string; description: string; icon: JSX.Element };
  draggedType: FigureType | null;
  onDragStart: (type: FigureType) => (e: React.DragEvent) => void;
  onDragEnd: () => void;
  isOpen: boolean;
}

function FigureItem({ figure, draggedType, onDragStart, onDragEnd, isOpen }: FigureItemProps) {
  const { showTooltip, tooltipProps } = useTooltip({ delay: 3000 });

  return (
    <div className="figure-item-wrapper">
      <div
        className={`figure-item ${draggedType === figure.type ? 'dragging' : ''}`}
        draggable
        onDragStart={onDragStart(figure.type)}
        onDragEnd={onDragEnd}
        role="button"
        tabIndex={0}
        aria-label={`Arrastrar ${figure.label}`}
        {...tooltipProps}
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
      {showTooltip && !isOpen && (
        <div className="figure-tooltip">
          <div className="tooltip-title">{figure.label}</div>
          <div className="tooltip-description">{figure.description}</div>
        </div>
      )}
    </div>
  );
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

  const figures: Array<{ type: FigureType; label: string; description: string; icon: JSX.Element }> = [
    {
      type: 'rectangle',
      label: 'Rectángulo',
      description: 'Arrastra para crear un rectángulo en el canvas',
      icon: <RectangleIcon />
    },
    {
      type: 'square',
      label: 'Cuadrado',
      description: 'Arrastra para crear un cuadrado en el canvas',
      icon: <SquareIcon />
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
        {figures.map(figure => <FigureItem key={figure.type} figure={figure} draggedType={draggedType} onDragStart={handleDragStart} onDragEnd={handleDragEnd} isOpen={isOpen} />)}
      </div>
    </div>
  );
}
