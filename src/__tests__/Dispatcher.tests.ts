import 'reflect-metadata';
import Timer from '../Timer/Timer';
import { IEvent, EventType } from '../Interfaces/AppInterfaces';
import ServiceBuilder from '../ServiceBuilder';
import Service from '../Controllers/Service';
import AppState from '../State/AppState';
import { DependencyContainer } from 'tsyringe';
import Dispatcher from '../Controllers/Dispatcher';
import { EventOrigin } from '../Interfaces/BoardInterfaces';

function createMouseEvent(type: EventType): IEvent {
  return {
    eventType: type,
    time: 1,
    id: 1,
    state: true,
    e: { target: { id: 1 } } as any as MouseEvent
  }
}

let appState: AppState;
let service: Service;
let container: DependencyContainer;
let element: HTMLElement;
let dispatcher: Dispatcher;

beforeEach(() => {
  let matrix: DOMMatrix = {} as DOMMatrix;
  (matrix as any).inverse = () => { };

  let svgPoint: SVGPoint = { x: 0, y: 0 } as SVGPoint;
  (svgPoint as any).matrixTransform = () => { return { x: 0, y: 0 } }

  element = document.createElementNS('http://www.w3.org/2000/svg', 'svg') as any;
  (element as any).getScreenCTM = () => { return matrix };
  (element as any).createSVGPoint = () => { return svgPoint };

  const timer: Timer = new Timer();
  appState = new AppState();

  const serviceBuilder: ServiceBuilder = new ServiceBuilder();
  service = serviceBuilder.build(element, appState, timer);
  container = serviceBuilder.getContainer();

  dispatcher = container.resolve(Dispatcher);
});

describe('Drawify core functionality', () => {
  it('should handle pointer down event', () => {
    const pointerDownEvent: IEvent = createMouseEvent(EventType.POINTER_DOWN);
    dispatcher.dispatchEvent(pointerDownEvent, EventOrigin.USER);
  });
});
