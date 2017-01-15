import {TaskManager, Task} from '../task-manager/index';
import {TaskManagerModal}  from '../task-manager/task-manager-modal';
import {autoinject, DialogService, DialogController, ApplicationState, SelectedProject, withModal} from '../../shared/index';

import {AureliaSamStore} from '../../aurelia-sam/aurelia-sam';

@autoinject()
export class DeveloperModal {
  project;

  constructor(private dialogController: DialogController,
              private taskManager: TaskManager,
              private dialogService: DialogService,
              private selectedProject: SelectedProject,
              private state: ApplicationState,
              private store: AureliaSamStore
              ) {
    this.project = selectedProject.current;
  }

  createDummyTasks(firstFails = false) {
    let firstPromise;
    let timeouts = [];
    let first = new Task(this.selectedProject.current, 'first task', () => {
      return new Promise((r, reject) => {
        setTimeout(() => {
         if (!first.finished) r();
        }, 10000);

        if (firstFails) {
          setTimeout(() => {
            reject(new Error('test'));
          }, 4000);
        }

        for (let x = 1; x <= 1000; x++) {
          setTimeout(() => first.addTaskLog('output'), x * 10);
        }
      });
    });
    first.stoppable = true;
    first.stop = async () => {};
    this.taskManager.addTask(this.selectedProject.current, first);


    let second = new Task(this.selectedProject.current, 'second task', () => {
      return new Promise(r => {
        setTimeout(() => {
         if (!second.finished) r();
        }, 10000);

        for (let x = 1; x <= 10; x++) {
          setTimeout(() => second.addTaskLog('output'), x * 1000);
        }
      });
    });
    second.dependsOn = first;
    second.stoppable = true;
    second.stop = async () => {};
    this.taskManager.addTask(this.selectedProject.current, second);

    this.taskManager.startTask(first);
  }

  dumpSamHistory() {
    const history = this.store.getHistory();
    console.log('[dumpSamHistory]', history);
  }

  throwError() {
    throw new Error('something terrible has happened');
  }
}
