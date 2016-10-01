import {Workflow} from '../../../src/scaffolding/workflow';
import {DialogController, DialogControllerFake, MontereyRegistries, MontereyRegistriesFake}  from '../fakes/index';
import {WorkflowContext} from '../../../src/scaffolding/workflow-context';
import {ScaffoldProject} from '../../../src/scaffolding/scaffold-project';
import {Settings} from '../../../src/shared/settings';
import {Container} from 'aurelia-framework';

describe('Scaffold project modal', () => {
  let sut: ScaffoldProject;
  let container: Container;
  let settings;
  let context: WorkflowContext;

  beforeEach(() => {
    container = new Container();
    container.registerSingleton(DialogController, DialogControllerFake);
    container.registerSingleton(MontereyRegistries, MontereyRegistriesFake);
    settings = {
      getValue: jasmine.createSpy('getValue')
    };
    container.registerInstance(Settings, settings);
    sut = container.get(ScaffoldProject);
    sut.reset();
    context = sut.context;
  });

  it('copies JSON definition so old answers are cleared', () => {
    sut.reset();
    (<any>sut).workflow.steps[0].someProp = 'foo';
    sut.reset();
    expect((<any>sut).workflow.steps[0].someProperty).toBeUndefined();
  });

  it('restores project path from settings', () => {
    settings.getValue = (key) => {
      if (key === 'new-project-folder') {
        return 'c:/my-path';
      }
    };
    sut.reset();

    expect(sut.state.path).toBe('c:/my-path');
  });

  it('shows loading indicator when loading templates', (r) => {
    let resolved: any;
    sut.fillTemplateList = () => new Promise(resolve => resolved = resolve);
    expect(sut.loading).toBe(false);
    let promise = sut.attached();

    expect(sut.loading).toBe(true);

    resolved();

    promise.then(() => {
      r();
    });
  });

  it('loads templates', async (r) => {
    let spy = spyOn(sut, 'fillTemplateList');
    await sut.attached();

    expect(spy).toHaveBeenCalled();
    r();
  });

  it('resets on attached', async (r) => {
    let spy = spyOn(sut, 'reset');
    await sut.attached();

    expect(spy).toHaveBeenCalled();
    r();
  });

  it('assigns state of template to the state of the WorkflowContext', () => {
    sut.selectedTemplate = <any>{
      state: {
        prop: 'foo'
      }
    };
    sut.reset();

    expect(sut.state.prop).toBe('foo');
  });

  it('next() calls next on workflow context', async (r) => {
    let spy = spyOn(context, 'next').and.returnValue(Promise.resolve());
    await sut.next();

    expect(spy).toHaveBeenCalled();

    r();
  });

  it('next() closes dialog if last step of workflow has been reached', async (r) => {
    spyOn(context, 'next').and.returnValue(Promise.resolve());
    let dialog = <DialogControllerFake>container.get(DialogController);
    sut.workflow.currentStep.type = 'project-install';
    await sut.next();

    expect(dialog.ok).toHaveBeenCalled();

    r();
  });
});