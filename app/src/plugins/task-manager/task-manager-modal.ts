import * as moment                     from 'moment';
import {autoinject, observable}        from 'aurelia-framework';
import {DialogController}              from 'aurelia-dialog';
import {EventAggregator, Subscription} from 'aurelia-event-aggregator';
import {TaskManager}                   from './task-manager';
import {TRexDialog}                    from './components/t-rex-dialog';
import {Task}                          from './task';
import {withModal}                     from '../../shared/decorators';
import {ApplicationState}              from '../../shared/application-state';
import {TreeListNode}                  from '../../shared/tree-list/tree-list-node';
import {Project}                       from '../../shared/project';

@autoinject()
export class TaskManagerModal {
  @observable selectedNode: TreeListNode;

  selectedTask: Task;
  selectedProject: Project;
  @observable showFinished = true;
  subscriptions: Array<Subscription> = [];

  model: { task: Task };

  taskTree: Array<TreeListNode>;

  constructor(private dialogController: DialogController,
              private taskManager: TaskManager,
              private ea: EventAggregator,
              private state: ApplicationState) {
    // we need to update the tree when tasks are added, started and finished
    this.subscriptions.push(this.ea.subscribe('TaskStarted', () => this.updateTree()));
    this.subscriptions.push(this.ea.subscribe('TaskAdded', () => this.updateTree()));
    this.subscriptions.push(this.ea.subscribe('TaskFinished', () => this.updateTree()));
  }

  activate(model) {
    this.model = model;

    this.updateTree();
  }

  updateTree() {
     let tree = [];

    let selectedTask = this.selectedTask;
    let selectedProject = this.selectedProject;

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
          if (task === selectedTask) {
            taskNode.selected = true;
          }

          childNodes.push(taskNode);
        }
      });

      let projNode = new TreeListNode(proj.name.length > 25 ? proj.name.slice(0, 25) + '...' : proj.name, childNodes);
      projNode.title = proj.name;
      projNode.data = { project: proj };
      projNode.bold = true;

      // recover selection
      if (proj === selectedProject) {
        projNode.selected = true;
      }

      tree.push(projNode);
    });
  
    // we can probably sort this in a better way
    // for example, running processes should take priority over finished processes
    tree.sort((a: TreeListNode, b: TreeListNode) => b.children.length - a.children.length);

    this.taskTree = tree;
  }

  selectedNodeChanged() {
    if (this.selectedNode.data.project) {
      this.selectedProject = this.selectedNode.data.project;
      this.selectedTask = null;
    } else {
      this.selectedTask = this.selectedNode.data.task;
      this.selectedProject = null;
    }
  }

  showFinishedChanged() {
    this.updateTree();
  }

  @withModal(TRexDialog, null, { modal: false })
  trex() {}
}
