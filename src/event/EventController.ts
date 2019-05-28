import EventState from './EventState';
import { RecordController } from '../recorder/RecordController';
import { IEvent, EventOrigin, IStrokeProps } from '../utils/boardInterfaces';
import { EventType } from '../utils/appInterfaces';
import { BoardController } from '../board/BoardController';
import Timer from '../timer/Timer';
import { IAction, Targets, IDrawOptions, PointerActionType, IPanOptions, optionTypes, IStrokePropOptions, StrokeAttributes } from './eventInterfaces';

export default class EventController {
  constructor(
    private state: EventState,
    private timer: Timer,
    private playBoard: BoardController,
    private board: BoardController,
    private recorder: RecordController,
  ) {
  }

  public dispatch(event: IEvent, origin: EventOrigin): void {
    console.log('EVENT: ' + event.eventType);
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
        action.target = Targets.DRAW;
        options = {
          type: PointerActionType.MOVE,
          event: event.e!,
        } as IDrawOptions;
        break;
      case EventType.POINTER_DOWN:
        action.target = Targets.DRAW;
        options = {
          type: PointerActionType.START,
          event: event.e!,
        } as IDrawOptions;
        break;
      case EventType.POINTER_UP:
        action.target = Targets.DRAW;
        options = {
          type: PointerActionType.STOP,
          event: event.e!,
        } as IDrawOptions;
        break;
      case EventType.SET_STROKE_PROPS:
        action.target = Targets.STROKE_PROP;
        options = event.strokeProps!;
        break;
      case EventType.SET_VIEWBOX:
        action.target = Targets.VIEW_BOX;
        options = ;
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
