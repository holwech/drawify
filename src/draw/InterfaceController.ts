import { AppController } from './AppController';
import { IStrokeProps, EventType, BoardState, IViewBox } from './utils/boardInterfaces';
import { ActionType } from './utils/appInterfaces';
import { State } from './State';

export class Controller {
  public state: State;
  private app: AppController;

  constructor(svgID: string, strokeProps: IStrokeProps) {
    this.app = new AppController(svgID, strokeProps);
    this.state = this.app.state;
  }

  public playRecording(): void {
    this.app.dispatchAction({ action: ActionType.PLAY_START });
  }

  public startRecording(): void {
    this.app.dispatchAction({ action: ActionType.RECORD_START });
  }

  public pauseRecording(): void {
    this.app.dispatchAction({ action: ActionType.RECORD_PAUSE });
  }

  public stopRecording(): void {
    this.app.dispatchAction({ action: ActionType.RECORD_STOP });
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
