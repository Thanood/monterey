import {WorkflowContext} from './workflow-context';
import {ScaffoldProject}   from './scaffold-project';
import {TaskManager, Task} from '../plugins/task-manager/index';
import {TaskManagerModal}  from '../plugins/task-manager/task-manager-modal';
import {WorkflowViewer}    from '../plugins/workflow/workflow-viewer';
import {Notification, Project, PluginManager, ProjectManager,
  FS, Logger, DialogService, autoinject, observable, LogManager} from '../shared/index';

const logger = <Logger>LogManager.getLogger('PostCreate');

/**
 * This screen is the last screen of the scaffolding wizard.
 * It allows users to select which actions (workflow) to perform now that the project
 * has been created. Often it is used to run commands like "npm install" or "jspm install"
 */
@autoinject()
export class PostCreate {
  state;
  project: Project;
  @observable checkedCount: number;
  selectedTasks: Array<Task>;
  context: WorkflowContext;
  workflowViewer: WorkflowViewer;

  constructor(private projectManager: ProjectManager,
              private pluginManager: PluginManager,
              private dialogService: DialogService,
              private scaffoldProject: ScaffoldProject,
              private notification: Notification,
              private taskManager: TaskManager) {}


  async activate(model: { context: WorkflowContext }) {
    this.context = model.context;
    this.state = model.context.state;

    this.context.onNext(() => this.next());

    this.context.title = 'The project has been created!';

    await this.addProject();
  }

  async addProject() {
    this.state.path = FS.join(this.state.path, this.state.name);

    let proj = await this.projectManager.addProjectByWizardState(this.state);

    if (proj) {
      this.project = <Project>proj;
      this.context.project = this.project;
    }
  }

  attached() {
    this.checkedCountChanged();
  }

  checkedCountChanged() {
    this.context.closeButtonVisible = false;
    this.context.previousButtonVisible = false;
    this.context.nextButtonText = this.checkedCount > 0 ? 'Start' : 'Close';
  }

  async next() {
    if (this.checkedCount > 0) {
      this.workflowViewer.start();

      logger.info(`${this.selectedTasks.length} (${this.selectedTasks.map(x => x.title).join(', ')}) were checked`);

      this.dialogService.open({ viewModel: TaskManagerModal, model: { task: this.selectedTasks[0] } });
    } else {
      logger.info(`No tasks were checked`);
    }

    return true;
  }
}