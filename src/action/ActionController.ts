import EventState from './ActionState';
import { RecordController } from '../recorder/RecordController';
import { EventOrigin } from '../utils/boardInterfaces';
import { EventType, IEvent } from '../utils/appInterfaces';
import { BoardController } from '../board/BoardController';
import Timer from '../timer/Timer';
import { IAction, Targets, IDrawOptions, PointerActionType, optionTypes, IZoomOptions, IStateOptions } from './ActionInterfaces';

export default class ActionController {
  constructor(
    private state: EventState,
    private timer: Timer,
    private playBoard: BoardController,
    private board: BoardController,
    private recorder: RecordController,
  ) {
  }

  public dispatchEvent(event: IEvent, origin: EventOrigin): void {
    // console.log('EVENT: ' + EventType[event.eventType]);
    const action: IAction = {
      id: this.getIdForEvent(event),
      time: this.timer.getTime(),
      target: Targets.DRAW,
      options: undefined,
    };
    switch (event.eventType) {
      case EventType.POINTER_MOVE:
        action.target = this.state.panState ? Targets.PAN : Targets.DRAW;
        action.options = {
          type: PointerActionType.MOVE,
          event: event.e!,
        };
        this.commitAction(action);
        break;
      case EventType.POINTER_DOWN:
        action.target = this.state.panState ? Targets.PAN : Targets.DRAW;
        action.options = {
          type: PointerActionType.START,
          event: event.e!,
        };
        this.commitAction(action);
        break;
      case EventType.POINTER_UP:
        action.target = this.state.panState ? Targets.PAN : Targets.DRAW;
        action.options = {
          type: PointerActionType.STOP,
          event: event.e!,
        };
        this.commitAction(action);
        break;
      case EventType.ONWHEEL:
        action.target = Targets.ZOOM;
        action.options = {
          event: event.e!,
        } as IZoomOptions;
        this.commitAction(action);
        break;
      default:
        console.warn('Event type ' + EventType[event.eventType] + ' does not have a case in get Action in Event Controller');
    }
    this.recorder.record(action);
    // this.playBoard.commitAction(this.getAction(event));
  }

  public dispatchAction(action: IAction): void {
    action.id = this.getId();
    action.time = this.timer.getTime();
    this.recorder.record(action);
    this.commitAction(action);
  }

  public commitAction(action: IAction): void {
    switch (action.target) {
      case Targets.BOARD_STATE:
        action.target = Targets.BOARD_STATE;
        this.state.panState = (action.options as IStateOptions).flag!;
        break;
      default:
        this.board.execute(action);
        break;
    }
  }

  // private prepareUserEvent(event: IEvent): void {
  //   event.time = this.timer.getTime();
  //   event.id = this.getId(event);
  //   switch (event.eventType) {
  //     case EventType.CLICK:
  //       event.isEdit = true;        
  //       break;
  //     default:
  //       break;
  //   }
  // }

  private getIdForEvent(event: IEvent): number {
    if (
      event.eventType !== EventType.POINTER_MOVE &&
      event.eventType !== EventType.POINTER_UP
    ) {
      this.state.idCount++;
    }
    return this.state.idCount;
  }

  private getId(): number {
    return this.state.idCount++;
  }
}
