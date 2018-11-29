"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Canvas = /** @class */ (function () {
    function Canvas(canvasID) {
        var _this = this;
        this.drawLog = [];
        this.canvas = document.getElementById(canvasID);
        this.context = this.canvas.getContext('2d');
        this.canvas.addEventListener('mousedown', function (e) { return _this.mouseDownDraw(e); });
        this.canvas.addEventListener('mousemove', function (e) { return _this.mouseMoveDraw(e); });
        this.canvas.addEventListener('mouseup', function () { return _this.mouseUpDraw(); });
        this.canvas.addEventListener('mouseleave', function () { return _this.mouseLeaveDraw(); });
    }
    Canvas.prototype.clear = function () {
        this.context.setTransform(1, 0, 0, 1, 0, 0);
        this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
    };
    Canvas.prototype.test = function () {
        console.log('Test!');
    };
    Canvas.prototype.mouseDownDraw = function (e) {
        this.mousePressed = true;
        var offsetX = e.pageX - this.canvas.offsetLeft;
        var offsetY = e.pageY - this.canvas.offsetTop;
        this.draw(offsetX, offsetY, false);
    };
    Canvas.prototype.mouseMoveDraw = function (e) {
        if (this.mousePressed) {
            var offsetX = e.pageX - this.canvas.offsetLeft;
            var offsetY = e.pageY - this.canvas.offsetTop;
            this.draw(offsetX, offsetY, true);
        }
    };
    Canvas.prototype.mouseUpDraw = function () {
        this.mousePressed = false;
    };
    Canvas.prototype.mouseLeaveDraw = function () {
        this.mousePressed = false;
    };
    Canvas.prototype.draw = function (x, y, isDown) {
        if (isDown) {
            this.context.beginPath();
            this.context.strokeStyle = 'black';
            this.context.lineWidth = 2;
            this.context.lineJoin = 'round';
            this.context.moveTo(this.lastX, this.lastY);
            this.context.lineTo(x, y);
            this.context.closePath();
            this.context.stroke();
        }
        this.lastX = x;
        this.lastY = y;
    };
    return Canvas;
}());
exports.Canvas = Canvas;
//# sourceMappingURL=draw.js.map