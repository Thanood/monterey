import {TaskDetail} from '../../../../src/plugins/task-manager/task-detail';
import {Task} from '../../../../src/plugins/task-manager/task';
import {Container} from 'aurelia-framework';
import '../../setup';

describe('TaskDetail', () => {
  let sut: TaskDetail;

  beforeEach(() => {
    let container = new Container();
    sut = container.get(TaskDetail);
  });

  it('uses correct format for elapsed', () => {
    sut.task = new Task(null);

    sut.task.start = new Date(2016, 8, 30, 5, 0, 0);
    sut.task.end = new Date(2016, 8, 30, 6, 0, 0);
    sut.updateElapsed();
    expect(sut.task.elapsed).toBe('1 hour');

    sut.task.start = new Date(2016, 8, 30, 5, 0, 0);
    sut.task.end = new Date(2016, 8, 30, 7, 0, 0);
    sut.updateElapsed();
    expect(sut.task.elapsed).toBe('2 hours');

    sut.task.start = new Date(2016, 8, 30, 6, 0, 0);
    sut.task.end = new Date(2016, 8, 30, 6, 1, 0);
    sut.updateElapsed();
    expect(sut.task.elapsed).toBe('1 minute');

    sut.task.start = new Date(2016, 8, 30, 6, 0, 0);
    sut.task.end = new Date(2016, 8, 30, 6, 2, 0);
    sut.updateElapsed();
    expect(sut.task.elapsed).toBe('2 minutes');

    sut.task.start = new Date(2016, 8, 30, 6, 0, 0);
    sut.task.end = new Date(2016, 8, 30, 6, 0, 1);
    sut.updateElapsed();
    expect(sut.task.elapsed).toBe('1 second');

    sut.task.start = new Date(2016, 8, 30, 6, 0, 0);
    sut.task.end = new Date(2016, 8, 30, 6, 0, 2);
    sut.updateElapsed();
    expect(sut.task.elapsed).toBe('2 seconds');

    sut.task.start = new Date(2016, 8, 30, 6, 0, 0);
    sut.task.end = new Date(2016, 8, 30, 7, 2, 5);
    sut.updateElapsed();
    expect(sut.task.elapsed).toBe('1 hour, 2 minutes, 5 seconds');

    sut.task.start = new Date(2016, 8, 30, 6, 0, 0);
    sut.task.end = new Date(2016, 8, 30, 7, 0, 5);
    sut.updateElapsed();
    expect(sut.task.elapsed).toBe('1 hour, 5 seconds');
  });
});