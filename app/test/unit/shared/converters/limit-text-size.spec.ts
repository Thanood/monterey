import {LimitTextSizeValueConverter}  from '../../../../src/shared/converters/limit-text-size';
import {Container} from 'aurelia-framework';

describe('LimitTextSizeValueConverter', () => {
  let sut: LimitTextSizeValueConverter;
  let container: Container;

  beforeEach(() => {
    container = new Container();
    sut = container.get(LimitTextSizeValueConverter);
  });

  it('returns empty string if null/undefined', () => {
    expect(sut.toView(null, 5)).toBe('');
    expect(sut.toView(undefined, 5)).toBe('');
  });

  it('cuts off text at specific point and adds three dots', () => {
    expect(sut.toView('123456789', 5)).toBe('12345...');
    expect(sut.toView('123456789', 100)).toBe('123456789');
  });
});