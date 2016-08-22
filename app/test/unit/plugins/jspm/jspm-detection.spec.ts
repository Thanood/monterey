import {JSPMDetection}     from '../../../../src/plugins/jspm/jspm-detection';
import {Project}           from '../../../../src/shared/project';
import {initializePAL, FS} from 'monterey-pal';

describe('JSPM detection', () => {
  let sut: JSPMDetection;
  let fs;

  beforeEach(() => {
    FS.join = (...args) => Array.prototype.slice.call(args).filter(x => x !== '').join('/');
    sut = new JSPMDetection();
  });

  it('getJspm017Path returns correct path to the config', () => {
    // take into account the baseURL
    let project = new Project();
    project.path = 'C:/dir/my-project';
    let packageJSON = JSON.parse('{ "jspm": { "directories": { "baseURL": "base-url" } } }');
    expect(sut.getJspm017Path(project, packageJSON)).toBe('C:/dir/my-project/base-url/jspm.config.js');


    // without baseURL
    project = new Project();
    project.path = 'C:/dir/my-project';
    packageJSON = JSON.parse('{ "jspm": { } }');
    expect(sut.getJspm017Path(project, packageJSON)).toBe('C:/dir/my-project/jspm.config.js');
  });



  it('getJspm016Path returns correct path to the config', () => {
    // take into account the baseURL
    let project = new Project();
    project.path = 'C:/dir/my-project';
    let packageJSON = JSON.parse('{ "jspm": { "directories": { "baseURL": "base-url" } } }');
    expect(sut.getJspm016Path(project, packageJSON)).toBe('C:/dir/my-project/base-url/config.js');


    // without baseURL
    project = new Project();
    project.path = 'C:/dir/my-project';
    packageJSON = JSON.parse('{ "jspm": { } }');
    expect(sut.getJspm016Path(project, packageJSON)).toBe('C:/dir/my-project/config.js');
  });

  it('findJspmVersion does not do anything without a dependency/devdependecy in package.json', () => {
    let project = new Project();
    let packageJSON = JSON.parse('{ }');
    
    sut.findJspmVersion(project, packageJSON);

    expect(project.jspmVersion).toBeUndefined();
  });

  it('findJspmVersion looks in devDependencies for the version', () => {
    let project = new Project();
    let packageJSON = JSON.parse('{ "devDependencies": { "jspm": "0.16.15" } }');
    
    sut.findJspmVersion(project, packageJSON);

    expect(project.configJsPath).toBeUndefined();
    expect(project.jspmVersion).toBe("0.16.15");
  });

  it('findJspmVersion looks in dependencies for the version', () => {
    let project = new Project();
    let packageJSON = JSON.parse('{ "dependencies": { "jspm": "0.16.15" } }');
    
    sut.findJspmVersion(project, packageJSON);

    expect(project.configJsPath).toBeUndefined();
    expect(project.jspmVersion).toBe("0.16.15");
  });


  it('findJspmConfig looks for config.js file if version cannot be detected otherwise', (r) => {
    let project = new Project();
    project.packageJSONPath = 'C:/dir/my-project/package.json';
    project.path = 'C:/dir/my-project';

    FS.readFile = async (filePath) => '{ "jspm": { } }'
    FS.fileExists = async (path) => {
      if (path === 'C:/dir/my-project/config.js') {
        return true;
      }
      return false; 
    };

    sut.findJspmConfig(project)
    .then(() => {
      expect(project.configJsPath).toBe('C:/dir/my-project/config.js');
      expect(project.jspmVersion).toBe('^0.16.0');
      r();
    }).catch(e => r.fail(e));
  });


  it('findJspmConfig looks for jspm.config.js file if version cannot be detected otherwise', (r) => {
    let project = new Project();
    project.packageJSONPath = 'C:/dir/my-project/package.json';
    project.path = 'C:/dir/my-project';

    FS.readFile = async (filePath) => '{ "jspm": { } }'
    FS.fileExists = async (path) => {
      if (path === 'C:/dir/my-project/jspm.config.js') {
        return true;
      }
      return false; 
    };

    sut.findJspmConfig(project)
    .then(() => {
      expect(project.configJsPath).toBe('C:/dir/my-project/jspm.config.js');
      expect(project.jspmVersion).toBe('^0.17.0');
      r();
    }).catch(e => r.fail(e));
  });


  it('findJspmConfig gets jspm 0.16 version from the jspm version in package.json', (r) => {
    let project = new Project();
    project.packageJSONPath = 'C:/dir/my-project/package.json';
    project.path = 'C:/dir/my-project';

    FS.readFile = async (filePath) => '{ "jspm": { }, "dependencies": { "jspm": "0.16.15" } }';

    sut.findJspmConfig(project)
    .then(() => {
      expect(project.configJsPath).toBe('C:/dir/my-project/config.js');
      expect(project.jspmVersion).toBe('0.16.15');
      r();
    }).catch(e => r.fail(e));
  });


  it('findJspmConfig gets jspm 0.17 version from the jspm version in package.json', (r) => {
    let project = new Project();
    project.packageJSONPath = 'C:/dir/my-project/package.json';
    project.path = 'C:/dir/my-project';

    FS.readFile = async (filePath) => '{ "jspm": { }, "dependencies": { "jspm": "0.17.03" } }';

    sut.findJspmConfig(project)
    .then(() => {
      expect(project.configJsPath).toBe('C:/dir/my-project/jspm.config.js');
      expect(project.jspmVersion).toBe('0.17.03');
      r();
    }).catch(e => r.fail(e));
  });
});