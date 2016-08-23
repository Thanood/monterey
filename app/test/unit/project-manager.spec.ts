import {ProjectManager} from '../../src/shared/project-manager';
import {initializePAL} from 'monterey-pal';

describe('ProjectManager removeProject', () => {
  let sut: ProjectManager;
  let state;
  let ea;

  beforeEach(() => {
    state = {
      projects: [],
      _save: jasmine.createSpy('_save').and.returnValue(new Promise(resolve => resolve()))
    };
    ea = {
      publish: (msg) => {}
    };
    sut = new ProjectManager(null, state, null, ea);
  });

  it('removes project from state', async (d) => {
    let deleteProject = {
      name: 'foo'
    };
    state.projects.push({
      name: 'My project'
    });
    state.projects.push(deleteProject);
    state.projects.push({
      name: 'bar'
    });

    await sut.removeProject(deleteProject);
    expect(state.projects.length).toBe(2);
    expect(state.projects.indexOf(deleteProject)).toBe(-1);

    d();
  });

  it('persists changes to session', async (d) => {
    let deleteProject = {
      name: 'foo'
    };
    state.projects.push({
      name: 'My project'
    });
    state.projects.push(deleteProject);
    state.projects.push({
      name: 'bar'
    });

    await sut.removeProject(deleteProject);
    expect(state._save).toHaveBeenCalled();
    d();
  });
});


describe('ProjectManager hasProjects', () => {
  let sut: ProjectManager;
  let state;
  let ea;

  beforeEach(() => {
    state = {
      projects: []
    };
    ea = {
      publish: (msg) => {}
    };
    sut = new ProjectManager(null, state, null, ea);
  });

  it('returns whether the projectmanager has any projects registered', () => {
    expect(sut.hasProjects()).toBe(false);

    state.projects.push({
      name: 'Foo'
    });

    expect(sut.hasProjects()).toBe(true);
  });
});


describe('ProjectManager addProjectByWizardState', () => {
  let sut: ProjectManager;
  let state;
  let ea;

  beforeEach(() => {
    state = {
      projects: []
    };
    ea = {
      publish: (msg) => {}
    };
    sut = new ProjectManager(null, state, null, ea);
  });

  it('calls addProject with project definition based on wizard state', () => {
    let addProjectSpy = spyOn(sut, 'addProject');

    sut.addProjectByWizardState({
      installNPM: true,
      path: 'c:/some/dir',
      name: 'foo'
    });

    expect(addProjectSpy).toHaveBeenCalledWith({
      installNPM: true,
      path: 'c:/some/dir',
      name: 'foo'
    });
  });
});


describe('ProjectManager addProjectByPath', () => {
  let sut: ProjectManager;
  let state;
  let ea;

  beforeEach(() => {
    state = {
      projects: []
    };
    ea = {
      publish: (msg) => {}
    };
    sut = new ProjectManager(null, state, null, ea);
  });

  it('calls addProject with project path', () => {
    let addProjectSpy = spyOn(sut, 'addProject');

    sut.addProjectByPath('c:/some/dir');

    expect(addProjectSpy).toHaveBeenCalledWith({
      path: 'c:/some/dir'
    });
  });
});


describe('ProjectManager addProject', () => {
  let sut: ProjectManager;
  let state;
  let pluginManager;
  let notification;
  let ea;

  beforeEach(() => {
    state = {
      projects: [],
      _save: jasmine.createSpy('_save'),
    };
    ea = {
      publish: (msg) => {}
    };
    notification = {
      warning: jasmine.createSpy('warning'),
      error: jasmine.createSpy('error')
    };
    pluginManager = {
      notifyOfAddedProject: jasmine.createSpy('notifyOfAddedProject'),
      evaluateProject: jasmine.createSpy('evaluateProject').and.callFake(proj => {
        return new Promise(resolve => {
          resolve(proj);
        });
      })
    };
    initializePAL((fs) => {
      fs.getDirName = (path) => {
        let split = path.split('/');
        return split[split.length - 1];
      }
    });
    sut = new ProjectManager(pluginManager, state, notification, ea);
  });

  it('has all plugins evaluate the project', () => {
    let project = {
      path: ''
    };
    sut.addProject(project);

    expect(pluginManager.evaluateProject).toHaveBeenCalledWith(project);
  });

  it('sets project name to folder path if all else fails', async (d) => {
    let project = <any>{
      path: 'C:/test'
    };
    let result = await sut.addProject(project);

    expect(project.name).toBe('test');

    d();
  });

  it('adds project to state', async (d) => {
    let project = {
      path: '',
      packageJSONPath: 'C:/test/package.json',
      name: 'my app'
    };
    let result = await sut.addProject(project);

    expect(state.projects.length).toBe(1);
    expect(state.projects[0].name).toBe('my app');

    d();
  });

  it('notifies plugins of added project', async (d) => {
    let project = {
      path: '',
      packageJSONPath: 'C:/test/package.json',
      name: 'my app'
    };
    await sut.addProject(project);

    expect(pluginManager.notifyOfAddedProject).toHaveBeenCalled();

    d();
  });

  it('persists changes to session', async (d) => {
    let project = {
      path: '',
      packageJSONPath: 'C:/test/package.json',
      name: 'my app'
    };
    await sut.addProject(project);

    expect(state._save).toHaveBeenCalled();

    d();
  });
});

describe('ProjectManager verifyProjectsExistence', () => {
  let sut: ProjectManager;
  let state;
  let pal;
  let fs;
  let ea;
  let notification;

  beforeEach(() => {
    state = {
      projects: [],
      _save: jasmine.createSpy('_save'),
    };
    notification = {
      warning: jasmine.createSpy('warning')
    };
    ea = {
      publish: (msg) => {}
    };
    sut = new ProjectManager(null, state, notification, ea);
    fs = {
      folderExists: jasmine.createSpy('folderExists').and.callFake(param => {
        return new Promise(resolve => {
          if (param === '/existing') resolve(true);
          if (param === '/nonexisting') resolve(false);
        });
      })
    };
    initializePAL((_fs) => Object.assign(_fs, fs));
  });

  it('removes projects of whose package.json doesn\'t exist anymore', async (d) => {

    state.projects = [{
      path: '/existing'
    }, {
      path: '/nonexisting'
    }];

    await sut.verifyProjectsExistence();

    expect(state.projects.length).toBe(1);
    expect(state.projects.find(p => p.path === '/nonexisting')).toBe(undefined);

    d();
  });

  it('persists changes to session', async (d) => {

    state.projects = [{
      path: '/existing'
    }, {
      path: '/nonexisting'
    }];

    await sut.verifyProjectsExistence();

    expect(state._save).toHaveBeenCalled();

    // when no projects have been removed / moved, don't save state
    state._save.calls.reset();

    state.projects = [{
      path: '/existing'
    }];

    await sut.verifyProjectsExistence();

    expect(state._save).not.toHaveBeenCalled();

    d();
  });

  it('warns user that projects have been removed', async (d) => {
    state.projects = [{
      name: 'foo',
      path: '/existing'
    }, {
      name: 'bar',
      path: '/nonexisting'
    }, {
      name: 'baz',
      path: '/nonexisting'
    }];

    await sut.verifyProjectsExistence();

    expect(notification.warning).toHaveBeenCalledWith('The following projects were removed/relocated and will be removed from Monterey:\r\n bar, baz');

    d();
  });
});