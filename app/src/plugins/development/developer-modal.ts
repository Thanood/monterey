import {TaskManager, Task} from '../task-manager/index';
import {TaskManagerModal}  from '../task-manager/task-manager-modal';
import {Tour}              from '../../main/components/tour';
import {autoinject, DialogService, DialogController, ApplicationState, SelectedProject} from '../../shared/index';

@autoinject()
export class DeveloperModal {
  project;

  constructor(private dialogController: DialogController,
              private taskManager: TaskManager,
              private dialogService: DialogService,
              private selectedProject: SelectedProject,
              private state: ApplicationState,
              private tour: Tour) {
    this.project = selectedProject.current;
  }

  createDummyTasks() {
    let firstPromise;
    let timeouts = [];
    let first = new Task(this.selectedProject.current, 'first task', () => {
      return new Promise(r => {
        setTimeout(() => {
         if (!first.finished) r();
        }, 10000);

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

  throwError() {
    throw new Error('something terrible has happened');
  }

  startTour() {
    this.dialogController.cancel();
    this.tour.start();
  }
}