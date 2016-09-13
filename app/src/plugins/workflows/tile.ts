import {autoinject, useView} from 'aurelia-framework';
import {Main}                from '../../main/main';
import {SelectedProject}     from '../../shared/selected-project';
import {Notification}        from '../../shared/notification';
import {Workflow}            from '../../project-installation/workflow';
import {CommandWorkflow}     from '../../project-installation/command-workflow';
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
  commandWorkflow: CommandWorkflow;

  constructor(private main: Main,
              private selectedProject: SelectedProject,
              private commandRunner: CommandRunner,
              private notification: Notification,
              private taskManager: TaskManager) {
    this.img = 'images/play.png';
  }

  activate(model) {
    Object.assign(this, model.model);
  }

  async onClick() {

    if (!this.workflow) {
      this.workflow = this.commandWorkflow.createWorkflow(this.selectedProject.current, this.commandRunner, this.taskManager);
    }

    let wasRunning = this.running;
    this.running = !this.running;

    if (wasRunning) {
      this.workflow.stop();
      this.workflow = null;

      this.notification.success('Stopped');

      this.img = 'images/play.png';
    } else {
      this.workflow.start();

      this.notification.success('Started');

      this.img = 'images/stop.png';
    }
  }
}
