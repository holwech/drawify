import { AppController } from './AppController';
import { IViewBox, EventOrigin } from './utils/boardInterfaces';
import { EventType } from './utils/appInterfaces';
import { UserActionType } from './utils/appInterfaces';
import AppState from './AppState';
import { IStrokePropOptions, Targets, IStateOptions } from './action/ActionInterfaces';

export class Controller {
  public app: AppController;

  constructor(svgID: string, state: AppState, strokeProps: IStrokePropOptions[]) {
    this.app = new AppController(svgID, state);
    strokeProps.forEach(strokeProp => {
      this.app.action.dispatchAction({ target: Targets.STROKE_PROP, options: strokeProp });
    });
  }

  public start(): void {
    this.app.dispatchUserAction({ action: UserActionType.START });
  }

  public pause(): void {
    this.app.dispatchUserAction({ action: UserActionType.PAUSE });
  }

  public reverse(): void {
    this.app.dispatchUserAction({ action: UserActionType.REVERSE });
  }

  public restart(): void {
    this.app.dispatchUserAction({ action: UserActionType.RESTART });
  }

  public recordOn(): void {
    this.app.dispatchUserAction({ action: UserActionType.RECORD_ON });
  }

  public recordOff(): void {
    this.app.dispatchUserAction({ action: UserActionType.RECORD_OFF });
  }

  public clear(): void {
    this.app.action.dispatchAction({ target: Targets.CLEAR });
  }

  public stateToggle(flag: boolean): void {
    this.app.action.dispatchAction({
      target: Targets.BOARD_STATE,
      options: { flag } as IStateOptions,
    });
  }

  public setStrokeProperties(strokeProps: IStrokePropOptions): void {
    this.app.action.dispatchAction({ target: Targets.STROKE_PROP, options: strokeProps });
  }

  public setViewBox(viewBox: IViewBox): void {
    this.app.action.dispatchAction({ target: Targets.VIEW_BOX, options: viewBox });
  }
}
