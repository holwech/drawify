import { singleton } from 'tsyringe';
import { SVG } from '../Interfaces/AppInterfaces';
import { IAction, optionTypes, Targets, IClickOptions } from '../Interfaces/ActionInterfaces';
import Dispatcher from './Dispatcher';
import { RecordController } from './RecordController';
import { Board } from '../Board/Board';

@singleton()
export default class EditController {
  constructor(dispatcher: Dispatcher, private recorder: RecordController, private board: Board) {
    dispatcher.onEdit(this.execute.bind(this));
  }

  public execute(action: IAction<optionTypes>): void {
    switch (action.target) {
      case Targets.CLICK:
        this.removeElement(action.options as IClickOptions);
        this.recorder.filterLogById(action.id!);
        break;
      default:
        break;
    }
  }

  private removeElement(options: IClickOptions): void {
    let id = (options.event?.target as Element).id;
    this.board.removeElement(options.event?.target as Element);
    this.recorder.filterLogById(Number(id));
  }
}
