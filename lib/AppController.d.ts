import { IEvent, IStrokeProps } from './utils/boardInterfaces';
import { IAction } from './utils/appInterfaces';
import AppState from './AppState';
export declare class AppController {
    state: AppState;
    private board;
    private player;
    private recorder;
    private event;
    private svg;
    constructor(svgID: string, strokeProps: IStrokeProps);
    dispatchEvent(event: IEvent): void;
    dispatchAction(action: IAction): void;
}
