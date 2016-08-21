import 'moment';
import {Task}                   from './task';
import {LogManager, autoinject} from 'aurelia-framework';
import {EventAggregator}        from 'aurelia-event-aggregator';
import {RandomNumber}           from '../../shared/random-number';
import {Project}                from '../../shared/project';
import {ApplicationState}       from '../../shared/application-state';
import {Errors}                 from '../errors/errors';

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
    
    this.ea.publish('TaskAdded', { project: task.project, task: task });
  }

  startTask(task: Task) {
    task.start = new Date();
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
    });
  }

  addTaskLog(task: Task, text: string, level?: string) {
    task.logs.push({
      message: `[${moment().format('LTS')}] ${level ? `[${level}]` : ''} ${text}`,
      level: level
    });
  }

  finishTask(task: Task) {
    if (task.status !== 'cancelled by user') {
      task.status = 'finished';
    }
    task.end = new Date();
    task.finished = true;

    this.startDependingTasks(task);

    let index = this.tasks.indexOf(task);
    this.tasks.splice(index, 1);

    this.ea.publish('TaskFinished', { error: true, project: task.project, task: task });
  }

  startDependingTasks(task: Task) {
    this.tasks.forEach(t => {
      if (t.dependsOn === task) {
        this.startTask(t);
      }
    })
  }

  cancelTask(task: Task) {
    if (!task.cancelable) {
      throw new Error('This task cannot be cancelled');
    }

    // if the task has never started then it shouldn't have an end date
    if (task.start) {
      task.end = new Date();
    }

    this.addTaskLog(task, '-----CANCELLED BY USER-----');
    task.status = 'cancelled by user';
    task.finished = true;
    task.cancel(task);

    this.ea.publish('TaskFinished', { project: task.project, task: task });
  }
}
