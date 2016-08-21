import {bindable, inject, Parent} from 'aurelia-framework';
import {TreeListNode} from './tree-list-node';

@inject(Element)
export class TreeNode {
  @bindable node: TreeListNode = null;

  constructor(private element: Element) {
  }

  nodeClicked(e: Event, node: TreeListNode) {
    let target: Element = <any>e.target;
    
    if (target.classList.contains('glyphicon-menu-down') || target.classList.contains('glyphicon-menu-right')) {
      this.node.toggleNode();
    } else {
      this.element.dispatchEvent(new CustomEvent('on-select', {
        bubbles: true,
        detail: node
      }));
    }
  }
}