import {bindable, autoinject}              from 'aurelia-framework';
import {TaskRunnerService, ServiceLocator} from '../../shared/task-runner-service';
import {Notification}                      from '../../shared/notification';
import {ProjectTask, Project}              from '../../shared/project';
import {TaskManager}                       from './task-manager';
import {Task}                              from './task';

@autoinject()
export class ProjectDetail {
  @bindable project: Project;
  service: TaskRunnerService;
  tasks: Array<ProjectTask>;
  selectedTask: ProjectTask;
  
  constructor(private taskRunnerServiceLocator: ServiceLocator,
              private taskManager: TaskManager,
              private notification: Notification) {}

  async projectChanged() {
    if (this.project) {
      this.service = this.taskRunnerServiceLocator.get(this.project);
      
      let tasks = await this.service.getTasks(this.project, true);
      this.tasks = tasks;
    } else {
      this.service = null;
      this.tasks = [];
    }
  }

  startTask(projTask?: ProjectTask) {
    if (!projTask) {
      projTask = this.selectedTask;
    }
    if (!projTask) {
      this.notification.warning('No task has been selected');
      return;
    }
    let task = new Task(this.project, `${this.selectedTask.command} ${this.selectedTask.parameters.join(' ')}`);

    let result = this.service.runTask(this.project, this.selectedTask, stdout => {
      this.taskManager.addTaskLog(task, stdout);
    }, stderr => {
      this.taskManager.addTaskLog(task, stderr);
    });
    task.promise = result.completion;
    task.cancelable = true;
    task.cancel = () => {
      console.log(task);
      return task.meta.service.cancelTask(task.meta.process) 
    };
    task.meta = {
      service: this.service,
      process: result.process
    };

    this.taskManager.addTask(this.project, task);

    this.notification.success('Task has been started');
  }
}