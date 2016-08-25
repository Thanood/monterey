export interface Command {
  id?: number;
  command: string;
  parameters: Array<string>;
}