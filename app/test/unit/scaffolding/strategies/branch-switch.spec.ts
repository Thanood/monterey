import {BranchSwitch} from '../../../../src/scaffolding/strategies/branch-switch';

describe('BranchSwitch', () => {
  let sut: BranchSwitch;

  beforeEach(() => {
    sut = new BranchSwitch();
  });

  it('accepts branch switches', () => {
    expect(sut.accepts(<any>{ type: 'branch-switch' })).toBe(true);
  });

  it('finds next activity and calls next on workflow', () => {
    let step = <any>{
      stateProperty: 'color',
      branches: [{
        case: 'blue',
        nextActivity: 5
      }, {
        case: 'red',
        nextActivity: 10
      }]
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
  });

  it('uses the id if the value is an object', () => {
    let step = <any>{
      stateProperty: 'color',
      branches: [{
        case: 'blue',
        nextActivity: 5
      }, {
        case: 'red',
        nextActivity: 10
      }]
    };
    let workflow = <any>{
      next: jasmine.createSpy('next')
    };
    let context = <any>{
      state: {
        color: {
          id: 'blue',
          name: 'blue'
        }
      }
    };

    sut.next(step, workflow, context);

    expect(workflow.next).toHaveBeenCalledWith(5);
  });
});