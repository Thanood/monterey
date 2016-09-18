import {bindable}    from 'aurelia-framework';
import {CommandTree} from '../task-manager/index';

export class WorkflowDetail {
  @bindable workflow: CommandTree;
}