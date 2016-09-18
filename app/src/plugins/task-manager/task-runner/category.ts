import {TaskRunner, Category as CategoryModel} from './task-runner';
import {Command} from '../commands/command';
import {bindable, autoinject} from 'aurelia-framework';

@autoinject()
export class Category {
  @bindable cat: CategoryModel;
  @bindable project;
  curr: Command;

  constructor(private parent: TaskRunner) {}

  select(command: Command) {
    this.cat.selectedCommand = command;

    // clone the command so user can change parameters without affecting the list
    this.curr = new Command().fromObject(command);
  }
}