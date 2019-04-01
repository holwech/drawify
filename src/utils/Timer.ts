enum TimerStates {
  UINIT,
  STARTED,
  PAUSED,
  STOPPED,
  REVERSE,
}

interface ITimeMonitor {
  minutes: number;
  seconds: number;
}

export default class Timer {
  private startTime = 0;
  private stopTime = 0;
  private pauseTime = 0;
  private reverseTime = 0;
  private state: TimerStates = TimerStates.UINIT;
  private timeMonitorInterval!: number;

  public getTime(): number {
    switch (this.state) {
      case TimerStates.UINIT:
        return 0;
      case TimerStates.STARTED:
        return new Date().getTime() - this.startTime;
      case TimerStates.PAUSED:
        return this.pauseTime - this.startTime;
      case TimerStates.STOPPED:
        return this.stopTime - this.startTime;
      case TimerStates.REVERSE:
        const time = this.reverseTime - this.startTime - new Date().getTime();
        if (time < 0) {
          return 0;
        } else {
          return time;
        }
    }
  }

  public getStopTime(): number {
    if (this.state !== TimerStates.STOPPED) {
      return 0;
    }
    return this.stopTime;
  }

  public getState(): TimerStates {
    return this.state;
  }

  public restart(): void {
    this.startTime = new Date().getTime();
    this.stopTime = this.startTime;
  }

  public start(): void {
    switch (this.state) {
      case TimerStates.UINIT:
        this.startTime = new Date().getTime();
        break;
      case TimerStates.PAUSED:
        this.startTime += new Date().getTime() - this.pauseTime;
        break;
      case TimerStates.STOPPED:
        this.startTime = new Date().getTime();
        this.stopTime = this.startTime;
        this.pauseTime = this.startTime;
        break;
      case TimerStates.REVERSE:
        this.startTime = new Date().getTime() - this.getTime();
        break;
      default:
        break;
    }
    this.state = TimerStates.STARTED;
    console.log('State is ' + this.state);
  }

  public reverse(): void {
    switch (this.state) {
      case TimerStates.UINIT:
        this.reverseTime = this.startTime;
        break;
      case TimerStates.STARTED:
        this.reverseTime = new Date().getTime();
        break;
      case TimerStates.PAUSED:
        this.reverseTime = this.pauseTime;
        break;
      case TimerStates.STOPPED:
        throw new Error('Cannot run reverse on a stopped timer');
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
        this.pauseTime = new Date().getTime();
        break;
      case TimerStates.STOPPED:
        break;
      case TimerStates.REVERSE:
        const currentTime = new Date().getTime();
        this.startTime = currentTime - this.getTime();
        this.pauseTime = currentTime;
        break;
      default:
        break;
    }
    this.state = TimerStates.PAUSED;
    console.log('State is ' + this.state);
  }

  public stop(): void {
    switch (this.state) {
      case TimerStates.UINIT:
        return;
      case TimerStates.STARTED:
        this.stopTime = new Date().getTime();
        break;
      case TimerStates.PAUSED:
        this.stopTime = this.pauseTime;
        break;
      default:
        break;
    }
    this.state = TimerStates.STOPPED;
    console.log('State is ' + this.state);
  }

  public bindTimeMonitor(timeObj: ITimeMonitor): void {
    this.timeMonitorInterval = setInterval(() => {
      console.log(this.state);
      const currentTime = this.getTime();
      timeObj.minutes = Math.floor((currentTime % (1000 * 60 * 60)) / (1000 * 60));
      timeObj.seconds = Math.floor((currentTime % (1000 * 60)) / 1000);
      console.log(timeObj.seconds);
    }, 1000);
  }
}
