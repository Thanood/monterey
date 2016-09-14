import {SupportModal} from './support-modal';
import {withModal}    from '../../shared/decorators';
import {useView}      from 'aurelia-framework';

@useView('../task-bar/default-item.html')
export class TaskBar {
  img = 'images/support-25x25.png';
  tooltip = 'tooltip-support';
  text = 'support';

  @withModal(SupportModal)
  onClick() {}
}