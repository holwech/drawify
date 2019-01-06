"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SVGDraw = /** @class */ (function () {
    function SVGDraw(svgID) {
        var _this = this;
        this.strokeWidth = '2';
        this.svg.getElementsByTagName(svgID);
        this.bufferSize = document.getElementById('cmbBufferSize').value;
        this.path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        this.path.setAttribute('fill', 'none');
        this.path.setAttribute('stroke', '#000');
        this.path.setAttribute('stroke-width', this.strokeWidth);
        this.pathStarted = false;
        this.buffer = [];
        this.rect = this.svg.getBoundingClientRect();
        this.svg.addEventListener('mousedown', function (e) { return _this.mouseDownDraw(e); });
        this.svg.addEventListener('mousemove', function (e) { return _this.mouseMoveDraw(e); });
        this.svg.addEventListener('mouseup', function () { return _this.mouseUpDraw(); });
    }
    SVGDraw.prototype.mouseDownDraw = function (e) {
        this.pathStarted = true;
        this.path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        this.path.setAttribute('fill', 'none');
        this.path.setAttribute('stroke', '#000');
        this.path.setAttribute('stroke-width', this.strokeWidth);
        this.buffer = [];
        var pt = this.getMousePosition(e);
        this.appendToBuffer(pt);
        this.strPath = 'M' + pt.x + ' ' + pt.y;
        this.path.setAttribute('d', this.strPath);
        this.svg.appendChild(this.path);
    };
    SVGDraw.prototype.getMousePosition = function (e) {
        return {
            x: e.pageX - this.rect.left,
            y: e.pageY - this.rect.top,
        };
    };
    SVGDraw.prototype.appendToBuffer = function (pt) {
        this.buffer.push(pt);
        while (this.buffer.length > Number(this.bufferSize)) {
            this.buffer.shift();
        }
    };
    SVGDraw.prototype.mouseMoveDraw = function (e) {
        if (this.pathStarted) {
            this.appendToBuffer(this.getMousePosition(e));
            this.updateSVGPath();
        }
    };
    SVGDraw.prototype.getAveragePoint = function (offset) {
        var len = this.buffer.length;
        if (len % 2 === 1 || len >= Number(this.bufferSize)) {
            var totalX = 0;
            var totalY = 0;
            var pt = {
                x: 0,
                y: 0,
            };
            var count = 0;
            for (var i = offset; i < len; i++) {
                count++;
                pt = this.buffer[i];
                totalX += pt.x;
                totalY += pt.y;
            }
            return {
                x: totalX / count,
                y: totalY / count,
            };
        }
        return null;
    };
    SVGDraw.prototype.updateSVGPath = function () {
        var pt = this.getAveragePoint(0);
        if (pt) {
            this.strPath += ' L' + pt.x + ' ' + pt.y;
            var tempPath = '';
            for (var offset = 2; offset < this.buffer.length; offset += 2) {
                pt = this.getAveragePoint(offset);
                tempPath += ' L' + pt.x + ' ' + pt.y;
            }
            this.path.setAttribute('d', this.strPath + tempPath);
        }
    };
    SVGDraw.prototype.mouseUpDraw = function () {
        if (this.pathStarted) {
            this.pathStarted = false;
        }
    };
    return SVGDraw;
}());
exports.SVGDraw = SVGDraw;
//# sourceMappingURL=draw.js.map