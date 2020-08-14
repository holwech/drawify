import { RecordController } from './RecordController';
import { EventType, IEvent, IEdit, EditType } from '../Interfaces/AppInterfaces';
import Timer from '../Timer/Timer';
import { IAction, Targets, PointerActionType, IZoomOptions, IDrawOptions, IClickOptions, optionTypes } from '../Interfaces/ActionInterfaces';
import { singleton } from 'tsyringe';
import { IModifier, ModifierTarget } from '../Domain/Modifier';
import DispatcherState from '../State/DispatcherState';

@singleton()
export default class Dispatcher {
  private actionListeners: { (action: IAction<optionTypes>): void }[] = [];
  private editListeners: { (action: IAction<optionTypes>): void }[] = [];
  constructor(private state: DispatcherState, private timer: Timer, private recorder: RecordController) {}

  public onAction(actionListener: (action: IAction<optionTypes>) => void): void {
    this.actionListeners.push(actionListener);
  }

  public onEdit(editListener: (action: IAction<optionTypes>) => void): void {
    this.editListeners.push(editListener);
  }

  public dispatchEvent(event: IEvent): void {
    let action = this.eventToAction(event);
    if (this.state.editMode) {
      this.commitEdit(action);
    } else {
      this.commitAction(action);
      this.recorder.record(action);
    }
  }

  public dispatchModifier(modifier: IModifier) {
    switch (modifier.target) {
      case ModifierTarget.PAN_ON:
        this.state.panState = true;
      case ModifierTarget.PAN_OFF:
        this.state.panState = false;
        break;
      case ModifierTarget.EDIT_ON:
        this.state.editMode = true;
        break;
      case ModifierTarget.EDIT_OFF:
        this.state.editMode = false;
      case ModifierTarget.SET_STROKE_PROPS:
        this.state.strokeProps = { ...modifier?.options! }
        break;
      default:
        break;
    }
  }

  public eventToAction(event: IEvent) {
    //console.log('EVENT: ' + EventType[event.eventType], action.id);
    switch (event.eventType) {
      case EventType.POINTER_MOVE:
        return {
          id: this.getIdForEvent(event),
          time: this.timer.getTime(),
          target: this.state.panState ? Targets.PAN : Targets.DRAW,
          options: {
            type: PointerActionType.MOVE,
            event: event.e! as PointerEvent,
            strokeProps: this.state.strokeProps,
          }
        } as IAction<IDrawOptions>
      case EventType.POINTER_DOWN:
        return {
          id: this.getIdForEvent(event),
          time: this.timer.getTime(),
          target: this.state.panState ? Targets.PAN : Targets.DRAW,
          options: {
            type: PointerActionType.START,
            event: event.e! as PointerEvent,
            strokeProps: this.state.strokeProps,
          }
        } as IAction<IDrawOptions>
      case EventType.POINTER_UP:
        return {
          id: this.getIdForEvent(event),
          time: this.timer.getTime(),
          target: this.state.panState ? Targets.PAN : Targets.DRAW,
          options: {
            type: PointerActionType.STOP,
            event: event.e! as PointerEvent,
          }
        } as IAction<IDrawOptions>
      case EventType.ONWHEEL:
        return {
          id: this.getIdForEvent(event),
          time: this.timer.getTime(),
          target: Targets.ZOOM,
          options: {
            event: event.e! as WheelEvent,
          } 
        } as IAction<IZoomOptions>;
      case EventType.CLICK:
        return {
          id: this.getIdForEvent(event),
          time: this.timer.getTime(),
          target: Targets.CLICK,
          options: {
            type: this.state.clickTarget,
            event: event.e!,
          } 
        } as IAction<IClickOptions>;
      default:
        throw 'Event type ' + EventType[event.eventType] + ' does not have a case in get Action in Event Controller'
    }
  }


  public dispatchAction(action: IAction<optionTypes>): void {
    if (action.target === Targets.END) {
      this.state.panState = false;
    }
    action.id = this.getId();
    action.time = this.timer.getTime();
    this.recorder.record(action);
    this.commitAction(action);
  }

  public commitEdit(action: IAction<optionTypes>): void {
    console.log('EDIT: ' + Targets[action.target]);
    this.editListeners.forEach(listener => listener(action))
  }

  public commitAction(action: IAction<optionTypes>): void {
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
