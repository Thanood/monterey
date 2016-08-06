import {AboutModal}       from './about-modal';
import {withModal}        from '../../shared/decorators';

export class TaskBar {
  @withModal(AboutModal)
  showAboutModal() {}
}