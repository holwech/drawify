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
  width: number;
  bufferSize: number;
}

export interface IViewBox {
  x: number;
  y: number;
  width: number;
  height: number;
}
