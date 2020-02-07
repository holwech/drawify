import DispatcherState from '../State/DispatcherState';
import { RecordController } from './RecordController';
import { EventOrigin } from '../Interfaces/BoardInterfaces';
import { EventType, IEvent } from '../Interfaces/AppInterfaces';
import { BoardController } from './BoardController';
import Timer from '../Timer/Timer';
import { IAction, Targets, PointerActionType, IZoomOptions, IStateOptions } from '../Interfaces/ActionInterfaces';
import { singleton } from 'tsyringe';

@singleton()
export default class Dispatcher {
  constructor(
    private state: DispatcherState,
    private timer: Timer,
    private board: BoardController,
    private recorder: RecordController,
  ) { }

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
          console.log('filtered')
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

  public dispatchAction(action: IAction): void {
    switch (action.target) {
      case Targets.BOARD_STATE:
        this.state.panState = (action.options as IStateOptions).flag!;
        break;
      case Targets.PREDRAW:
        this.board.predraw();
        break;
      default:
        if (action.target === Targets.END) {
          this.state.panState = false;
        }
        action.id = this.getId();
        action.time = this.timer.getTime();
        this.recorder.record(action);
        this.commitAction(action);
        break;
    }
  }

  public commitAction(action: IAction): void {
    console.log('ACTION: ' + Targets[action.target]);
    this.board.execute(action);
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
