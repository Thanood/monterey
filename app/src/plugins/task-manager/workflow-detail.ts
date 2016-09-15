import {bindable}    from 'aurelia-framework';
import {CommandTree} from '../workflow/command-tree';

export class WorkflowDetail {
  @bindable workflow: CommandTree;
}