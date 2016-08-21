import 'moment';
import {Task}                   from './task';
import {LogManager, autoinject} from 'aurelia-framework';
import {EventAggregator}        from 'aurelia-event-aggregator';
import {RandomNumber}           from '../../shared/random-number';
import {Project}                from '../../shared/project';
import {ApplicationState}       from '../../shared/application-state';
import {Errors}                 from '../errors/errors';

const logger = LogManager.getLogger('TaskManager');

/* Usage:
let task = {
  // some promise that eventually resolves
  promise: new Promise(resolve => {
    setTimeout(() => resolve(), 10000);
  }),
  // a description of what is happening
  title: 'baz'
};
this.taskManager.addTask(task);

// at some point, log a message specifically for this task
this.taskManager.addTaskLog(task, 'something happened');
*/
@autoinject()
export class TaskManager {

  constructor(private ea: EventAggregator,
              private errors: Errors) {
  }

  addTask(project: Project, task: Task) {
    if (!task.execute || !task.title) {
      throw new Error('task execute function and title are required');
    }

    task.id = new RandomNumber().create();
    task.start = new Date();
    task.status = 'queued';
    task.project = project;
    if (!task.logs) {
      task.logs = [];
    }

    project.__meta__.taskmanager.tasks.push(task);
    
    this.ea.publish('TaskAdded', { project: task.project, task: task });
  }

  startTask(task: Task) {
    task.status = 'running';
    
    this.ea.publish('TaskStarted', { project: task.project, task: task });

    return task.execute().then((result) => {
      this.addTaskLog(task, '-----FINISHED-----');
        
      this.finishTask(task);
      this.ea.publish('TaskFinished', { error: false, project: task.project, task: task });
      return result;
    }).catch((e) => {
      this.addTaskLog(task, '-----FINISHED WITH ERROR-----');
      this.addTaskLog(task, e.message);
      logger.error(e);
      this.errors.add(e);
      this.finishTask(task);
      this.ea.publish('TaskFinished', { error: true, project: task.project, task: task });
    })
    .then(() => {
      if (task.queue && task.queue.length > 0) {
        task.queue.forEach(t => this.startTask(t));
      }
    });
  }

  addTaskLog(task: Task, text: string, level?: string) {
    task.logs.unshift({
      message: `[${moment().format('LTS')}] ${level ? `[${level}]` : ''} ${text}`,
      level: level
    });
  }

  finishTask(task: Task) {
    if (task.status !== 'cancelled by user') {
      task.status = 'finished';
    }
    task.end = new Date();
  }

  cancelTask(task: Task) {
    if (!task.cancelable) {
      throw new Error('This task cannot be cancelled');
    }

    this.addTaskLog(task, '-----CANCELLED BY USER-----');
    task.status = 'cancelled by user';
    task.end = new Date();
    task.cancel(task);
  }
}
