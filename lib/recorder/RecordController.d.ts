import { IEvent } from '../utils/boardInterfaces';
import { AppController } from '../AppController';
export declare class RecordController {
    private log;
    constructor(app: AppController, initialState?: IEvent[]);
    record(event: IEvent): void;
    printLog(): void;
    getEventLog(): IEvent[];
}
