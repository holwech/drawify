import { IViewBox } from '../Interfaces/BoardInterfaces';

export enum PointerActionType {
  START,
  STOP,
  MOVE,
}

export enum ElementClickActionType {
  REMOVE,
}

export enum Targets {
  DRAW,
  PAN,
  ZOOM,
  CLICK,
  STROKE_PROP,
  BOARD_PROP,
  CLEAR,
  VIEW_BOX,
  END,
  PREDRAW,
}

export enum StrokeAttributes {
  COLOR = 'stroke',
  WIDTH = 'stroke-width',
  BUFFER_SIZE = 'buffer-size',
  FILL = 'fill',
}

export interface IDrawOptions {
  type: PointerActionType;
  event: IPointerEvent;
}

export interface IPanOptions {
  type: PointerActionType;
  event: IPointerEvent;
}

export interface IClickOptions {
  type: ElementClickActionType;
  event: IPointerEvent;
}

export interface IZoomOptions {
  event: IPointerEvent;
}

export interface IPointerEvent {
  id: string;
  deltaY: number;
  clientX: number;
  clientY: number;
}

export interface IStrokePropOptions {
  targetAttr: StrokeAttributes;
  value: any;
}

export interface IStateOptions {
  flag: boolean;
}

export type optionTypes =
  | IDrawOptions
  | IPanOptions
  | IZoomOptions
  | IStrokePropOptions
  | IViewBox
  | IStateOptions
  | IClickOptions;

export interface IAction {
  id?: number;
  time?: number;
  target: Targets;
  options?: optionTypes;
}
