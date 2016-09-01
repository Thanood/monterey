import {Task}                   from './task';
import {LogManager, autoinject} from 'aurelia-framework';
import {EventAggregator}        from 'aurelia-event-aggregator';
import {RandomNumber}           from '../../shared/random-number';
import {Project}                from '../../shared/project';
import {ApplicationState}       from '../../shared/application-state';
import {Errors}                 from '../errors/errors';
import 'moment';

const logger = LogManager.getLogger('TaskManager');

@autoinject()
export class TaskManager {

  tasks: Array<Task> = [];

  constructor(private ea: EventAggregator,
              private errors: Errors) {
  }

  addTask(project: Project, task: Task) {
    if (!task.execute || !task.title) {
      throw new Error('task execute function and title are required');
    }

    task.id = new RandomNumber().create();
    task.status = 'queued';
    task.project = project;
    if (!task.logs) {
      task.logs = [];
    }

    project.__meta__.taskmanager.tasks.push(task);
    this.tasks.push(task);

    logger.info(`queued '${task.title}' for project '${project.name}'`);
    
    this.ea.publish('TaskAdded', { project: task.project, task: task });
  }

  startTask(task: Task) {
    if (task.status !== 'queued') {
      return Promise.resolve();
    }

    task.start = new Date();
    task.status = 'running';
    
    this.ea.publish('TaskStarted', { project: task.project, task: task });

    logger.info(`started '${task.title}' for project '${task.project.name}'`);
  
    this.addTaskLog(task, '-----STARTED-----');

    return task.execute().then((result) => {
      this.addTaskLog(task, '-----FINISHED-----');
        
      logger.info(`task '${task.title}' for project '${task.project.name}' finished without error`);
      this.finishTask(task, false);
      return result;
    }).catch((e) => {
      this.addTaskLog(task, '-----FINISHED WITH ERROR-----');
      this.addTaskLog(task, e.message);
      this.errors.add(e); 
      this.finishTask(task, true);
      
      let timeItTook = `${moment(task.end).diff(task.start, 'seconds')} seconds`;
      logger.info(`task '${task.title}' for project '${task.project.name}' finished with error (after it ran for ${timeItTook})`);
      logger.error(e);
    });
  }

  addTaskLog(task: Task, text: string, level?: string) {
    task.addTaskLog(text, level);
  }

  finishTask(task: Task, errorred = false) {
    if (task.status !== 'stopped by user') {
      task.status = 'finished';
    }

    // if the task has never started then it shouldn't have an end date
    if (task.start) {
      task.end = new Date();
    }

    task.description = null;
    task.finished = true;

    if (task.status === 'finished') {
      this.startDependingTasks(task);
    }

    let index = this.tasks.indexOf(task);
    this.tasks.splice(index, 1);

    this.ea.publish('TaskFinished', { error: errorred, project: task.project, task: task });
  }

  startDependingTasks(task: Task) {
    this.tasks.forEach(t => {
      if (t.dependsOn === task && t.status === 'queued') {
        this.startTask(t);
      }
    })
  }

  async stopTask(task: Task) {
    if (!task.stoppable) {
      throw new Error('This task cannot be cancelled');
    }

    logger.info(`task '${task.title}' for project '${task.project.name}' was cancelled by user`);

    return await this._stopTask(task);
  }

  private async _stopTask(task: Task) {
    this.addTaskLog(task, '-----STOPPED BY USER-----');
    task.status = 'stopped by user';

    let promise = Promise.resolve();

    if (task.start) {
      promise = task.stop(task);
    }
    
    await promise;
    this.finishTask(task);

    await this.stopTaskDependencies(task);
  }

  /**
   * Cancells all dependent tasks of a task
   */
  async stopTaskDependencies(task: Task) {
    for(let x = this.tasks.length - 1; x >= 0; x--) {
      let t = this.tasks[x];
      if (t.dependsOn === task) {
        await this._stopTask(t);
      }
    }
  }
}
