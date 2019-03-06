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

export enum Action {
  ONWHEEL = 'ONWHEEL',
  POINTER_DOWN = 'POINTER_DOWN',
  POINTER_MOVE = 'POINTER_MOVE',
  POINTER_UP = 'POINTER_UP',
}

export enum BoardState {
  DRAW = 'DRAW',
  PAN = 'PAN',
    }
