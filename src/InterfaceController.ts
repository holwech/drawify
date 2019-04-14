import { AppController } from './AppController';
import { IStrokeProps, EventType, BoardState, IViewBox } from './utils/boardInterfaces';
import { ActionType } from './utils/appInterfaces';
import AppState from './AppState';

export class Controller {
  public app: AppController;

  constructor(svgID: string, state: AppState, strokeProps: IStrokeProps) {
    this.app = new AppController(svgID, state, strokeProps);
  }

  public start(): void {
    this.app.dispatchAction({ action: ActionType.START });
  }

  public pause(): void {
    this.app.dispatchAction({ action: ActionType.PAUSE });
  }

  public reverse(): void {
    this.app.dispatchAction({ action: ActionType.REVERSE });
  }

  public restart(): void {
    this.app.dispatchAction({ action: ActionType.RESTART });
  }

  public recordOn(): void {
    this.app.dispatchAction({ action: ActionType.RECORD_ON });
  }

  public recordOff(): void {
    this.app.dispatchAction({ action: ActionType.RECORD_OFF });
  }

  public clear(): void {
    this.app.dispatchEvent({ eventType: EventType.CLEAR });
  }

  public setState(state: BoardState): void {
    this.app.dispatchEvent({ eventType: EventType.SET_STATE, state });
  }

  public setStrokeProperties(strokeProps: IStrokeProps): void {
    this.app.dispatchEvent({ eventType: EventType.SET_STROKE_PROPS, strokeProps });
  }

  public setViewBox(viewBox: IViewBox): void {
    this.app.dispatchEvent({ eventType: EventType.SET_VIEWBOX, viewBox });
  }
}
