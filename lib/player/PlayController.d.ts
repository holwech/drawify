import { IEvent } from '../utils/boardInterfaces';
import { AppController } from '../AppController';
import PlayState from './PlayState';
export declare class PlayController {
    private app;
    private state;
    constructor(app: AppController, state: PlayState);
    play(): void;
    pause(): void;
    stop(): void;
    reverse(): void;
    setEventLog(log: IEvent[]): void;
    deleteEventLog(): void;
    private reset;
    private playEvents;
    private reversePlayEvents;
}
