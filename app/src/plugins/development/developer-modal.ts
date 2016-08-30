import {autoinject}         from 'aurelia-framework';
import {DialogController}   from 'aurelia-dialog';
import {TaskManager}        from '../task-manager/task-manager';
import {Task}               from '../task-manager/task';
import {ApplicationState}   from '../../shared/application-state';
import {SelectedProject}    from '../../shared/selected-project';
import {WorkflowViewer}     from '../../project-installation/workflow-viewer';

@autoinject()
export class DeveloperModal {
  project;
  workflowViewer: WorkflowViewer;

  constructor(private dialogController: DialogController,
              private taskManager: TaskManager,
              private selectedProject: SelectedProject,
              private state: ApplicationState) {
    this.project = selectedProject.current;
  }

  createDummyTasks() {
    var firstPromise;
    var timeouts = [];
    let first = new Task(this.selectedProject.current, 'first task', () => {
      return new Promise(r => {
        setTimeout(() => {
         if (!first.finished) r(); 
        }, 20000);
        
        // for(let x = 1; x <= 1000; x++) {
        //   setTimeout(() => first.addTaskLog('output'), x * 10);
        // }

        for(let x = 1; x <= 80; x++) {
          setTimeout(() => first.addTaskLog('output'), x * 250);
        }

      });
    });
    first.stoppable = true;
    first.stop = async () => {};
    this.taskManager.addTask(this.selectedProject.current, first);

    
    let second = new Task(this.selectedProject.current, 'second task', () => {
      return new Promise(r => {
        setTimeout(() => {
         if (!second.finished) r(); 
        }, 10000);

        for(let x = 1; x <= 10; x++) {
          setTimeout(() => second.addTaskLog('output'), x * 1000);
        }
      });
    });
    second.dependsOn = first;
    second.stoppable = true;
    second.stop = async () => {};
    // this.taskManager.addTask(this.selectedProject.current, second);

    this.taskManager.startTask(first);
  }

  startWorkflow() {
    this.workflowViewer.start();
  }

  throwError() {
    throw new Error('something terrible has happened');
  }
}