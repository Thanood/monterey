import {bindable, autoinject}                 from 'aurelia-framework';
import {ServiceLocator, CommandRunnerService} from './command-runner-service';
import {Notification}                         from '../../shared/notification';
import {Project}                              from '../../shared/project';
import {CommandRunner}                        from './command-runner';
import {Command}                              from './command';
import {TaskManager}                          from './task-manager';
import {Task}                                 from './task';

@autoinject()
export class ProjectDetail {
  @bindable project: Project;
  service: CommandRunnerService;
  tasks: Array<Command>;
  selectedTask: Command;
  error?: string;
  loading = false;
  
  constructor(private taskRunnerServiceLocator: ServiceLocator,
              private taskManager: TaskManager,
              private commandRunner: CommandRunner,
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
        this.tasks = await this.commandRunner.load(this.project, withCache);
      } catch (e) {
        this.error = `Failed to load tasks for this project (${e.message}). Did you install the npm modules?`;
      }

      if (this.tasks && this.tasks.length === 0) {
        this.error = `Did not find any tasks`;
      }
    } else {
      this.service = null;
      this.tasks = [];
    }
    this.loading = false;
  }

  startTask(command?: Command) {
    if (!this.selectedTask && !command) {
      this.notification.warning('No task has been selected');
      return;
    }
    
    let task = this.commandRunner.run(this.project, command || this.selectedTask);

    this.taskManager.addTask(this.project, task);
    this.taskManager.startTask(task);

    this.notification.success('Task has been started');
  }
}