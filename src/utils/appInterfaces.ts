export enum AppStates {
  RECORDING = 'RECORDING',
  PLAYING = 'PLAYING',
}

export enum AppSubState {
  START = 'START',
  STOPP = 'STOP',
  PAUSE = 'PAUSED',
  REVERSE = 'REVERSE'
}

export enum ActionType {
  RECORD_ON = 'RECORD_ON',
  RECORD_OFF = 'RECORD_OFF',
  START = 'START',
  STOP = 'STOP',
  PAUSE = 'PAUSE',
  REVERSE = 'REVERSE',
  EVENT_REMOVE_LISTENER = 'EVENT_REMOVE_LISTENER',
  EVENT_ADD_LISTENER = 'EVENT_ADD_LISTENER',
}

export interface IAction {
  action: ActionType;
  option?: string;
}
