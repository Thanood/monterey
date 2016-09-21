import {WorkflowContext} from '../workflow-context';
import {GithubAPI, ValidationController, inject, observable, NewInstance, ValidationRules} from '../../shared/index';

@inject(NewInstance.of(ValidationController), GithubAPI)
export class UrlInput {
  state;
  slug: string;
  @observable repo: string;
  templates = [];
  subdirectories = [];
  error: string;
  loading: boolean = false;
  context: WorkflowContext;

  constructor(private validation: ValidationController,
              private githubAPI: GithubAPI) {
  }

  async activate(model: { context: WorkflowContext }) {
    this.context = model.context;
    this.context.onNext(() => this.next());
    this.state = model.context.state;

    if (this.state.github.repo) {
      this.repo = `https://github.com/${this.state.github.repo}`;
    }

    await this.githubAPI.confirmAuth();
  }

  attached() {
    ValidationRules
      .ensure('repo').presence()
      .on(this.state.github);
  }

  async repoChanged() {
    let matches = this.repo.match(/github.com\/(.*\/.*?)(.git)?$/);
    this.error = '';
    this.slug = '';
    this.state.github.repo = '';

    if (matches && (this.repo.match(/\//g) || []).length === 4 && matches.length > 2) {
      this.slug = matches[1];
      this.state.github.repo = this.slug;

      await this.lookupSubfolders();
    } else {
      this.error = 'Incorrect github url. Format: https://github.com/some-username/some-repository';
    }
  }

  async lookupSubfolders() {
    this.loading = true;
    this.subdirectories = [];

    try {
      let response = await this.githubAPI.getContents(this.slug);
      if (response.status === 404) {
        this.error = 'Did not find this repository';
      } else {
        let contents = await response.json();
        for (let x = 0; x < contents.length; x++) {
          let fileOrDir = contents[x];
          if (fileOrDir.type === 'dir') {
            this.subdirectories.push(fileOrDir.name);
          }
        }
      }
    } catch (e) {
      console.log(e);
      this.error = 'Could not get repository contents';
    }

    this.loading = false;
  }

  async next() {
    if (this.validation.validate().length > 0) {
      return false;
    }

    if (this.state.github.subfolder) {
      this.state.name = this.state.github.subfolder;
    } else {
      this.state.name = this.slug.split('/')[1];
    }

    return true;
  }
}
