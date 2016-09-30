import {Screen} from '../../../../src/scaffolding/strategies/screen';

describe('Screen', () => {
  let sut: Screen;

  beforeEach(() => {
    sut = new Screen();
  });

  it('accepts screen steps', () => {
    expect(sut.accepts(<any>{ type: 'screen' })).toBe(true);
  });

  it('keeps track of what the first screen is', () => {
    let firstStep = <any>{};
    let secondStep = <any>{ foo: 'bar' };
    let context = <any>{ state: {} };
    let workflow = <any>{ context: context };
    sut.next(firstStep, workflow, context);

    expect(workflow.firstScreen).toBe(firstStep);

    sut.next(secondStep, workflow, context);
    expect(workflow.firstScreen).toBe(firstStep);
  });
});