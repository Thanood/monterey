import {CommandEditor} from '../../../../src/plugins/task-manager/commands/command-editor';
import {Container} from 'aurelia-framework';

describe('CommandEditor', () => {
  let sut: CommandEditor;

  beforeEach(() => {
    let container = new Container();
    sut = container.get(CommandEditor);
  });

  it('correctly splits command string into command with args', () => {
    sut.commandStr = 'gulp watch';
    sut.persist();
    expect(sut.command.command).toBe('gulp');
    expect(sut.command.args[0]).toBe('watch');

    sut.commandStr = 'au run --watch';
    sut.persist();
    expect(sut.command.command).toBe('au');
    expect(sut.command.args[0]).toBe('run');
    expect(sut.command.args[1]).toBe('--watch');

    sut.commandStr = 'au';
    sut.persist();
    expect(sut.command.command).toBe('au');
    expect(sut.command.args.length).toBe(0);
  });

  it('resets when command changes', () => {
    sut.commandStr = 'gulp watch';
    sut.command = { command: 'dotnet', args: ['run'] };
    sut.commandChanged();
    expect(sut.commandStr).toBe('dotnet run');

    sut.commandStr = 'gulp watch';
    sut.command = null;
    sut.commandChanged();
    expect(sut.commandStr).toBe('');
  });
});