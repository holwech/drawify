import EventState from './EventState';
import { RecordController } from '../recorder/RecordController';
import { IEvent, EventOrigin } from '../utils/boardInterfaces';
import { EventType } from '../utils/appInterfaces';
import { BoardController } from '../board/BoardController';
import Timer from '../timer/Timer';

export default class EventController {
  constructor(
    private state: EventState,
    private timer: Timer,
    private playBoard: BoardController,
    private board: BoardController,
    private recorder: RecordController,
  ) {}

  public dispatch(event: IEvent, origin: EventOrigin): void {
    console.log('EVENT: ' + event.eventType);
    if (origin === EventOrigin.USER) {
      this.userDispatch(event)
    } else {
      this.playBoard.execute(event);
    }
  }

  private userDispatch(event: IEvent): void {
    this.prepareUserEvent(event);
    this.board.execute(event);
    this.recorder.record(event);
  }

  private prepareUserEvent(event: IEvent): void {
    event.time = this.timer.getTime();
    event.id = this.getId(event);
    switch (event.eventType) {
      case EventType.CLICK:
        event.isEdit = true;        
        break;
      default:
        break;
    }
  }

  private getId(event: IEvent): number {
    if (event.eventType === EventType.POINTER_DOWN) {
      this.state.idCount++;
    }
    return this.state.idCount;
  }
}
