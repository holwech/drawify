"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Transform = /** @class */ (function () {
    function Transform(svgElement) {
        this.isPointerDown = false;
        this.pointerOrigin = new DOMPoint();
        this.svg = svgElement;
    }
    Transform.prototype.onWheel = function (point, viewBox, scale) {
        viewBox.x = point.x + (viewBox.x - point.x) * scale;
        viewBox.y = point.y + (viewBox.y - point.y) * scale;
        viewBox.width = viewBox.width * scale;
        viewBox.height = viewBox.height * scale;
        var viewBoxString = viewBox.x + " " + viewBox.y + " " + viewBox.width + " " + viewBox.height;
        this.svg.setAttribute('viewBox', viewBoxString);
    };
    Transform.prototype.onPointerDown = function (point) {
        this.isPointerDown = true;
        this.pointerOrigin = point;
    };
    Transform.prototype.onPointerUp = function () {
        this.isPointerDown = false;
    };
    Transform.prototype.onPointerMove = function (point, viewBox) {
        if (!this.isPointerDown) {
            return;
        }
        viewBox.x = viewBox.x - (point.x - this.pointerOrigin.x);
        viewBox.y = viewBox.y - (point.y - this.pointerOrigin.y);
        var viewBoxString = viewBox.x + " " + viewBox.y + " " + viewBox.width + " " + viewBox.height;
        this.svg.setAttribute('viewBox', viewBoxString);
    };
    return Transform;
}());
exports.Transform = Transform;
//# sourceMappingURL=Transform.js.map