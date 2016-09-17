import {withModal, useView} from '../../shared/index';
import {SupportModal}       from './support-modal';

@useView('../task-bar/default-item.html')
export class TaskBar {
  img = 'images/support-25x25.png';
  tooltip = 'tooltip-support';
  text = 'support';

  @withModal(SupportModal)
  onClick() {}
}