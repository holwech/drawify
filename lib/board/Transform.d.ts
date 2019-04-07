import { IViewBox } from '../utils/boardInterfaces';
export declare class Transform {
    private svg;
    private isPointerDown;
    private pointerOrigin;
    constructor(svgElement: SVGElement & SVGElement & SVGSVGElement);
    onWheel(point: DOMPoint, viewBox: IViewBox, scale: number): void;
    onPointerDown(point: DOMPoint): void;
    onPointerUp(): void;
    onPointerMove(point: DOMPoint, viewBox: IViewBox): void;
}
