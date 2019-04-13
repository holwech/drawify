import { TimerStates } from './timerInterfaces';

interface ITimeMonitor {
  minutes: string;
  seconds: string;
  lengthMinutes: string;
  lengthSeconds: string;
}

export default class Timer {
  public timeMonitor: ITimeMonitor = {
    minutes: '00',
    seconds: '00',
    lengthMinutes: '00',
    lengthSeconds: '00',
  };
  private startTime = 0;
  private pauseTime = 0;
  private reverseTime = 0;
  private lengthTime = 0;
  private state: TimerStates = TimerStates.UINIT;

  constructor() {
    this.startTimeMonitor();
  }

  public getTime(): number {
    switch (this.state) {
      case TimerStates.UINIT:
        return 0;
      case TimerStates.STARTED:
        return Date.now() - this.startTime;
      case TimerStates.PAUSED:
        return this.pauseTime - this.startTime;
      case TimerStates.REVERSE:
        const time = 2 * this.reverseTime - this.startTime - Date.now();
        if (time < 0) {
          return 0;
        } else {
          return time;
        }
    }
  }

  public setLengthTime(): void {
    const currentTime = this.getTime();
    if (currentTime > this.lengthTime) {
      this.lengthTime = currentTime;
    }
  }

  public getState(): TimerStates {
    return this.state;
  }
  
  public getLengthTime(): number {
    return this.lengthTime - this.startTime;
  }

  public restart(): void {
    this.setLengthTime();
    const currentTime = Date.now();
    this.lengthTime = currentTime + this.lengthTime - this.startTime
    this.startTime = currentTime;
    this.pauseTime = this.startTime;
  }

  public reset(): void {
    this.restart();
    this.lengthTime = this.startTime;
  }

  public start(): void {
    switch (this.state) {
      case TimerStates.UINIT:
        this.startTime = Date.now();
        break;
      case TimerStates.PAUSED:
        this.startTime += Date.now() - this.pauseTime;
        break;
      case TimerStates.REVERSE:
        this.startTime = Date.now() - this.getTime();
        break;
      default:
        break;
    }
    this.state = TimerStates.STARTED;
  }

  public reverse(): void {
    switch (this.state) {
      case TimerStates.UINIT:
        this.reverseTime = this.startTime;
        break;
      case TimerStates.STARTED:
        this.setLengthTime();
        this.reverseTime = Date.now();
        break;
      case TimerStates.PAUSED:
        const currentTime = Date.now();
        this.startTime += currentTime - this.pauseTime;
        this.reverseTime = currentTime;
        break;
      default:
        break;
    }
    this.state = TimerStates.REVERSE;
  }

  public pause(): void {
    switch (this.state) {
      case TimerStates.UINIT:
        break;
      case TimerStates.STARTED:
        this.setLengthTime();
        this.pauseTime = Date.now();
        break;
      case TimerStates.REVERSE:
        const currentTime = Date.now();
        this.startTime = currentTime - this.getTime();
        this.pauseTime = currentTime;
        break;
      default:
        break;
    }
    this.state = TimerStates.PAUSED;
  }

  public startTimeMonitor(): void {
    setInterval(() => {
      const currentTime = this.getTime();
      const minutes = Math.floor((currentTime % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((currentTime % (1000 * 60)) / 1000);
      this.timeMonitor.minutes = this.pad(String(minutes), 2);
      this.timeMonitor.seconds = this.pad(String(seconds), 2);
      if (currentTime > this.lengthTime) {
        this.timeMonitor.lengthMinutes = this.timeMonitor.minutes;
        this.timeMonitor.lengthSeconds = this.timeMonitor.seconds;
      }
    }, 1000);
  }

  private now(): number {
    if (!this.startTime) {
      this.startTime = Date.now();
    }
    return Date.now() - this.startTime;
  }

  private pad(n: string, width: number, z?: string | undefined): string {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  }
}
