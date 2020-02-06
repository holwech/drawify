import "reflect-metadata";
import { RecordController } from '../Controllers/RecordController';
import { Targets } from '../Interfaces/ActionInterfaces';


describe('Recording actions', () => {
  it('should return state', () => {
    const record = new RecordController();
    const action = [
      { id: 1, time: 1, target: Targets.DRAW },
      { id: 2, time: 2, target: Targets.DRAW },
      { id: 3, time: 3, target: Targets.DRAW },
      { id: 4, time: 4, target: Targets.END },
    ];
    action.forEach((action) => record.record(action));
    expect(record.getEventLog().length).toBe(4);
  });

  it('should remove redundant end action', () => {
    const record = new RecordController();
    const action = [
      { id: 1, time: 1, target: Targets.DRAW },
      { id: 2, time: 2, target: Targets.DRAW },
      { id: 3, time: 3, target: Targets.END },
      { id: 4, time: 4, target: Targets.DRAW },
      { id: 5, time: 5, target: Targets.END },
    ];
    action.forEach((action) => record.record(action));
    expect(record.getEventLog().length).toBe(4);
  });

  it('should order out of order actions', () => {
    const record = new RecordController();
    const action = [
      { id: 1, time: 1, target: Targets.DRAW },
      { id: 3, time: 3, target: Targets.DRAW },
      { id: 2, time: 2, target: Targets.DRAW },
      { id: 4, time: 4, target: Targets.END },
    ];
    action.forEach((action) => record.record(action));
    expect(record.getEventLog()[2].id).toBe(3);
  });
});
