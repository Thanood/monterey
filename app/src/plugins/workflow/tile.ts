import {Main}        from '../../main/main';
import {Workflow}    from './workflow';
import {Phase}       from './phase';
import {Step}        from './step';
import {CommandTree} from './command-tree';
import {TaskManager, CommandRunner, Task} from '../task-manager/index';
import {SelectedProject, Notification, autoinject, useView} from '../../shared/index';

@useView('plugins/default-tile.html')
@autoinject()
export class Tile {
  title: string;
  img: string;
  workflow: Workflow;
  tree: CommandTree;

  constructor(private main: Main,
              private selectedProject: SelectedProject,
              private commandRunner: CommandRunner,
              private notification: Notification,
              private taskManager: TaskManager) {
    if (!selectedProject.current.__meta__.workflows) {
      selectedProject.current.__meta__.workflows = [];
    }
  }

  activate(model) {
    Object.assign(this, model.model);

    this.restoreWorkflow();

    this.update();
  }

  restoreWorkflow() {
    let project = this.selectedProject.current;
    let workflows = project.__meta__.workflows;
    if (workflows && workflows.length > 0) {
      let workflow = workflows.find(x => x.tree.id === this.tree.id);

      if (workflow) {
        this.workflow = workflow.workflow;
      }
    }
  }

  async onClick() {
    let project = this.selectedProject.current;

    if (!this.workflow) {
      this.workflow = this.tree.createWorkflow(project, this.commandRunner, this.taskManager);
    }

    let wasRunning = this.workflow.running;

    if (wasRunning) {

      this.stop();

      this.notification.success('Stopped');
    } else {

      this.start();

      this.notification.success('Started');
    }

    this.update();
  }

  update() {
    this.img = this.workflow && this.workflow.running ? 'images/stop.png' : 'images/play.png';
  }

  stop() {
    let project = this.selectedProject.current;

    this.workflow.stop();
    this.workflow = null;

    project.__meta__.workflows.splice(project.__meta__.workflows.findIndex(x => x.tree === this.tree));
  }

  start() {
    let project = this.selectedProject.current;

    this.workflow.start()
    .then(() => {
      this.update();
    });

    project.__meta__.workflows.push({ tree: this.tree, workflow: this.workflow });
  }
}
