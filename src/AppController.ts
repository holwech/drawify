import { EventOrigin, IStrokeProps } from './utils/boardInterfaces';
import { EventType } from './utils/appInterfaces';
import { BoardController } from './board/BoardController';
import { PlayBaseController } from './player/PlayBaseController';
import { RecordController } from './recorder/RecordController';
import { EventListenerController } from './eventListener/EventListenerController';
import { IAction, UserActionType, AppStates } from './utils/appInterfaces';
import AppState from './AppState';
import EventController from './event/EventController';

export class AppController {
  public state: AppState;
  public event: EventController;
  private board: BoardController;
  private playBoard: BoardController;
  private player: PlayBaseController;
  private recorder: RecordController;
  // private editor: EditController;
  private eventListeners: EventListenerController;
  private svg: HTMLElement & SVGElement & SVGSVGElement;

  constructor(svgID: string, state: AppState, strokeProps: IStrokeProps) {
    this.state = state;
    this.svg = (document.getElementById(svgID) as any) as HTMLElement & SVGElement & SVGSVGElement;
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

    // These are missing timestamps?
    const initialState = [
      { eventType: EventType.SET_STROKE_PROPS, strokeProps, time: 0 },
      { eventType: EventType.SET_VIEWBOX, viewBox, time: 0 },
    ];
    this.board = new BoardController(this.svg, initialState);
    this.playBoard = new BoardController(this.svg, initialState);
    this.recorder = new RecordController(initialState);
    this.player = new PlayBaseController(this, this.state.timer, this.state.playState);
    // this.editor = new EditController(this.svg);
    this.event = new EventController(
      this.state.eventState,
      this.state.timer,
      this.playBoard,
      this.board,
      this.recorder,
    );
    this.eventListeners = new EventListenerController(this.svg, this);
    this.eventListeners.addEventListeners();
  }

  public dispatchAction(action: IAction): void {
    console.log('ACTION: ' + action.action);
    switch (action.action) {
      case UserActionType.START:
        if (this.state.timer.atStart()) {
          this.player.playFromTime(0);
        }
        this.state.timer.start();
        this.state.state = AppStates.START;
        break;
      case UserActionType.PAUSE:
        this.state.timer.pause();
        this.state.state = AppStates.PAUSE;
        break;
      case UserActionType.REVERSE:
        this.state.timer.reverse();
        this.state.state = AppStates.REVERSE;
        break;
      case UserActionType.RESTART:
        this.state.timer.pause();
        if (this.state.timer.atEnd()) {
          this.event.dispatch({ eventType: EventType.END }, EventOrigin.USER);
        }
        this.player.setEventLog(this.recorder.getEventLog());
        this.state.timer.restart();
        this.player.restart();
        this.event.dispatch({ eventType: EventType.RESET }, EventOrigin.PLAYER );
        break;
      default:
        break;
    }
  }
}
