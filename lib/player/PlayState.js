"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Timer_1 = __importDefault(require("../timer/Timer"));
var playInterfaces_1 = require("./playInterfaces");
var PlayState = /** @class */ (function () {
    function PlayState(timer, log, currIdx, state) {
        if (timer === void 0) { timer = new Timer_1.default(); }
        if (log === void 0) { log = []; }
        if (currIdx === void 0) { currIdx = 0; }
        if (state === void 0) { state = playInterfaces_1.PlayStates.STOP; }
        this.timer = timer;
        this.log = log;
        this.currIdx = currIdx;
        this.state = state;
    }
    return PlayState;
}());
exports.default = PlayState;
//# sourceMappingURL=PlayState.js.map