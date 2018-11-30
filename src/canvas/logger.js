"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Line = /** @class */ (function () {
    function Line() {
    }
    return Line;
}());
var Logger = /** @class */ (function () {
    function Logger(canvasID) {
        var _this = this;
        this.drawLog = [];
        this.canvas = document.getElementById(canvasID);
        this.context = this.canvas.getContext('2d');
        this.canvas.addEventListener('mousedown', function (e) { return _this.mouseDownDraw(e); });
        this.canvas.addEventListener('mousemove', function (e) { return _this.mouseMoveDraw(e); });
        this.canvas.addEventListener('mouseup', function () { return _this.mouseUpDraw(); });
        this.canvas.addEventListener('mouseleave', function () { return _this.mouseLeaveDraw(); });
    }
    Logger.prototype.clear = function () {
        this.context.setTransform(1, 0, 0, 1, 0, 0);
        this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
    };
    return Logger;
}());
exports.Logger = Logger;
//# sourceMappingURL=logger.js.map