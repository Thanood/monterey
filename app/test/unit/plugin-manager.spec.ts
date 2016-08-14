import {PluginManager} from '../../src/shared/plugin-manager';
import {BasePlugin}    from '../../src/plugins/base-plugin';
import {ApplicationState} from '../../src/shared/application-state';

describe('PluginManager', () => {
  let pluginManager: PluginManager;

  beforeEach(() => {
    pluginManager = new PluginManager();
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
    pluginManager = new PluginManager();

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
    } catch(e) {
      d.fail(e);
    }
  });
});