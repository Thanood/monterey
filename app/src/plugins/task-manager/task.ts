import {Project} from '../../shared/project';

export class Task implements Task {
  logs = [];
  stoppable = false;
  id?: number;
  start?: Date;
  end?: Date;
  finished?: boolean;
  description?: string;
  elapsed?: string;
  status?: string;
  stop?: (task: Task) => Promise<void>;
  estimation?: string;
  meta?: any;
  promise: Promise<any>;
  dependsOn?: Task;

  constructor(public project: Project,
              public title: string, 
              public execute?: () => Promise<any>) {
  }
}

export interface LogMessage {
  level?: string;
  message: string;
}