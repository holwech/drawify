enum TimerState {
  UINIT,
  STARTED,
  PAUSED,
  STOPPED,
}

export default class Timer {
  private startTime = 0;
  private stopTime = 0;
  private pauseTime = 0;
  private state: TimerState = TimerState.UINIT;

  public getTime() {
    switch (this.state) {
      case TimerState.UINIT: {
        return 0;
      }
      case TimerState.STARTED: {
        return new Date().getTime() - this.startTime;
      }
      case TimerState.PAUSED: {
        return this.pauseTime - this.startTime;
      }
      case TimerState.STOPPED: {
        return this.stopTime - this.startTime;
      }
    }
  }

  public getStopTime() {
    if (this.state !== TimerState.STOPPED) {
      return 0;
    }
    return this.stopTime;
  }

  public getState() {
    return this.state;
  }

  public restart() {
    this.startTime = new Date().getTime();
    this.stopTime = this.startTime;
  }

  public start() {
    switch (this.state) {
      case TimerState.UINIT: {
        this.startTime = new Date().getTime();
        break;
      }
      case TimerState.PAUSED: {
        this.startTime += new Date().getTime() - this.pauseTime;
        break;
      }
      case TimerState.STOPPED: {
        this.startTime = new Date().getTime();
        this.stopTime = this.startTime;
        this.pauseTime = this.startTime;
        break;
      }
      default: {
        break;
      }
    }
    this.state = TimerState.STARTED;
    console.log('State is ' + this.state);
  }

  public pause() {
    switch (this.state) {
      case TimerState.UINIT: {
        return;
      }
      case TimerState.STARTED: {
        this.pauseTime = new Date().getTime();
        break;
      }
      case TimerState.STOPPED: {
        return;
      }
      default: {
        break;
      }
    }
    this.state = TimerState.PAUSED;
    console.log('State is ' + this.state);
  }

  public stop() {
    switch (this.state) {
      case TimerState.UINIT: {
        return;
      }
      case TimerState.STARTED: {
        this.stopTime = new Date().getTime();
        break;
      }
      case TimerState.PAUSED: {
        this.stopTime = this.pauseTime;
        break;
      }
      default: {
        break;
      }
    }
    this.state = TimerState.STOPPED;
    console.log('State is ' + this.state);
  }
}
