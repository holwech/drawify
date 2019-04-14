export enum AppStates {
  RECORDING = 'RECORDING',
  PLAYING = 'PLAYING',
}

export enum AppSubState {
  START = 'START',
  PAUSE = 'PAUSED',
  REVERSE = 'REVERSE'
}

export enum ActionType {
  RECORD_ON = 'RECORD_ON',
  RECORD_OFF = 'RECORD_OFF',
  START = 'START',
  PAUSE = 'PAUSE',
  REVERSE = 'REVERSE',
  RESET = 'RESET',
  RESTART = 'RESTART',
}

export interface IAction {
  action: ActionType;
  option?: string;
}
