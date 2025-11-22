import { Point, Figure, Anchor, AnchorPosition } from '../types';

export function calculateAnchorPosition(
  figure: Figure,
  position: AnchorPosition,
  index: number,
  totalAnchors: number
): Point {
  const { x, y, width, height } = figure;

  switch (position) {
    case 'top':
      return {
        x: x + (width / (totalAnchors + 1)) * (index + 1),
        y: y
      };
    case 'right':
      return {
        x: x + width,
        y: y + (height / (totalAnchors + 1)) * (index + 1)
      };
    case 'bottom':
      return {
        x: x + (width / (totalAnchors + 1)) * (index + 1),
        y: y + height
      };
    case 'left':
      return {
        x: x,
        y: y + (height / (totalAnchors + 1)) * (index + 1)
      };
  }
}

export function updateFigureAnchors(figure: Figure, anchorsPerSide: number = 1): Anchor[] {
  const anchors: Anchor[] = [];
  const positions: AnchorPosition[] = ['top', 'right', 'bottom', 'left'];

  positions.forEach(position => {
    for (let i = 0; i < anchorsPerSide; i++) {
      const pos = calculateAnchorPosition(figure, position, i, anchorsPerSide);
      anchors.push({
        id: `${figure.id}-${position}-${i}`,
        position,
        index: i,
        x: pos.x,
        y: pos.y
      });
    }
  });

  return anchors;
}

export function distance(p1: Point, p2: Point): number {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

export function snapToGrid(point: Point, gridSize: number): Point {
  return {
    x: Math.round(point.x / gridSize) * gridSize,
    y: Math.round(point.y / gridSize) * gridSize
  };
}

export function isPointInRect(point: Point, rect: { x: number; y: number; width: number; height: number }): boolean {
  return (
    point.x >= rect.x &&
    point.x <= rect.x + rect.width &&
    point.y >= rect.y &&
    point.y <= rect.y + rect.height
  );
}

export function generateOrthogonalPath(start: Point, end: Point): Point[] {
  const midX = (start.x + end.x) / 2;

  return [
    start,
    { x: midX, y: start.y },
    { x: midX, y: end.y },
    end
  ];
}

export function generateCurvedPath(start: Point, end: Point, controlPoints: Point[] = []): string {
  if (controlPoints.length === 0) {
    const midX = (start.x + end.x) / 2;
    const midY = (start.y + end.y) / 2;
    return `M ${start.x} ${start.y} Q ${midX} ${start.y}, ${midX} ${midY} T ${end.x} ${end.y}`;
  }

  let path = `M ${start.x} ${start.y}`;
  controlPoints.forEach((cp, i) => {
    if (i === 0) {
      path += ` Q ${cp.x} ${cp.y}`;
    } else {
      path += ` ${cp.x} ${cp.y}`;
    }
  });
  path += ` ${end.x} ${end.y}`;

  return path;
}

export function generateStraightPath(start: Point, end: Point): string {
  return `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
}
