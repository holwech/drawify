import { IStrokePropOptions } from '../Interfaces/ActionInterfaces';
import { IViewBox } from '../Interfaces/BoardInterfaces';

export enum AppStates {
  START = 'START',
  PAUSE = 'PAUSED',
  REVERSE = 'REVERSE',
}

export enum UserActionType {
  RECORD_ON = 'RECORD_ON',
  RECORD_OFF = 'RECORD_OFF',
  START = 'START',
  PAUSE = 'PAUSE',
  STOP = 'STOP',
  REVERSE = 'REVERSE',
  RESET = 'RESET',
  RESTART = 'RESTART',
}

export enum EventType {
  ONWHEEL,
  POINTER_DOWN,
  POINTER_MOVE,
  POINTER_UP,
  CLICK,
  SET_STROKE_PROPS,
  CLEAR,
  RESET,
  STATE_TOGGLE,
  SET_VIEWBOX,
  END,
}

export interface IUserAction {
  action: UserActionType;
  option?: string;
}

export interface IEvent {
  eventType: EventType;
  isEdit?: boolean;
  time?: number;
  id?: number;
  e?: MouseEvent | WheelEvent | TouchEvent;
  state?: boolean;
  viewBox?: IViewBox;
}

export type SVG = HTMLElement & SVGElement & SVGSVGElement;
