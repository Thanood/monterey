import {WorkflowContext} from './workflow-context';
import {FS, Settings, ValidationController, ValidationRules, inject, NewInstance} from '../shared/index';

/**
 * The ProjectFolder screen asks the user where the project should be created.
 */
@inject(NewInstance.of(ValidationController), Settings)
export class ProjectFolder {
  state: any;

  constructor(private validation: ValidationController,
              private settings: Settings) {
  }

  activate(model: { context: WorkflowContext }) {
    model.context.onNext(() => this.next());

    this.state = model.context.state;

    ValidationRules
    .ensure('path').required()
    .on(this.state);
  }

  async next() {
    if (!this.settings.getValue('new-project-folder')) {
      this.settings.setValue('new-project-folder', this.state.path);
      await this.settings.save();
    }

    return this.validation.validate().length === 0;
  }

  async directoryBrowser() {
    let path = await FS.showOpenDialog({
      title: 'Select folder where the Aurelia project will be created in',
      properties: ['openDirectory']
    });

    if (path && path.length > 0) {
      this.state.path = path[0];
    }
    this.state.folder = this.state.path;
  }
}