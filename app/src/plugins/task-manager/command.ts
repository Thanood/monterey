export interface Command {
  id?: number;
  description?: string;
  command: string;
  args: Array<string>;
}