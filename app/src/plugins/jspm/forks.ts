import {autoinject}       from 'aurelia-framework';
import {DialogController} from 'aurelia-dialog';
import * as moment        from  'moment';

@autoinject()
export class Forks {
  forks = [];

  constructor(private dialogController: DialogController) {
  }

  activate(model) {
    this.forks = model.forks;
    this.forks.forEach(fork => fork.versionString = fork.versions.join(', '));
  }
}
