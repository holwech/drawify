import 'reflect-metadata';
import { container } from 'tsyringe';
import { BoardController } from './board/BoardController';


export default class ServiceBuilder {
    public build(svg: HTMLElement & SVGElement & SVGSVGElement) {
        return container.resolve<BoardController>(BoardController);
    }
}