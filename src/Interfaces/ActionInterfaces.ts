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

export interface IStrokeProps {
  [key: string]: any;
  stroke: string;
  'stroke-width': number;
  'buffer-size': number;
  fill: string | undefined;
}

export interface IDrawOptions {
  type: PointerActionType;
  event: PointerEvent;
  strokeProps: IStrokeProps;
}

export interface IPanOptions {
  type: PointerActionType;
  event: PointerEvent;
}

export interface IClickOptions {
  type: ElementClickActionType;
  event: PointerEvent;
}

export interface IZoomOptions {
  event: WheelEvent;
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
  | IViewBox
  | IStateOptions
  | IClickOptions;

export interface IAction<T extends optionTypes> {
  id?: number;
  time?: number;
  target: Targets;
  options?: T;
}