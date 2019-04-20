import EventState from './EventState';
import { PlayBaseController } from '../player/PlayBaseController';
import { RecordController } from '../recorder/RecordController';
import { IEvent, EventOrigin, EventType } from '../utils/boardInterfaces';
import { BoardController } from '../board/BoardController';
import Timer from '../timer/Timer';


export default class EventController {
  constructor(
    private state: EventState,
    private timer: Timer,
    private playBoard: BoardController,
    private board: BoardController,
    private player: PlayBaseController,
    private recorder: RecordController,
  ) {
    
  }
  
  public dispatch(event: IEvent, origin: EventOrigin): void {
    console.log('EVENT: ' + event.eventType);
    if (origin === EventOrigin.USER) {
      event.time = this.timer.getTime();
      event.id = this.getId(event);
      console.log(event.id);
      this.board.execute(event);
      this.recorder.record(event);
    } else {
      this.playBoard.execute(event);
    }
  }

  private getId(event: IEvent): number {
    if (event.eventType === EventType.POINTER_DOWN) {
      this.state.idCount++;
    }
    return this.state.idCount;
  }
}