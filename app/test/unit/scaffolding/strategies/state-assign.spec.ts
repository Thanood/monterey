import {StateAssign} from '../../../../src/scaffolding/strategies/state-assign';

describe('StateAssign', () => {
  let sut: StateAssign;

  beforeEach(() => {
    sut = new StateAssign();
  });

  it('accepts state assign steps', () => {
    expect(sut.accepts(<any>{ type: 'state-assign' })).toBe(true);
  });

  it('assigns the state of the step to the state of the workflow', () => {
    let step = <any>{
      state: {
        name: 'foo'
      },
      nextActivity: 5
    };
    let workflow = <any>{
      next: jasmine.createSpy('next')
    };
    let context = <any>{
      state: {
        color: 'blue'
      }
    };

    sut.next(step, workflow, context);

    expect(workflow.next).toHaveBeenCalledWith(5);
    expect(context.state.name).toBe('foo');
  });
});