import {Plugin}        from '../../../../src/plugins/gulp/index';
import {Project}       from '../../../../src/shared/project';
import {Container}     from 'aurelia-framework';
import {initializePAL, FS} from 'monterey-pal';
import '../../setup';

describe('Gulp plugin', () => {
  let plugin: Plugin;
  let fs;

  beforeEach(() => {
    FS.join = (...args) => Array.prototype.slice.call(args).join('/')
    FS.getFolderPath = (path: string) => {
      let split = path.split('/');
      let splice = split.splice(0, split.length - 1);
      return splice.join('/');
    };
    plugin = new Container().get(Plugin);
  });

  let paths = [
    'C:/dir/my-project/gulpfile.js',
    'C:/dir/my-project/src/skeleton/gulpfile.js',
    'C:/dir/my-project/src/skeleton-navigation-esnext-vs/gulpfile.js',
    'C:/dir/my-project/src/skeleton-navigation-typescript-vs/gulpfile.js',
    'C:/dir/my-project/some/folder/structure/gulpfile.js',
  ];

  for(let x = 0; x < paths.length; x++) {
    it(`finds gulpfile.js in ${paths[x]}`, (r) => {
      let project = new Project();
      project.path = 'C:/dir/my-project';
      project.packageJSONPath = 'C:/dir/my-project/some/folder/structure/package.json';

      FS.fileExists = async (path) => {
        if (path === paths[x]) {
          return true;
        }
        return false;
      };

      plugin.evaluateProject(project)
      .then(() => {
        expect(project.gulpfile).toBe(paths[x]);
        r();
      }).catch(e => r.fail(e))
    })
  }
});