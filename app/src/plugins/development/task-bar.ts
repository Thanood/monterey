import {autoinject}       from 'aurelia-framework';
import {withModal}        from '../../shared/decorators';
import {DeveloperModal}   from './developer-modal';

@autoinject()
export class TaskBar {
  @withModal(DeveloperModal, null, { modal: false })
  show() {}
}