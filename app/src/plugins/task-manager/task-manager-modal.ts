import * as moment              from 'moment';
import {autoinject, observable} from 'aurelia-framework';
import {TaskManager}            from './task-manager';
import {DialogController}       from 'aurelia-dialog';
import {withModal}              from '../../shared/decorators';
import {TRexDialog}             from './components/t-rex-dialog';
import {ApplicationState}       from '../../shared/application-state';
import {Task}                   from './task';
import {TreeListNode}           from '../../shared/tree-list/tree-list-node';

@autoinject()
export class TaskManagerModal {
  @observable selectedTask: Task;
  model: { task: Task };

  taskTree: Array<TreeListNode>;

  constructor(private dialogController: DialogController,
              private taskManager: TaskManager,
              private state: ApplicationState) {
  }

  activate(model) {
    this.model = model;

    this.taskManager.addTask(this.state.projects[0], {
      title: 'NPM install',
      promise: new Promise(r => setTimeout(() => r(), 5000))
    });
    this.taskManager.addTask(this.state.projects[0], {
      title: 'JSPM install',
      promise: new Promise(r => setTimeout(() => r(), 5000))
    });
    this.taskManager.addTask(this.state.projects[0], {
      title: 'gulp watch',
      promise: new Promise(r => setTimeout(() => r(), 5000))
    });

    
    this.taskManager.addTask(this.state.projects[1], {
      title: 'NPM install',
      promise: new Promise(r => setTimeout(() => r(), 5000))
    });
    this.taskManager.addTask(this.state.projects[1], {
      title: 'au run --watch',
      promise: new Promise(r => setTimeout(() => r(), 5000))
    });

    this.taskTree = [];

    this.state.projects.forEach(proj => {
      let childNodes = [];
      proj.__meta__.taskmanager.tasks.forEach(task => {
        let taskNode = new TreeListNode(task.title)
        taskNode.data = task;
        childNodes.push(taskNode);
      });
      this.taskTree.push(new TreeListNode(proj.name, childNodes));
    });
    console.log(this.taskTree);
  }

  // attached() {
  //   if (this.model && this.model.task) {
  //     this.selectedTask = this.model.task;
  //   } else if (this.taskManager.runningTasks.length > 0) {
  //     this.selectedTask = this.taskManager.runningTasks[0];
  //   }
  // }

  // selectedTaskChanged() {
  //   this.updateElapsed();
  // }
  
  @withModal(TRexDialog, null, { modal: false })
  trex() {}

  // this.interval = setInterval(() => this.updateElapsed(), 1000);
  // updateElapsed() {
  //   if (this.selectedTask && !this.selectedTask.finished) {
  //     let endDate;
  //     if (this.selectedTask.end) {
  //       endDate = this.selectedTask.end;
  //     } else {
  //       endDate = new Date();
  //     }
  //     this.selectedTask.elapsed = `${moment(endDate).diff(this.selectedTask.start, 'seconds')} seconds`;
  //   }
  // }

  // detached() {
  //   clearInterval(this.interval);
  // }
}
