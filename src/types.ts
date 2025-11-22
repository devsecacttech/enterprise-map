export type FigureType = 'rectangle' | 'square';

export type AnchorPosition = 'top' | 'right' | 'bottom' | 'left';

export interface Point {
  x: number;
  y: number;
}

export interface Anchor {
  id: string;
  position: AnchorPosition;
  index: number;
  x: number;
  y: number;
}

export interface Figure {
  id: string;
  type: FigureType;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  meta: {
    label: string;
    color: string;
  };
  anchors: Anchor[];
}

export interface ConnectionEndpoint {
  figureId: string;
  anchorId: string;
}

export interface ConnectionStyle {
  type: 'orthogonal' | 'curved' | 'straight';
  arrowHead: boolean;
  strokeWidth: number;
  color: string;
}

export interface Connection {
  id: string;
  source: ConnectionEndpoint;
  target: ConnectionEndpoint | null;
  points: Point[];
  style: ConnectionStyle;
  zIndex: number;
}

export interface CanvasState {
  figures: Figure[];
  connections: Connection[];
  settings: {
    zoom: number;
    panX: number;
    panY: number;
    gridEnabled: boolean;
    gridSize: number;
    snapToGrid: boolean;
  };
}

export interface Selection {
  type: 'figure' | 'connection' | 'connectionPoint' | null;
  ids: string[];
  pointIndex?: number;
}

export type CanvasEventCallbacks = {
  onCreateFigure?: (figure: Figure) => void;
  onUpdateFigure?: (figure: Figure) => void;
  onDeleteFigure?: (figureId: string) => void;
  onMoveFigure?: (figureId: string, x: number, y: number) => void;
  onCreateConnection?: (connection: Connection) => void;
  onUpdateConnection?: (connection: Connection) => void;
  onDeleteConnection?: (connectionId: string) => void;
  onSelectionChange?: (selection: Selection) => void;
};
