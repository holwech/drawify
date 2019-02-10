export interface ILogPoint {
  time: number;
  x: number;
  y: number;
  type: string;
  stringPath: string;
}

export interface IPoint {
  x: number;
  y: number;
}

export interface IStrokeStyle {
  color: string;
  width: string;
  bufferSize: string;
}