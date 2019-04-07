"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var timerInterfaces_1 = require("./timerInterfaces");
var Timer = /** @class */ (function () {
    function Timer() {
        this.startTime = 0;
        this.stopTime = 0;
        this.pauseTime = 0;
        this.reverseTime = 0;
        this.state = timerInterfaces_1.TimerStates.UINIT;
    }
    Timer.prototype.getTime = function () {
        switch (this.state) {
            case timerInterfaces_1.TimerStates.UINIT:
                return 0;
            case timerInterfaces_1.TimerStates.STARTED:
                return Date.now() - this.startTime;
            case timerInterfaces_1.TimerStates.PAUSED:
                return this.pauseTime - this.startTime;
            case timerInterfaces_1.TimerStates.STOPPED:
                return this.stopTime - this.startTime;
            case timerInterfaces_1.TimerStates.REVERSE:
                var time = 2 * this.reverseTime - this.startTime - Date.now();
                if (time < 0) {
                    return 0;
                }
                else {
                    return time;
                }
        }
    };
    Timer.prototype.getStopTime = function () {
        if (this.state !== timerInterfaces_1.TimerStates.STOPPED) {
            return 0;
        }
        return this.stopTime;
    };
    Timer.prototype.getState = function () {
        return this.state;
    };
    Timer.prototype.restart = function () {
        this.startTime = Date.now();
        this.stopTime = this.startTime;
    };
    Timer.prototype.start = function () {
        switch (this.state) {
            case timerInterfaces_1.TimerStates.UINIT:
                this.startTime = Date.now();
                break;
            case timerInterfaces_1.TimerStates.PAUSED:
                this.startTime += Date.now() - this.pauseTime;
                break;
            case timerInterfaces_1.TimerStates.STOPPED:
                this.startTime = Date.now();
                this.stopTime = this.startTime;
                this.pauseTime = this.startTime;
                break;
            case timerInterfaces_1.TimerStates.REVERSE:
                this.startTime = Date.now() - this.getTime();
                break;
            default:
                break;
        }
        this.state = timerInterfaces_1.TimerStates.STARTED;
    };
    Timer.prototype.reverse = function () {
        switch (this.state) {
            case timerInterfaces_1.TimerStates.UINIT:
                this.reverseTime = this.startTime;
                break;
            case timerInterfaces_1.TimerStates.STARTED:
                this.reverseTime = Date.now();
                break;
            case timerInterfaces_1.TimerStates.PAUSED:
                var currentTime = Date.now();
                this.startTime += currentTime - this.pauseTime;
                this.reverseTime = currentTime;
                break;
            case timerInterfaces_1.TimerStates.STOPPED:
                throw new Error('Cannot run reverse on a stopped timer');
            default:
                break;
        }
        this.state = timerInterfaces_1.TimerStates.REVERSE;
    };
    Timer.prototype.pause = function () {
        switch (this.state) {
            case timerInterfaces_1.TimerStates.UINIT:
                break;
            case timerInterfaces_1.TimerStates.STARTED:
                this.pauseTime = Date.now();
                break;
            case timerInterfaces_1.TimerStates.STOPPED:
                break;
            case timerInterfaces_1.TimerStates.REVERSE:
                var currentTime = Date.now();
                this.startTime = currentTime - this.getTime();
                this.pauseTime = currentTime;
                break;
            default:
                break;
        }
        this.state = timerInterfaces_1.TimerStates.PAUSED;
    };
    Timer.prototype.stop = function () {
        switch (this.state) {
            case timerInterfaces_1.TimerStates.UINIT:
                return;
            case timerInterfaces_1.TimerStates.STARTED:
                this.stopTime = Date.now();
                break;
            case timerInterfaces_1.TimerStates.PAUSED:
                this.stopTime = this.pauseTime;
                break;
            default:
                break;
        }
        this.state = timerInterfaces_1.TimerStates.STOPPED;
    };
    Timer.prototype.bindTimeMonitor = function (timeObj) {
        var _this = this;
        this.timeMonitorInterval = setInterval(function () {
            console.log(_this.state);
            var currentTime = _this.getTime();
            timeObj.minutes = Math.floor((currentTime % (1000 * 60 * 60)) / (1000 * 60));
            timeObj.seconds = Math.floor((currentTime % (1000 * 60)) / 1000);
            console.log(timeObj.seconds);
        }, 1000);
    };
    return Timer;
}());
exports.default = Timer;
//# sourceMappingURL=Timer.js.map