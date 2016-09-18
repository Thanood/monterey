import {TRexDialog}  from './components/t-rex-dialog';
import {TaskManager, Task, TaskRunner} from './index';
import {Settings, withModal, ApplicationState, TreeNode, TreeListNode, Project, Notification,
  EventAggregator, Subscription, DialogController, I18N, autoinject, observable, ContextMenu} from '../../shared/index';

@autoinject()
export class TaskManagerModal {
  @observable selectedNode: TreeListNode;

  selectedTask: Task;
  taskTreeElement: Element;
  splitter: Element;
  left: Element;
  selectedProject: Project;
  @observable showFinished;
  subscriptions: Array<Subscription> = [];
  taskRunnerVM: TaskRunner;

  model: { task: Task, project: Project };

  taskTree: Array<TreeListNode>;

  constructor(private dialogController: DialogController,
              private taskManager: TaskManager,
              private contextMenu: ContextMenu,
              private notification: Notification,
              private settings: Settings,
              private i18n: I18N,
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

    this.showFinished = this.settings.getValue('show-finished-tasks');
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

    this.taskRunnerVM.select(this.selectedProject);
  }

  contextMenuActivated(builder, clickedElement) {
    let treeNode = $(clickedElement).closest('tree-node')[0];
    let treeListNode = <TreeListNode>(<any>treeNode).au.controller.viewModel.node;

    if (!treeListNode.data.task) {
      return;
    }

    let task = <Task>treeListNode.data.task;
    builder.addItem({ title: this.i18n.tr('end-task'), onClick: () => {
      if (task.finished) {
        this.notification.error(this.i18n.tr('task-has-already-finished'));
        return;
      }

      if (!task.stoppable) {
        this.notification.error('task-cannot-be-stopped');
        return;
      }

      this.taskManager.stopTask(task);
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
          let taskNode = new TreeListNode(task.title);
          taskNode.title = task.title;
          switch (task.status) {
            case 'running':
              taskNode.icon = 'glyphicon glyphicon-cog gly-spin';
            break;
            case 'queued':
              taskNode.icon = 'glyphicon glyphicon-pause';
            break;
            case 'stopped by user':
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

      let projNode = new TreeListNode(proj.name, childNodes);
      projNode.title = proj.name;
      projNode.data = { project: proj };
      projNode.bold = true;

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
      this.taskRunnerVM.select(this.selectedProject);
    } else if (this.selectedNode.data.task) {
      this.selectedTask = this.selectedNode.data.task;
    }
  }

  showFinishedChanged(newVal, oldVal) {
    if (oldVal !== undefined) {
      this.settings.setValue('show-finished-tasks', this.showFinished);
    }
    this.updateTree();
  }

  @withModal(TRexDialog, null, { modal: false })
  trex() {}

  detached() {
    this.contextMenu.detach(this.taskTreeElement);
    this.subscriptions.forEach(subscription => subscription.dispose());
  }
}
