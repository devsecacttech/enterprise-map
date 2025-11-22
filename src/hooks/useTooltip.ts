import { useState, useEffect, useRef } from 'react';

interface UseTooltipProps {
  delay?: number;
}

interface UseTooltipReturn {
  showTooltip: boolean;
  tooltipProps: {
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    onMouseMove: () => void;
  };
}

export function useTooltip({ delay = 3000 }: UseTooltipProps = {}): UseTooltipReturn {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastMoveRef = useRef<number>(Date.now());

  useEffect(() => {
    if (isHovering) {
      // Iniciar timeout para mostrar tooltip
      timeoutRef.current = setTimeout(() => {
        setShowTooltip(true);
      }, delay);
    } else {
      // Limpiar timeout y ocultar tooltip
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      setShowTooltip(false);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isHovering, delay]);

  const handleMouseEnter = () => {
    setIsHovering(true);
    lastMoveRef.current = Date.now();
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  const handleMouseMove = () => {
    const now = Date.now();
    const timeSinceLastMove = now - lastMoveRef.current;
    lastMoveRef.current = now;

    // Si se movió el mouse, reiniciar el tooltip
    if (timeSinceLastMove < 100) {
      setShowTooltip(false);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        setShowTooltip(true);
      }, delay);
    }
  };

  return {
    showTooltip,
    tooltipProps: {
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      onMouseMove: handleMouseMove
    }
  };
}
