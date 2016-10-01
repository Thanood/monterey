import {DialogController} from 'aurelia-dialog';
import {WorkflowContext}  from './workflow-context';
import {Workflow}         from './workflow';
import * as activities    from './activities.json!';
import {MontereyRegistries, Settings, autoinject, observable} from '../shared/index';

/**
 * ScaffoldProject is the wizard in which the scaffolding process takes place. ScaffoldProject
 * takes care of propogating next/previous events to the scaffolding Workflow
 */
@autoinject()
export class ScaffoldProject {
  context: WorkflowContext;
  workflow: Workflow;
  state: any;
  loading = false;
  templates: Array<ProjectTemplate> = [];
  @observable selectedTemplate: ProjectTemplate;

  constructor(private dialog: DialogController,
              private registries: MontereyRegistries,
              private settings: Settings) {}

  async attached() {
    this.loading = true;
    await this.fillTemplateList();
    this.reset();
    this.loading = false;
  }

  reset() {
    this.workflow = new Workflow(JSON.parse(JSON.stringify(activities.activities)));
    this.context = this.workflow.context;
    this.state = this.context.state;

    // restore selected project folder of previous session
    if (this.settings.getValue('new-project-folder')) {
      this.state.path = this.settings.getValue('new-project-folder');
    }

    if (this.selectedTemplate && this.selectedTemplate.state) {

      let clone = JSON.parse(JSON.stringify(this.selectedTemplate.state));

      Object.assign(this.state, clone, {
        source: this.selectedTemplate.source
      });
    }

    this.workflow.next(1);
  }

  async fillTemplateList() {
    this.templates = [];
    this.templates.push({
      name: 'Aurelia-CLI',
      source: 'cli',
      id: 1,
      state: {
        name: 'aurelia-app'
      }
    });

    let id = 2;

    let skeletons = await this.registries.getTemplates();

    skeletons.forEach(skeleton => {
      this.templates.push({
        name: skeleton.name,
        source: 'skeleton',
        state: {
          // set the default name of the project to the name of the skeleton
          name: skeleton.name,
          github: skeleton
        },
        id: id
      });

      id++;
    });


    this.templates.push({
      name: 'GitHub',
      source: 'github',
      id: id,
      state: {
        name: 'aurelia-app',
        github: {}
      }
    });

    this.selectedTemplate = this.templates[0];
  }

  switchTemplate(template: ProjectTemplate) {
    if (!this.workflow.isFirstScreen) {
      if (!this._confirm('Are you sure? Progress will be lost')) {
        return;
      }
    }

    this.selectedTemplate = template;
  }

  close() {
    if (!this.workflow.isFirstScreen) {
      if (!this._confirm('Are you sure? Progress will be lost')) {
        return;
      }
    }

    this.dialog.cancel();
  }

  _confirm(msg) {
    return confirm(msg);
  }

  async next() {
    await this.context.next();

    if (this.context.workflow.isLastStep) {
      this.dialog.ok(this.context.project);
    }
  }

  selectedTemplateChanged() {
    this.reset();
  }
}

export interface ProjectTemplate {
  name: string;
  source: string;
  state?: any;
  id: number;
}