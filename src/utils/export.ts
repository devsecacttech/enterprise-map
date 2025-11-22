import { Figure, Connection, Point } from '../types';

export function exportToJSON(figures: Figure[], connections: Connection[]): string {
  return JSON.stringify(
    {
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      figures,
      connections
    },
    null,
    2
  );
}

export function exportToSVG(
  figures: Figure[],
  connections: Connection[],
  settings: { width: number; height: number }
): string {
  const { width, height } = settings;

  let svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L0,6 L9,3 z" fill="#007acc" />
    </marker>
  </defs>
`;

  // Renderizar conexiones
  connections.forEach(conn => {
    if (conn.points.length < 2) return;

    const pathData = conn.points
      .map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`))
      .join(' ');

    svgContent += `  <path d="${pathData}" fill="none" stroke="${conn.style.color}" stroke-width="${conn.style.strokeWidth}" ${conn.style.arrowHead ? 'marker-end="url(#arrowhead)"' : ''} />\n`;
  });

  // Renderizar figuras
  figures.forEach(fig => {
    svgContent += `  <rect x="${fig.x}" y="${fig.y}" width="${fig.width}" height="${fig.height}" fill="${fig.meta.color}" fill-opacity="0.3" stroke="${fig.meta.color}" stroke-width="2" rx="4" />\n`;
    svgContent += `  <text x="${fig.x + fig.width / 2}" y="${fig.y + fig.height / 2}" text-anchor="middle" dominant-baseline="middle" fill="#ffffff" font-size="14" font-weight="500">${fig.meta.label}</text>\n`;
  });

  svgContent += '</svg>';

  return svgContent;
}

export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportToPNG(
  svgElement: SVGSVGElement,
  filename: string,
  scale: number = 2
): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      const img = new Image();
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        ctx.scale(scale, scale);
        ctx.drawImage(img, 0, 0);
        URL.revokeObjectURL(url);

        canvas.toBlob(blob => {
          if (blob) {
            const pngUrl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = pngUrl;
            a.download = filename;
            a.click();
            URL.revokeObjectURL(pngUrl);
            resolve();
          } else {
            reject(new Error('Could not create blob'));
          }
        });
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Could not load image'));
      };

      img.src = url;
    } catch (error) {
      reject(error);
    }
  });
}

export function getBoundingBox(figures: Figure[]): {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  width: number;
  height: number;
} {
  if (figures.length === 0) {
    return { minX: 0, minY: 0, maxX: 0, maxY: 0, width: 0, height: 0 };
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  figures.forEach(fig => {
    minX = Math.min(minX, fig.x);
    minY = Math.min(minY, fig.y);
    maxX = Math.max(maxX, fig.x + fig.width);
    maxY = Math.max(maxY, fig.y + fig.height);
  });

  return {
    minX,
    minY,
    maxX,
    maxY,
    width: maxX - minX,
    height: maxY - minY
  };
}

export function duplicateFigure(figure: Figure, offset: Point = { x: 20, y: 20 }): Figure {
  return {
    ...figure,
    id: `fig-${Date.now()}-${Math.random()}`,
    x: figure.x + offset.x,
    y: figure.y + offset.y,
    anchors: [] // Los anchors se regenerarán
  };
}

export function isPointInSelectionBox(
  point: Point,
  box: { start: Point; end: Point }
): boolean {
  const minX = Math.min(box.start.x, box.end.x);
  const maxX = Math.max(box.start.x, box.end.x);
  const minY = Math.min(box.start.y, box.end.y);
  const maxY = Math.max(box.start.y, box.end.y);

  return point.x >= minX && point.x <= maxX && point.y >= minY && point.y <= maxY;
}

export function isFigureInSelectionBox(
  figure: Figure,
  box: { start: Point; end: Point }
): boolean {
  const minX = Math.min(box.start.x, box.end.x);
  const maxX = Math.max(box.start.x, box.end.x);
  const minY = Math.min(box.start.y, box.end.y);
  const maxY = Math.max(box.start.y, box.end.y);

  // Verificar si alguna parte de la figura está dentro del box
  return !(
    figure.x + figure.width < minX ||
    figure.x > maxX ||
    figure.y + figure.height < minY ||
    figure.y > maxY
  );
}

export function alignFigures(
  figures: Figure[],
  alignment: 'left' | 'right' | 'top' | 'bottom' | 'center-horizontal' | 'center-vertical'
): Figure[] {
  if (figures.length === 0) return figures;

  const bbox = getBoundingBox(figures);

  return figures.map(fig => {
    let x = fig.x;
    let y = fig.y;

    switch (alignment) {
      case 'left':
        x = bbox.minX;
        break;
      case 'right':
        x = bbox.maxX - fig.width;
        break;
      case 'top':
        y = bbox.minY;
        break;
      case 'bottom':
        y = bbox.maxY - fig.height;
        break;
      case 'center-horizontal':
        x = bbox.minX + (bbox.width - fig.width) / 2;
        break;
      case 'center-vertical':
        y = bbox.minY + (bbox.height - fig.height) / 2;
        break;
    }

    return { ...fig, x, y };
  });
}

export function distributeFigures(
  figures: Figure[],
  direction: 'horizontal' | 'vertical'
): Figure[] {
  if (figures.length < 3) return figures;

  const sorted = [...figures].sort((a, b) => {
    return direction === 'horizontal' ? a.x - b.x : a.y - b.y;
  });

  const first = sorted[0];
  const last = sorted[sorted.length - 1];

  const totalSpace =
    direction === 'horizontal'
      ? last.x + last.width - first.x
      : last.y + last.height - first.y;

  const totalFigureSize = sorted.reduce(
    (sum, fig) => sum + (direction === 'horizontal' ? fig.width : fig.height),
    0
  );

  const spacing = (totalSpace - totalFigureSize) / (sorted.length - 1);

  let currentPos = direction === 'horizontal' ? first.x : first.y;

  return sorted.map((fig, index) => {
    if (index === 0 || index === sorted.length - 1) {
      return fig;
    }

    const newFig = { ...fig };
    if (direction === 'horizontal') {
      currentPos += sorted[index - 1].width + spacing;
      newFig.x = currentPos;
    } else {
      currentPos += sorted[index - 1].height + spacing;
      newFig.y = currentPos;
    }

    return newFig;
  });
}
