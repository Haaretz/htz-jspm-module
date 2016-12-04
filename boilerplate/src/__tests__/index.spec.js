import method from '../index';

describe('method', () => {
  it('should be a function', () => {
    expect(method).to.be.a('function');
  });

  it('should return true for params passed that are greater than 0', () => {
    expect(method(1)).to.be.true();
  });
});
