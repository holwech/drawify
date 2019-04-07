"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var boardInterfaces_1 = require("../utils/boardInterfaces");
var appInterfaces_1 = require("../utils/appInterfaces");
var EventController = /** @class */ (function () {
    function EventController(svg, app) {
        var _this = this;
        this.svg = svg;
        this.app = app;
        this.onWheel = function (e) {
            _this.app.dispatchEvent({ eventType: boardInterfaces_1.EventType.ONWHEEL, e: e });
        };
        this.onPointerDown = function (e) {
            _this.app.dispatchEvent({ eventType: boardInterfaces_1.EventType.POINTER_DOWN, e: e });
            _this.svg.removeEventListener('mousedown', _this.fnOnPointerDown); // Pressing the mouse
            _this.svg.addEventListener('mouseup', _this.fnOnPointerUp); // Releasing the mouse
            _this.svg.addEventListener('mouseleave', _this.fnOnPointerUp); // Releasing the mouse
            _this.svg.addEventListener('mousemove', _this.fnOnPointerMove); // Mouse is moving
        };
        this.onPointerUp = function (e) {
            _this.app.dispatchEvent({ eventType: boardInterfaces_1.EventType.POINTER_UP, e: e });
            _this.svg.removeEventListener('mouseup', _this.fnOnPointerUp); // Releasing the mouse
            _this.svg.removeEventListener('mouseleave', _this.fnOnPointerUp); // Releasing the mouse
            _this.svg.removeEventListener('mousemove', _this.fnOnPointerMove); // Mouse is moving
            _this.svg.addEventListener('mousedown', _this.fnOnPointerDown); // Pressing the mouse
        };
        this.onPointerMove = function (e) {
            _this.app.dispatchEvent({ eventType: boardInterfaces_1.EventType.POINTER_MOVE, e: e });
        };
        // Event Listeners
        this.fnOnWheel = this.onWheel;
        this.fnOnPointerDown = this.onPointerDown;
        this.fnOnPointerMove = this.onPointerMove;
        this.fnOnPointerUp = this.onPointerUp;
    }
    EventController.prototype.executeAction = function (action) {
        switch (action.action) {
            case appInterfaces_1.ActionType.RECORD_START:
                this.svg.addEventListener('mousedown', this.fnOnPointerDown); // Pressing the mouse
                this.svg.addEventListener('wheel', this.fnOnWheel);
                break;
            case appInterfaces_1.ActionType.RECORD_PAUSE:
                this.svg.addEventListener('mousedown', this.fnOnPointerDown); // Pressing the mouse
                this.svg.addEventListener('wheel', this.fnOnWheel);
                break;
            case appInterfaces_1.ActionType.RECORD_STOP:
                this.svg.removeEventListener('mousedown', this.fnOnPointerDown); // Pressing the mouse
                this.svg.removeEventListener('wheel', this.fnOnWheel);
                break;
            default:
                break;
        }
    };
    return EventController;
}());
exports.EventController = EventController;
//# sourceMappingURL=EventController.js.map