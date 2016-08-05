import {autoinject}       from 'aurelia-framework';
import {Errors}           from './errors';
import {ErrorModal}       from './error-modal';
import {withModal}        from '../../shared/decorators';

@autoinject()
export class TaskBar {
  constructor(private errors: Errors) {}

  @withModal(ErrorModal)
  showErrors() {}
}