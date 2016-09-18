import {autoinject}       from 'aurelia-framework';
import {Project}          from './project';
import {ApplicationState} from './application-state';

/**
 * Singleton object that knows which project is currently selected.
 * Uses the observer pattern to notify when the selected project changes
 */
@autoinject()
export class SelectedProject {
  current: Project;
  callbacks: Array<(project: Project) => void> = [];

  constructor(private state: ApplicationState) {}

  onChange(callback: (project: Project) => void) {
    this.callbacks.push(callback);
    return {
      dispose: () => {
        this.callbacks.splice(this.callbacks.indexOf(callback), 1);
      }
    };
  }

  set(project: Project) {
    this.current = project;
    this.callbacks.forEach(cb => cb(this.current));

    this.state.selectedProjectPath = this.current ? this.current.path : null;
    this.state._save();
  }
}