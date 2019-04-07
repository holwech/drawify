"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Timer_1 = __importDefault(require("../timer/Timer"));
var boardInterfaces_1 = require("../utils/boardInterfaces");
var playInterfaces_1 = require("./playInterfaces");
var PlayController = /** @class */ (function () {
    function PlayController(app, state) {
        this.app = app;
        this.state = state;
        this.state.timer = new Timer_1.default();
        this.state.log = [];
    }
    PlayController.prototype.play = function () {
        switch (this.state.state) {
            case playInterfaces_1.PlayStates.PLAY:
                break;
            case playInterfaces_1.PlayStates.PAUSE:
                this.state.timer.start();
                this.state.state = playInterfaces_1.PlayStates.PLAY;
                this.playEvents();
                break;
            case playInterfaces_1.PlayStates.STOP:
                this.reset();
                this.state.timer.start();
                this.state.state = playInterfaces_1.PlayStates.PLAY;
                this.playEvents();
                break;
            case playInterfaces_1.PlayStates.REVERSE:
                this.state.timer.start();
                this.state.state = playInterfaces_1.PlayStates.PLAY;
                this.playEvents();
                break;
            default:
                break;
        }
        this.state.state = playInterfaces_1.PlayStates.PLAY;
    };
    PlayController.prototype.pause = function () {
        switch (this.state.state) {
            case playInterfaces_1.PlayStates.PLAY:
                this.state.timer.pause();
                break;
            case playInterfaces_1.PlayStates.PAUSE:
                break;
            case playInterfaces_1.PlayStates.STOP:
                this.state.timer.pause();
                break;
            case playInterfaces_1.PlayStates.REVERSE:
                this.state.timer.pause();
                break;
            default:
                break;
        }
        this.state.state = playInterfaces_1.PlayStates.PAUSE;
    };
    PlayController.prototype.stop = function () {
        switch (this.state.state) {
            case playInterfaces_1.PlayStates.PLAY:
                this.state.timer.stop();
                break;
            case playInterfaces_1.PlayStates.PAUSE:
                this.state.timer.stop();
                break;
            case playInterfaces_1.PlayStates.STOP:
                break;
            default:
                break;
        }
        this.state.state = playInterfaces_1.PlayStates.STOP;
    };
    PlayController.prototype.reverse = function () {
        switch (this.state.state) {
            case playInterfaces_1.PlayStates.REVERSE:
                break;
            default:
                this.app.dispatchEvent({ eventType: boardInterfaces_1.EventType.CLEAR });
                this.state.state = playInterfaces_1.PlayStates.REVERSE;
                this.state.timer.reverse();
                this.reversePlayEvents();
                break;
        }
    };
    PlayController.prototype.setEventLog = function (log) {
        this.state.log = log;
    };
    PlayController.prototype.deleteEventLog = function () {
        this.state.log = [];
    };
    PlayController.prototype.reset = function () {
        this.app.dispatchEvent({ eventType: boardInterfaces_1.EventType.CLEAR });
        this.state.currIdx = 0;
        this.state.timer.stop();
    };
    PlayController.prototype.playEvents = function () {
        var _this = this;
        if (this.state.currIdx !== this.state.log.length) {
            setTimeout(function () {
                if (_this.state.state === playInterfaces_1.PlayStates.PLAY) {
                    _this.app.dispatchEvent(_this.state.log[_this.state.currIdx]);
                    _this.state.currIdx++;
                    _this.playEvents();
                }
            }, this.state.log[this.state.currIdx].time - this.state.timer.getTime());
        }
        else {
            this.stop();
        }
    };
    PlayController.prototype.reversePlayEvents = function () {
        var _this = this;
        console.log('playing reverse');
        if (this.state.currIdx >= 0) {
            setTimeout(function () {
                if (_this.state.state === playInterfaces_1.PlayStates.REVERSE) {
                    _this.app.dispatchEvent(_this.state.log[_this.state.currIdx]);
                    _this.state.currIdx--;
                    _this.reversePlayEvents();
                }
            }, this.state.timer.getTime() - this.state.log[this.state.currIdx].time);
        }
        else {
            this.stop();
        }
    };
    return PlayController;
}());
exports.PlayController = PlayController;
//# sourceMappingURL=PlayController.js.map