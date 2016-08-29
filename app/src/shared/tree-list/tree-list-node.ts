export class TreeListNode {
  name: string;
  children: Array<TreeListNode>;
  visible: boolean;
  icon: string = 'glyphicon';
  expanded: boolean;
  data: any;
  selected = false;
  bold = false;

  /**
   * This is visible when keeping the cursor on the treenode
   */
  title: string;

  constructor(name: string, children?: Array<TreeListNode>){
    this.name = name;
    this.children = children || [];
    this.visible = true;

    if(this.hasChildren()){
      this.icon = 'glyphicon glyphicon-menu-down';
      this.expanded = true;
    }
  }

  hasChildren() {
    return this.children.length > 0;
  }

  toggleNode() {
    if (!this.hasChildren()) {
      return;
    }

    for(var i = 0; i < this.children.length; i++){
      this.children[i].visible = !this.children[i].visible;
    }

    this.expanded = !this.expanded;

    if(this.expanded === true){
      this.icon = 'glyphicon glyphicon-menu-right';
    }
    else{
      this.icon = 'glyphicon glyphicon-menu-down';
    }
  }
}