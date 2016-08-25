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
        
      this.finishTask(task, false);
      return result;
    }).catch((e) => {
      this.addTaskLog(task, '-----FINISHED WITH ERROR-----');
      this.addTaskLog(task, e.message);
      logger.error(e);
      this.errors.add(e);
      this.finishTask(task, true);
    });
  }

  addTaskLog(task: Task, text: string, level?: string) {
    function addLog(task: Task, text: string, level?: string) {
      text = text.trim();
      if (!text) return;

      let hasTimestamp = text.match(/^\[(.*)\]/);
      if (level) {
        text = `[${level}] ${text}`;
      }
      if (!hasTimestamp) {
        text = `[${moment().format('HH:mm:ss')}] ${text}`;
      }
      task.logs.push({
        message: text,
        level: level
      });
    }

    let parts = text.split('\n');
    parts.forEach(part => addLog(task, part, level));
  }

  finishTask(task: Task, errorred = false) {
    if (task.status !== 'stopped by user') {
      task.status = 'finished';
    }

    // if the task has never started then it shouldn't have an end date
    if (task.start) {
      task.end = new Date();
    }

    task.finished = true;

    this.startDependingTasks(task);

    let index = this.tasks.indexOf(task);
    this.tasks.splice(index, 1);

    this.ea.publish('TaskFinished', { error: errorred, project: task.project, task: task });
  }

  startDependingTasks(task: Task) {
    this.tasks.forEach(t => {
      if (t.dependsOn === task) {
        this.startTask(t);
      }
    })
  }

  stopTask(task: Task) {
    if (!task.stoppable) {
      throw new Error('This task cannot be cancelled');
    }

    this.addTaskLog(task, '-----STOPPED BY USER-----');
    task.status = 'stopped by user';
    
    return task.stop(task)
    .then(() => {
      this.finishTask(task);
    });
  }
}
