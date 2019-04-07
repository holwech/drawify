"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Timer_1 = __importDefault(require("../timer/Timer"));
var timerInterfaces_1 = require("../timer/timerInterfaces");
describe('core functions', function () {
    it('should return state', function () {
        var timer = new Timer_1.default();
        expect(timer.getState()).toBeDefined();
    });
    it('should return state', function () {
        var timer = new Timer_1.default();
        expect(timer.getTime()).toBeDefined();
    });
});
describe('timer functions', function () {
    it('should restart timer correctly', function () {
        var timer = new Timer_1.default();
        var currTime = 0;
        moveTimeTo(0);
        timer.start();
        moveTimeTo(1000);
        timer.restart();
        moveTimeTo(2000);
        expect(timer.getTime()).toBe(1000);
        moveTimeTo(4000);
        expect(timer.getTime()).toBe(3000);
    });
    it('uninitalized timer should give 0', function () {
        var timer = new Timer_1.default();
        moveTimeTo(0);
        expect(timer.getTime()).toBe(0);
    });
    it('show correc time for started timer', function () {
        var timer = new Timer_1.default();
        moveTimeTo(0);
        timer.start();
        moveTimeTo(1000);
        expect(timer.getState()).toBe(timerInterfaces_1.TimerStates.STARTED);
        expect(timer.getTime()).toBe(1000);
    });
    it('show correct time after pause and then start', function () {
        var timer = new Timer_1.default();
        moveTimeTo(0);
        timer.start();
        moveTimeTo(1000);
        timer.pause();
        moveTimeTo(2000);
        expect(timer.getTime()).toBe(1000);
        timer.start();
        moveTimeTo(3000);
        expect(timer.getTime()).toBe(2000);
    });
    it('show correct time after stop and then start', function () {
        var timer = new Timer_1.default();
        moveTimeTo(0);
        timer.start();
        moveTimeTo(1000);
        expect(timer.getTime()).toBe(1000);
        timer.stop();
        moveTimeTo(2000);
        expect(timer.getTime()).toBe(1000);
        timer.start();
        moveTimeTo(4000);
        expect(timer.getTime()).toBe(2000);
    });
    it('show correct time after start -> reverse -> start', function () {
        var timer = new Timer_1.default();
        moveTimeTo(0);
        timer.start();
        moveTimeTo(4000);
        timer.reverse();
        moveTimeTo(5000);
        expect(timer.getTime()).toBe(3000);
        timer.start();
        moveTimeTo(8000);
        expect(timer.getTime()).toBe(6000);
    });
    it('show correct time when reverse reaches time 0', function () {
        var timer = new Timer_1.default();
        moveTimeTo(0);
        timer.start();
        moveTimeTo(2000);
        timer.reverse();
        moveTimeTo(5000);
        expect(timer.getTime()).toBe(0);
    });
    it('show correct time after start -> pause -> reverse', function () {
        var timer = new Timer_1.default();
        moveTimeTo(0);
        timer.start();
        moveTimeTo(4000);
        timer.pause();
        moveTimeTo(5000);
        timer.reverse();
        moveTimeTo(6000);
        expect(timer.getTime()).toBe(3000);
    });
    it('show correct time after start -> pause -> reverse -> start -> stop', function () {
        var timer = new Timer_1.default();
        moveTimeTo(0);
        timer.start();
        moveTimeTo(3000);
        timer.pause();
        moveTimeTo(4000);
        timer.reverse();
        moveTimeTo(6000);
        timer.start();
        moveTimeTo(8000);
        timer.stop();
        moveTimeTo(10000);
        expect(timer.getTime()).toBe(3000);
    });
    it('show correct time after start -> reverse -> pause -> start -> stop', function () {
        var timer = new Timer_1.default();
        moveTimeTo(0);
        moveTimeTo(1000);
        timer.start();
        moveTimeTo(5000);
        timer.reverse();
        moveTimeTo(7000);
        timer.pause();
        moveTimeTo(9000);
        timer.start();
        moveTimeTo(10000);
        expect(timer.getTime()).toBe(3000);
    });
});
var moveTimeTo = function (newTime) {
    if (newTime !== 0 && Date.now() > newTime) {
        throw new Error('Cannot move time to be less than the current set time');
    }
    Date.now = jest.fn(function () { return newTime; });
};
//# sourceMappingURL=timer.test.js.map