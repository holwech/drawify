import { TimerStates } from './timerInterfaces';
interface ITimeMonitor {
    minutes: number;
    seconds: number;
}
export default class Timer {
    private startTime;
    private stopTime;
    private pauseTime;
    private reverseTime;
    private state;
    private timeMonitorInterval;
    getTime(): number;
    getStopTime(): number;
    getState(): TimerStates;
    restart(): void;
    start(): void;
    reverse(): void;
    pause(): void;
    stop(): void;
    bindTimeMonitor(timeObj: ITimeMonitor): void;
}
export {};
