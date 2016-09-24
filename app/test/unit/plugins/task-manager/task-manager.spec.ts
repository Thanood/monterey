import {TaskManager} from '../../../../src/plugins/task-manager/task-manager';
import {Task} from '../../../../src/plugins/task-manager/task';
import {Project} from '../../../../src/shared/project';

describe('TaskManager', () => {
  let taskManager: TaskManager;
  let ea;
  let errors;

  beforeEach(() => {
    ea = { publish: jasmine.createSpy('publish'), subscribe: jasmine.createSpy('subscribe') };
    errors = { add: () => {} };
    taskManager = new TaskManager(ea, errors);
  });

  it ('addTask expects execution function and title', () => {
    let project = new Project();
    let task = new Task(project, null);
    expect(() => taskManager.addTask(project, task)).toThrow(new Error('task execute function and title are required'));


    task = new Task(project, 'something');
    expect(() => taskManager.addTask(project, task)).toThrow(new Error('task execute function and title are required'));
  });

  it ('addTask assigns id and status (queued)', () => {
    let project = new Project();
    let task = new Task(project, 'jspm install', () => Promise.resolve());

    taskManager.addTask(project, task);

    expect(task.id).not.toBeUndefined();
    expect(task.status).toBe('queued');
  });

  it ('addTask sests finished to false', () => {
    let project = new Project();
    let task = new Task(project, 'jspm install', () => Promise.resolve());

    task.finished = true;

    taskManager.addTask(project, task);

    expect(task.finished).toBe(false);
  });

  it ('addTask pushes task on projects meta property', () => {
    let project = new Project();
    let task = new Task(project, 'jspm install', () => Promise.resolve());

    taskManager.addTask(project, task);

    expect(project.__meta__.taskmanager.tasks.length).toBe(1);
    expect(project.__meta__.taskmanager.tasks[0]).toBe(task);

    // the taskmanager should keep track of running tasks in order to start dependency tasks
    expect(taskManager.tasks.length).toBe(1);
    expect(taskManager.tasks[0]).toBe(task);
  });

  it ('addTask publishes TaskAdded event', () => {
    let project = new Project();
    let task = new Task(project, 'jspm install', () => Promise.resolve());

    taskManager.addTask(project, task);

    expect(ea.publish).toHaveBeenCalledWith('TaskAdded', { project: project, task: task });
  });

  it ('startTask updates status to "running"', () => {
    let project = new Project();
    let task = new Task(project, 'jspm install', () => Promise.resolve());

    taskManager.addTask(project, task);
    taskManager.startTask(task);

    expect(task.status).toBe('running');
  });

  it ('startTask sets start date', () => {
    let project = new Project();
    let task = new Task(project, 'jspm install', () => Promise.resolve());

    taskManager.addTask(project, task);
    taskManager.startTask(task);

    expect(task.start).not.toBeUndefined();
  });

  it ('startTask publishes TaskStarted event', () => {
    let project = new Project();
    let task = new Task(project, 'jspm install', () => Promise.resolve());

    taskManager.addTask(project, task);
    taskManager.startTask(task);

    expect(ea.publish).toHaveBeenCalledWith('TaskStarted', { project: project, task: task });
  });

  it ('startTask executes the executor function of the task', () => {
    let project = new Project();
    let executor = jasmine.createSpy('executor').and.returnValue(Promise.resolve());
    let task = new Task(project, 'jspm install', executor);

    taskManager.addTask(project, task);
    taskManager.startTask(task);

    expect(executor).toHaveBeenCalled();
  });

  it ('finished log message gets added after task has finished', (r) => {
    let project = new Project();
    let task = new Task(project, 'jspm install', () => Promise.resolve());

    spyOn(taskManager, 'addTaskLog');

    taskManager.addTask(project, task);
    taskManager.startTask(task)
    .then(() => {
      expect(taskManager.addTaskLog).toHaveBeenCalled();
      r();
    });
  });

  it ('error gets added to the log if task fails', (r) => {
    let project = new Project();
    let task = new Task(project, 'jspm install', () => Promise.reject(new Error('something failed')));

    spyOn(taskManager, 'addTaskLog');

    taskManager.addTask(project, task);
    taskManager.startTask(task)
    .then(() => {
      expect(taskManager.addTaskLog).toHaveBeenCalledWith(task, 'something failed');
      r();
    });
  });

  it ('when task throws error, the status should be \'failed\'', (r) => {
    let project = new Project();
    let task = new Task(project, 'jspm install', () => Promise.reject(new Error('something failed')));

    spyOn(taskManager, 'addTaskLog');

    taskManager.addTask(project, task);
    taskManager.startTask(task)
    .then(() => {
      expect(task.status).toBe('failed');
      r();
    });
  });

  it ('error in task cancels all depending tasks', (r) => {
    let project = new Project();
    let npmInstall = new Task(project, 'npm install', () => Promise.reject(new Error('something failed')));
    let jspmInstall = new Task(project, 'jspm install', () => Promise.resolve());
    let gulpWatch = new Task(project, 'gulp watch', () => Promise.resolve());
    jspmInstall.dependsOn = npmInstall;
    gulpWatch.dependsOn = jspmInstall;

    spyOn(taskManager, 'addTaskLog');

    taskManager.addTask(project, npmInstall);
    taskManager.addTask(project, jspmInstall);
    taskManager.addTask(project, gulpWatch);

    taskManager.startTask(npmInstall)
    .then(() => {
      expect(jspmInstall.status).toBe('stopped');
      expect(gulpWatch.status).toBe('stopped');
      expect(gulpWatch.finished).toBe(true);
      expect(jspmInstall.finished).toBe(true);
      r();
    });
  });

  it ('publishes TaskFinished when task completes', (r) => {
    let project = new Project();
    let task = new Task(project, 'jspm install', () => Promise.resolve());

    taskManager.addTask(project, task);
    taskManager.startTask(task)
    .then(() => {
      expect(ea.publish).toHaveBeenCalledWith('TaskFinished', { project: project, task: task });
      r();
    });
  });

  it ('publishes TaskFinished when task fails', (r) => {
    let project = new Project();
    let task = new Task(project, 'jspm install', () => Promise.reject(new Error('something failed')));

    taskManager.addTask(project, task);
    taskManager.startTask(task)
    .then(() => {
      expect(ea.publish).toHaveBeenCalled();
      expect(ea.publish).toHaveBeenCalledWith('TaskFinished', { project: project, task: task });
      r();
    });
  });

  it ('sets finished to true and sets end date when task has finished', (r) => {
    let project = new Project();
    let task = new Task(project, 'jspm install', () => Promise.reject(new Error('something failed')));

    taskManager.addTask(project, task);
    taskManager.startTask(task)
    .then(() => {
      expect(task.end).not.toBeUndefined();
      expect(task.finished).toBe(true);
      r();
    });
  });

  it ('sets status to completed after a task finishes without errors', (r) => {
    let project = new Project();
    let task = new Task(project, 'jspm install', () => Promise.resolve());

    taskManager.addTask(project, task);
    taskManager.startTask(task)
    .then(() => {
      expect(task.status).toBe('completed');
      r();
    });
  });

  it ('sets status to "cancelled by user" after user cancelled the task', (r) => {
    let project = new Project();
    let task = new Task(project, 'jspm install', () => Promise.resolve());
    task.stoppable = true;
    task.stop = () => Promise.resolve();

    taskManager.addTask(project, task);
    taskManager.stopTask(task)
    .then(() => {
      expect(task.status).toBe('stopped by user');
      r();
    });
  });

  it ('only sets end date on cancel when the task has been started', (r) => {
    let project = new Project();
    let task = new Task(project, 'jspm install', () => Promise.resolve());
    task.stoppable = true;
    task.stop = () => Promise.resolve();

    taskManager.addTask(project, task);
    taskManager.stopTask(task)
    .then(() => {
      expect(task.end).toBeUndefined();
      r();
    });
  });

  it ('throws error when unstoppable task is cancelled', () => {
    let project = new Project();
    let task = new Task(project, 'jspm install', () => Promise.resolve());
    task.stoppable = false;

    taskManager.addTask(project, task);
    taskManager.stopTask(task)
    .catch(e => {
      expect(e.message).toBe('This task cannot be cancelled');
    });
  });

  it ('depending tasks get started after task finished', (r) => {
    let project = new Project();
    let _resolveTask2;
    let task1 = new Task(project, 'npm install', () => Promise.resolve());
    let task2 = new Task(project, 'jspm install', () => new Promise(r => _resolveTask2 = r));
    task2.dependsOn = task1;

    taskManager.addTask(project, task1);
    taskManager.addTask(project, task2);

    taskManager.startTask(task1)
    .then(() => {
      expect(task2.status).toBe('running');
      _resolveTask2();
      r();
    });
  });

  it ('cancelling of task cancels all dependent tasks', async (r) => {
    let project = new Project();
    let _resolveTask2;
    let task1 = new Task(project, 'npm install', () => Promise.resolve());
    let task2 = new Task(project, 'jspm install', () => Promise.resolve());
    let task3 = new Task(project, 'typings install', () => Promise.resolve());
    let task4 = new Task(project, 'gulp watch', () => Promise.resolve());
    let task5 = new Task(project, 'dotnet run', () => Promise.resolve());
    task1.stoppable = true;
    task1.stop = async () => {};
    task2.dependsOn = task1;
    task3.dependsOn = task2;
    task4.dependsOn = task3;
    task5.dependsOn = task3;

    taskManager.addTask(project, task1);
    taskManager.addTask(project, task2);
    taskManager.addTask(project, task3);
    taskManager.addTask(project, task4);
    taskManager.addTask(project, task5);

    await taskManager.stopTask(task1);

    expect(task2.status).toBe('stopped by user');
    expect(task3.status).toBe('stopped by user');
    expect(task4.status).toBe('stopped by user');
    expect(task5.status).toBe('stopped by user');
    r();
  });

  it ('starts only queued tasks', async (r) => {
    let project = new Project();
    let _resolver;
    let task1 = new Task(project, 'npm install', () => new Promise(resolver => _resolver = resolver));

    taskManager.addTask(project, task1);
    task1.status = 'completed';

    await taskManager.startTask(task1);
    expect(task1.status).not.toBe('running');
    r();
  });

  it ('clears log when task gets added in case restart of task', () => {
    let project = new Project();
    let task1 = new Task(project, 'npm install', () => Promise.resolve());
    task1.addTaskLog('test');
    taskManager.addTask(project, task1);

    expect(task1.logs.length).toBe(0);
  });

  it ('creates correct log messages', () => {
    let task = new Task(new Project(), 'some task');
    taskManager.addTaskLog(task, 'foo', 'warn');
    let now = moment().format('HH:mm:ss');
    expect(task.logs[0].message).toBe(`[${now}] [warn] foo`);

    taskManager.addTaskLog(task, 'foo');
    now = moment().format('HH:mm:ss');
    expect(task.logs[1].message).toBe(`[${now}] foo`);
  });

  it ('log messages only get timestamp if message does not have timestamp already', () => {
    let task = new Task(new Project(), 'some task');
    taskManager.addTaskLog(task, '[25:80:90] foo');
    let now = moment().format('LTS');
    expect(task.logs[0].message).toBe(`[25:80:90] foo`);
  });

  it ('logs are split on new lines', () => {
    let task = new Task(new Project(), 'some task');
    taskManager.addTaskLog(task, 'foo\r\nbar');
    let now = moment().format('HH:mm:ss');
    expect(task.logs.length).toBe(2);
    expect(task.logs[0].message).toBe(`[${now}] foo`);
    expect(task.logs[1].message).toBe(`[${now}] bar`);
  });

  it ('empty log messages are ignored', () => {
    let task = new Task(new Project(), 'some task');
    taskManager.addTaskLog(task, '');
    expect(task.logs.length).toBe(0);

    taskManager.addTaskLog(task, 'some msg\n');
    expect(task.logs.length).toBe(1);

    task.logs.splice(0);
    taskManager.addTaskLog(task, 'some msg\n\n\n');
    expect(task.logs.length).toBe(1);

    task.logs.splice(0);
    taskManager.addTaskLog(task, '[14:05:23] ');
    expect(task.logs.length).toBe(0);
  });
});
