import { IStrokePropOptions } from "../action/ActionInterfaces";
import { IViewBox } from "./boardInterfaces";

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
  e?: MouseEvent | WheelEvent;
  strokeProps?: IStrokePropOptions;
  state?: boolean;
  viewBox?: IViewBox;
}