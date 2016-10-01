import {Workflow} from '../../../src/scaffolding/workflow';
import {WorkflowContext} from '../../../src/scaffolding/workflow-context';
import {IStep} from '../../../src/scaffolding/istep';

describe('Workflow scaffolding engine', () => {
  let sut: Workflow;
  let context: WorkflowContext;

  beforeEach(() => {
    sut = new Workflow([{
      id: 1,
      type: 'state-assign',
      nextActivity: 2,
      state: {}
    }, {
      id: 2,
      type: 'screen',
      viewModel: './project-folder',
      nextActivity: 3
    }, {
      id: 3,
      type: 'branch-switch',
      stateProperty: 'source',
      branches: [{
        case: 'cli',
        nextActivity: 5
      }, {
      case: 'skeleton',
      nextActivity: 6
      }, {
      case: 'github',
      nextActivity: 4
      }]
    }, {
      id: 4,
      type: 'state-assign',
      state: {}
    }, {
      id: 5,
      type: 'state-assign',
      state: {}
    }, {
      id: 6,
      type: 'state-assign',
      state: {}
    }]);

    // clear any strategies, makes testing more easier
    sut.strategies = [];

    context = sut.context;
  });

  it('next() finds next step based on nextActivity', () => {
    sut.next(1);
    expect(sut.currentStep.id).toBe(1);

    sut.next(2);
    expect(sut.currentStep.id).toBe(2);
  });

  it('isFirstScreen', () => {
    let step = <any>{foo: 'bar'};
    sut.firstScreen = step;
    sut.currentStep = step;
    expect(sut.isFirstScreen).toBe(true);

    let otherStep = <any>{foo: 'foobar'};
    sut.firstScreen = step;
    sut.currentStep = otherStep;
    expect(sut.isFirstScreen).toBe(false);
  });

  it('next() calls next function of accepting strategies', () => {
    class Strategy {
      accepts (step: IStep) { return true; }
      next (a: any, b: any, c: any) {}
      previous(a: any, b: any, c: any) {}
      preprocess(steps: any) {}
    }
    let strat = new Strategy();
    let acceptSpy = spyOn(strat, 'accepts').and.returnValue(true);
    let nextSpy = spyOn(strat, 'next');

    sut.strategies.push(strat);

    sut.next(1);

    expect(nextSpy).toHaveBeenCalled();
  });

  it('previous() goes to previous step', () => {
    let prevStep = <any>{
      id: 1
    };
    sut.previousSteps = [prevStep];
    sut.currentStep = <any> {
      id: 2
    };

    sut.previous();
    expect(sut.currentStep.id).toBe(1);
  });

  it('previous() removes currentStep from the previousSteps array', () => {
    let prevStep = <any>{
      id: 1
    };
    sut.previousSteps = [prevStep];
    sut.currentStep = <any> {
      id: 2
    };

    sut.previous();
    expect(sut.previousSteps.length).toBe(0);
  });

  it('previous() does not go beyond the first screen', () => {
    let firstScreen = <any>{
      id: 2
    };
    sut.firstScreen = firstScreen;
    sut.previousSteps = [];
    sut.currentStep = firstScreen;

    sut.previous();
    expect(sut.currentStep).toBe(firstScreen);
  });

  it('previous() calls previous() on all strategies', () => {
    let prevStep = <any>{
      id: 1
    };
    sut.previousSteps = [prevStep];
    sut.currentStep = <any> {
      id: 2
    };

    class Strategy {
      accepts (step: IStep) { return true; }
      next (a: any, b: any, c: any) {}
      previous(a: any, b: any, c: any) {}
      preprocess(steps: any) {}
    }
    let strat = new Strategy();
    let acceptSpy = spyOn(strat, 'accepts').and.returnValue(true);
    let previousSpy = spyOn(strat, 'previous');

    sut.strategies.push(strat);

    sut.previous();

    expect(previousSpy).toHaveBeenCalled();
  });
});