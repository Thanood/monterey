import {Project} from '../../shared/project';
import {Command} from './command';
import {OS, FS}  from 'monterey-pal';
import 'moment';

export class Task implements Task {
  logs = [];
  stoppable = false;
  id?: number;
  start?: Date;
  end?: Date;
  finished?: boolean;
  description?: string;
  elapsed?: string;
  status?: 'queued'|'stopped by user'|'running'|'finished';
  stop?: (task: Task) => Promise<void>;
  estimation?: string;
  meta?: any = {};
  promise: Promise<any>;
  dependsOn?: Task;

  constructor(public project: Project,
              public title?: string,
              public execute?: () => Promise<any>) {
  }

  addTaskLog(text: string, level?: string) {
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

    if (text.match(/^\[(.*)\] $/)) {
      return;
    }

    let parts = text.split('\n');
    parts.forEach(part => addLog(this, part, level));
  }
}

export interface LogMessage {
  level?: string;
  message: string;
}