import { AppController } from './AppController';
import { IStrokeProps, EventType, BoardState, IViewBox } from './utils/boardInterfaces';
import { ActionType } from './utils/appInterfaces';

export class Controller {
  public app: AppController;

  constructor(svgID: string, strokeProps: IStrokeProps) {
    this.app = new AppController(svgID, strokeProps);
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

  public stop(): void {
    this.app.dispatchAction({ action: ActionType.STOP });
  }
  
  public recordOn(): void {
    this.app.dispatchAction({ action: ActionType.RECORD_ON })
  }

  public recordOff(): void {
    this.app.dispatchAction({ action: ActionType.RECORD_OFF })
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
