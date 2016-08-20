import {bindable, inject, Parent} from 'aurelia-framework';
import {TreeListNode} from './tree-list-node';

@inject(Element)
export class TreeList {
  @bindable node: TreeListNode = null;

  constructor(private element: Element) {
  }

  nodeClicked(node: TreeListNode) {
    this.node.toggleNode();

    node.selected = true;

    this.element.dispatchEvent(new CustomEvent('on-select', {
      bubbles: true,
      detail: node
    }));
  }
}