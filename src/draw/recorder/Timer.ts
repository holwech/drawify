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

  public start() {
    switch (this.state) {
      case TimerState.UINIT: {
        this.startTime = new Date().getTime();
        break;
      }
      case TimerState.PAUSED: {
        this.pauseTime = new Date().getTime() - this.stopTime;
        break;
      }
    }
    this.state = TimerState.STARTED;
  }

  public restart() {
    this.startTime = new Date().getTime();
    this.stopTime = this.startTime;
  }

  public stop() {

  }
}