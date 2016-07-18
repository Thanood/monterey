import {ProjectManager} from '../../src/shared/project-manager';
import {initializePAL} from 'monterey-pal';

describe('ProjectManager removeProject', () => {
  let sut: ProjectManager;
  let state;

  beforeEach(() => {
    state = {
      projects: [],
      _save: jasmine.createSpy('_save')
    };
    sut = new ProjectManager(null, state);
  });

  it('removes project from state', () => {
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

    sut.removeProject(deleteProject);
    expect(state.projects.length).toBe(2);
    expect(state.projects.indexOf(deleteProject)).toBe(-1);
  });

  it('persists changes to session', () => {
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

    sut.removeProject(deleteProject);
    expect(state._save).toHaveBeenCalled();
  });
});


describe('ProjectManager hasProjects', () => {
  let sut: ProjectManager;
  let state;

  beforeEach(() => {
    state = {
      projects: []
    };
    sut = new ProjectManager(null, state);
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

  beforeEach(() => {
    state = {
      projects: []
    };
    sut = new ProjectManager(null, state);
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

  beforeEach(() => {
    state = {
      projects: []
    };
    sut = new ProjectManager(null, state);
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

  beforeEach(() => {
    state = {
      projects: [],
      _save: jasmine.createSpy('_save'),
    };
    pluginManager = {
      notifyOfAddedProject: jasmine.createSpy('notifyOfAddedProject'),
      evaluateProject: jasmine.createSpy('evaluateProject').and.callFake(proj => {
        return new Promise(resolve => {
          resolve(proj);
        });
      })
    };
    sut = new ProjectManager(pluginManager, state);
  });

  it('has all plugins evaluate the project', () => {
    let project = {
      path: ''
    };
    sut.addProject(project);

    expect(pluginManager.evaluateProject).toHaveBeenCalledWith(project);
  });

  it('expects a PackageJSONPath', async (d) => {
    let toastrSpy = spyOn((<any>window).toastr, 'error');
    let project = {
      path: ''
    };
    let result = await sut.addProject(project);

    expect(toastrSpy).toHaveBeenCalledWith('location of package.json was not found, the project will not be added to Monterey');
    expect(result).toBe(false);

    d();
  });

  it('expects a name', async (d) => {
    let toastrSpy = spyOn((<any>window).toastr, 'error');
    let project = {
      path: '',
      packageJSONPath: 'C:/test/package.json'
    };
    let result = await sut.addProject(project);

    expect(toastrSpy).toHaveBeenCalledWith('project name was not found, the project will not be added to Monterey');
    expect(result).toBe(false);

    d();
  });

  it('adds project to state', async (d) => {
    let toastrSpy = spyOn((<any>window).toastr, 'error');
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
    let toastrSpy = spyOn((<any>window).toastr, 'error');
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
    let toastrSpy = spyOn((<any>window).toastr, 'error');
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

  beforeEach(() => {
    state = {
      projects: [],
      _save: jasmine.createSpy('_save'),
    };
    sut = new ProjectManager(null, state);
    fs = {
      fileExists: jasmine.createSpy('fileExists').and.callFake(param => {
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
      packageJSONPath: '/existing'
    }, {
      packageJSONPath: '/nonexisting'
    }];

    await sut.verifyProjectsExistence();

    expect(state.projects.length).toBe(1);
    expect(state.projects.find(p => p.packageJSONPath === '/nonexisting')).toBe(undefined);

    d();
  });

  it('persists changes to session', async (d) => {

    state.projects = [{
      packageJSONPath: '/existing'
    }, {
      packageJSONPath: '/nonexisting'
    }];

    await sut.verifyProjectsExistence();

    expect(state._save).toHaveBeenCalled();

    // when no projects have been removed / moved, don't save state
    state._save.calls.reset();

    state.projects = [{
      packageJSONPath: '/existing'
    }];

    await sut.verifyProjectsExistence();

    expect(state._save).not.toHaveBeenCalled();

    d();
  });

  it('warns user that projects have been removed', async (d) => {

    let toastrSpy = spyOn((<any>window).toastr, 'warning');

    state.projects = [{
      name: 'foo',
      packageJSONPath: '/existing'
    }, {
      name: 'bar',
      packageJSONPath: '/nonexisting'
    }, {
      name: 'baz',
      packageJSONPath: '/nonexisting'
    }];

    await sut.verifyProjectsExistence();

    expect(toastrSpy).toHaveBeenCalledWith('The following projects were removed/relocated and will be removed from Monterey:\r\n bar, baz');

    d();
  });
});