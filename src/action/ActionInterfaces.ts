import { IViewBox } from '../utils/boardInterfaces';

export enum PointerActionType {
  START,
  STOP,
  MOVE,
}

export enum Targets {
  DRAW ,
  PAN,
  ZOOM,
  BOARD_STATE,
  REMOVE,
  STROKE_PROP,
  BOARD_PROP,
  CLEAR,
  VIEW_BOX,
}

export enum StrokeAttributes {
  COLOR = 'stroke',
  WIDTH = 'stroke-width',
  BUFFER_SIZE = 'buffer-size',
  FILL = 'fill',
}

export interface IDrawOptions {
  type: PointerActionType;
  event: MouseEvent;
}

export interface IPanOptions {
  type: PointerActionType;
  event: MouseEvent;
}

export interface IZoomOptions {
  event: WheelEvent;
}

export interface IStrokePropOptions {
  targetAttr: StrokeAttributes,
  value: any;
};

export type optionTypes = IDrawOptions | IPanOptions | IZoomOptions | IStrokePropOptions | IViewBox;

export interface IAction {
  id: number;
  time: number;
  target: Targets;
  options?: optionTypes;
}