import { AppController } from '../AppController';
import { IAction } from '../utils/appInterfaces';
export declare class EventController {
    private svg;
    private app;
    private fnOnWheel;
    private fnOnPointerDown;
    private fnOnPointerMove;
    private fnOnPointerUp;
    constructor(svg: HTMLElement & SVGElement & SVGSVGElement, app: AppController);
    executeAction(action: IAction): void;
    private onWheel;
    private onPointerDown;
    private onPointerUp;
    private onPointerMove;
}
