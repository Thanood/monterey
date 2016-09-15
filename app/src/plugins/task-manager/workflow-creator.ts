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
    let treeId = selectedNode.original.treeId;
    return this.getTreeWithId(treeId);
  }

  getParent(tree: CommandTree) {
    function y (x): CommandTree {
      let parent = x;

      if (x.children) {
        for (let child of x.children) {
          if (child.id === tree.id) {
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
    if (!this.tree) {
      return;
    }

    this.assignIds(this.tree);

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
      let original = data.instance.get_node(data.selected[0]).original;
      let treeId = original.treeId;
      this.selectedCommand = this.getTreeWithId(treeId).command;
    });
  }

  assignIds(tree: CommandTree) {
    tree.id = new RandomNumber().create();

    if (tree.children && tree.children.length > 0) {
      for (let child of tree.children) {
        tree.id = new RandomNumber().create();
        this.assignIds(child);
      }
    }
  }

  getTreeWithId(id) {
    if (!this.tree) {
      return;
    }

    let tree;
    function y (x) {
      if (x.id === id) {
        tree = x;
      }
      if (x.children) {
        for (let child of x.children) {
          y(child);
        }
      }
    }

    y(this.tree);

    return tree;
  }

  formatTree(parentNode: any, array: Array<any>, tree: CommandTree) {
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
        treeId: commandTree.id,
        children: []
      };
    }

    return {
      text: `${command.command} ${command.args.join(' ')}`,
      treeId: commandTree.id,
      children: []
    };
  }

  /**
   * Based on the jsTree, build up a new CommandTree
   */
  getCurrentCommandTree() {
    console.log(this.jsTree.get_json('#'));
  }

  async save() {
    this.getCurrentCommandTree();

    await this.state._save();
    this.notification.success('Saved');
  }
}