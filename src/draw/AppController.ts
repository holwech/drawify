import { IEvent, EventType, IStrokeProps } from './utils/boardInterfaces';
import { BoardController } from './board/BoardController';
import { PlayController } from './player/PlayController';
import { RecordController } from './recorder/RecordController';
import { EventController } from './event/EventController';
import { IAction, ActionType, AppStates } from './utils/appInterfaces';
import AppState from './AppState';

export class AppController {
  public state: AppState;
  private board: BoardController;
  private player: PlayController;
  private recorder: RecordController;
  private event: EventController;
  private svg: HTMLElement & SVGElement & SVGSVGElement;

  constructor(svgID: string, strokeProps: IStrokeProps) {
    this.state = new AppState();
    this.svg = document.getElementById(svgID) as any as HTMLElement & SVGElement & SVGSVGElement;
    if (!this.svg.getScreenCTM()) {
      throw new Error('getScreenCTM is not defined');
    }
    let viewBox = { x: 0, y: 0, width: 1200, height: 800 };
    const viewboxElem = this.svg.getAttributeNS(null, 'viewBox');
    if (viewboxElem !== null) {
      const arr = viewboxElem.split(' ').map(Number);
      viewBox = { x: arr[0], y: arr[1], width: arr[2], height: arr[3] };
    } else {
      throw new Error('The SVG element requires the view box attribute to be set.');
    }

    const initialState = [
      { eventType: EventType.SET_STROKE_PROPS, strokeProps },
      { eventType: EventType.SET_VIEWBOX, viewBox },
    ];
    this.board = new BoardController(this.svg, this, initialState);
    this.recorder = new RecordController(this, initialState);
    this.player = new PlayController(this, this.state.playState);
    this.event = new EventController(this.svg, this);
  }

  public dispatchEvent(event: IEvent): void {
    console.log('EVENT: ' + event.eventType);
    switch (this.state.state) {
      case AppStates.UINIT:
        console.log('App uninitialized');
        break;
      case AppStates.RECORDING:
        event.time = this.state.timer.getTime();
        this.board.execute(event);
        this.recorder.record(event);
        break;
      case AppStates.PLAYING:
        this.board.execute(event);
        break;
      default:
        throw new Error('No case for appState ' + this.state.state);
    }
  }

  public dispatchAction(action: IAction): void {
    console.log('ACTION: ' + action.action);
    switch (action.action) {
      case ActionType.RECORD_START:
        this.state.state = AppStates.RECORDING;
        this.state.timer.start();
        this.event.executeAction(action);
        break;
      case ActionType.RECORD_STOP:
        this.state.state = AppStates.RECORDING;
        this.state.timer.stop();
        this.event.executeAction(action);
        break;
      case ActionType.RECORD_PAUSE:
        this.state.state = AppStates.RECORDING;
        this.state.timer.pause();
        this.event.executeAction(action);
        break;
      case ActionType.PLAY_START:
        if (
          this.state.state === AppStates.RECORDING ||
          this.state.state === AppStates.UINIT
        ) {
          this.player.setEventLog(this.recorder.getEventLog());
        }
        this.state.state = AppStates.PLAYING;
        this.player.play();
        break;
      case ActionType.PLAY_STOP:
        this.player.stop();
        this.state.state = AppStates.PLAYING;
        break;
      case ActionType.PLAY_PAUSE:
        this.player.pause();
        this.state.state = AppStates.PLAYING;
        break;
      case ActionType.PLAY_REVERSE:
        this.player.reverse();
        this.state.state = AppStates.PLAYING;
        break;
      default:
        throw new Error('No case for action ' + action.action);
    }
  }
}
