import {Project} from '../../shared/project';

export interface Task {
  promise: Promise<any>;
  title: string;
  id?: number;
  start?: Date;
  end?: Date;
  logs?: Array<LogMessage>;
  finished?: boolean;
  elapsed?: string;
  project?: Project;
}

export interface LogMessage {
  level?: string;
  message: string;
}