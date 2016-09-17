import {Task} from '../task-manager/index';

export class Step {
  order?: number;
  checked?: boolean = true;

  constructor(public identifier: string, public title: string, public task: Task) {}
}