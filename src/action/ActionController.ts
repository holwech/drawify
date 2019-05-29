import EventState from './ActionState';
import { RecordController } from '../recorder/RecordController';
import { EventOrigin } from '../utils/boardInterfaces';
import { EventType, IEvent } from '../utils/appInterfaces';
import { BoardController } from '../board/BoardController';
import Timer from '../timer/Timer';
import { IAction, Targets, IDrawOptions, PointerActionType, optionTypes, IZoomOptions } from './ActionInterfaces';

export default class ActionController {
  constructor(
    private state: EventState,
    private timer: Timer,
    private playBoard: BoardController,
    private board: BoardController,
    private recorder: RecordController,
  ) {
  }

  public dispatch(event: IEvent, origin: EventOrigin): void {
    console.log('EVENT: ' + EventType[event.eventType]);
    const action = this.getAction(event);
    this.dispatchAction(action);
    this.recorder.record(action);
    // this.playBoard.execute(this.getAction(event));
  }

  public dispatchAction(action: IAction): void {
    this.board.execute(action);
  }

  private getAction(event: IEvent): IAction {
    let options: optionTypes | undefined;
    const action: IAction = {
      id: this.getId(event),
      time: this.timer.getTime(),
      target: Targets.DRAW,
      options,
    };
    switch (event.eventType) {
      case EventType.POINTER_MOVE:
        action.target = this.state.panState ? Targets.PAN : Targets.DRAW;
        options = {
          type: PointerActionType.MOVE,
          event: event.e!,
        } as IDrawOptions;
        break;
      case EventType.POINTER_DOWN:
        action.target = this.state.panState ? Targets.PAN : Targets.DRAW;
        options = {
          type: PointerActionType.START,
          event: event.e!,
        } as IDrawOptions;
        break;
      case EventType.POINTER_UP:
        action.target = this.state.panState ? Targets.DRAW : Targets.PAN;
        options = {
          type: PointerActionType.STOP,
          event: event.e!,
        } as IDrawOptions;
        break;
      case EventType.ONWHEEL:
        action.target = Targets.ZOOM;
        options = {
          event: event.e!,
        } as IZoomOptions;
        break;
      case EventType.STATE_TOGGLE:
        action.target = Targets.BOARD_STATE;
        this.state.panState = event.state!;
        break;
      case EventType.SET_STROKE_PROPS:
        action.target = Targets.STROKE_PROP;
        options = event.strokeProps!;
        break;
      case EventType.SET_VIEWBOX:
        action.target = Targets.VIEW_BOX;
        options = event.viewBox;
        break;
      default:
        options = undefined;
        throw new Error('Event type ' + event.eventType + ' does not have a case in get Action in Event Controller');
    }
    action.options = options;
    return action;
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

  private getId(event: IEvent): number {
    if (event.eventType === EventType.POINTER_DOWN) {
      this.state.idCount++;
    }
    return this.state.idCount;
  }
}
