import {AboutModal} from './about-modal';
import {withModal, useView}  from '../../shared/index';

@useView('../task-bar/default-item.html')
export class TaskBar {
  text = 'about';
  tooltip = 'tooltip-about';
  icon = 'fa fa-info-circle';

  @withModal(AboutModal)
  onClick() {}
}