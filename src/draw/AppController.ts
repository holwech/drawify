import { IEvent, EventType } from './utils/boardInterfaces';
import { BoardController } from './board/BoardController';
import { PlayController } from './player/PlayController';
import { RecordController } from './recorder/RecordController';
import { EventController } from './event/EventController';
import { AppState, IAction, ActionType } from './utils/appInterfaces';
import Timer from './utils/Timer';

export class AppController {
  private board!: BoardController;
  private player!: PlayController;
  private recorder!: RecordController;
  private event!: EventController;
  private appState = AppState.UINIT;

  private numObj = 0;
  private timer: Timer;

  constructor() {
    this.timer = new Timer();
  }

  public init(
    board: BoardController,
    player: PlayController,
    recorder: RecordController,
    event: EventController,
  ): void {
    this.board = board;
    this.player = player;
    this.recorder = recorder;
    this.event = event;
  }

  public dispatchEvent(event: IEvent): void {
    console.log('EVENT: ' + event.eventType);
    switch (this.appState) {
      case AppState.UINIT:
        console.log('App uninitialized');
        break;
      case AppState.RECORD_START:
        event.time = this.timer.getTime();
        this.board.execute(event);
        this.recorder.record(event);
        break;
      case AppState.RECORD_STOP:
        break;
      case AppState.RECORD_PAUSE:
        event.time = this.timer.getTime();
        this.board.execute(event);
        this.recorder.record(event);
        break;
      case AppState.PLAY_START:
        this.board.execute(event);
        break;
      default:
        throw new Error('No case for appState ' + this.appState);
    }
  }

  public dispatchAction(action: IAction): void {
    console.log('ACTION: ' + action.action);
    switch (action.action) {
      case ActionType.RECORD_START:
        this.appState = AppState.RECORD_START;
        this.timer.start();
        this.event.executeAction(action);
        break;
      case ActionType.RECORD_STOP:
        this.appState = AppState.RECORD_STOP;
        this.event.executeAction(action);
        break;
      case ActionType.RECORD_PAUSE:
        this.timer.pause();
        this.appState = AppState.RECORD_PAUSE;
        this.event.executeAction(action);
        break;
      case ActionType.PLAY_START:
        if (
          this.appState !== AppState.PLAY_PAUSE &&
          this.appState !== AppState.PLAY_STOP &&
          this.appState !== AppState.PLAY_START
          ) {
          this.player.setEventLog(this.recorder.getEventLog());
        }
        this.appState = AppState.PLAY_START;
        this.player.play();
        break;
      case ActionType.PLAY_STOP:
        this.player.stop();
        this.appState = AppState.PLAY_STOP;
        break;
      case ActionType.PLAY_PAUSE:
        this.player.pause();
        this.appState = AppState.PLAY_PAUSE;
        break;
      default:
        throw new Error('No case for action ' + action.action);
    }
  }

  private newID(): number {
    this.numObj++;
    return this.numObj;
  }
}
