import { ElementClickActionType, IStrokeProps } from '../Interfaces/ActionInterfaces';
import { singleton } from 'tsyringe';

@singleton()
export default class DispatcherState {
  public idCount: number = 0;
  public panState: boolean = false;
  public editMode: boolean = false;
  public clickTarget = ElementClickActionType.REMOVE;
  public strokeProps: IStrokeProps = {
    stroke: 'green',
    'stroke-width': 50,
    'buffer-size': 20,
    fill: undefined,
  };
  public scale: number = 1;
  public scaledStrokeWidth: number = this.strokeProps['stroke-width'];

  constructor() { }
}
