import {SupportModal}     from './support-modal';
import {withModal}        from '../../shared/decorators';

export class TaskBar {
  @withModal(SupportModal)
  showSupportModal() {}
}