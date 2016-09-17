import {TerminalModal}      from './terminal-modal';
import {withModal, useView} from '../../shared/index';

@useView('../task-bar/default-item.html')
export class TaskBar {
  tooltip = 'tooltip-terminal';
  icon = 'glyphicon glyphicon-cog';
  text = 'terminal';

  @withModal(TerminalModal)
  onClick() {}
}
