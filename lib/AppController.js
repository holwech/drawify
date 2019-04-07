"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var boardInterfaces_1 = require("./utils/boardInterfaces");
var BoardController_1 = require("./board/BoardController");
var PlayController_1 = require("./player/PlayController");
var RecordController_1 = require("./recorder/RecordController");
var EventController_1 = require("./event/EventController");
var appInterfaces_1 = require("./utils/appInterfaces");
var AppState_1 = __importDefault(require("./AppState"));
var AppController = /** @class */ (function () {
    function AppController(svgID, strokeProps) {
        this.state = new AppState_1.default();
        this.svg = document.getElementById(svgID);
        if (!this.svg.getScreenCTM()) {
            throw new Error('getScreenCTM is not defined');
        }
        var viewBox = { x: 0, y: 0, width: 1200, height: 800 };
        var viewboxElem = this.svg.getAttributeNS(null, 'viewBox');
        if (viewboxElem !== null) {
            var arr = viewboxElem.split(' ').map(Number);
            viewBox = { x: arr[0], y: arr[1], width: arr[2], height: arr[3] };
        }
        else {
            throw new Error('The SVG element requires the view box attribute to be set.');
        }
        var initialState = [
            { eventType: boardInterfaces_1.EventType.SET_STROKE_PROPS, strokeProps: strokeProps },
            { eventType: boardInterfaces_1.EventType.SET_VIEWBOX, viewBox: viewBox },
        ];
        this.board = new BoardController_1.BoardController(this.svg, this, initialState);
        this.recorder = new RecordController_1.RecordController(this, initialState);
        this.player = new PlayController_1.PlayController(this, this.state.playState);
        this.event = new EventController_1.EventController(this.svg, this);
    }
    AppController.prototype.dispatchEvent = function (event) {
        console.log('EVENT: ' + event.eventType);
        switch (this.state.state) {
            case appInterfaces_1.AppStates.UINIT:
                console.log('App uninitialized');
                break;
            case appInterfaces_1.AppStates.RECORDING:
                event.time = this.state.timer.getTime();
                this.board.execute(event);
                this.recorder.record(event);
                break;
            case appInterfaces_1.AppStates.PLAYING:
                this.board.execute(event);
                break;
            default:
                throw new Error('No case for appState ' + this.state.state);
        }
    };
    AppController.prototype.dispatchAction = function (action) {
        console.log('ACTION: ' + action.action);
        switch (action.action) {
            case appInterfaces_1.ActionType.RECORD_START:
                this.state.state = appInterfaces_1.AppStates.RECORDING;
                this.state.timer.start();
                this.event.executeAction(action);
                break;
            case appInterfaces_1.ActionType.RECORD_STOP:
                this.state.state = appInterfaces_1.AppStates.RECORDING;
                this.state.timer.stop();
                this.event.executeAction(action);
                break;
            case appInterfaces_1.ActionType.RECORD_PAUSE:
                this.state.state = appInterfaces_1.AppStates.RECORDING;
                this.state.timer.pause();
                this.event.executeAction(action);
                break;
            case appInterfaces_1.ActionType.PLAY_START:
                if (this.state.state === appInterfaces_1.AppStates.RECORDING || this.state.state === appInterfaces_1.AppStates.UINIT) {
                    this.player.setEventLog(this.recorder.getEventLog());
                }
                this.state.state = appInterfaces_1.AppStates.PLAYING;
                this.player.play();
                break;
            case appInterfaces_1.ActionType.PLAY_STOP:
                this.player.stop();
                this.state.state = appInterfaces_1.AppStates.PLAYING;
                break;
            case appInterfaces_1.ActionType.PLAY_PAUSE:
                this.player.pause();
                this.state.state = appInterfaces_1.AppStates.PLAYING;
                break;
            case appInterfaces_1.ActionType.PLAY_REVERSE:
                this.player.reverse();
                this.state.state = appInterfaces_1.AppStates.PLAYING;
                break;
            default:
                throw new Error('No case for action ' + action.action);
        }
    };
    return AppController;
}());
exports.AppController = AppController;
//# sourceMappingURL=AppController.js.map