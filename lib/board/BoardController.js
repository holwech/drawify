"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SVGDraw_1 = require("./SVGDraw");
var Transform_1 = require("./Transform");
var boardInterfaces_1 = require("../utils/boardInterfaces");
var SCALE_FACTOR = 0.05;
var BoardController = /** @class */ (function () {
    function BoardController(svgElement, app, initialState) {
        var _this = this;
        if (initialState === void 0) { initialState = []; }
        // State properties
        this.scale = 1;
        this.state = boardInterfaces_1.BoardState.DRAW;
        this.strokeProps = {
            color: 'green',
            width: 50,
            bufferSize: 20,
        };
        this.viewBox = {
            x: 0,
            y: 0,
            width: 1200,
            height: 800,
        };
        this.svg = svgElement;
        this.app = app;
        this.draw = new SVGDraw_1.SVGDraw(this.svg);
        this.transform = new Transform_1.Transform(this.svg);
        initialState.forEach(function (event) {
            _this.execute(event);
        });
    }
    BoardController.prototype.execute = function (event) {
        switch (event.eventType) {
            case boardInterfaces_1.EventType.POINTER_MOVE:
                this.onPointerMove(event.e);
                break;
            case boardInterfaces_1.EventType.POINTER_DOWN:
                this.onPointerDown(event.e);
                break;
            case boardInterfaces_1.EventType.POINTER_UP:
                this.onPointerUp();
                break;
            case boardInterfaces_1.EventType.SET_STROKE_PROPS:
                this.setStrokeProperties(event.strokeProps);
                break;
            case boardInterfaces_1.EventType.ONWHEEL:
                this.onWheel(event.e);
                break;
            case boardInterfaces_1.EventType.CLEAR:
                this.clear();
                break;
            case boardInterfaces_1.EventType.SET_STATE:
                this.setState(event.state);
                break;
            case boardInterfaces_1.EventType.SET_VIEWBOX:
                this.setViexBox(event.viewBox);
                break;
            default:
                break;
        }
    };
    BoardController.prototype.setState = function (state) {
        this.state = state;
    };
    BoardController.prototype.clear = function () {
        this.draw.clear();
    };
    BoardController.prototype.setStrokeProperties = function (strokeProps) {
        this.strokeProps.bufferSize = strokeProps.bufferSize;
        this.strokeProps.color = strokeProps.color;
        this.strokeProps.width = strokeProps.width * this.scale;
    };
    BoardController.prototype.setViexBox = function (viexBox) {
        this.viewBox = viexBox;
    };
    BoardController.prototype.onWheel = function (e) {
        e.preventDefault();
        if (this.state === boardInterfaces_1.BoardState.PAN) {
            var scale = e.deltaY > 0 ? 1 + SCALE_FACTOR : 1 - SCALE_FACTOR;
            this.strokeProps.width = this.strokeProps.width * scale;
            var point = this.getPointerPosition(e);
            this.transform.onWheel(point, this.viewBox, scale);
            this.scale *= scale;
        }
    };
    BoardController.prototype.onPointerDown = function (e) {
        e.preventDefault();
        var point = this.getPointerPosition(e);
        switch (this.state) {
            case boardInterfaces_1.BoardState.DRAW:
                this.draw.onPointerDown(point, this.strokeProps);
                break;
            case boardInterfaces_1.BoardState.PAN:
                this.transform.onPointerDown(point);
                break;
            default:
                throw new Error('No state ' + this.state + ' in onPointerDown');
        }
    };
    BoardController.prototype.onPointerMove = function (e) {
        e.preventDefault();
        var point = this.getPointerPosition(e);
        switch (this.state) {
            case boardInterfaces_1.BoardState.DRAW:
                this.draw.onPointerMove(point, this.strokeProps.bufferSize);
                break;
            case boardInterfaces_1.BoardState.PAN:
                this.transform.onPointerMove(point, this.viewBox);
                break;
            default:
                throw new Error('Not state ' + this.state + ' in onPointerMove');
        }
    };
    BoardController.prototype.onPointerUp = function () {
        switch (this.state) {
            case boardInterfaces_1.BoardState.DRAW:
                this.draw.onPointerUp();
                break;
            case boardInterfaces_1.BoardState.PAN:
                this.transform.onPointerUp();
                break;
            default:
                throw new Error('Not state ' + this.state + ' in onPointerUp');
        }
    };
    BoardController.prototype.getPointerPosition = function (e) {
        var svgPoint = this.svg.createSVGPoint();
        svgPoint.x = e.clientX;
        svgPoint.y = e.clientY;
        // Null check is done in constructor
        return svgPoint.matrixTransform(this.svg.getScreenCTM().inverse());
    };
    return BoardController;
}());
exports.BoardController = BoardController;
//# sourceMappingURL=BoardController.js.map