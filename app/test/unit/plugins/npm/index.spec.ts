import {Plugin}        from '../../../../src/plugins/npm/index';
import {Project}       from '../../../../src/shared/project';
import {initializePAL, FS} from 'monterey-pal';
import {Container}     from 'aurelia-framework';
import '../../setup';

describe('NPM plugin', () => {
  let plugin: Plugin;
  let fs;

  beforeEach(() => {
    FS.join = (...args) => Array.prototype.slice.call(args).join('/')
    FS.getFolderPath = (path: string) => {
      let split = path.split('/');
      let splice = split.splice(0, split.length - 1);
      return splice.join('/');
    };
    FS.normalize = (path: string) => path;
    plugin = new Container().get(Plugin);
  });

  let paths = [
    'C:/dir/my-project/src/skeleton/package.json',
    'C:/dir/my-project/src/skeleton-navigation-esnext-vs/package.json',
    'C:/dir/my-project/src/skeleton-navigation-typescript-vs/package.json'
  ];

  for(let x = 0; x < paths.length; x++) {
    it(`finds package.json in ${paths[x]}`, (r) => {
      let project = new Project();
      project.path = 'C:/dir/my-project';

      FS.showOpenDialog = async (config) => Promise.resolve([]);
      FS.readFile = async (path: string) => '{ }';
      FS.fileExists = async (path) => {
        if (path === paths[x]) {
          return true;
        }
        return false;
      };

      plugin.evaluateProject(project)
      .then(() => {
        expect(project.packageJSONPath).toBe(paths[x]);
        r();
      }).catch(e => r.fail(e))
    })
  }

  it('takes the project name out of package.json', (r) => {
    let project = new Project();
    project.path = 'c:/dir/my-project';

    FS.showOpenDialog = async (config) => Promise.resolve([]);
    FS.readFile = async (path: string) => '{ "name": "my-project-name" }';
    FS.fileExists = async (path) => {
      if (path === 'c:/dir/my-project/package.json') {
        return true;
      }
      return false;
    };

    plugin.evaluateProject(project)
    .then(() => {
      expect(project.name).toBe('my-project-name');
      r();
    }).catch(e => r.fail(e))
  });

  it('if the project has a name, which is different than what\'s in package.json, then overwrite package.json', (r) => {
    let project = new Project();
    project.path = 'c:/dir/my-project';
    project.name = 'skeleton-esnext';

    FS.showOpenDialog = async (config) => Promise.resolve([]);
    FS.readFile = async (path: string) => '{ "name": "my-project-name" }';
    let writeFileSpy = jasmine.createSpy('writeFile').and.returnValue(Promise.resolve());;
    FS.writeFile = writeFileSpy;
    FS.fileExists = async (path) => {
      if (path === 'c:/dir/my-project/package.json') {
        return true;
      }
      return false;
    };

    plugin.evaluateProject(project)
    .then(() => {
      expect(writeFileSpy).toHaveBeenCalled();
      expect(writeFileSpy.calls.argsFor(0)[0]).toBe('c:/dir/my-project/package.json');
      expect(JSON.parse(writeFileSpy.calls.argsFor(0)[1]).name).toBe('skeleton-esnext');
      
      r();
    }).catch(e => r.fail(e))
  });


  // https://docs.npmjs.com/files/package.json#name        
  let invalidNames = [
    // too long (also has uppercase letters)
    {
      name: 'zWv39S0MLeiFH6CZWHJLhCIxYPljTaj8FS835ZGnQK35j82sIp8kxrmqClxWbhCUTqwiK34UAP4tEeBfY6lsvxMq7Hgj21qUTBhBbI9aPUFSpcZ6ZnEXWPSUTGOyPFA3sizcCqe7swTzpKikZLfr2tSoy3m4XL6aQDtIMRuOFo9v6IgxuZ9qMpDFw1IrSj1OL2yBcjA2yHk6luJwc8SfJuUDlkfaZpfEPabXLRwzvbhVDMZQ4g5fLXAJyA',
      expected: 'zwv39s0mleifh6czwhjlhcixypljtaj8fs835zgnqk35j82sip8kxrmqclxwbhcutqwik34uap4teebfy6lsvxmq7hgj21qutbhbbi9apufspcz6znexwpsutgoypfa3sizccqe7swtzpkikzlfr2tsoy3m4xl6aqdtimruofo9v6igxuz9qmpdfw1irsj1ol2ybcja2yhk6lujwc8sfju'
    },
    
    // starts with dot
    {
      name: '.my-project',
      expected: 'my-project'
    },

    // starts with underscore
    {
      name: '_my-project',
      expected: 'my-project',
    },    

    // has dot but not at the start
    {
      name: 'my.project',
      expected: 'my.project'
    },

    // has underscore but not at the start
    {
      name: 'my_project',
      expected: 'my_project',
    },

    // Uppercased letters
    {
      name: 'MY-PROJECT',
      expected: 'my-project',
    },

    // non URL safe characters,
    {
      name: 'my project',
      expected: 'my-project',
    },
    {
      name: '~my-project',
      expected: 'my-project',
    }
  ];

  invalidNames.forEach(invalidName => {
    it(`writes only valid package names to package.json (${invalidName.name})`, (r) => {
        let project = new Project();
        project.path = 'c:/dir/my-project';
        project.name = invalidName.name;

        FS.showOpenDialog = async (config) => Promise.resolve([]);
        FS.readFile = async (path: string) => '{ "name": "my-project-name" }';
        let writeFileSpy = jasmine.createSpy('writeFile').and.returnValue(Promise.resolve());;
        FS.writeFile = writeFileSpy;
        FS.fileExists = async (path) => {
          if (path === 'c:/dir/my-project/package.json') {
            return true;
          }
          return false;
        };

        plugin.evaluateProject(project)
        .then(() => {
          expect(writeFileSpy).toHaveBeenCalled();
          expect(writeFileSpy.calls.argsFor(0)[0]).toBe('c:/dir/my-project/package.json');
          expect(JSON.parse(writeFileSpy.calls.argsFor(0)[1]).name).toBe(invalidName.expected);
          
          r();
        }).catch(e => r.fail(e))
      });
  });
  
});