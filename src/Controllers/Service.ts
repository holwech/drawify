import { AppController } from './AppController';
import { IViewBox } from '../Interfaces/BoardInterfaces';
import { UserActionType } from '../Interfaces/AppInterfaces';
import { IStrokeProps, Targets, IAction } from '../Interfaces/ActionInterfaces';
import { singleton } from 'tsyringe';
import Dispatcher from './Dispatcher';
import { ModifierTarget } from '../Domain/Modifier';
import { RecordController } from './RecordController';

@singleton()
export default class Service {
  constructor(private app: AppController, private dispatcher: Dispatcher, private recorder: RecordController) {
    console.log('Constructing service')
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

  public setStrokeProperties(strokeProps: IStrokeProps): void {
    this.dispatcher.dispatchModifier({ target: ModifierTarget.SET_STROKE_PROPS, options: strokeProps });
  }

  public setViewBox(viewBox: IViewBox): void {
    this.dispatcher.dispatchAction({ target: Targets.VIEW_BOX, options: viewBox });
  }

  public export(): IAction[] {
    this.app.dispatchUserAction({ action: UserActionType.STOP });
    return this.recorder.getEventLog();
  }
}
