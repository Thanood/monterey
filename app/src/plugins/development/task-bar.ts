import {DeveloperModal} from './developer-modal';
import {withModal, autoinject, useView} from '../../shared/index';

@useView('../task-bar/default-item.html')
@autoinject()
export class TaskBar {
  text = 'Developer';

  @withModal(DeveloperModal, null, { modal: false })
  onClick() {}
}