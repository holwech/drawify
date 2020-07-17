import 'reflect-metadata';
import Timer from '../Timer/Timer';
import { IEvent, EventType } from '../Interfaces/AppInterfaces';
import ServiceBuilder from '../ServiceBuilder';
import Service from '../Controllers/Service';
import AppState from '../State/AppState';
import { DependencyContainer } from 'tsyringe';
import { EventListenerController } from '../Controllers/EventListenerController';
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
let eventListener: EventListenerController;
let dispatcher: Dispatcher;

beforeEach(() => {
  const timer: Timer = new Timer();
  appState = new AppState();

  element = document.createElementNS('http://www.w3.org/2000/svg', 'svg') as any;
  (element as any).getScreenCTM = () => true;
  (element as any).createSVGPoint = () => { return { x: 0.5, y: 0.5 } };

  const serviceBuilder: ServiceBuilder = new ServiceBuilder();
  service = serviceBuilder.build(element, appState, timer);
  container = serviceBuilder.getContainer();

  dispatcher = container.resolve(Dispatcher);
});

describe('Drawify core functionality', () => {
  it('should handle pointer down event', () => {
    const pointerDownEvent: IEvent = createMouseEvent(EventType.POINTER_DOWN);
    dispatcher.dispatchEvent(pointerDownEvent, EventOrigin.USER);

    console.log('Container currently has: ' + JSON.stringify(container))
  });
  /*   it('Should handle pointer move event', () => {
      expect(state.idCount).toEqual(0);
      const pointerDownEvent: IEvent = createMouseEvent(EventType.POINTER_MOVE);
      dispatcher.dispatchEvent(pointerDownEvent, EventOrigin.USER)
      console.log(JSON.stringify(state));
      expect(state.idCount).toEqual(1);
    }); */
});
