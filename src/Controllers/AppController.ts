import { BoardController } from './BoardController';
import { PlayBaseController } from './PlayBaseController';
import { RecordController } from './RecordController';
import { EventListenerController } from './EventListenerController';
import { IUserAction, UserActionType, AppStates, SVG } from '../Interfaces/appInterfaces';
import AppState from '../State/AppState';
import { Targets, IAction } from '../Interfaces/ActionInterfaces';
import { injectable } from 'tsyringe';
import Dispatcher from './Dispatcher';

@injectable()
export class AppController {
  private svg!: SVG;

  constructor(
    private board: BoardController,
    private player: PlayBaseController,
    private recorder: RecordController,
    private eventListeners: EventListenerController,
    private state: AppState,
    private dispatcher: Dispatcher
  ) {

  }

  public init(svgID: string) {
    this.svg = (document.getElementById(svgID) as any) as SVG;
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
    this.board.init(this.svg);
    this.eventListeners.init(this.svg);
    this.eventListeners.addEventListeners();

    const initialState: IAction[] = [{ target: Targets.VIEW_BOX, options: viewBox }];
    initialState.forEach(event => {
      this.dispatcher.dispatchAction(event);
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
        if (this.state.timer.atEnd()) {
          this.dispatcher.dispatchAction({ target: Targets.END });
        }
        break;
      case UserActionType.REVERSE:
        this.state.timer.reverse();
        this.state.state = AppStates.REVERSE;
        break;
      case UserActionType.RESTART:
        this.state.timer.pause();
        if (this.state.timer.atEnd()) {
          this.dispatcher.dispatchAction({ target: Targets.END });
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
