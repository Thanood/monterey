import {autoinject, useView} from 'aurelia-framework';
import {DeveloperModal}      from './developer-modal';
import {withModal}           from '../../shared/index';

@useView('../task-bar/default-item.html')
@autoinject()
export class TaskBar {
  text = 'Developer';

  @withModal(DeveloperModal, null, { modal: false })
  onClick() {}
}