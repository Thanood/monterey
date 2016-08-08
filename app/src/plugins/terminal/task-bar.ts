import {TerminalModal}       from './terminal-modal';
import {withModal}        from '../../shared/decorators';

export class TaskBar {
  @withModal(TerminalModal)
  showTerminalModal() {
  }
}
