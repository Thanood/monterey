import {Errors} from '../errors/errors';
import {Task}   from './task';
import {Project, RandomNumber, ApplicationState, EventAggregator, LogManager, autoinject} from '../../shared/index';
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

    if (!task.id) {
      task.id = new RandomNumber().create();
    }

    task.status = 'queued';
    task.finished = false;
    task.project = project;
    if (!task.logs) {
      task.logs = [];
    } else {
      // clear logs for tasks that get restarted
      task.logs.splice(0);
    }

    // do not add the same task a second time
    if (!this.tasks.find(x => x === task)) {
      project.__meta__.taskmanager.tasks.push(task);
      this.tasks.push(task);
    }

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
      this.addTaskLog(task, '-----COMPLETED-----');
      task.status = 'completed';

      logger.info(`task '${task.title}' for project '${task.project.name}' finished without error`);

      this.finishTask(task);
      return result;
    }).catch((e) => {
      task.status = 'failed';

      this.addTaskLog(task, '-----FINISHED WITH ERROR-----');
      this.addTaskLog(task, e.message);
      this.errors.add(e);

      this.finishTask(task);

      let timeItTook = `${moment(task.end).diff(task.start, 'seconds')} seconds`;
      logger.info(`task '${task.title}' for project '${task.project.name}' finished with error (after it ran for ${timeItTook})`);
      logger.error(e);
    });
  }

  addTaskLog(task: Task, text: string, level?: string) {
    task.addTaskLog(text, level);
  }

  finishTask(task: Task) {
    // if the task has never started then it shouldn't have an end date
    if (task.start) {
      task.end = new Date();
    }

    task.description = null;
    task.finished = true;

    if (task.status !== 'failed' && task.status === 'completed') {
      this.startDependingTasks(task);
    }

    if (task.status === 'failed') {
      this.stopDependingTasks(task);
    }

    this.ea.publish('TaskFinished', { project: task.project, task: task });
  }

  startDependingTasks(task: Task) {
    this.tasks.forEach(t => {
      if (t.dependsOn === task && t.status === 'queued') {
        this.startTask(t);
      }
    });
  }

  stopDependingTasks(task: Task) {
    for (let i = 0; i < this.tasks.length; i++) {
      let t = this.tasks[i];
      if (t.dependsOn === task && t.status === 'queued') {
        t.status = 'stopped';
        t.finished = true;
        this.stopDependingTasks(t);
      }
    }
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
    for (let x = 0; x < this.tasks.length; x++) {
      let t = this.tasks[x];
      if (t.dependsOn === task) {
       await this._stopTask(this.tasks[x]);
      }
    }
  }
}