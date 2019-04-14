import { IEvent, EventType, EventOrigin, IStrokeProps } from './utils/boardInterfaces';
import { BoardController } from './board/BoardController';
import { PlayController } from './player/PlayController';
import { RecordController } from './recorder/RecordController';
import { EventController } from './event/EventController';
import { IAction, ActionType, AppStates, AppSubState } from './utils/appInterfaces';
import AppState from './AppState';

export class AppController {
  public state: AppState;
  private board: BoardController;
  private playBoard: BoardController;
  private player: PlayController;
  private recorder: RecordController;
  private event: EventController;
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

    const initialState = [
      { eventType: EventType.SET_STROKE_PROPS, strokeProps },
      { eventType: EventType.SET_VIEWBOX, viewBox },
    ];
    this.board = new BoardController(this.svg, this, initialState);
    this.playBoard = new BoardController(this.svg, this, initialState);
    this.recorder = new RecordController(this, initialState);
    this.player = new PlayController(this, this.state.playState);
    this.event = new EventController(this.svg, this);
  }

  public dispatchEvent(event: IEvent, origin: EventOrigin): void {
    console.log('EVENT: ' + event.eventType);
    switch (this.state.state) {
      case AppStates.RECORDING:
        if (origin === EventOrigin.USER) {
          event.time = this.state.timer.getTime();
          this.board.execute(event);
          this.recorder.record(event);
        } else {
          this.playBoard.execute(event);
        }
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
      case ActionType.RECORD_ON:
        this.event.addEventListeners();
        this.state.state = AppStates.RECORDING;
        break;
      case ActionType.RECORD_OFF:
        this.event.removeEventListeners();
        this.state.timer.pause();
        this.state.timer.setLengthTime();
        if (this.state.timer.atEndTime()) {
          this.dispatchEvent({ eventType: EventType.END }, EventOrigin.USER);
        }
        this.player.setEventLog(this.recorder.getEventLog());
        this.dispatchAction({ action: ActionType.PAUSE });
        this.state.state = AppStates.PLAYING;
        break;
      default:
        switch (this.state.state) {
          case AppStates.RECORDING:
            this.dispatchRecordAction(action);
            break;
          case AppStates.PLAYING:
            this.dispatchPlayAction(action);
            break;
          default:
            break;
        }
    }
  }

  private dispatchRecordAction(action: IAction): void {
    switch (action.action) {
      case ActionType.START:
        this.state.timer.start();
        this.state.subState = AppSubState.START;
        break;
      case ActionType.PAUSE:
        this.state.timer.pause();
        this.state.subState = AppSubState.PAUSE;
        break;
      case ActionType.REVERSE:
        this.state.timer.reverse();
        this.state.subState = AppSubState.REVERSE;
        break;
      case ActionType.RESTART:
        this.state.timer.restart();
        this.dispatchAction({ action: ActionType.RECORD_OFF });
        break;
      default:
        break;
    }
  }

  private dispatchPlayAction(action: IAction): void {
    switch (action.action) {
      case ActionType.START:
        if (this.state.timer.atEndTime()) {
          this.dispatchAction({ action: ActionType.RESTART });
        }
        this.player.play();
        this.state.subState = AppSubState.START;
        break;
      case ActionType.PAUSE:
        this.player.pause();
        this.state.subState = AppSubState.PAUSE;
        break;
      case ActionType.REVERSE:
        this.player.reverse();
        this.state.subState = AppSubState.REVERSE;
        break;
      case ActionType.RESTART:
        this.player.restart();
        break;
      default:
        break;
    }
  }
}
