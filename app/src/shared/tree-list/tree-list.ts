import {bindable, children} from 'aurelia-framework';
import {TreeNode} from './tree-node';
import {TreeListNode} from './tree-list-node';

export class TreeList {
  @bindable tree : Array<TreeListNode>;
  @bindable selectedNode: TreeListNode;

  nodeClicked(node: TreeListNode) {

    this.tree.forEach(node => this.deselect(node));
    this.selectedNode = node;

    node.selected = true;
  }

  deselect(node: TreeListNode) {
    if (node.children.length > 0) {
      node.children.forEach(node => this.deselect(node));
    }

    node.selected = false;
  }
}