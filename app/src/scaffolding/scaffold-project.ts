import {autoinject, bindable} from 'aurelia-framework';
import {DialogController}     from 'aurelia-dialog';
import {FS, NPM}              from 'monterey-pal';
import {Workflow}             from './workflow';
import * as activities        from './activities.json!';
import {ProjectManager, MontereyRegistries, Settings} from '../shared/index';

@autoinject()
export class ScaffoldProject {
  state: any = {};
  workflow: Workflow;
  title: string = 'Create new application';
  closeBtnText: string = 'Close';
  @bindable selectedTemplate: ProjectTemplate;
  templates: Array<ProjectTemplate> = [];
  loading = false;

  constructor(private dialog: DialogController,
              private projectManager: ProjectManager,
              private settings: Settings,
              private registries: MontereyRegistries) {
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
  }

  async attached() {
    this.loading = true;
    await this.fillTemplateList();
    this.selectedTemplate = this.templates[0];
    this.loading = false;
  }

  async next() {
    this.title = 'Create new application';
    this.closeBtnText = 'Close';
    await this.workflow.next();
  }

  switchTemplate(template: ProjectTemplate) {
    if (this.workflow && !this.workflow.isFirst) {
      if (!confirm('Are you sure? Progress will be lost')) {
        return;
      }
    }

    this.selectedTemplate = template;
  }

  selectedTemplateChanged() {
    let template = this.selectedTemplate.state ? JSON.parse(JSON.stringify(this.selectedTemplate.state)) : {};

    this.state = Object.assign({}, template || {}, {
      source: this.selectedTemplate.source
    });

    if (this.settings.getValue('new-project-folder')) {
      this.state.path = this.settings.getValue('new-project-folder');
    }

    // copy activities JSON so multiple sessions can be started without new session inheriting answers
    this.workflow = new Workflow(JSON.parse(JSON.stringify(activities)), this.state);
  }

  async close() {
    if (!this.workflow.isLast) {
      if (!confirm('Are you sure?')) {
        return;
      }
    }

    let curStep = this.workflow.currentStep;
    if (curStep && curStep.project) {
      await curStep.execute();

      // save the project directory so we can use that as default in
      // next sessions
      if (!this.settings.getValue('new-project-folder')) {
        this.settings.setValue('new-project-folder', this.state.folder);
        await this.settings.save();
      }

      this.dialog.ok(curStep.project);
    } else {
      this.dialog.cancel();
    }
  }
}

export interface ProjectTemplate {
  name: string;
  source: string;
  state?: any;
  id: number;
}