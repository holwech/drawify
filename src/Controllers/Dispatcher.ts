import DispatcherState from '../State/DispatcherState';
import { RecordController } from './RecordController';
import { EventOrigin } from '../Interfaces/BoardInterfaces';
import { EventType, IEvent } from '../Interfaces/AppInterfaces';
import Timer from '../Timer/Timer';
import { IAction, Targets, PointerActionType, IZoomOptions } from '../Interfaces/ActionInterfaces';
import { singleton } from 'tsyringe';
import { IModifier, ModifierTarget } from '../Domain/Modifier';

@singleton()
export default class Dispatcher {
  private actionListeners: { (action: IAction): void }[] = [];
  constructor(private state: DispatcherState, private timer: Timer, private recorder: RecordController) {}

  public onAction(actionListener: (action: IAction) => void): void {
    this.actionListeners.push(actionListener);
  }

  public dispatchEvent(event: IEvent, origin: EventOrigin): void {
    const action: IAction = {
      id: this.getIdForEvent(event),
      time: this.timer.getTime(),
      target: Targets.DRAW,
      options: undefined,
    };
    //console.log('EVENT: ' + EventType[event.eventType], action.id);
    switch (event.eventType) {
      case EventType.POINTER_MOVE:
        action.target = this.state.panState ? Targets.PAN : Targets.DRAW;
        action.options = {
          type: PointerActionType.MOVE,
          event: event.e!,
        };
        break;
      case EventType.POINTER_DOWN:
        action.target = this.state.panState ? Targets.PAN : Targets.DRAW;
        action.options = {
          type: PointerActionType.START,
          event: event.e!,
        };
        break;
      case EventType.POINTER_UP:
        action.target = this.state.panState ? Targets.PAN : Targets.DRAW;
        action.options = {
          type: PointerActionType.STOP,
          event: event.e!,
        };
        break;
      case EventType.ONWHEEL:
        action.target = Targets.ZOOM;
        action.options = {
          event: event.e!,
        } as IZoomOptions;
        break;
      case EventType.CLICK:
        action.target = Targets.CLICK;
        action.options = {
          type: this.state.clickTarget,
          event: event.e!,
        };
        if (this.timer.atEnd()) {
          this.recorder.filterLogById(action.id!);
          console.log('filtered');
        }
        break;
      default:
        console.warn(
          'Event type ' + EventType[event.eventType] + ' does not have a case in get Action in Event Controller',
        );
    }
    this.commitAction(action);
    this.recorder.record(action);
  }

  public dispatchModifier(modifier: IModifier) {
    switch (modifier.target) {
      case ModifierTarget.PAN_ON:
        this.state.panState = true;
        break;
      case ModifierTarget.PAN_OFF:
        this.state.panState = false;
        break;
      default:
        break;
    }
  }

  public dispatchAction(action: IAction): void {
    if (action.target === Targets.END) {
      this.state.panState = false;
    }
    action.id = this.getId();
    action.time = this.timer.getTime();
    this.recorder.record(action);
    this.commitAction(action);
  }

  public commitAction(action: IAction): void {
    console.log('ACTION: ' + Targets[action.target]);
    this.actionListeners.forEach(listener => listener(action));
  }

  private getIdForEvent(event: IEvent): number {
    if (event.eventType !== EventType.POINTER_MOVE && event.eventType !== EventType.POINTER_UP) {
      this.state.idCount++;
    }
    return this.state.idCount;
  }

  private getId(): number {
    return this.state.idCount++;
  }
}
