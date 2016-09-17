import {TaskBar} from '../../../../src/plugins/task-manager/task-bar';
import {TaskManager} from '../../../../src/plugins/task-manager/task-manager';
import {Container} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {I18N}            from 'aurelia-i18n';

describe('TaskManager taskbar', () => {
  let sut: TaskBar;
  let ea;
  let taskManager: TaskManager;

  beforeEach(() => {
    ea = new EventAggregator();
    let container = new Container();
    this.taskManager = <any>{};
    container.registerInstance(TaskManager, this.taskManager);
    container.registerInstance(I18N, {
      tr: (key) => {
        if (key === 'task-manager') return 'Task manager';
        if (key === 'queued') return 'queued';
        if (key === 'running') return 'running';
      }
    });
    container.registerInstance(EventAggregator, ea);
    sut = container.get(TaskBar);
  });

  it('keeps track of running and queued tasks', () => {
    sut.attached();
    this.taskManager.tasks = [{ status: 'queued' }];
    ea.publish('TaskAdded');
    expect(sut.queued).toBe(1);
    expect(sut.running).toBe(0);

    this.taskManager.tasks = [{ status: 'running' }];
    ea.publish('TaskStarted');
    expect(sut.queued).toBe(0);
    expect(sut.running).toBe(1);

    this.taskManager.tasks = [{ status: 'finished' }];
    ea.publish('TaskFinished', { task: { start: new Date(), end: new Date(), status: 'finished' }});
    expect(sut.queued).toBe(0);
    expect(sut.running).toBe(0);
  });

  it('updates busy flag', () => {
    this.taskManager.tasks = [];
    sut.busy = false;
    sut.propertyChanged();
    expect(sut.busy).toBe(false);

    this.taskManager.tasks = [{ status: 'queued' }];
    sut.busy = false;
    sut.running = 0;
    sut.queued = 1;
    sut.propertyChanged();
    expect(sut.busy).toBe(true);

    this.taskManager.tasks = [{ status: 'running' }];
    sut.busy = false;
    sut.running = 1;
    sut.queued = 0;
    sut.propertyChanged();
    expect(sut.busy).toBe(true);
  });

  it('sets correct message in taskbar', () => {
    this.taskManager.tasks = [];
    sut.propertyChanged();

    expect(sut.text).toBe('Task manager');


    this.taskManager.tasks = [{ status: 'running' }];
    sut.propertyChanged();

    expect(sut.text).toBe('Task manager (1 running)');


    this.taskManager.tasks = [{ status: 'queued' }];
    sut.propertyChanged();

    expect(sut.text).toBe('Task manager (1 queued)');


    this.taskManager.tasks = [{ status: 'running' }, { status: 'queued'}];
    sut.propertyChanged();

    expect(sut.text).toBe('Task manager (1 running, 1 queued)');
  });

  it('disposes of subscriptions', () => {
    let spies = [];
    let spy = spyOn(ea, 'subscribe').and.callFake(() => {
      let subscr = { dispose: jasmine.createSpy('dispose') };
      spies.push(subscr);
      return subscr;
    });

    sut.attached();

    expect(spies.length).toBe(3);

    sut.detached();

    spies.forEach(spy => {
      expect(spy.dispose).toHaveBeenCalled();
    });
  });
});