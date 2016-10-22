import {Common} from '../../../../src/plugins/jspm/common';

describe('JSPM Common', () => {
  let sut: Common;

  beforeEach(() => {
    sut = new Common();
  });

  it('resolves log messages from jspm', () => {
    expect(sut._resolveJSPMLogMessage('foo %myvar% bar')).toBe('foo myvar bar');
    expect(sut._resolveJSPMLogMessage('foo %myvar% bar %myvar%')).toBe('foo myvar bar myvar');

    expect(sut._resolveJSPMLogMessage(undefined)).toBe('');
  });
});