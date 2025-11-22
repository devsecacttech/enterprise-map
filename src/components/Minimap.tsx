import { useRef, useEffect } from 'react';
import { CanvasState } from '../types';
import './Minimap.css';

interface MinimapProps {
  state: CanvasState;
  viewportWidth: number;
  viewportHeight: number;
  onViewportChange: (panX: number, panY: number) => void;
}

export default function Minimap({
  state,
  viewportWidth,
  viewportHeight,
  onViewportChange
}: MinimapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const minimapSize = 200;
  const isDragging = useRef(false);

  const getBounds = () => {
    if (state.figures.length === 0) {
      return { minX: 0, minY: 0, maxX: 1000, maxY: 1000 };
    }

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    state.figures.forEach(fig => {
      minX = Math.min(minX, fig.x);
      minY = Math.min(minY, fig.y);
      maxX = Math.max(maxX, fig.x + fig.width);
      maxY = Math.max(maxY, fig.y + fig.height);
    });

    // Agregar padding
    const padding = 100;
    minX -= padding;
    minY -= padding;
    maxX += padding;
    maxY += padding;

    return { minX, minY, maxX, maxY };
  };

  const drawMinimap = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bounds = getBounds();
    const worldWidth = bounds.maxX - bounds.minX;
    const worldHeight = bounds.maxY - bounds.minY;

    const scale = Math.min(
      minimapSize / worldWidth,
      minimapSize / worldHeight
    );

    // Limpiar canvas
    ctx.clearRect(0, 0, minimapSize, minimapSize);

    // Fondo
    ctx.fillStyle = '#2d2d30';
    ctx.fillRect(0, 0, minimapSize, minimapSize);

    // Transformar coordenadas
    ctx.save();
    ctx.scale(scale, scale);
    ctx.translate(-bounds.minX, -bounds.minY);

    // Dibujar conexiones
    state.connections.forEach(conn => {
      if (conn.points.length < 2) return;

      ctx.strokeStyle = conn.style.color;
      ctx.lineWidth = 1 / scale;
      ctx.beginPath();
      ctx.moveTo(conn.points[0].x, conn.points[0].y);
      for (let i = 1; i < conn.points.length; i++) {
        ctx.lineTo(conn.points[i].x, conn.points[i].y);
      }
      ctx.stroke();
    });

    // Dibujar figuras
    state.figures.forEach(fig => {
      ctx.fillStyle = fig.meta.color;
      ctx.globalAlpha = 0.5;
      ctx.fillRect(fig.x, fig.y, fig.width, fig.height);
      ctx.globalAlpha = 1;

      ctx.strokeStyle = fig.meta.color;
      ctx.lineWidth = 2 / scale;
      ctx.strokeRect(fig.x, fig.y, fig.width, fig.height);
    });

    ctx.restore();

    // Dibujar viewport
    const vpX = -state.settings.panX / state.settings.zoom;
    const vpY = -state.settings.panY / state.settings.zoom;
    const vpW = viewportWidth / state.settings.zoom;
    const vpH = viewportHeight / state.settings.zoom;

    const vpScreenX = (vpX - bounds.minX) * scale;
    const vpScreenY = (vpY - bounds.minY) * scale;
    const vpScreenW = vpW * scale;
    const vpScreenH = vpH * scale;

    ctx.strokeStyle = '#007acc';
    ctx.lineWidth = 2;
    ctx.strokeRect(vpScreenX, vpScreenY, vpScreenW, vpScreenH);

    ctx.fillStyle = 'rgba(0, 122, 204, 0.2)';
    ctx.fillRect(vpScreenX, vpScreenY, vpScreenW, vpScreenH);
  };

  useEffect(() => {
    drawMinimap();
  }, [state, viewportWidth, viewportHeight]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDragging.current = true;
    handleMouseMove(e);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const bounds = getBounds();
    const worldWidth = bounds.maxX - bounds.minX;
    const worldHeight = bounds.maxY - bounds.minY;

    const scale = Math.min(
      minimapSize / worldWidth,
      minimapSize / worldHeight
    );

    const worldX = x / scale + bounds.minX;
    const worldY = y / scale + bounds.minY;

    const newPanX = -worldX * state.settings.zoom + viewportWidth / 2;
    const newPanY = -worldY * state.settings.zoom + viewportHeight / 2;

    onViewportChange(newPanX, newPanY);
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      isDragging.current = false;
    };

    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, []);

  return (
    <div className="minimap-container">
      <canvas
        ref={canvasRef}
        width={minimapSize}
        height={minimapSize}
        className="minimap-canvas"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
      <div className="minimap-label">Minimap</div>
    </div>
  );
}
