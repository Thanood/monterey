export class TaskManager {
  runningTasks = [];
  allTasks = [];

  addTask(task) {
    if (!task.promise || !task.title) {
      throw new Error('task promise and title are required');
    }

    task.id = this.createId();
    task.start = new Date();
    task.logs = [];

    this.runningTasks.push(task);
    this.allTasks.push(task);

    return task.promise.then((result) => {
      this.finishTask(task);
      return result;
    });
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
