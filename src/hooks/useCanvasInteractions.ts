import { useState, useCallback, useEffect } from 'react';
import { Point } from '../types';

interface UseSelectionBoxReturn {
  selectionBox: {
    start: Point;
    end: Point;
  } | null;
  startSelection: (point: Point) => void;
  updateSelection: (point: Point) => void;
  endSelection: () => void;
  isSelecting: boolean;
}

export function useSelectionBox(): UseSelectionBoxReturn {
  const [selectionBox, setSelectionBox] = useState<{
    start: Point;
    end: Point;
  } | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);

  const startSelection = useCallback((point: Point) => {
    setSelectionBox({
      start: point,
      end: point
    });
    setIsSelecting(true);
  }, []);

  const updateSelection = useCallback((point: Point) => {
    if (!isSelecting) return;
    setSelectionBox(prev => {
      if (!prev) return null;
      return {
        ...prev,
        end: point
      };
    });
  }, [isSelecting]);

  const endSelection = useCallback(() => {
    setIsSelecting(false);
    setSelectionBox(null);
  }, []);

  return {
    selectionBox,
    startSelection,
    updateSelection,
    endSelection,
    isSelecting
  };
}

interface UseKeyboardShortcutsProps {
  onCopy?: () => void;
  onPaste?: () => void;
  onCut?: () => void;
  onSelectAll?: () => void;
  onDelete?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onEscape?: () => void;
}

export function useKeyboardShortcuts(props: UseKeyboardShortcutsProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignorar si estamos en un input
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modifier = isMac ? e.metaKey : e.ctrlKey;

      // Ctrl/Cmd + C: Copiar
      if (modifier && e.key === 'c' && props.onCopy) {
        e.preventDefault();
        props.onCopy();
      }

      // Ctrl/Cmd + V: Pegar
      if (modifier && e.key === 'v' && props.onPaste) {
        e.preventDefault();
        props.onPaste();
      }

      // Ctrl/Cmd + X: Cortar
      if (modifier && e.key === 'x' && props.onCut) {
        e.preventDefault();
        props.onCut();
      }

      // Ctrl/Cmd + A: Seleccionar todo
      if (modifier && e.key === 'a' && props.onSelectAll) {
        e.preventDefault();
        props.onSelectAll();
      }

      // Delete/Backspace: Eliminar
      if ((e.key === 'Delete' || e.key === 'Backspace') && props.onDelete) {
        e.preventDefault();
        props.onDelete();
      }

      // Ctrl/Cmd + Z: Deshacer
      if (modifier && e.key === 'z' && !e.shiftKey && props.onUndo) {
        e.preventDefault();
        props.onUndo();
      }

      // Ctrl/Cmd + Shift + Z o Ctrl/Cmd + Y: Rehacer
      if (
        ((modifier && e.key === 'z' && e.shiftKey) ||
          (modifier && e.key === 'y')) &&
        props.onRedo
      ) {
        e.preventDefault();
        props.onRedo();
      }

      // Escape: Cancelar/deseleccionar
      if (e.key === 'Escape' && props.onEscape) {
        e.preventDefault();
        props.onEscape();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [props]);
}

interface UseClipboardProps {
  onCopy: (data: any) => void;
  onPaste: (data: any) => void;
}

export function useClipboard({ onCopy, onPaste }: UseClipboardProps) {
  const [clipboard, setClipboard] = useState<any>(null);

  const copy = useCallback((data: any) => {
    setClipboard(data);
    onCopy(data);
  }, [onCopy]);

  const paste = useCallback(() => {
    if (clipboard) {
      onPaste(clipboard);
    }
  }, [clipboard, onPaste]);

  const cut = useCallback((data: any) => {
    setClipboard(data);
    onCopy(data);
  }, [onCopy]);

  return {
    copy,
    paste,
    cut,
    hasClipboard: clipboard !== null
  };
}
