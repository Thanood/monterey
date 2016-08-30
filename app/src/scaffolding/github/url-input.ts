import {inject, observable, NewInstance} from 'aurelia-framework';
import {ValidationRules}      from 'aurelia-validatejs';
import {ValidationController} from 'aurelia-validation';
import {GithubAPI}            from '../../shared/github-api';
import {IStep}                from '../istep';

@inject(NewInstance.of(ValidationController), GithubAPI)
export class UrlInput {
  step: IStep;
  state;
  slug: string;
  @observable repo: string;
  templates = [];
  subdirectories = [];
  error: string;
  loading: boolean = false;

  constructor(private validation: ValidationController,
              private githubAPI: GithubAPI) {
  }

  async activate(model) {
    this.state = model.state;
    this.step = model.step;
    this.step.execute = () => this.execute();
    this.step.previous = () => this.previous();

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
        for(let x = 0; x < contents.length; x++) {
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

  async previous() {
    return {
      goToPreviousStep: true
    };
  }

  async execute() {
    if (this.validation.validate().length > 0) {
      return {
        goToNextStep: false
      };
    }

    if (this.state.github.subfolder) {
      this.state.name = this.state.github.subfolder;
    } else {
      this.state.name = this.slug.split('/')[1];
    }
    
    return {
      goToNextStep: true
    };
  }
}
