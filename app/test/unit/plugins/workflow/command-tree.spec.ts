import {CommandRunner, CommandTree} from '../../../../src/plugins/task-manager/index';
import {Container}   from 'aurelia-dependency-injection';
import {Project}     from '../../../../src/shared/project';

describe('CommandTree', () => {
  let sut: CommandTree;
  let container: Container;

  beforeEach(() => {
    sut = new CommandTree({});
    container = new Container();
  });

  it('creates correct workflow', () => {
    let project = new Project();

    // - npm install
    //    - jspm install
    //        - dotnet run
    //        - gulp watch
    sut.children = [new CommandTree({
      command: { command: 'npm', args: ['install'] },
      children: [new CommandTree({
        command: { command: 'jspm', args: ['install'] },
        children: [new CommandTree({
          command: { command: 'gulp', args: ['watch'] }
        }), new CommandTree({
          command: { command: 'dotnet', args: ['run'] }
        })]
      })]
    })];

    let workflow = sut.createWorkflow(project, container.get(CommandRunner), null);

    expect(workflow.phases.length).toBe(1);

    let phase = workflow.phases[0];

    expect(phase.steps.length).toBe(4);

    expect(phase.steps[0].title).toBe('npm install');
    expect(phase.steps[1].title).toBe('jspm install');
    expect(phase.steps[2].title).toBe('gulp watch');
    expect(phase.steps[3].title).toBe('dotnet run');

    expect(phase.steps[0].task.dependsOn).toBeUndefined();
    expect(phase.steps[1].task.dependsOn).toBe(phase.steps[0].task);
    expect(phase.steps[2].task.dependsOn).toBe(phase.steps[1].task);
    expect(phase.steps[3].task.dependsOn).toBe(phase.steps[1].task);
  });
});