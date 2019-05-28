import { IViewBox } from "../utils/boardInterfaces";

export enum PointerActionType {
  START,
  STOP,
  MOVE,
}

export enum Targets {
  DRAW = 'DRAW',
  PAN = 'PAN',
  ZOOM = 'ZOOM',
  REMOVE = 'REMOVE',
  STROKE_PROP = 'STROKE_PROPS',
  BOARD_PROP = 'BOARD_PROPS',
  CLEAR = 'CLEAR',
  VIEW_BOX = 'VIEW_BOX',
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

export interface IZoom {
  event: WheelEvent;
}

export interface IStrokePropOptions {
  targetAttr: StrokeAttributes,
  value: any;
};

export interface IViewBoxOptions {
  viewBox: IViewBox;
}

export type optionTypes = IDrawOptions | IPanOptions | IZoom | IStrokePropOptions | IViewBoxOptions;

export interface IAction {
  id: number;
  time: number;
  target: Targets;
  options?: optionTypes;
}