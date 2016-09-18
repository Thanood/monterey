import {autoinject, observable, LogManager} from 'aurelia-framework';
import {Logger}            from 'aurelia-logging';
import {DialogService}     from 'aurelia-dialog';
import {FS}                from 'monterey-pal';
import {IStep}             from './istep';
import {ScaffoldProject}   from './scaffold-project';
import {TaskManager, Task} from '../plugins/task-manager/index';
import {TaskManagerModal}  from '../plugins/task-manager/task-manager-modal';
import {WorkflowViewer}    from '../plugins/workflow/workflow-viewer';
import {Notification, Project, PluginManager, ProjectManager} from '../shared/index';

const logger = <Logger>LogManager.getLogger('PostCreate');

/**
 * This screen is the last screen of the scaffolding wizard.
 * It allows users to select which actions (workflow) to perform now that the project
 * has been created. Often it is used to run commands like "npm install" or "jspm install"
 */
@autoinject()
export class PostCreate {
  state;
  step: IStep;
  project: Project;
  @observable checkedCount: number;
  selectedTasks: Array<Task>;
  workflowViewer: WorkflowViewer;

  constructor(private projectManager: ProjectManager,
              private pluginManager: PluginManager,
              private dialogService: DialogService,
              private scaffoldProject: ScaffoldProject,
              private notification: Notification,
              private taskManager: TaskManager) {}

  async activate(model) {
    this.state = model.state;
    this.step = model.step;
    this.step.execute = () => this.execute();
    this.step.previous = () => this.previous();

    this.scaffoldProject.title = 'The project has been created!';

    await this.addProject();
  }

  async addProject() {
    this.state.path = FS.join(this.state.path, this.state.name);

    let proj = await this.projectManager.addProjectByWizardState(this.state);

    if (proj) {
      this.project = <Project>proj;
      this.step.project = this.project;
    }
  }

  attached() {
    this.checkedCountChanged();
  }

  checkedCountChanged() {
    this.scaffoldProject.closeBtnText = this.checkedCount > 0 ? 'Start' : 'Close';
  }

  async execute() {
    if (this.checkedCount > 0) {
      this.workflowViewer.start();

      logger.info(`${this.selectedTasks.length} (${this.selectedTasks.map(x => x.title).join(', ')}) were checked`);

      this.dialogService.open({ viewModel: TaskManagerModal, model: { task: this.selectedTasks[0] } });
    } else {
      logger.info(`No tasks were checked`);
    }

    return {
      goToNextStep: true
    };
  }

  async previous() {
    return {
      goToPreviousStep: true
    };
  }
}