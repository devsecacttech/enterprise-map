import { Figure as FigureType, Point } from '../types';
import './Figure.css';

interface FigureProps {
  figure: FigureType;
  isSelected: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onAnchorMouseDown: (anchorId: string, anchorPos: Point, e: React.MouseEvent) => void;
}

export default function Figure({
  figure,
  isSelected,
  onMouseDown,
  onAnchorMouseDown
}: FigureProps) {
  return (
    <g
      className={`figure ${isSelected ? 'selected' : ''}`}
      onMouseDown={onMouseDown}
      role="button"
      tabIndex={0}
      aria-label={`Figura ${figure.meta.label}`}
      data-figure-id={figure.id}
    >
      <rect
        x={figure.x}
        y={figure.y}
        width={figure.width}
        height={figure.height}
        fill={figure.meta.color}
        fillOpacity={0.3}
        stroke={figure.meta.color}
        strokeWidth={2}
        rx={4}
        className="figure-body"
      />

      {isSelected && (
        <>
          <rect
            x={figure.x - 2}
            y={figure.y - 2}
            width={figure.width + 4}
            height={figure.height + 4}
            fill="none"
            stroke="#007acc"
            strokeWidth={1}
            strokeDasharray="4,4"
            className="selection-box"
            pointerEvents="none"
          />

          <rect
            x={figure.x - 4}
            y={figure.y - 4}
            width={8}
            height={8}
            fill="#007acc"
            className="resize-handle"
          />
          <rect
            x={figure.x + figure.width - 4}
            y={figure.y - 4}
            width={8}
            height={8}
            fill="#007acc"
            className="resize-handle"
          />
          <rect
            x={figure.x - 4}
            y={figure.y + figure.height - 4}
            width={8}
            height={8}
            fill="#007acc"
            className="resize-handle"
          />
          <rect
            x={figure.x + figure.width - 4}
            y={figure.y + figure.height - 4}
            width={8}
            height={8}
            fill="#007acc"
            className="resize-handle"
          />
        </>
      )}

      <text
        x={figure.x + figure.width / 2}
        y={figure.y + figure.height / 2}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#ffffff"
        fontSize="14"
        fontWeight="500"
        pointerEvents="none"
        className="figure-label"
      >
        {figure.meta.label}
      </text>

      {isSelected && figure.anchors.map(anchor => (
        <g
          key={anchor.id}
          className="anchor"
          onMouseDown={(e) => {
            e.stopPropagation();
            onAnchorMouseDown(anchor.id, { x: anchor.x, y: anchor.y }, e);
          }}
        >
          <circle
            cx={anchor.x}
            cy={anchor.y}
            r={6}
            fill="#007acc"
            stroke="#ffffff"
            strokeWidth={2}
            className="anchor-point"
            data-anchor-id={anchor.id}
          />
          <circle
            cx={anchor.x}
            cy={anchor.y}
            r={12}
            fill="transparent"
            className="anchor-hitbox"
          />
        </g>
      ))}
    </g>
  );
}
