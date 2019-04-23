import { IEvent, EventType, EventOrigin, IStrokeProps } from './utils/boardInterfaces';
import { BoardController } from './board/BoardController';
import { PlayBaseController } from './player/PlayBaseController';
import { RecordController } from './recorder/RecordController';
import { EventListenerController } from './eventListener/EventListenerController';
import { IAction, ActionType, AppStates } from './utils/appInterfaces';
import AppState from './AppState';
import EventController from './event/EventController';

export class AppController {
  public state: AppState;
  public event: EventController;
  private board: BoardController;
  private playBoard: BoardController;
  private player: PlayBaseController;
  private recorder: RecordController;
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
    this.board = new BoardController(this.svg, this, initialState);
    this.playBoard = new BoardController(this.svg, this, initialState);
    this.recorder = new RecordController(this, initialState);
    this.player = new PlayBaseController(this, this.state.timer, this.state.playState);
    this.event = new EventController(
      this.state.eventState,
      this.state.timer,
      this.playBoard,
      this.board,
      this.player,
      this.recorder,
    );
    this.eventListeners = new EventListenerController(this.svg, this);
    this.eventListeners.addEventListeners();
  }

  public dispatchAction(action: IAction): void {
    console.log('ACTION: ' + action.action);
    switch (action.action) {
      case ActionType.START:
        if (this.state.timer.atStart()) {
          this.player.playFromTime(0);
        }
        this.state.timer.start();
        this.state.state = AppStates.START;
        break;
      case ActionType.PAUSE:
        this.state.timer.pause();
        this.state.state = AppStates.PAUSE;
        break;
      case ActionType.REVERSE:
        this.state.timer.reverse();
        this.state.state = AppStates.REVERSE;
        break;
      case ActionType.RESTART:
        this.state.timer.pause();
        if (this.state.timer.atEnd()) {
          this.event.dispatch({ eventType: EventType.END }, EventOrigin.USER);
        }
        this.player.setEventLog(this.recorder.getEventLog());
        this.state.timer.restart();
        this.player.restart();
        break;
      default:
        break;
    }
  }
}
