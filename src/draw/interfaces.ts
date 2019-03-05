export interface IRecordPoint {
  time: number;
  x: number;
  y: number;
}

export interface IPoint {
  x: number;
  y: number;
}

export interface IStrokeStyle {
  color: string;
  width: number;
  bufferSize: number;
}

export interface IViewBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export enum ActionType {
  DRAW = 'DRAW',
  ZOOM = 'ZOOM',
  PAN = 'PAN',
}
