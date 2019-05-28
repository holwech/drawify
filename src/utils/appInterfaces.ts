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
  ONWHEEL = 'ONWHEEL',
  POINTER_DOWN = 'POINTER_DOWN',
  POINTER_MOVE = 'POINTER_MOVE',
  POINTER_UP = 'POINTER_UP',
  CLICK = 'CLICK',
  SET_STROKE_PROPS = 'SET_STROKE_PROPS',
  CLEAR = 'CLEAR',
  RESET = 'RESET',
  SET_STATE = 'SET_STATE',
  SET_VIEWBOX = 'SET_VIEWBOX',
  END = 'END',
}

export interface IUserAction {
  action: UserActionType;
  option?: string;
}
