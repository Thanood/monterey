import * as moment                     from 'moment';
import {autoinject, observable}        from 'aurelia-framework';
import {DialogController}              from 'aurelia-dialog';
import {EventAggregator, Subscription} from 'aurelia-event-aggregator';
import {TaskManager}                   from './task-manager';
import {TRexDialog}                    from './components/t-rex-dialog';
import {Task}                          from './task';
import {withModal}                     from '../../shared/decorators';
import {ApplicationState}              from '../../shared/application-state';
import {TreeNode}                      from '../../shared/tree-list/tree-node';
import {TreeListNode}                  from '../../shared/tree-list/tree-list-node';
import {ContextMenu}                   from '../../shared/context-menu/context-menu';
import {Project}                       from '../../shared/project';

@autoinject()
export class TaskManagerModal {
  @observable selectedNode: TreeListNode;

  selectedTask: Task;
  taskTreeElement: Element;
  selectedProject: Project;
  @observable showFinished = true;
  subscriptions: Array<Subscription> = [];

  model: { task: Task, project: Project };

  taskTree: Array<TreeListNode>;

  constructor(private dialogController: DialogController,
              private taskManager: TaskManager,
              private contextMenu: ContextMenu,
              private ea: EventAggregator,
              private state: ApplicationState) {
    // we need to update the tree when tasks are added, started and finished
    this.subscriptions.push(this.ea.subscribe('TaskStarted', (obj) => {
      this.selectedTask = obj.task;
      this.selectedProject = null;
      this.updateTree();
    }));
    this.subscriptions.push(this.ea.subscribe('TaskAdded', () => this.updateTree()));
    this.subscriptions.push(this.ea.subscribe('TaskFinished', () => this.updateTree()));
  }

  activate(model) {
    this.model = model;

    if (this.model) {
      if (this.model.task) {
        this.selectedTask = this.model.task;
      } else if (this.model.project) {
        this.selectedProject = this.model.project;
      }
    }

    this.updateTree();
  }

  attached() {
    this.contextMenu.attach(this.taskTreeElement, (builder, clickedElement) => this.contextMenuActivated(builder, clickedElement));
  }

  contextMenuActivated(builder, clickedElement) {
    let treeNode = $(clickedElement).closest('tree-node')[0];
    let treeListNode = <TreeListNode>(<any>treeNode).au.controller.viewModel.node;
    
    if (!treeListNode.data.task) {
      return;
    }

    let task = <Task>treeListNode.data.task;
    if (task.finished) {
      return;
    }

    builder.addItem({ title: 'Cancel', onClick: () => {
      if (task.cancelable) {
        this.taskManager.cancelTask(task);
      } else {
        alert('This task cannot be cancelled');
      }
    }});
  }

  updateTree() {
     let tree = [];

    // projects have tasks
    // so here we generate a tree of TreeListNode
    // where a TreeListNode can be a project (1st level) or task (2nd level)
    this.state.projects.forEach(proj => {
      let childNodes = [];
      proj.__meta__.taskmanager.tasks.forEach(task => {
        if (!task.finished || this.showFinished) {
          let taskNode = new TreeListNode(task.title.length > 20 ? task.title.slice(0,20) + '...' : task.title);
          taskNode.title = task.title;
          switch(task.status) {
            case 'running':
              taskNode.icon = 'glyphicon glyphicon-cog gly-spin';
            break;
            case 'queued':
              taskNode.icon = 'glyphicon glyphicon-pause';
            break;
            case 'cancelled by user':
              taskNode.icon = 'glyphicon glyphicon-remove';
            break;
            case 'finished':
              taskNode.icon = 'glyphicon glyphicon-ok';
            break;
          }
          taskNode.data = { task: task };

          // recover selection
          if (task === this.selectedTask) {
            taskNode.selected = true;
          }

          childNodes.push(taskNode);
        }
      });

      let projNode = new TreeListNode(proj.name.length > 15 ? proj.name.slice(0, 15) + '...' : proj.name, childNodes);
      projNode.title = proj.name;
      projNode.data = { project: proj };
      projNode.bold = true;

      let newTaskNode = new TreeListNode('Start new task');
      projNode.title = 'Start new task';
      newTaskNode.data = { project: proj };
      newTaskNode.icon = 'glyphicon glyphicon-plus';
      projNode.children.push(newTaskNode);

      if (proj === this.selectedProject) {
        projNode.selected = true;
      }

      tree.push(projNode);
    });
  
    // we can probably sort this in a better way
    // for example, running processes should take priority over finished processes
    tree.sort((a: TreeListNode, b: TreeListNode) => b.children.map(x => x.data).length - a.children.map(x => x.data).length);

    this.taskTree = tree;
  }

  selectedNodeChanged() {
    this.selectedTask = null;
    this.selectedProject = null;

    if (this.selectedNode.data.project) {
      this.selectedProject = this.selectedNode.data.project;
    } else if(this.selectedNode.data.task) {
      this.selectedTask = this.selectedNode.data.task;
    }
  }

  showFinishedChanged() {
    this.updateTree();
  }

  @withModal(TRexDialog, null, { modal: false })
  trex() {}

  detached() {
    this.subscriptions.forEach(subscription => subscription.dispose());
  }
}
