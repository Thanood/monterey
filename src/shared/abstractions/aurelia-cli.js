// const path = fs.getModulePath('aurelia-cli');
// const ProjectTemplate = require(path + 'lib/commands/new/project-template').ProjectTemplate;

export class AureliaCLI {
  async create(model) {
    let ProjectTemplate = require('aurelia-cli/lib/commands/new/project-template').ProjectTemplate;

    let options = {
      hasFlag: function() {
        return false;
      }
    };

    let project = new ProjectTemplate(model, options);

    let configurePlatform = require(`aurelia-cli/lib/commands/new/platforms/${model.platform.id}`);
    configurePlatform(project, options);

    let configureTranspiler = require(`aurelia-cli/lib/commands/new/transpilers/${model.transpiler.id}`);
    configureTranspiler(project, options);

    let configureMarkupProcessor = require(`aurelia-cli/lib/commands/new/markup-processors/${model.markupProcessor.id}`);
    configureMarkupProcessor(project, options);

    let configureCSSProcessor = require(`aurelia-cli/lib/commands/new/css-processors/${model.cssProcessor.id}`);
    configureCSSProcessor(project, options);

    let configureUnitTestRunner = require(`aurelia-cli/lib/commands/new/unit-test-runners/${model.unitTestRunner.id}`);
    configureUnitTestRunner(project, options);

    let configureEditor = require(`aurelia-cli/lib/commands/new/editors/${model.editor.id}`);
    configureEditor(project, options);

    let pathToAddProject = model.path;
    project.create({}, pathToAddProject);
  }

  async install(model) {
    console.log('install', model);
  }
}
