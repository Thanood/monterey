import {Input} from '../../../../src/scaffolding/strategies/input';

describe('Input', () => {
  let sut: Input;

  beforeEach(() => {
    sut = new Input();
  });

  it('accepts input steps', () => {
    expect(sut.accepts(<any>{ type: 'input-select' })).toBe(true);
    expect(sut.accepts(<any>{ type: 'input-text' })).toBe(true);
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

  it('sets the view-model of the step', () => {
    let firstStep = <any>{};
    let context = <any>{ state: {} };
    let workflow = <any>{ context: context };
    sut.next(firstStep, workflow, context);

    expect(firstStep.viewModel).toBe('scaffolding/question');
  });

  it('sets the default answer', () => {
    let firstStep = <any>{
      stateProperty: 'color'
    };
    let context = <any>{
      state: {
        color: 'blue'
      }
    };
    let workflow = <any>{ context: context };
    sut.next(firstStep, workflow, context);

    expect(firstStep.answer).toBe('blue');
  });

  it('selects the first answer from a input-select', () => {
    let firstStep = <any>{
      type: 'input-select',
      options: [{
        value: 'blue'
      }],
      stateProperty: 'color'
    };
    let context = <any>{ state: {} };
    let workflow = <any>{ context: context };
    sut.next(firstStep, workflow, context);

    expect(firstStep.answer).toBe('blue');
  });

  it('preprocesses steps so that a screen is used for the name of a project', () => {
    let steps = [<any>{
      stateProperty: 'name',
      type: 'input-text'
    }];
    sut.preprocess(steps);

    expect(steps[0].type).toBe('screen');
    expect(steps[0].viewModel).toBe('../project-name');
  });
});