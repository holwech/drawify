import { IEvent } from '../utils/boardInterfaces';
import { AppController } from '../AppController';
export declare class BoardController {
    private scale;
    private state;
    private app;
    private strokeProps;
    private viewBox;
    private svg;
    private draw;
    private transform;
    constructor(svgElement: HTMLElement & SVGElement & SVGSVGElement, app: AppController, initialState?: IEvent[]);
    execute(event: IEvent): void;
    private setState;
    private clear;
    private setStrokeProperties;
    private setViexBox;
    private onWheel;
    private onPointerDown;
    private onPointerMove;
    private onPointerUp;
    private getPointerPosition;
}
