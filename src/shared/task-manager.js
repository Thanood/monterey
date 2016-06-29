export class TaskManager {
  runningTasks = [];

  addTask(promise) {
    let task = {
      id: this.createId(),
      promise: promise
    };

    this.runningTasks.push(task);
        console.log(this);

    return promise.then((result) => {
      this.removeTask(task);
      return result;
    });
  }

  removeTask(task) {
      console.log('remove task');
    let index = this.runningTasks.indexOf(task);
    this.runningTasks.splice(index, 1);
  }

  createId() {
    return Math.floor((Math.random() * 999999999) + 111111111);
  }
}
