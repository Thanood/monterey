export interface Task {
  promise: Promise<any>;
  title: string;
  id?: number;
  start?: Date;
  end?: Date;
  logs?: Array<LogMessage>;
  finished?: boolean;
  elapsed?: string;
}

export interface LogMessage {
  level?: string;
  message: string;
}