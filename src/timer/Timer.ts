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
  private startTime: number;
  private pauseTime = 0;
  private reverseTime = 0;
  private lengthTime = 0;
  private state: TimerStates = TimerStates.PAUSED;

  constructor() {
    this.startTimeMonitor();
    this.startTime = Date.now();
  }

  public getTime(): number {
    switch (this.state) {
      case TimerStates.STARTED:
        return this.now();
      case TimerStates.PAUSED:
        return this.pauseTime;
      case TimerStates.REVERSE:
        const time = 2 * this.reverseTime - this.now();
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

  public getLengthTime(): number {
    this.setLengthTime();
    return this.lengthTime;
  }

  public getState(): TimerStates {
    return this.state;
  }

  public restart(): void {
    this.setLengthTime();
    this.startTime = Date.now();
    this.pauseTime = 0;
    this.updateTimeMonitor();
  }

  public reset(): void {
    this.restart();
    this.lengthTime = 0;
  }

  public start(): void {
    console.log('started');
    console.log(this.getLengthTime());
    switch (this.state) {
      case TimerStates.PAUSED:
        this.startTime += this.now() - this.pauseTime;
        break;
      case TimerStates.REVERSE:
        this.startTime += 2 * (this.now() - this.reverseTime);
        break;
      default:
        break;
    }
    this.state = TimerStates.STARTED;
  }

  public reverse(): void {
    console.log('reverse');
    switch (this.state) {
      case TimerStates.STARTED:
        this.setLengthTime();
        this.reverseTime = this.now();
        break;
      case TimerStates.PAUSED:
        const now = this.now();
        this.startTime += now - this.pauseTime;
        this.reverseTime = this.now();
        break;
      default:
        break;
    }
    this.state = TimerStates.REVERSE;
  }

  public pause(): void {
    console.log('paused');
    switch (this.state) {
      case TimerStates.STARTED:
        this.setLengthTime();
        this.pauseTime = this.now();
        break;
      case TimerStates.REVERSE:
        const now = this.now();
        this.startTime += 2 * (now - this.reverseTime);
        this.pauseTime = this.now();
        break;
      default:
        break;
    }
    this.state = TimerStates.PAUSED;
  }

  private startTimeMonitor(): void {
    setInterval(() => {
      this.updateTimeMonitor();
    }, 1000);
  }

  private updateTimeMonitor(): void {
    const currentTime = this.getTime();
    const minutes = Math.floor((currentTime % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((currentTime % (1000 * 60)) / 1000);
    this.timeMonitor.minutes = this.pad(String(minutes), 2);
    this.timeMonitor.seconds = this.pad(String(seconds), 2);
    if (currentTime > this.lengthTime) {
      this.timeMonitor.lengthMinutes = this.timeMonitor.minutes;
      this.timeMonitor.lengthSeconds = this.timeMonitor.seconds;
    }
  } 

  private now(): number {
    return Date.now() - this.startTime;
  }

  private pad(n: string, width: number, z?: string | undefined): string {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  }
}
