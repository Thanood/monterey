import {autoinject}                        from 'aurelia-framework';
import {TaskRunnerService, ServiceLocator} from '../../shared/task-runner-service';
import {ProjectTask, Project}              from '../../shared/project';
import {TaskManager}                       from './task-manager';
import {Task}                              from './task';

@autoinject()
export class TaskRunner {
  constructor(private taskRunnerServiceLocator: ServiceLocator,
              private taskManager: TaskManager) {}
  run(project: Project, projTask: ProjectTask) {
    let service = this.taskRunnerServiceLocator.get(project);
    let task = new Task(project, `${projTask.command} ${projTask.parameters.join(' ')}`);
    
    task.execute = this._executor(service, task, project, projTask);
    task.stoppable = true;
    task.stop = this._stop(task);

    return task;
  }

  _stop(task: Task) {
    return () => {
      let service = <TaskRunnerService>(task.meta.service);
      return service.stopTask(task.meta.process) 
    };
  }

  _executor(service: TaskRunnerService, task: Task, project: Project, projTask: ProjectTask) {
    return () => {
      let result = service.runTask(project, projTask, task, stdout => {
        this.taskManager.addTaskLog(task, stdout);
      }, stderr => {
        this.taskManager.addTaskLog(task, stderr);
      });
      
      task.meta = {
        service: service,
        process: result.process
      };

      return result.completion;
    };
  }

  async load(project: Project, withCache: boolean = true) {
    let service = <TaskRunnerService>this.taskRunnerServiceLocator.get(project);
    if (service) {
      return await service.getTasks(project, withCache);
    } else {
      return [];
    }
  }

  runByCmd(project: Project, command: string) {
    let service = <TaskRunnerService>this.taskRunnerServiceLocator.get(project);
    let task = new Task(project, command);
    
    task.execute = async () => {
      let tasks = await this.load(project, true);
      let projTask;
      tasks.forEach(task => {
        if (`${task.command} ${task.parameters.join(' ')}` === command) {
          projTask = task;
        }
      });

      return this._executor(service, task, project, projTask)();
    };
    task.stoppable = true;
    task.stop = this._stop(task);

    return task;
  }
}