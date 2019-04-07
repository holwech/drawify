"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Timer_1 = __importDefault(require("./timer/Timer"));
var appInterfaces_1 = require("./utils/appInterfaces");
var PlayState_1 = __importDefault(require("./player/PlayState"));
var AppState = /** @class */ (function () {
    function AppState(state, playState, timer) {
        if (state === void 0) { state = appInterfaces_1.AppStates.UINIT; }
        if (playState === void 0) { playState = new PlayState_1.default(); }
        if (timer === void 0) { timer = new Timer_1.default(); }
        this.state = state;
        this.playState = playState;
        this.timer = timer;
    }
    return AppState;
}());
exports.default = AppState;
//# sourceMappingURL=AppState.js.map