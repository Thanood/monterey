import {autoinject, useView} from 'aurelia-framework';
import {Main}                from '../../main/main';
import {SelectedProject}     from '../../shared/selected-project';
import {Notification}        from '../../shared/notification';
import {CommandRunner}       from '../task-manager/command-runner';
import {TaskManager}         from '../task-manager/task-manager';
import {Task}                from '../task-manager/task';
import {Workflow}            from './workflow';
import {Phase}               from './phase';
import {Step}                from './step';
import {CommandTree}         from './command-tree';

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

    this.running = !!this.workflow;

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

    if (!this.workflow) {
      this.workflow = this.tree.createWorkflow(this.selectedProject.current, this.commandRunner, this.taskManager);
    }

    let wasRunning = this.running;

    if (wasRunning) {

      this.stop();

      this.running = false;

      this.notification.success('Stopped');
    } else {

      this.start();

      this.running = true;

      this.notification.success('Started');
    }

    this.update();
  }

  update() {
    this.img = this.running ? 'images/stop.png' : 'images/play.png';
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
      this.running = false;
      this.update();
    });

    project.__meta__.workflows.push({ tree: this.tree, workflow: this.workflow });
  }
}
