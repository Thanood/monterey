import {bindable}    from 'aurelia-framework';
import {CommandTree} from '../workflow/command-tree';
import {Command}     from './command';

export class WorkflowCreator {
  @bindable tree: CommandTree;
  treeDiv: Element;
  jsTree: JSTree;

  treeChanged() {
    this.refreshTree();
  }

  addCommand() {
    let selection = this.jsTree.get_selected();
    let tree;

    if (selection && selection.length === 0) {
      tree = this.tree;
    }
    else {
      let selectedNode = this.jsTree.get_node(selection[0]);
      tree = selectedNode.original.tree;
    }

    if (!tree.children) {
      tree.children = [];
    }
    tree.children.push(new CommandTree({ name: 'test' }));

    this.refreshTree();
  }

  refreshTree() {
    if (!this.tree) {
      return;
    }

    let data = this.formatTree(null, [], this.tree);

    $(this.treeDiv).jstree({
      'core' : {
        'check_callback' : true,
        data: data
      },
      'plugins': ['dnd']
    });

    this.jsTree = $.jstree.reference(<any>this.treeDiv);
  }

  formatTree(parentNode: any, array: Array<any>, tree: CommandTree) {
    let node = this.formatCommand(tree.command, tree);

    if (!parentNode) {
      parentNode = node;
      array.push(parentNode);
    }

    if (tree.children && tree.children.length > 0) {
      for (let child of tree.children) {
        this.formatTree(parentNode, array, child);
      }
    }

    return array;
  }

  formatCommand(command: Command, commandTree: CommandTree) {
    return {
      text: `${command.command} ${command.args.join(' ')}`,
      command: command,
      tree: commandTree,
      children: []
    };
  }
}