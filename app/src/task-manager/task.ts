export interface Task {
  promise: Promise<any>;
  title: string;
  id?: number;
  start?: Date;
  end?: Date;
  logs?: Array<string>;
  finished?: boolean;
  elapsed?: string;
}