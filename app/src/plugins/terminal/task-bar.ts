import {TerminalModal}       from './terminal-modal';
import {withModal}        from '../../shared/decorators';
import {TerminalState}   from './terminal-state';
import {autoinject}         from 'aurelia-framework';

@autoinject()
export class TaskBar {

  constructor(private terminalState: TerminalState) {
  }

  @withModal(TerminalModal)
  showTerminalModal() {
  }
}
