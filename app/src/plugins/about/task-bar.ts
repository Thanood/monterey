import {AboutModal}       from './about-modal';
import {withModal}        from '../../shared/decorators';
import {useView}      from 'aurelia-framework';

@useView('../task-bar/default-item.html')
export class TaskBar {
  text = 'about';
  tooltip = 'tooltip-about';
  icon = 'fa fa-info-circle';

  @withModal(AboutModal)
  onClick() {}
}