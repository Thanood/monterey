import {Question}  from '../../../src/scaffolding/question';
import {Container} from 'aurelia-framework';
import {ValidationController, ValidationControllerFake}  from '../fakes/index';
import {WorkflowContext} from '../../../src/scaffolding/workflow-context';
import {Workflow} from '../../../src/scaffolding/workflow';

describe('Scaffolding Question', () => {
  let sut: Question;
  let container: Container;

  beforeEach(() => {
    container = new Container();
    container.registerInstance(Element, document.createElement('div'));
    sut = container.get(Question);

    sut.validation = new ValidationControllerFake();
  });

  it('applies answer to the stateProperty of the state', () => {
    sut.state = {};
    sut.step = <any>{
      answer: 'blue',
      stateProperty: 'color'
    };
    sut.next();
    expect(sut.state.color).toBe('blue');
  });

  it('goes to next page when there are no validation errors', async (r) => {
    let validation = <ValidationControllerFake>sut.validation;
    validation.validate.and.returnValue([]);
    sut.state = {};
    sut.step = <any>{
      answer: 'blue',
      stateProperty: 'color'
    };

    expect(await sut.next()).toBe(true);

    validation.validate.and.returnValue(['error']);
    expect(await sut.next()).toBe(false);

    r();
  });

  it('registers next() callback', async (r) => {
    let workflow = new Workflow([]);
    let workflowContext = new WorkflowContext(workflow);
    sut.activate({ context: workflowContext });

    spyOn(sut, 'next');
    workflowContext.next();
    expect(sut.next).toHaveBeenCalled();
    r();
  });
});