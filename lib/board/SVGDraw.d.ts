import { IStrokeProps } from '../utils/boardInterfaces';
export declare class SVGDraw {
    private svg;
    private path;
    private pathStarted;
    private strPath;
    private buffer;
    constructor(svgElement: HTMLElement & SVGElement & SVGSVGElement);
    clear(): void;
    onPointerDown(point: DOMPoint, style: IStrokeProps): void;
    onPointerMove(point: DOMPoint, bufferSize: number): void;
    onPointerUp(): void;
    private appendToBuffer;
    private getAveragePoint;
    private updateSVGPath;
}
