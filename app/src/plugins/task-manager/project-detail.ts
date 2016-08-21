import {bindable, autoinject}              from 'aurelia-framework';
import {TaskRunnerService, ServiceLocator} from '../../shared/task-runner-service';
import {Notification}                      from '../../shared/notification';
import {ProjectTask, Project}              from '../../shared/project';
import {TaskRunner}                        from './task-runner';
import {TaskManager}                       from './task-manager';
import {Task}                              from './task';

@autoinject()
export class ProjectDetail {
  @bindable project: Project;
  service: TaskRunnerService;
  tasks: Array<ProjectTask>;
  selectedTask: ProjectTask;
  error?: string;
  loading = false;
  
  constructor(private taskRunnerServiceLocator: ServiceLocator,
              private taskManager: TaskManager,
              private taskRunner: TaskRunner,
              private notification: Notification) {}

  async projectChanged() {
    this.loadTasks(true);
  }

  async loadTasks(withCache = true) {
    this.error = '';
    this.loading = true;
  
    if (this.project) {
      this.service = this.taskRunnerServiceLocator.get(this.project);
      
      try {
        this.tasks = await this.taskRunner.load(this.project, withCache);
      } catch (e) {
        this.error = `Failed to load tasks for this project (${e.message}). Did you install the npm modules?`;
      }
    } else {
      this.service = null;
      this.tasks = [];
    }
    this.loading = false;
  }

  startTask(projTask?: ProjectTask) {
    if (!this.selectedTask && !projTask) {
      this.notification.warning('No task has been selected');
      return;
    }
    
    let task = this.taskRunner.run(this.project, projTask || this.selectedTask);

    this.taskManager.addTask(this.project, task);
    this.taskManager.startTask(task);

    this.notification.success('Task has been started');
  }
}