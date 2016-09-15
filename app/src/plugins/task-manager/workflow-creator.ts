import {bindable, autoinject} from 'aurelia-framework';
import {RandomNumber}         from '../../shared/random-number';
import {ApplicationState}     from '../../shared/application-state';
import {Notification}         from '../../shared/notification';
import {CommandTree}          from '../workflow/command-tree';
import {Command}              from './command';

@autoinject()
export class WorkflowCreator {
  @bindable tree: CommandTree;
  treeDiv: Element;
  jsTree: JSTree;
  selectedCommand: Command;

  nodes: Array<CommandTree> = [];

  constructor(private state: ApplicationState,
              private notification: Notification) {}

  treeChanged() {
    this.refreshTree();
  }

  addCommand() {
    let selectedTree = this.getSelectedTree();

    if (!selectedTree) {
      selectedTree = this.tree;
    }

    if (!selectedTree.children) {
      selectedTree.children = [];
    }
    selectedTree.children.push(new CommandTree({ command: { command: 'dotnet', args: ['run'] }}));

    this.refreshTree();
  }

  removeCommand() {
    let selectedTree = this.getSelectedTree();
    let parentTree = this.getParent(selectedTree);

    if (parentTree) {
      parentTree.children.splice(parentTree.children.indexOf(selectedTree), 1);
      this.refreshTree();
    } else {
      alert('Can\'t remove parent node');
    }
  }

  getSelectedTree(): CommandTree {
    let selection = this.jsTree.get_selected();
    let selectedNode = this.jsTree.get_node(selection[0]);
    return this.nodes[selectedNode.a_attr.index];
  }

  getParent(tree: CommandTree) {
    function y (x): CommandTree {
      let parent = x;

      if (x.children) {
        for (let child of x.children) {
          if (child === tree) {
            return parent;
          }

          let z = y(child);
          if (z) {
            return z;
          }
        }
      }
    }

    return y(this.tree);
  }

  refreshTree() {
    this.nodes = [];

    if (!this.tree) {
      return;
    }

    let data = this.formatTree(null, [], this.tree);

    if (this.jsTree) {
      this.jsTree.destroy();
    }

    $(this.treeDiv).jstree({
      'core' : {
        'check_callback' : true,
        data: data
      },
      'plugins': ['dnd']
    });

    this.jsTree = $.jstree.reference(<any>this.treeDiv);

    // no collapse
    $(this.treeDiv).on('close_node.jstree', function (e, data) {
      data.instance.open_node(data.node);
    });

    $(this.treeDiv).on('loaded.jstree', () => {
      this.jsTree.open_all();
    });

    $(this.treeDiv).on('changed.jstree', (e, data) => {
      this.selectedCommand = this.getSelectedTree().command;
    });
  }

  formatTree(parentNode: any, array: Array<any>, tree: CommandTree) {
    this.nodes.push(tree);

    let node = this.formatCommand(tree.command, tree);

    if (!parentNode) {
      parentNode = node;
      array.push(parentNode);
    } else {
      parentNode.children.push(node);
      parentNode = node;
    }

    if (tree.children && tree.children.length > 0) {
      for (let child of tree.children) {
        this.formatTree(parentNode, array, child);
      }
    }

    return array;
  }

  formatCommand(command: Command, commandTree: CommandTree): any {
    if (!command) {
      return {
        text: `${commandTree.name}`,
        icon: 'glyphicon glyphicon-cog',
        data: {
          index: this.nodes.indexOf(commandTree)
        },
        children: []
      };
    }

    return {
      text: `${command.command} ${command.args.join(' ')}`,
      icon: 'glyphicon glyphicon-cog',
      a_attr: {
        index: this.nodes.indexOf(commandTree)
      },
      children: []
    };
  }

  async save() {
    this.refreshTree();

    await this.state._save();
    this.notification.success('Saved');
  }
}