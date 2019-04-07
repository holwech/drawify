import { AppController } from './AppController';
import { IStrokeProps, BoardState, IViewBox } from './utils/boardInterfaces';
export declare class Controller {
    app: AppController;
    constructor(svgID: string, strokeProps: IStrokeProps);
    startPlayer(): void;
    reversePlayer(): void;
    pausePlayer(): void;
    startRecording(): void;
    pauseRecording(): void;
    stopRecording(): void;
    clear(): void;
    setState(state: BoardState): void;
    setStrokeProperties(strokeProps: IStrokeProps): void;
    setViewBox(viewBox: IViewBox): void;
}
