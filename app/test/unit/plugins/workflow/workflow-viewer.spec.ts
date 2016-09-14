import {WorkflowViewer} from '../../../../src/plugins/workflow/workflow-viewer';
import {Step}           from '../../../../src/plugins/workflow/step';
import {Workflow}       from '../../../../src/plugins/workflow/workflow';
import {Phase}          from '../../../../src/plugins/workflow/phase';
import {Project}        from '../../../../src/shared/project';
import {PluginManager}  from '../../../../src/shared/plugin-manager';
import {Container}      from 'aurelia-dependency-injection';
import {FS}             from 'monterey-pal';
import '../../setup';

import {Plugin as JSPMPlugin}    from '../../../../src/plugins/jspm/index';
import {Plugin as NPMPlugin}     from '../../../../src/plugins/npm/index';
import {Plugin as CLIPlugin}     from '../../../../src/plugins/aurelia-cli/index';
import {Plugin as GulpPlugin}    from '../../../../src/plugins/gulp/index';
import {Plugin as WebpackPlugin} from '../../../../src/plugins/webpack/index';
import {Plugin as TypingsPlugin} from '../../../../src/plugins/typings/index';
import {Plugin as DotNetPlugin}  from '../../../../src/plugins/dotnet/index';

describe('Workflow viewer resolving', () => {
  let sut: WorkflowViewer;
  let container: Container;
  let proj: Project;
  let pluginManager: PluginManager;

  beforeEach(() => {
    container = new Container();
    proj = new Project();
    pluginManager = container.get(PluginManager);
    sut = <WorkflowViewer>container.get(WorkflowViewer);

    FS.getFolderPath = (p) => p;

    let plugin = [NPMPlugin, JSPMPlugin, CLIPlugin, GulpPlugin, WebpackPlugin, TypingsPlugin, DotNetPlugin];
    plugin.forEach(p => {
      pluginManager.registerPlugin(container.get(p));
    });

    sut.project = proj;
  });

  it('workflow gets set', async (r) => {
    await sut.resolveWorkflow();
    expect(sut.workflow).not.toBeUndefined();
    r();
  });

  it('npm install step is added', async (r) => {
    proj.packageJSONPath = 'c:/mydir/package.json';
    await sut.resolveWorkflow();
    expect(sut.workflow.getPhase('dependencies').stepExists('npm install')).toBe(true);
    r();
  });

  it('jspm install has higher order than npm install', async (r) => {
    proj.packageJSONPath = 'c:/mydir/package.json';
    proj.jspmVersion = '0.16.15';
    proj.configJsPath = 'c:/mydir/config.js';
    await sut.resolveWorkflow();
    expect(sut.workflow.getPhase('dependencies').stepExists('npm install')).toBe(true);
    expect(sut.workflow.getPhase('dependencies').stepExists('jspm install')).toBe(true);
    expect(sut.workflow.getPhase('dependencies').getStep('jspm install').order > sut.workflow.getPhase('dependencies').getStep('npm install').order).toBe(true);
    r();
  });
});

