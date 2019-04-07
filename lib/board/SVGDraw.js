"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SVGDraw = /** @class */ (function () {
    function SVGDraw(svgElement) {
        this.path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        this.pathStarted = false;
        this.buffer = [];
        this.svg = svgElement;
    }
    SVGDraw.prototype.clear = function () {
        var lastChild = this.svg.lastChild;
        while (lastChild) {
            this.svg.removeChild(lastChild);
            lastChild = this.svg.lastChild;
        }
    };
    SVGDraw.prototype.onPointerDown = function (point, style) {
        this.pathStarted = true;
        this.path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        this.path.setAttribute('fill', 'none');
        this.path.setAttribute('stroke', style.color);
        this.path.setAttribute('stroke-width', String(style.width));
        // Keeps stroke width constant, regardless of zoom
        // this.path.setAttribute('vector-effect', 'non-scaling-stroke');
        this.buffer = [];
        this.appendToBuffer(point, style.bufferSize);
        this.strPath = 'M' + point.x + ' ' + point.y;
        this.path.setAttribute('d', this.strPath);
        this.svg.appendChild(this.path);
    };
    SVGDraw.prototype.onPointerMove = function (point, bufferSize) {
        if (this.pathStarted) {
            this.appendToBuffer(point, bufferSize);
            this.updateSVGPath(bufferSize);
        }
    };
    SVGDraw.prototype.onPointerUp = function () {
        if (this.pathStarted) {
            this.pathStarted = false;
        }
    };
    SVGDraw.prototype.appendToBuffer = function (point, bufferSize) {
        this.buffer.push(point);
        while (this.buffer.length > bufferSize) {
            this.buffer.shift();
        }
    };
    SVGDraw.prototype.getAveragePoint = function (offset, bufferSize) {
        var len = this.buffer.length;
        if (len % 2 === 1 || len >= bufferSize) {
            var totalX = 0;
            var totalY = 0;
            var point = new DOMPoint();
            var count = 0;
            for (var i = offset; i < len; i++) {
                count++;
                point = this.buffer[i];
                totalX += point.x;
                totalY += point.y;
            }
            return new DOMPoint(totalX / count, totalY / count);
        }
        return null;
    };
    SVGDraw.prototype.updateSVGPath = function (bufferSize) {
        var point = this.getAveragePoint(0, bufferSize);
        if (point) {
            this.strPath += ' L' + point.x + ' ' + point.y;
            var tempPath = '';
            for (var offset = 2; offset < this.buffer.length; offset += 2) {
                point = this.getAveragePoint(offset, bufferSize);
                tempPath += ' L' + point.x + ' ' + point.y;
            }
            this.path.setAttribute('d', this.strPath + tempPath);
        }
    };
    return SVGDraw;
}());
exports.SVGDraw = SVGDraw;
//# sourceMappingURL=SVGDraw.js.map