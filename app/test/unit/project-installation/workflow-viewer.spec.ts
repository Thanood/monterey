import {WorkflowViewer} from '../../../src/project-installation/workflow-viewer';
import {Step} from '../../../src/project-installation/step';
import {Workflow} from '../../../src/project-installation/workflow';
import {Phase} from '../../../src/project-installation/phase';
import {Project} from '../../../src/shared/project';
import {PluginManager} from '../../../src/shared/plugin-manager';
import {Container}  from 'aurelia-dependency-injection';
import {FS}         from 'monterey-pal';
import '../setup';

import {Plugin as JSPMPlugin}    from '../../../src/plugins/jspm/index';
import {Plugin as NPMPlugin}     from '../../../src/plugins/npm/index';
import {Plugin as CLIPlugin}     from '../../../src/plugins/aurelia-cli/index';
import {Plugin as GulpPlugin}    from '../../../src/plugins/gulp/index';
import {Plugin as WebpackPlugin} from '../../../src/plugins/webpack/index';
import {Plugin as TypingsPlugin} from '../../../src/plugins/typings/index';
import {Plugin as DotNetPlugin}  from '../../../src/plugins/dotnet/index';

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

describe('Workflow viewer', () => {
  let sut: WorkflowViewer;
  let container: Container;

  beforeEach(() => {
    container = new Container();
    sut = <WorkflowViewer>container.get(WorkflowViewer);

    sut.workflow = new Workflow();
    sut.workflow.addPhase(new Phase('dependencies'));
    sut.workflow.addPhase(new Phase('environment'));
    sut.workflow.addPhase(new Phase('run'));

    sut.workflow.getPhase('dependencies').addStep(new Step('npm install', 'npm install', null));
    sut.workflow.getPhase('dependencies').addStep(new Step('jspm install', 'jspm install', null));

    sut.workflow.getPhase('environment').addStep(new Step('typings install', 'typings install', null));

    sut.workflow.getPhase('run').addStep(new Step('gulp watch', 'gulp watch', null));
    sut.workflow.getPhase('run').addStep(new Step('dotnet run', 'dotnet run', null));
  });

  it('deselects following phases when a phase gets unchecked', () => {
    sut.workflow.getPhase('dependencies').checked = false;

    sut.workflow.onCheck(sut.workflow.getPhase('dependencies'));

    for(let x = sut.workflow.phases.indexOf(sut.workflow.getPhase('dependencies')) + 1; x < sut.workflow.phases.length; x++) {
      expect(sut.workflow.phases[x].checked).toBe(false);

      for(let y = 0; y < sut.workflow.phases[x].steps.length; y++) {
        expect(sut.workflow.phases[x].steps[y].checked).toBe(false);
      }
    }
  });

  it('deselects following phases when a step gets unchecked', () => {
    // using this to make sure that previous steps are left untouched
    sut.workflow.getPhase('dependencies').steps[0].checked = true;

    sut.workflow.getPhase('dependencies').steps[1].checked = false;
    sut.workflow.onCheck(sut.workflow.getPhase('dependencies'), sut.workflow.getPhase('dependencies').steps[1]);

    for(let x = sut.workflow.phases.indexOf(sut.workflow.getPhase('dependencies')) + 1; x < sut.workflow.phases.length; x++) {
      expect(sut.workflow.phases[x].checked).toBe(false);

      for(let y = 0; y < sut.workflow.phases[x].steps.length; y++) {
        expect(sut.workflow.phases[x].steps[y].checked).toBe(false);
      }
    }

    expect(sut.workflow.getPhase('dependencies').steps[0].checked).toBe(true);
  });

  it('selects previous phases when a phase gets checked', () => {
    // deselect all
    sut.workflow.phases.forEach(phase => {
      phase.checked = false;
      phase.steps.forEach(step => step.checked = false);
    });

    sut.workflow.getPhase('run').checked = true;
    sut.workflow.onCheck(sut.workflow.getPhase('run'));

    for(let x = 0; x < sut.workflow.phases.indexOf(sut.workflow.getPhase('run')); x++) {
      expect(sut.workflow.phases[x].checked).toBe(true);

      for(let x = 0; x < sut.workflow.phases[x].steps.length; x++) {
        expect(sut.workflow.phases[x].steps[x].checked).toBe(true);
      }
    }
  });

  it('deselects next steps in the same phase', () => {
    sut.workflow.getPhase('dependencies').steps[0].checked = false;

    sut.workflow.onCheck(sut.workflow.getPhase('dependencies'), sut.workflow.getPhase('dependencies').steps[0]);

    expect(sut.workflow.getPhase('dependencies').steps[1].checked).toBe(false);
  });

  it('selects previous steps in the same phase', () => {
    sut.workflow.getPhase('dependencies').steps[0].checked = false;
    sut.workflow.getPhase('dependencies').steps[1].checked = true;

    sut.workflow.onCheck(sut.workflow.getPhase('dependencies'), sut.workflow.getPhase('dependencies').steps[1]);

    expect(sut.workflow.getPhase('dependencies').steps[0].checked).toBe(true);
  });

  it('selects phase if all steps are checked', () => {
    sut.workflow.getPhase('dependencies').checked = false;

    sut.workflow.getPhase('dependencies').steps[0].checked = true;
    sut.workflow.getPhase('dependencies').steps[1].checked = true;

    sut.workflow.onCheck(sut.workflow.getPhase('dependencies'), sut.workflow.getPhase('dependencies').steps[1]);

    expect(sut.workflow.getPhase('dependencies').checked).toBe(true);
  });

  it('unselects phase if all steps are unchecked', () => {
    sut.workflow.getPhase('dependencies').checked = true;

    sut.workflow.getPhase('dependencies').steps.forEach(step => step.checked = false);

    sut.workflow.onCheck(sut.workflow.getPhase('dependencies'), sut.workflow.getPhase('dependencies').steps[0]);

    expect(sut.workflow.getPhase('dependencies').checked).toBe(false);
  });

  it('selects/deselects steps in phase when a phase gets selected/deselected', () => {
    sut.workflow.getPhase('dependencies').checked = false;

    sut.workflow.onCheck(sut.workflow.getPhase('dependencies'));

    sut.workflow.getPhase('dependencies').steps.forEach(s => expect(s.checked).toBe(false));

    // and check again

    sut.workflow.getPhase('dependencies').checked = true;

    sut.workflow.onCheck(sut.workflow.getPhase('dependencies'));

    sut.workflow.getPhase('dependencies').steps.forEach(s => expect(s.checked).toBe(true));    
  });
});