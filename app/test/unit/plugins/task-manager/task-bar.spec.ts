import {TaskBar} from '../../../../src/plugins/task-manager/task-bar';
import {EventAggregator} from 'aurelia-event-aggregator';

describe('TaskManager taskbar', () => {
  let sut: TaskBar;
  let ea;

  beforeEach(() => {
    ea = new EventAggregator();
    sut = new TaskBar(ea);
  });

  it('keeps track of running and queued tasks', () => {
    sut.running = 0;
    sut.queued = 0;
    sut.attached();
    ea.publish('TaskAdded');
    expect(sut.queued).toBe(1);
    expect(sut.running).toBe(0);

    ea.publish('TaskStarted');
    expect(sut.queued).toBe(0);
    expect(sut.running).toBe(1);

    ea.publish('TaskFinished');
    expect(sut.queued).toBe(0);
    expect(sut.running).toBe(0);
  });

  it('updates busy flag', () => {
    sut.running = 0;
    sut.queued = 0;
    sut.propertyChanged();

    expect(sut.busy).toBe(false);

    sut.running = 0;
    sut.queued = 1;
    sut.propertyChanged();

    expect(sut.busy).toBe(true);

    sut.running = 1;
    sut.queued = 0;
    sut.propertyChanged();

    expect(sut.busy).toBe(true);
  });

  it('sets correct message in taskbar', () => {
    sut.running = 0;
    sut.queued = 0;
    sut.propertyChanged();

    expect(sut.taskManagerText).toBe('Task manager');

    
    sut.running = 1;
    sut.queued = 0;
    sut.propertyChanged();

    expect(sut.taskManagerText).toBe('Task manager (1 running)');

    
    sut.running = 0;
    sut.queued = 1;
    sut.propertyChanged();

    expect(sut.taskManagerText).toBe('Task manager (1 queued)');

    
    sut.running = 1;
    sut.queued = 1;
    sut.propertyChanged();

    expect(sut.taskManagerText).toBe('Task manager (1 running, 1 queued)');
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