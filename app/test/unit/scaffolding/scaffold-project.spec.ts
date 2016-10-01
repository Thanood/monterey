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
    spyOn(sut, '_confirm');
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

  it('adds aurelia-cli skeleton template', async (r) => {
    await sut.fillTemplateList();
    expect(sut.templates.length).toBeGreaterThan(0);
    expect(sut.templates[0].name).toBe('Aurelia-CLI');
    r();
  });

  it('aurelia-cli sets default app name', async (r) => {
    await sut.fillTemplateList();
    expect(sut.templates[0].state.name).toBe('aurelia-app');
    r();
  });

  it('adds skeleton templates', async (r) => {
    let registry = <MontereyRegistriesFake>container.get(MontereyRegistries);
    let spy = registry.getTemplates.and.returnValue(Promise.resolve([{
      name: 'foo'
    }, {
      name: 'bar'
    }]));
    await sut.fillTemplateList();
    expect(sut.templates[1].name).toBe('foo');
    expect(sut.templates[2].name).toBe('bar');
    r();
  });

  it('adds github template', async (r) => {
    await sut.fillTemplateList();
    expect(sut.templates.length).toBeGreaterThan(0);
    expect(sut.templates[sut.templates.length - 1].name).toBe('GitHub');
    r();
  });

  it('selects first template by default', async (r) => {
    await sut.fillTemplateList();
    expect(sut.selectedTemplate).toBe(sut.templates[0]);
    r();
  });

  it('confirms action when user switches template and there is progress', () => {
    let step1 = <any>{ id: 1 };
    let step2 = <any>{ id: 1 };
    sut.workflow.firstScreen = step1;
    sut.workflow.currentStep = step2;
    sut.switchTemplate(sut.templates[0]);

    expect(sut._confirm).toHaveBeenCalledWith('Are you sure? Progress will be lost');
  });

  it('updates selectedTemplate', () => {
    sut.switchTemplate(sut.templates[0]);
    expect(sut.selectedTemplate).toBe(sut.templates[0]);

    sut.switchTemplate(sut.templates[1]);
    expect(sut.selectedTemplate).toBe(sut.templates[1]);
  });

  it('confirms action when user closes dialog and there is progress', () => {
    let step1 = <any>{ id: 1 };
    let step2 = <any>{ id: 1 };
    sut.workflow.firstScreen = step1;
    sut.workflow.currentStep = step2;
    sut.close();

    expect(sut._confirm).toHaveBeenCalledWith('Are you sure? Progress will be lost');
  });

  it('cancels dialog when user clicks on close', () => {
    let dialogController = <DialogControllerFake>container.get(DialogController);
    sut.close();

    expect(dialogController.cancel).toHaveBeenCalled();
  });
});