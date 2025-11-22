import { Connection, Point } from '../types';
import { generateOrthogonalPath, generateCurvedPath, generateStraightPath } from '../utils/geometry';
import './ConnectionComponent.css';

interface ConnectionComponentProps {
  connection: Connection;
  isSelected: boolean;
  selectedPointIndex?: number;
  onClick: (e: React.MouseEvent) => void;
  onDoubleClick: (e: React.MouseEvent) => void;
  onPointMouseDown: (pointIndex: number, e: React.MouseEvent) => void;
}

export default function ConnectionComponent({
  connection,
  isSelected,
  selectedPointIndex,
  onClick,
  onDoubleClick,
  onPointMouseDown
}: ConnectionComponentProps) {
  const renderPath = () => {
    if (connection.points.length < 2) return '';

    const start = connection.points[0];
    const end = connection.points[connection.points.length - 1];

    if (connection.style.type === 'straight') {
      return generateStraightPath(start, end);
    } else if (connection.style.type === 'curved') {
      const controlPoints = connection.points.slice(1, -1);
      return generateCurvedPath(start, end, controlPoints);
    } else {
      const points = connection.style.type === 'orthogonal' && connection.points.length === 2
        ? generateOrthogonalPath(start, end)
        : connection.points;

      return points.map((p, i) =>
        i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`
      ).join(' ');
    }
  };

  return (
    <g
      className={`connection ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
    >
      <path
        d={renderPath()}
        fill="none"
        stroke="transparent"
        strokeWidth={connection.style.strokeWidth + 10}
        className="connection-hitbox"
        pointerEvents="stroke"
      />

      <path
        d={renderPath()}
        fill="none"
        stroke={connection.style.color}
        strokeWidth={connection.style.strokeWidth}
        markerEnd={connection.style.arrowHead ? 'url(#arrowhead)' : undefined}
        className="connection-path"
        pointerEvents="none"
      />

      {isSelected && connection.points.map((point, index) => (
        <g
          key={index}
          className="connection-point"
          onMouseDown={(e) => {
            e.stopPropagation();
            onPointMouseDown(index, e);
          }}
        >
          <circle
            cx={point.x}
            cy={point.y}
            r={6}
            fill={selectedPointIndex === index ? '#ffffff' : '#007acc'}
            stroke="#ffffff"
            strokeWidth={2}
            className="point-handle"
          />
          <circle
            cx={point.x}
            cy={point.y}
            r={12}
            fill="transparent"
            className="point-hitbox"
          />
        </g>
      ))}
    </g>
  );
}
