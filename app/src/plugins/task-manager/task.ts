import {Project}            from '../../shared/project';
import {PostInstallProcess} from '../../scaffolding/post-install-process';
import {OS, FS}             from 'monterey-pal';
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
  meta?: any;
  promise: Promise<any>;
  dependsOn?: Task;

  constructor(public project: Project,
              public title?: string, 
              public execute?: () => Promise<any>) {
  }

  fromPostInstallProcess(process: PostInstallProcess) {
    this.title = process.description;
    this.execute = async () => {
      let dir = this.project.packageJSONPath ? FS.getFolderPath(this.project.packageJSONPath) : this.project.path;
      let proc = OS.spawn(process.command, process.args, { cwd: dir }, out => {
        this.addTaskLog(out);
      }, stderr => {
        this.addTaskLog(stderr);
      });

      if (!this.meta) this.meta = {}; 
      this.meta.process = proc.process;

      return proc.completion;
    };
    this.stoppable = true;
    this.stop = async () => {
      return OS.kill(this.meta.process);
    };

    return this;
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