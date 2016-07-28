import {TaskManager} from '../../src/task-manager/task-manager';
import {Task} from '../../src/task-manager/task';

describe('TaskManager addTask', () => {
  let taskManager: TaskManager;

  beforeEach(() => {
    taskManager = new TaskManager();
  });

  it('creates task id and sets startdate', () => {
    let task = <Task>{
      title: 'foo',
      promise: new Promise(resolve => resolve())
    };
    taskManager.addTask(task);

    expect(task.id).not.toBeUndefined();
    expect(task.start).not.toBeUndefined();
  });

  it('addTaskLog adds log to the start of the logs array', () => {
    let task = <Task>{
      title: 'foo',
      promise: new Promise(resolve => resolve())
    };
    taskManager.addTask(task);

    taskManager.addTaskLog(task, 'logMessage1');
    taskManager.addTaskLog(task, 'logMessage2');
    taskManager.addTaskLog(task, 'logMessage3');

    expect(task.logs[0].message.indexOf('logMessage3') >= -1).toBe(true);
    expect(task.logs[1].message.indexOf('logMessage2') >= -1).toBe(true);
    expect(task.logs[2].message.indexOf('logMessage1') >= -1).toBe(true);
  });

  it('finishTask sets end date and removes task from runningTasks array', () => {
    let task = <Task>{
      title: 'foo',
      promise: new Promise(resolve => resolve())
    };
    taskManager.addTask(task);

    taskManager.finishTask(task);
    expect(task.end).not.toBeUndefined();
    expect(taskManager.runningTasks.length).toBe(0);
  });

  it('adds new tasks to the front of the runningTasks and allTasks array', () => {
    taskManager.runningTasks.push({});
    taskManager.allTasks.push({});

    let task = <Task>{
      title: 'foo',
      promise: new Promise(resolve => resolve())
    };
    taskManager.addTask(task);

    expect(taskManager.runningTasks.indexOf(task)).toBe(0);
    expect(taskManager.allTasks.indexOf(task)).toBe(0);
  });



  it('calls finishTask when promise resolves', (d) => {
    let spy = spyOn(taskManager, 'finishTask');
    let _resolve;
    let task = <Task>{
      title: 'foo',
      promise: new Promise(resolve => _resolve = resolve)
    };
    let p = taskManager.addTask(task);

    p.then(() => {
      expect(spy).toHaveBeenCalled()
      d();
    });

    _resolve();
  });



  it('logs success when promise gets resolved', (d) => {
    let spy = spyOn(taskManager, 'finishTask');
    let _resolve;
    let task = <Task>{
      title: 'foo',
      promise: new Promise((resolve, reject) => _resolve = resolve)
    };
    let p = taskManager.addTask(task);

    p.then(() => {
      expect(task.logs[0].message.indexOf('-----FINISHED-----') > -1).toBe(true);
      d();
    });

    _resolve();
  });



  it('logs error when promise gets rejected', (d) => {
    let spy = spyOn(taskManager, 'finishTask');
    let _reject;
    let task = <Task>{
      title: 'foo',
      promise: new Promise((resolve, reject) => _reject = reject)
    };
    let p = taskManager.addTask(task);

    p.then(() => {
      expect(task.logs[0].message.indexOf('FOO BAR ERROR') > -1).toBe(true);
      expect(task.logs[1].message.indexOf('-----FINISHED WITH ERROR-----') > -1).toBe(true);
      d();
    });

    _reject(new Error('FOO BAR ERROR'));
  });
});
