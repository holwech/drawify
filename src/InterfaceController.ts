import { AppController } from './AppController';
import { IStrokeProps, BoardState, IViewBox, EventOrigin } from './utils/boardInterfaces';
import { EventType } from './utils/appInterfaces';
import { UserActionType } from './utils/appInterfaces';
import AppState from './AppState';

export class Controller {
  public app: AppController;

  constructor(svgID: string, state: AppState, strokeProps: IStrokeProps) {
    this.app = new AppController(svgID, state, strokeProps);
  }

  public start(): void {
    this.app.dispatchAction({ action: UserActionType.START });
  }

  public pause(): void {
    this.app.dispatchAction({ action: UserActionType.PAUSE });
  }

  public reverse(): void {
    this.app.dispatchAction({ action: UserActionType.REVERSE });
  }

  public restart(): void {
    this.app.dispatchAction({ action: UserActionType.RESTART });
  }

  public recordOn(): void {
    this.app.dispatchAction({ action: UserActionType.RECORD_ON });
  }

  public recordOff(): void {
    this.app.dispatchAction({ action: UserActionType.RECORD_OFF });
  }

  public clear(): void {
    this.app.event.dispatch({ eventType: EventType.CLEAR }, EventOrigin.USER);
  }

  public setState(state: BoardState): void {
    this.app.event.dispatch({ eventType: EventType.SET_STATE, state }, EventOrigin.USER);
  }

  public setStrokeProperties(strokeProps: IStrokeProps): void {
    this.app.event.dispatch({ eventType: EventType.SET_STROKE_PROPS, strokeProps }, EventOrigin.USER);
  }

  public setViewBox(viewBox: IViewBox): void {
    this.app.event.dispatch({ eventType: EventType.SET_VIEWBOX, viewBox }, EventOrigin.USER);
  }
}
