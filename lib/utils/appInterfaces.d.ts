export declare enum AppStates {
    UINIT = "UINIT",
    RECORDING = "RECORDING",
    PLAYING = "PLAYING"
}
export declare enum ActionType {
    RECORD_START = "RECORD_START",
    RECORD_STOP = "RECORD_STOP",
    RECORD_PAUSE = "RECORD_PAUSE",
    PLAY_START = "PLAY_START",
    PLAY_STOP = "PLAY_STOP",
    PLAY_PAUSE = "PLAY_PAUSE",
    PLAY_REVERSE = "PLAY_REVERSE",
    EVENT_REMOVE_LISTENER = "EVENT_REMOVE_LISTENER",
    EVENT_ADD_LISTENER = "EVENT_ADD_LISTENER"
}
export interface IAction {
    action: ActionType;
    option?: string;
}