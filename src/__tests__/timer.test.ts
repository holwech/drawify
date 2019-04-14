import Timer from '../timer/Timer';
import { TimerStates } from '../timer/timerInterfaces';

describe('Core functions', () => {
  it('should return state', () => {
    const timer = new Timer();
    expect(timer.getState()).toBeDefined();
  });

  it('should return state', () => {
    const timer = new Timer();
    expect(timer.getTime()).toBeDefined();
  });

  it('restart should show correct time and time length', () => {
    const timer = new Timer();
    moveTimeTo(0);
    timer.start();
    moveTimeTo(1250);
    timer.restart();
    moveTimeTo(1500);
    expect(timer.getLengthTime()).toBe(1250);
    expect(timer.getTime()).toBe(250);
  });

  it('reset should reset timer and time length', () => {
    const timer = new Timer();
    moveTimeTo(0);
    timer.start();
    moveTimeTo(1250);
    timer.reset();
    moveTimeTo(1500);
    expect(timer.getLengthTime()).toBe(250);
    expect(timer.getTime()).toBe(250);
  });
});

describe('Base timer functions', () => {
  it('uninitalized timer should give 0', () => {
    const timer = new Timer();
    moveTimeTo(0);
    expect(timer.getTime()).toBe(0);
  });

  it('show correct time for started timer', () => {
    const timer = new Timer();
    moveTimeTo(0);
    timer.start();
    moveTimeTo(1000);
    expect(timer.getState()).toBe(TimerStates.STARTED);
    expect(timer.getTime()).toBe(1000);
  });

  it('show correct timer for start -> pause -> start', () => {
    const timer = new Timer();
    moveTimeTo(0);
    timer.start();
    moveTimeTo(1000);
    timer.pause();
    moveTimeTo(1500);
    timer.start();
    moveTimeTo(2000);
    expect(timer.getTime()).toBe(1500);
  });

  it('show correct timer for start -> reverse -> start', () => {
    const timer = new Timer();
    moveTimeTo(0);
    timer.start();
    moveTimeTo(1000);
    timer.reverse();
    moveTimeTo(1500);
    timer.start();
    moveTimeTo(3000);
    expect(timer.getTime()).toBe(2000);
  });

  it('show correct time after start -> reverse -> start', () => {
    const timer = new Timer();
    moveTimeTo(0);
    timer.start();
    moveTimeTo(4000);
    timer.reverse();
    moveTimeTo(5000);
    expect(timer.getTime()).toBe(3000);
    timer.start();
    moveTimeTo(8000);
    expect(timer.getTime()).toBe(6000);
  });

  it('show correct time after pause and then start', () => {
    const timer = new Timer();
    moveTimeTo(0);
    timer.start();
    moveTimeTo(1000);
    timer.pause();
    moveTimeTo(2000);
    expect(timer.getTime()).toBe(1000);
    timer.start();
    moveTimeTo(3000);
    expect(timer.getTime()).toBe(2000);
  });

  it('show return the same time after pause', () => {
    const timer = new Timer();
    moveTimeTo(0);
    timer.start();
    moveTimeTo(1000);
    timer.pause();
    moveTimeTo(2000);
    expect(timer.getTime()).toBe(1000);
    moveTimeTo(10000);
    expect(timer.getTime()).toBe(1000);
  });

  it('show correct time when reverse reaches time 0', () => {
    const timer = new Timer();
    moveTimeTo(0);
    timer.start();
    moveTimeTo(2000);
    timer.reverse();
    moveTimeTo(5000);
    expect(timer.getTime()).toBe(0);
  });

  it('show correct time after start -> pause -> reverse', () => {
    const timer = new Timer();
    moveTimeTo(0);
    timer.start();
    moveTimeTo(4000);
    timer.pause();
    moveTimeTo(5000);
    timer.reverse();
    moveTimeTo(6000);
    expect(timer.getTime()).toBe(3000);
  });
});

describe('Complex timer function traces', () => {
  // it('should restart timer correctly', () => {
  //   const timer = new Timer();
  //   moveTimeTo(0);
  //   timer.start();
  //   moveTimeTo(1000);
  //   timer.restart();
  //   moveTimeTo(2000);
  //   expect(timer.getTime()).toBe(1000);
  //   moveTimeTo(4000);
  //   expect(timer.getTime()).toBe(3000);
  // });

  it('should restart and show correct time length', () => {
    const timer = new Timer();
    moveTimeTo(0);
    timer.start();
    moveTimeTo(1500);
    timer.restart();
    expect(timer.getLengthTime()).toBe(1500);
    timer.start();
    moveTimeTo(2000);
    expect(timer.getLengthTime()).toBe(1500);
    timer.pause();
    moveTimeTo(2500);
    expect(timer.getLengthTime()).toBe(1500);
  });

  it('should restart timer and return correct time', () => {
    const timer = new Timer();
    moveTimeTo(0);
    timer.start();
    moveTimeTo(1000);
    timer.restart();
    expect(timer.getTime()).toBe(0);
    moveTimeTo(1500);
    expect(timer.getTime()).toBe(500);
    timer.pause();
    moveTimeTo(2000);
    expect(timer.getTime()).toBe(500);
    timer.restart();
    expect(timer.getTime()).toBe(0);
  });

  it('show correct time after start -> pause -> reverse -> start', () => {
    const timer = new Timer();
    moveTimeTo(0);
    timer.start();
    moveTimeTo(3000);
    timer.pause();
    moveTimeTo(4000);
    timer.reverse();
    moveTimeTo(6000);
    timer.start();
    moveTimeTo(8000);
    expect(timer.getTime()).toBe(3000);
  });

  it('show correct time after start -> reverse -> pause -> start', () => {
    const timer = new Timer();
    moveTimeTo(0);
    moveTimeTo(1000);
    timer.start();
    moveTimeTo(5000);
    timer.reverse();
    moveTimeTo(7000);
    timer.pause();
    moveTimeTo(9000);
    timer.start();
    moveTimeTo(10000);
    expect(timer.getTime()).toBe(3000);
  });
});

const moveTimeTo = (newTime: number) => {
  if (newTime !== 0 && Date.now() > newTime) {
    throw new Error('Cannot move time to be less than the current set time');
  }
  Date.now = jest.fn(() => newTime);
};
