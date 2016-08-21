import {Project} from '../../shared/project';

export class Task implements Task {
  logs = [];
  cancelable = false;
  id?: number;
  start?: Date;
  end?: Date;
  finished?: boolean;
  elapsed?: string;
  status?: string;
  cancel?: (task: Task) => Promise<void>;
  estimation?: string;
  meta?: any;
  promise: Promise<any>;
  queue?: Array<Task> = [];

  constructor(public project: Project,
              public title: string, 
              public execute?: () => Promise<any>) {
  }
}

export interface LogMessage {
  level?: string;
  message: string;
}