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
  dm?: DOMPoint;
}

export interface IStrokeStyle {
  color: string;
  width: number;
  bufferSize: number;
}
