import {autoinject, useView} from 'aurelia-framework';
import {Main}                from '../../main/main';
import {SelectedProject}     from '../../shared/selected-project';
import {Notification}        from '../../shared/notification';
import {Workflow}            from '../../project-installation/workflow';
import {CommandTree}         from '../../project-installation/command-tree';
import {Phase}               from '../../project-installation/phase';
import {Step}                from '../../project-installation/step';
import {CommandRunner}       from '../task-manager/command-runner';
import {TaskManager}         from '../task-manager/task-manager';
import {Task}                from '../task-manager/task';

@useView('plugins/default-tile.html')
@autoinject()
export class Tile {
  title: string;
  img: string;
  running: boolean;
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

    this.img = this.workflow ? 'images/stop.png' : 'images/play.png';
  }

  restoreWorkflow() {
    let project = this.selectedProject.current;
    let workflows = project.__meta__.workflows;
    if (workflows && workflows.length > 0) {
      let workflow = workflows.find(x => x.tree.id === this.tree.id);

      if (workflow) {
        this.workflow = workflow;
      }
    }
  }

  async onClick() {

    if (!this.workflow) {
      this.workflow = this.tree.createWorkflow(this.selectedProject.current, this.commandRunner, this.taskManager);
    }

    let wasRunning = this.running;
    this.running = !this.running;

    if (wasRunning) {

      this.stop();

      this.notification.success('Stopped');

      this.img = 'images/play.png';
    } else {

      this.start();

      this.notification.success('Started');

      this.img = 'images/stop.png';
    }
  }

  stop() {
    let project = this.selectedProject.current;

    this.workflow.stop();
    this.workflow = null;

    project.__meta__.workflows.splice(project.__meta__.workflows.findIndex(x => x.tree === this.tree));
  }

  start() {
    let project = this.selectedProject.current;

    this.workflow.start();

    project.__meta__.workflows.push({ tree: this.tree, workflow: this.workflow });
  }
}
