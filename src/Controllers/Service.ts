import { AppController } from './AppController';
import { IViewBox } from '../Interfaces/BoardInterfaces';
import { UserActionType } from '../Interfaces/AppInterfaces';
import { IStrokePropOptions, Targets, IStateOptions } from '../Interfaces/ActionInterfaces';
import { singleton } from 'tsyringe';
import Dispatcher from './Dispatcher';
import { ModifierTarget } from '../Domain/Modifier';

@singleton()
export default class Service {
  constructor(
    private app: AppController,
    private dispatcher: Dispatcher,
  ) {}

  public init(strokeProps: IStrokePropOptions[]) {
    strokeProps.forEach(strokeProp => {
      this.dispatcher.dispatchAction({ target: Targets.STROKE_PROP, options: strokeProp });
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
    this.dispatcher.dispatchAction({ target: Targets.CLEAR });
  }

  public stateToggle(flag: boolean): void {
    this.dispatcher.dispatchModifier({ target: flag ? ModifierTarget.PAN_ON : ModifierTarget.PAN_OFF });
  }

  public setStrokeProperties(strokeProps: IStrokePropOptions): void {
    this.dispatcher.dispatchAction({ target: Targets.STROKE_PROP, options: strokeProps });
  }

  public setViewBox(viewBox: IViewBox): void {
    this.dispatcher.dispatchAction({ target: Targets.VIEW_BOX, options: viewBox });
  }
}
