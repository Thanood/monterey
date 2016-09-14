import {autoinject}     from 'aurelia-framework';
import {withModal}      from '../../shared/decorators';
import {DeveloperModal} from './developer-modal';
import {useView}        from 'aurelia-framework';

@useView('../task-bar/default-item.html')
@autoinject()
export class TaskBar {
  text = 'Developer';

  @withModal(DeveloperModal, null, { modal: false })
  onClick() {}
}