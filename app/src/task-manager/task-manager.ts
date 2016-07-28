import 'moment';
import {Task}       from './task';
import {LogManager} from 'aurelia-framework';

const logger = LogManager.getLogger('TaskManager');

/* Usage:
let task = {
  // some promise that eventually resolves
  promise: new Promise(resolve => {
    setTimeout(() => resolve(), 10000);
  }),
  // a description of what is happening
  title: 'baz'
};
this.taskManager.addTask(task);

// at some point, log a message specifically for this task
this.taskManager.addTaskLog(task, 'something happened');
*/
export class TaskManager {
  runningTasks = [];
  allTasks = [];

  addTask(task: Task) {
    if (!task.promise || !task.title) {
      throw new Error('task promise and title are required');
    }

    task.id = this.createId();
    task.start = new Date();
    if (!task.logs) {
      task.logs = [];
    }

    this.runningTasks.unshift(task);
    this.allTasks.unshift(task);

    return task.promise.then((result) => {
      this.addTaskLog(task, '-----FINISHED-----');
      this.finishTask(task);
      return result;
    }).catch((e) => {
      this.addTaskLog(task, '-----FINISHED WITH ERROR-----');
      this.addTaskLog(task, e.message);
      logger.error(e);
      this.finishTask(task);
    });
  }

  addTaskLog(task: Task, text: string, prefix?: string) {
    prefix = prefix ? `[${prefix}]` : '';
    task.logs.unshift(`[${moment().format('LTS')}] ${prefix} ${text}`);
  }

  finishTask(task) {
    let index = this.runningTasks.indexOf(task);
    this.runningTasks.splice(index, 1);

    task.end = new Date();
  }

  createId() {
    return Math.floor((Math.random() * 999999999) + 111111111);
  }
}
