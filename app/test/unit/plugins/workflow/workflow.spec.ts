import {Step}     from '../../../../src/plugins/workflow/step';
import {Workflow} from '../../../../src/plugins/workflow/workflow';
import {Phase}    from '../../../../src/plugins/workflow/phase';
import {Task}     from '../../../../src/plugins/task-manager/task';
import {Project}  from '../../../../src/shared/project';
import '../../setup';

describe('Workflow', () => {
  let sut: Workflow;
  let taskManager: any;
  let project: Project;

  beforeEach(() => {
    taskManager = {
      addTask: jasmine.createSpy('addTask'),
      startTask: jasmine.createSpy('startTask').and.returnValue(Promise.resolve())
    };

    project = new Project();

    sut = new Workflow(taskManager, null);
    sut.addPhase(new Phase('dependencies'));
    sut.addPhase(new Phase('environment'));
    sut.addPhase(new Phase('run'));

    sut.getPhase('dependencies').addStep(new Step('npm install', 'npm install', new Task(project, '', () => Promise.resolve())));
    sut.getPhase('dependencies').addStep(new Step('jspm install', 'jspm install', new Task(project, '', () => Promise.resolve())));

    sut.getPhase('environment').addStep(new Step('typings install', 'typings install', new Task(project, '', () => Promise.resolve())));

    sut.getPhase('run').addStep(new Step('gulp watch', 'gulp watch', new Task(project, '', () => Promise.resolve())));
    sut.getPhase('run').addStep(new Step('dotnet run', 'dotnet run', new Task(project, '', () => Promise.resolve())));
  });

  it('deselects following phases when a phase gets unchecked', () => {
    sut.getPhase('dependencies').checked = false;

    sut.onCheck(sut.getPhase('dependencies'));

    for (let x = sut.phases.indexOf(sut.getPhase('dependencies')) + 1; x < sut.phases.length; x++) {
      expect(sut.phases[x].checked).toBe(false);

      for (let y = 0; y < sut.phases[x].steps.length; y++) {
        expect(sut.phases[x].steps[y].checked).toBe(false);
      }
    }
  });

  it('deselects following phases when a step gets unchecked', () => {
    // using this to make sure that previous steps are left untouched
    sut.getPhase('dependencies').steps[0].checked = true;

    sut.getPhase('dependencies').steps[1].checked = false;
    sut.onCheck(sut.getPhase('dependencies'), sut.getPhase('dependencies').steps[1]);

    for (let x = sut.phases.indexOf(sut.getPhase('dependencies')) + 1; x < sut.phases.length; x++) {
      expect(sut.phases[x].checked).toBe(false);

      for (let y = 0; y < sut.phases[x].steps.length; y++) {
        expect(sut.phases[x].steps[y].checked).toBe(false);
      }
    }

    expect(sut.getPhase('dependencies').steps[0].checked).toBe(true);
  });

  it('selects previous phases when a phase gets checked', () => {
    // deselect all
    sut.phases.forEach(phase => {
      phase.checked = false;
      phase.steps.forEach(step => step.checked = false);
    });

    sut.getPhase('run').checked = true;
    sut.onCheck(sut.getPhase('run'));

    for (let x = 0; x < sut.phases.indexOf(sut.getPhase('run')); x++) {
      expect(sut.phases[x].checked).toBe(true);

      for (let x = 0; x < sut.phases[x].steps.length; x++) {
        expect(sut.phases[x].steps[x].checked).toBe(true);
      }
    }
  });

  it('deselects next steps in the same phase', () => {
    sut.getPhase('dependencies').steps[0].checked = false;

    sut.onCheck(sut.getPhase('dependencies'), sut.getPhase('dependencies').steps[0]);

    expect(sut.getPhase('dependencies').steps[1].checked).toBe(false);
  });

  it('selects previous steps in the same phase', () => {
    sut.getPhase('dependencies').steps[0].checked = false;
    sut.getPhase('dependencies').steps[1].checked = true;

    sut.onCheck(sut.getPhase('dependencies'), sut.getPhase('dependencies').steps[1]);

    expect(sut.getPhase('dependencies').steps[0].checked).toBe(true);
  });

  it('selects phase if all steps are checked', () => {
    sut.getPhase('dependencies').checked = false;

    sut.getPhase('dependencies').steps[0].checked = true;
    sut.getPhase('dependencies').steps[1].checked = true;

    sut.onCheck(sut.getPhase('dependencies'), sut.getPhase('dependencies').steps[1]);

    expect(sut.getPhase('dependencies').checked).toBe(true);
  });

  it('unselects phase if all steps are unchecked', () => {
    sut.getPhase('dependencies').checked = true;

    sut.getPhase('dependencies').steps.forEach(step => step.checked = false);

    sut.onCheck(sut.getPhase('dependencies'), sut.getPhase('dependencies').steps[0]);

    expect(sut.getPhase('dependencies').checked).toBe(false);
  });

  it('selects/deselects steps in phase when a phase gets selected/deselected', () => {
    sut.getPhase('dependencies').checked = false;

    sut.onCheck(sut.getPhase('dependencies'));

    sut.getPhase('dependencies').steps.forEach(s => expect(s.checked).toBe(false));

    // and check again

    sut.getPhase('dependencies').checked = true;

    sut.onCheck(sut.getPhase('dependencies'));

    sut.getPhase('dependencies').steps.forEach(s => expect(s.checked).toBe(true));
  });

  it('start() adds all tasks to tasmanager', () => {
    let spy = <jasmine.Spy>(sut.taskManager.addTask);
    sut.start();

    expect(spy.calls.count()).toBe(5);
  });

  it('start() keeps track of whether it is running', (done) => {
    expect(sut.running).toBeFalsy();

    let _r;

    taskManager.startTask = jasmine.createSpy('startTask').and.returnValue({ promise: new Promise(r => _r = r) });

    sut.start()
    .promise.then(() => {
      expect(sut.running).toBeFalsy();
      done();
    });

    expect(sut.running).toBe(true);

    _r();
  });

  it('start() starts all tasks out of the first phase that do not have a task dependency', () => {
    let firstPhase = sut.getPhase('dependencies');

    let withDepStep = new Step('with dep', 'with dep', new Task(project, '', () => Promise.resolve()));
    withDepStep.task.dependsOn = firstPhase.steps[0].task;
    firstPhase.addStep(withDepStep);

    sut.start();

    for (let x = 0; x < firstPhase.steps.length; x++) {
      let step = firstPhase.steps[x];

      if (step.task.dependsOn) {
        expect(taskManager.startTask).not.toHaveBeenCalledWith(step.task);
      } else {
        expect(taskManager.startTask).toHaveBeenCalledWith(step.task);
      }
    }
  });
});