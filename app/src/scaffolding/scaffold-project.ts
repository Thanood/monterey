import {autoinject, bindable} from 'aurelia-framework';
import {DialogController}     from 'aurelia-dialog';
import {FS, NPM}              from 'monterey-pal';
import {ProjectManager}       from '../shared/project-manager';
import {MontereyRegistries}   from '../shared/monterey-registries';
import {Workflow}             from './workflow';
import * as activities        from './activities.json!';

@autoinject()
export class ScaffoldProject {
  state: any = {};
  workflow: Workflow;
  @bindable selectedTemplate: ProjectTemplate;
  templates: Array<ProjectTemplate> = [];
  loading = false;

  constructor(private dialog: DialogController,
              private projectManager: ProjectManager,
              private registries: MontereyRegistries) {
  }

  async fillTemplateList() {
    this.templates = [];
    this.templates.push({
      name: 'Aurelia-CLI',
      source: 'cli',
      id: 1
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
          skeleton: skeleton
        },
        id: id
      });

      id++;
    });


    this.templates.push({
      name: 'ZIP',
      source: 'zip',
      id: id
    });
  }

  async attached() {
    this.loading = true;
    await this.fillTemplateList();
    this.selectedTemplate = this.templates[0];
    this.loading = false;
  }

  async next() {
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
    this.state = Object.assign({}, this.selectedTemplate.state || {}, {
      source: this.selectedTemplate.source
    });
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