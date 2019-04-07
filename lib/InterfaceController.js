"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AppController_1 = require("./AppController");
var boardInterfaces_1 = require("./utils/boardInterfaces");
var appInterfaces_1 = require("./utils/appInterfaces");
var Controller = /** @class */ (function () {
    function Controller(svgID, strokeProps) {
        this.app = new AppController_1.AppController(svgID, strokeProps);
    }
    Controller.prototype.startPlayer = function () {
        this.app.dispatchAction({ action: appInterfaces_1.ActionType.PLAY_START });
    };
    Controller.prototype.reversePlayer = function () {
        this.app.dispatchAction({ action: appInterfaces_1.ActionType.PLAY_REVERSE });
    };
    Controller.prototype.pausePlayer = function () {
        this.app.dispatchAction({ action: appInterfaces_1.ActionType.PLAY_PAUSE });
    };
    Controller.prototype.startRecording = function () {
        this.app.dispatchAction({ action: appInterfaces_1.ActionType.RECORD_START });
    };
    Controller.prototype.pauseRecording = function () {
        this.app.dispatchAction({ action: appInterfaces_1.ActionType.RECORD_PAUSE });
    };
    Controller.prototype.stopRecording = function () {
        this.app.dispatchAction({ action: appInterfaces_1.ActionType.RECORD_STOP });
    };
    Controller.prototype.clear = function () {
        this.app.dispatchEvent({ eventType: boardInterfaces_1.EventType.CLEAR });
    };
    Controller.prototype.setState = function (state) {
        this.app.dispatchEvent({ eventType: boardInterfaces_1.EventType.SET_STATE, state: state });
    };
    Controller.prototype.setStrokeProperties = function (strokeProps) {
        this.app.dispatchEvent({ eventType: boardInterfaces_1.EventType.SET_STROKE_PROPS, strokeProps: strokeProps });
    };
    Controller.prototype.setViewBox = function (viewBox) {
        this.app.dispatchEvent({ eventType: boardInterfaces_1.EventType.SET_VIEWBOX, viewBox: viewBox });
    };
    return Controller;
}());
exports.Controller = Controller;
//# sourceMappingURL=InterfaceController.js.map