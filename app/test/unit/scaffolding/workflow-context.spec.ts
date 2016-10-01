import {WorkflowContext} from '../../../src/scaffolding/workflow-context';
import {Workflow} from '../../../src/scaffolding/workflow';

describe('WorkflowContext', () => {
  let sut: WorkflowContext;
  let workflow: Workflow;

  beforeEach(() => {
    workflow = new Workflow([]);
    workflow.currentStep = <any>{
      id: 1
    };
    spyOn(workflow, 'previous');
    spyOn(workflow, 'next');
    sut = new WorkflowContext(workflow);
  });

  it('registers next callbacks of screens', () => {
    let cb1 = () => Promise.resolve();
    let cb2 = () => Promise.resolve();

    expect(cb1).not.toBe(cb2);

    sut.onNext(cb1);
    expect(sut._next).toBe(cb1);

    sut.onNext(cb2);
    expect(sut._next).toBe(cb2);
  });

  it('registers previous callbacks of screens', () => {
    let cb1 = () => Promise.resolve();
    let cb2 = () => Promise.resolve();

    expect(cb1).not.toBe(cb2);

    sut.onPrevious(cb1);
    expect(sut._previous).toBe(cb1);

    sut.onPrevious(cb2);
    expect(sut._previous).toBe(cb2);
  });

  it('resets next and previous callbacks', () => {
    let nextSpy = jasmine.createSpy('next');
    let previousSpy = jasmine.createSpy('previous');

    sut.onNext(nextSpy);
    sut.onPrevious(previousSpy);

    sut.reset();

    sut._next();
    sut._previous();

    expect(nextSpy).not.toHaveBeenCalled();
    expect(previousSpy).not.toHaveBeenCalled();
  });

  it('resets button states/texts', () => {
    sut.nextButtonText = 'Next111';
    sut.previousButtonText = 'Previous111';
    sut.closeButtonText = 'Close111';
    sut.nextButtonVisible = false;
    sut.closeButtonVisible = false;
    sut.previousButtonVisible = false;
    sut.title = 'Create new application111';


    sut.reset();

    expect(sut.nextButtonText).toBe('Next');
    expect(sut.previousButtonText).toBe('Previous');
    expect(sut.closeButtonText).toBe('Close');
    expect(sut.nextButtonVisible).toBe(true);
    expect(sut.closeButtonVisible).toBe(true);
    expect(sut.previousButtonVisible).toBe(true);
    expect(sut.title).toBe('Create new application');
  });

  it('calls next on workflow when next() callback resolves to true', async (r) => {
    sut._next = () => Promise.resolve(true);

    await sut.next();

    expect(workflow.next).toHaveBeenCalled();
    r();
  });

  it('calls previous on workflow when previous() callback resolves to true', async (r) => {
    sut._previous = () => Promise.resolve(true);

    await sut.previous();

    expect(workflow.previous).toHaveBeenCalled();
    r();
  });

  it('resets after the screen\'s next() callback resolves to true', async (r) => {
    let spy = spyOn(sut, 'reset');

    sut._next = () => Promise.resolve(true);

    await sut.next();

    expect(spy).toHaveBeenCalled();
    r();
  });

  it('resets after the screen\'s previous() callback resolves to true', async (r) => {
    let spy = spyOn(sut, 'reset');

    sut._previous = () => Promise.resolve(true);

    await sut.previous();

    expect(spy).toHaveBeenCalled();
    r();
  });
});