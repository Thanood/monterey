import {autoinject}         from 'aurelia-framework';
import {DialogController}   from 'aurelia-dialog';
import {TaskManager}        from '../task-manager/task-manager';
import {Task}               from '../task-manager/task';
import {ApplicationState}   from '../../shared/application-state';

@autoinject()
export class DeveloperModal {
  constructor(private dialogController: DialogController,
              private taskManager: TaskManager,
              private state: ApplicationState) {}

  createDummyTasks() {
    var firstPromise;
    var timeouts = [];
    let first = new Task(this.state.projects[0], 'first task', () => {
      return new Promise(r => {
        setTimeout(() => {
         if (!first.finished) r(); 
        }, 10000);
        
        for(let x = 1; x <= 10; x++) {
          setTimeout(() => first.addTaskLog('output'), x * 1000);
        }
      });
    });
    first.stoppable = true;
    first.stop = async () => {};
    this.taskManager.addTask(this.state.projects[0], first);

    
    let second = new Task(this.state.projects[0], 'second task', () => {
      return new Promise(r => {
        setTimeout(() => {
         if (!second.finished) r(); 
        }, 10000);

        for(let x = 1; x <= 10; x++) {
          setTimeout(() => second.addTaskLog('output'), x * 1000);
        }
      });
    });
    second.dependsOn = first;
    second.stoppable = true;
    first.stop = async () => {};
    this.taskManager.addTask(this.state.projects[0], second);

    this.taskManager.startTask(first);
  }

  throwError() {
    throw new Error('something terrible has happened');
  }
}