import { BoardController } from './board/BoardController';
import { PlayBaseController } from './player/PlayBaseController';
import { RecordController } from './recorder/RecordController';
import { EventListenerController } from './eventListener/EventListenerController';
import { IUserAction, UserActionType, AppStates } from './utils/appInterfaces';
import AppState from './AppState';
import ActionController from './action/ActionController';
import { Targets, IAction } from './action/ActionInterfaces';

export class AppController {
  public state: AppState;
  public action: ActionController;
  public board: BoardController;
  public player: PlayBaseController;
  public recorder: RecordController;
  // private editor: EditController;
  private eventListeners: EventListenerController;
  private svg: HTMLElement & SVGElement & SVGSVGElement;

  constructor(svgID: string, state: AppState) {
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
    this.board = new BoardController(this.svg);
    this.recorder = new RecordController();
    this.player = new PlayBaseController(this, this.state.timer, this.state.playState);
    // this.editor = new EditController(this.svg);
    this.action = new ActionController(
      this.state.eventState,
      this.state.timer,
      this.board,
      this.recorder,
    );
    this.eventListeners = new EventListenerController(this.svg, this);
    this.eventListeners.addEventListeners();

    const initialState: IAction[] = [
      { target: Targets.VIEW_BOX, options: viewBox },
    ];
    initialState.forEach(event => {
      this.action.dispatchAction(event);
    });
  }

  public dispatchUserAction(action: IUserAction): void {
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
          this.action.dispatchAction({ target: Targets.END });
        }
        this.player.setEventLog(this.recorder.getEventLog());
        this.state.timer.restart();
        this.player.restart();
        // this.action.dispatchAction({ target: Targets.RESET }, false);
        break;
      default:
        break;
    }
  }
}
