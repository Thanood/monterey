import {autoinject, DialogController} from '../../shared/index';
import * as moment from  'moment';

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
