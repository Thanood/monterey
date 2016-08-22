import {Plugin}        from '../../../../src/plugins/webpack/index';
import {Project}       from '../../../../src/shared/project';
import {initializePAL, FS} from 'monterey-pal';

describe('Webpack plugin', () => {
  let plugin: Plugin;
  let fs;

  beforeEach(() => {
    FS.join = (...args) => Array.prototype.slice.call(args).join('/')
    plugin = new Plugin();
  });

  it('finds webpack.config.js automatically', (r) => {
    let project = new Project();
    project.path = 'C:/dir/my-project';

    FS.fileExists = async (path) => {
      if (path === 'C:/dir/my-project/webpack.config.js') {
        return true;
      }
      return false; 
    };

    plugin.evaluateProject(project)
    .then(() => {
      expect(project.webpackConfigPath).toBe('C:/dir/my-project/webpack.config.js');
      r();
    });
  });
});