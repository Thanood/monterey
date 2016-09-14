import {PluginManager} from '../../../src/shared/plugin-manager';
import {BasePlugin}    from '../../../src/plugins/base-plugin';
import {ApplicationState} from '../../../src/shared/application-state';
import {Project}          from '../../../src/shared/project';
import {Task}             from '../../../src/plugins/task-manager/task';
import {Workflow}         from '../../../src/plugins/workflow/workflow';
import {Phase}            from '../../../src/plugins/workflow/phase';
import {Step}             from '../../../src/plugins/workflow/step';

describe('PluginManager', () => {
  let pluginManager: PluginManager;

  beforeEach(() => {
    pluginManager = new PluginManager(null);
  });

  it('stores plugins in plugin array', () => {
    let plugin = new BasePlugin();
    pluginManager.registerPlugin(plugin);
    expect(pluginManager.plugins.length).toBe(1);
    expect(pluginManager.plugins.indexOf(plugin)).toBe(0);
  });
});


describe('PluginManager callbacks', () => {
  let pluginManager: PluginManager;

  beforeEach(() => {
    pluginManager = new PluginManager(null);

    for (let i = 0; i < 5; i++) {
      let plugin = new BasePlugin();
      plugin.evaluateProject = jasmine.createSpy('evaluateProject');
      plugin.getProjectInfoSections = jasmine.createSpy('getProjectInfoSections');
      plugin.getTiles = jasmine.createSpy('getTiles');
      plugin.onNewSession = jasmine.createSpy('onNewSession');
      plugin.onProjectAdd = jasmine.createSpy('onProjectAdd');
      pluginManager.registerPlugin(plugin);
    }
  });

  it('all plugins get notified of evaluateProject', async (d) => {
    let project = <any>{ path: '/my/project/path' };
    await pluginManager.evaluateProject(project);

    pluginManager.plugins.forEach(plugin => {
      expect(plugin.evaluateProject).toHaveBeenCalledWith(project);
    });

    d();
  });

  it('all plugins get notified when new session gets started', async (d) => {
    let state = new ApplicationState();
    await pluginManager.notifyOfNewSession(state);

    pluginManager.plugins.forEach(plugin => {
      expect(plugin.onNewSession).toHaveBeenCalledWith(state);
    });

    d();
  });

  it('all plugins get notified when new project gets added', async (d) => {
    let project = <any>{ path: '/my/project/path' };
    await pluginManager.notifyOfAddedProject(project);

    pluginManager.plugins.forEach(plugin => {
      expect(plugin.onProjectAdd).toHaveBeenCalledWith(project);
    });

    d();
  });

  it('all plugins can provide tiles', async (d) => {
    (<any>pluginManager.plugins[0].getTiles).and.returnValue([{ id: 1, name: 'a' }, { id: 2, name: 'b' }]);
    (<any>pluginManager.plugins[1].getTiles).and.returnValue([]);
    (<any>pluginManager.plugins[2].getTiles).and.returnValue([]);
    (<any>pluginManager.plugins[3].getTiles).and.returnValue([{ id: 3, name: 'c' }, { id: 4, name: 'd' }]);
    (<any>pluginManager.plugins[4].getTiles).and.returnValue([{ id: 5, name: 'e' }, { id: 6, name: 'f' }]);

    let project = <any>{ path: '/my/project/path' };
    try {
      let tiles = await pluginManager.getTilesForProject(project, false);

      expect(tiles.length).toBe(6);

      for (let i = 1; i < tiles.length; i++) {
        expect(tiles.find(x => x.id === i)).not.toBeUndefined();
      }

      d();
    } catch (e) {
      d.fail(e);
    }
  });
});


describe('PluginManager post install workflow resolver', () => {
  let pluginManager: PluginManager;
  let plugin1: BasePlugin;
  let plugin2: BasePlugin;

  beforeEach(() => {
    pluginManager = new PluginManager(null);

    plugin1 = new BasePlugin();
    plugin2 = new BasePlugin();

    pluginManager.registerPlugin(plugin1);
    pluginManager.registerPlugin(plugin2);
  });

  it ('calls all plugins to resolve the workflow', async (r) => {
    plugin1.resolvePostInstallWorkflow = jasmine.createSpy('resolvePostInstallWorkflow');
    plugin2.resolvePostInstallWorkflow = jasmine.createSpy('resolvePostInstallWorkflow');

    let workflow = new Workflow(null, null);
    let project = new Project();
    await pluginManager.resolvePostInstallWorkflow(project, workflow);

    expect(plugin1.resolvePostInstallWorkflow).toHaveBeenCalled();
    expect(plugin2.resolvePostInstallWorkflow).toHaveBeenCalled();
    r();
  });

  it('does multiple passes so that dependencies in the workflow can be resolved', async (r) => {
    plugin1.resolvePostInstallWorkflow = jasmine.createSpy('resolvePostInstallWorkflow');

    let workflow = new Workflow(null, null);
    let project = new Project();
    await pluginManager.resolvePostInstallWorkflow(project, workflow);

    expect((<jasmine.Spy>plugin1.resolvePostInstallWorkflow).calls.count()).toBe(3);
    r();
  });

  it('sorts steps by order', async (r) => {
    plugin1.resolvePostInstallWorkflow = async (project: Project, workflow: Workflow, pass) => {
      if (pass === 1) {
        let jspm = new Step('jspm install', 'jspm install', null);
        let npm = new Step('npm install', 'npm install', null);
        workflow.getPhase('dependencies').addStep(jspm);
        workflow.getPhase('dependencies').addStep(npm);
        // right now jspm has lower order than npm

        // now change the order, the plugin manager should sort based on the order
        workflow.getPhase('dependencies').moveAfter(jspm, npm);
      }
    };

    let workflow = new Workflow(null, null);
    workflow.addPhase(new Phase('dependencies'));
    let project = new Project();
    await pluginManager.resolvePostInstallWorkflow(project, workflow);

    expect(workflow.getPhase('dependencies').steps[0].identifier).toBe('npm install');
    r();
  });

  it('sets task dependencies after first pass, so that plugins can override these in 2nd and 3rd pass', async (r) => {
    plugin1.resolvePostInstallWorkflow = async (project: Project, workflow: Workflow, pass) => {
      if (pass === 1) {
        workflow.getPhase('dependencies').addStep(new Step('npm install', 'npm install', new Task(null)));
        workflow.getPhase('dependencies').addStep(new Step('jspm install', 'jspm install', new Task(null)));

        // first task of phase depends on last task of the phase before
        workflow.getPhase('run').addStep(new Step('typings install', 'typings install', new Task(null)));
      }
      if (pass === 2) {
        expect(workflow.getPhase('dependencies').steps[0].task.dependsOn).toBeUndefined();
        expect(workflow.getPhase('dependencies').steps[1].task.dependsOn).toBe(workflow.getPhase('dependencies').steps[0].task);

        expect(workflow.getPhase('run').steps[0].task.dependsOn).toBe(workflow.getPhase('dependencies').steps[1].task);
      }
    };

    let workflow = new Workflow(null, null);
    workflow.addPhase(new Phase('dependencies'));
    workflow.addPhase(new Phase('run'));
    let project = new Project();
    try {
      await pluginManager.resolvePostInstallWorkflow(project, workflow);
      r();
    } catch (e) { r.fail(e); }
  });
});
