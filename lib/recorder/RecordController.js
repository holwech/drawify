"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RecordController = /** @class */ (function () {
    function RecordController(app, initialState) {
        var _this = this;
        if (initialState === void 0) { initialState = []; }
        this.log = [];
        initialState.forEach(function (event) {
            _this.record(event);
        });
    }
    RecordController.prototype.record = function (event) {
        this.log.push(event);
    };
    RecordController.prototype.printLog = function () {
        console.log(this.log);
    };
    RecordController.prototype.getEventLog = function () {
        return this.log;
    };
    return RecordController;
}());
exports.RecordController = RecordController;
//# sourceMappingURL=RecordController.js.map