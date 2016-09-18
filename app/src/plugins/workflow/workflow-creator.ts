import {bindable}    from 'aurelia-framework';
import {CommandTree} from './command-tree';
import {Command}     from '../task-manager/commands/command';

export class WorkflowCreator {
  @bindable tree: CommandTree;
  treeDiv: Element;
  jsTree: JSTree;
  selectedCommand: Command;

  nodes: Array<CommandTree> = [];

  attached() {
    $(document).on('dnd_stop.vakata', this.afterDrop.bind(this));
  }

  treeChanged() {
    this.selectedCommand = null;

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
    selectedTree.children.push(new CommandTree({ command: { command: 'command', args: ['parameters'] }}));

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
      core: {
        check_callback: function(operation, node, node_parent, node_position, more) {
          return node_parent.id !== '#';
        },
        data: data,
      },
      dnd: {
        check_while_dragging: true
      },
      plugins: ['dnd']
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
      let selected = this.getSelectedTree();
      if (selected) {
        if (selected.command) {
          this.selectedCommand = selected.command;
        } else {
          this.selectedCommand = null;
        }
      }
    });
  }

  afterDrop() {
    this.jsTree.open_all();

    this.tree = this.rebuildWorkflow();

    this.refreshTree();
  }

  /**
   * Since the commands may have been reordered
   * walk through the jstree and create a new commandtree
   */
  rebuildWorkflow() {
    this.tree.children.splice(0);

    let r = this.jsTree.get_json();

    function y(parent, tree) {
      if (parent.children) {
        for (let child of parent.children) {
          let childTree = this.nodes[child.a_attr.index];
          let newTree = new CommandTree({
            command: childTree.command,
            children: []
          });
          tree.children.push(newTree);

          y.call(this, child, newTree);
        }
      }
    }

    y.call(this, r[0], this.tree);

    return this.tree;
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
        icon: 'glyphicon glyphicon-flash',
        a_attr: {
          index: this.nodes.indexOf(commandTree)
        },
        type: 'parent',
        children: []
      };
    }

    return {
      text: `${command.command} ${command.args.join(' ')}`,
      icon: 'glyphicon glyphicon-cog',
      a_attr: {
        index: this.nodes.indexOf(commandTree)
      },
      type: 'child',
      children: []
    };
  }

  detached() {
    $(document).off('dnd_stop.vakata');
  }
}