import ServiceBuilder from '../ServiceBuilder';

describe('Core functions', () => {
  it('should return state', () => {
    let instance = new ServiceBuilder().build(['test', 'test1'] as any);
  });
});