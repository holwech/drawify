import { AppController } from './AppController';
import { IViewBox, EventOrigin } from '../Interfaces/BoardInterfaces';
import { UserActionType } from '../Interfaces/appInterfaces';
import AppState from '../State/AppState';
import { IStrokePropOptions, Targets, IStateOptions } from '../Interfaces/ActionInterfaces';
import { injectable } from 'tsyringe';
import ActionController from './ActionController';

@injectable()
export class Controller {
  constructor(
    private app: AppController,
    private action: ActionController,
    private state: AppState
  ) {}

  public init(svgID: string, strokeProps: IStrokePropOptions[]) {
    this.app.init(svgID);
    strokeProps.forEach(strokeProp => {
      this.action.dispatchAction({ target: Targets.STROKE_PROP, options: strokeProp });
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
    this.action.dispatchAction({ target: Targets.CLEAR });
  }

  public stateToggle(flag: boolean): void {
    this.action.dispatchAction({
      target: Targets.BOARD_STATE,
      options: { flag } as IStateOptions,
    });
  }

  public setStrokeProperties(strokeProps: IStrokePropOptions): void {
    this.action.dispatchAction({ target: Targets.STROKE_PROP, options: strokeProps });
  }

  public setViewBox(viewBox: IViewBox): void {
    this.action.dispatchAction({ target: Targets.VIEW_BOX, options: viewBox });
  }
}
