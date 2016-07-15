import * as moment from  'moment';

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

  addTask(task) {
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
    }).catch(() => {
      this.addTaskLog(task, '-----FINISHED WITH ERROR-----');
      this.finishTask(task);
    });
  }

  addTaskLog(task, text) {
    task.logs.unshift(`[${moment().format('LTS')}] ${text}`);
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
