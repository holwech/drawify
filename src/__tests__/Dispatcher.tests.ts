import 'reflect-metadata';
import Dispatcher from '../Controllers/Dispatcher';
import { Targets } from '../Interfaces/ActionInterfaces';
import { EventOrigin } from '../Interfaces/BoardInterfaces';
import DispatcherState from '../State/DispatcherState';
import Timer from '../Timer/Timer';
import { RecordController } from '../Controllers/RecordController';
import { IEvent, EventType } from '../Interfaces/AppInterfaces';

function mouseEvent(event: string, args: MouseEventInit & { target: EventTarget }): MouseEvent {
  return new MouseEvent(event, { bubbles: true, ...args });
}

describe('Dispatcher handling actions', () => {
  it('should handle event', () => {
    const state: DispatcherState = new DispatcherState();
    const timer: Timer = new Timer();
    const recorder: RecordController = new RecordController();

    const dispatcher = new Dispatcher(state, timer, recorder);

    const testEvent = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      view: window
    });

    const pointerDownEvent: IEvent = {
      eventType: EventType.POINTER_DOWN,
      time: 1,
      id: 1,
      state: true,
      e: testEvent
    }

    dispatcher.dispatchEvent(pointerDownEvent, EventOrigin.USER)

    // action.forEach(action => record.record(action));
    // expect(record.getEventLog().length).toBe(4);
  });
});
