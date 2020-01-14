import EventState from '../State/ActionState';
import { RecordController } from './RecordController';
import { EventOrigin } from '../Interfaces/boardInterfaces';
import { EventType, IEvent } from '../Interfaces/appInterfaces';
import { BoardController } from './BoardController';
import Timer from '../timer/Timer';
import { IAction, Targets, PointerActionType, IZoomOptions, IStateOptions } from '../Interfaces/ActionInterfaces';
import { singleton } from 'tsyringe';
import { PlayBaseController } from './PlayBaseController';

@singleton()
export default class Dispatcher {
  constructor(
    private state: EventState,
    private timer: Timer,
    private board: BoardController,
    private recorder: RecordController,
    player: PlayBaseController
  ) {
    // Required so that there is not circular references
    player.Subscribe(this.dispatchAction);
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
        this.commitAction(action);
        break;
      default:
        console.warn(
          'Event type ' + EventType[event.eventType] + ' does not have a case in get Action in Event Controller',
        );
    }
    this.recorder.record(action);
    // this.playBoard.commitAction(this.getAction(event));
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
    console.log('Action: ' + Targets[action.target]);
    this.board.execute(action);
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
    if (event.eventType !== EventType.POINTER_MOVE && event.eventType !== EventType.POINTER_UP) {
      this.state.idCount++;
    }
    return this.state.idCount;
  }

  private getId(): number {
    return this.state.idCount++;
  }
}
