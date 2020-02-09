import ServiceBuilder from '../ServiceBuilder';

describe('Core functions', () => {
  it('should return state', () => {
    let service = new ServiceBuilder();
    let element = document.createElement('svg');
    (element as any).getScreenCTM = () => true;
    let instance = service.build(element);
  });
});
