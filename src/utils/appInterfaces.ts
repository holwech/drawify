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
  RESET = 'RESET',
}

export interface IAction {
  action: ActionType;
  option?: string;
}
