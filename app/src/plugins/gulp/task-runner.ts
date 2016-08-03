import {bindable} from 'aurelia-framework';

export class TaskRunner {
  @bindable close;
  tasks = [{
    id: 1,
    name: 'watch',
  }, {
    id: 2,
    name: 'build'
  }, {
    id: 3,
    name: 'build-less'
  }];
}