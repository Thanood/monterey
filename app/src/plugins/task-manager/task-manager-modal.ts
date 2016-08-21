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
    this.subscriptions.push(this.ea.subscribe('TaskStarted', () => this.updateTree()));
    this.subscriptions.push(this.ea.subscribe('TaskAdded', () => this.updateTree()));
    this.subscriptions.push(this.ea.subscribe('TaskFinished', () => this.updateTree()));
  }

  activate(model) {
    this.model = model;

    this.updateTree();
  }

  updateTree() {
    this.taskTree = [];

    let selectedTask = this.selectedTask;
    let selectedProject = this.selectedProject;

    this.state.projects.forEach(proj => {
      let childNodes = [];
      proj.__meta__.taskmanager.tasks.forEach(task => {
        if (!task.end || this.showFinished) {
          let taskNode = new TreeListNode(`${task.title} (${task.status})`)
          taskNode.data = { task: task };

          if (task === selectedTask) {
            taskNode.selected = true;
          }

          childNodes.push(taskNode);
        }
      });

      let projNode = new TreeListNode(proj.name, childNodes);
      projNode.data = { project: proj };
      projNode.bold = true;

      if (proj === selectedProject) {
        projNode.selected = true;
      }

      this.taskTree.push(projNode);
    });
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

  // attached() {
  //   if (this.model && this.model.task) {
  //     this.selectedTask = this.model.task;
  //   } else if (this.taskManager.runningTasks.length > 0) {
  //     this.selectedTask = this.taskManager.runningTasks[0];
  //   }
  // }

  @withModal(TRexDialog, null, { modal: false })
  trex() {}
}
