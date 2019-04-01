export interface IRecordPoint {
  time: number;
  x: number;
  y: number;
}

export interface IPoint {
  x: number;
  y: number;
}

export interface IStrokeProps {
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

export interface IEvent {
  eventType: EventType;
  time?: number;
  e?: MouseEvent | WheelEvent;
  strokeProps?: IStrokeProps;
  state?: BoardState;
  viewBox?: IViewBox;
}

export interface ILogEvent {
  event: IEvent;
  time: number;
  id: number;
}

export enum EventType {
  ONWHEEL = 'ONWHEEL',
  POINTER_DOWN = 'POINTER_DOWN',
  POINTER_MOVE = 'POINTER_MOVE',
  POINTER_UP = 'POINTER_UP',
  SET_STROKE_PROPS = 'SET_STROKE_PROPS',
  CLEAR = 'CLEAR',
  SET_STATE = 'SET_STATE',
  SET_VIEWBOX = 'SET_VIEWBOX',
}

export enum BoardState {
  DRAW = 'DRAW',
  PAN = 'PAN',
}
