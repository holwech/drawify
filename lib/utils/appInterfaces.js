"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AppStates;
(function (AppStates) {
    AppStates["UINIT"] = "UINIT";
    AppStates["RECORDING"] = "RECORDING";
    AppStates["PLAYING"] = "PLAYING";
})(AppStates = exports.AppStates || (exports.AppStates = {}));
var ActionType;
(function (ActionType) {
    ActionType["RECORD_START"] = "RECORD_START";
    ActionType["RECORD_STOP"] = "RECORD_STOP";
    ActionType["RECORD_PAUSE"] = "RECORD_PAUSE";
    ActionType["PLAY_START"] = "PLAY_START";
    ActionType["PLAY_STOP"] = "PLAY_STOP";
    ActionType["PLAY_PAUSE"] = "PLAY_PAUSE";
    ActionType["PLAY_REVERSE"] = "PLAY_REVERSE";
    ActionType["EVENT_REMOVE_LISTENER"] = "EVENT_REMOVE_LISTENER";
    ActionType["EVENT_ADD_LISTENER"] = "EVENT_ADD_LISTENER";
})(ActionType = exports.ActionType || (exports.ActionType = {}));
//# sourceMappingURL=appInterfaces.js.map