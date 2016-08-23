import {Plugin}        from '../../../../src/plugins/aurelia-cli/index';
import {Project}       from '../../../../src/shared/project';
import {Container}     from 'aurelia-framework';
import {initializePAL, FS} from 'monterey-pal';
import '../../setup';

describe('Aurelia-cli plugin', () => {
  let plugin: Plugin;
  let fs;

  beforeEach(() => {
    FS.join = (...args) => Array.prototype.slice.call(args).join('/')
    plugin = new Container().get(Plugin);
  });

  it('finds aurelia.json file automatically', (r) => {
    let project = new Project();
    project.path = 'C:/dir/my-project';

    FS.fileExists = async (path) => {
      if (path === 'C:/dir/my-project/aurelia_project/aurelia.json') {
        return true;
      }
      return false; 
    };

    plugin.evaluateProject(project)
    .then(() => {
      expect(project.aureliaJSONPath).not.toBeUndefined();
      r();
    });
  });
});