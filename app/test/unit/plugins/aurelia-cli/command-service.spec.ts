import {CommandService} from '../../../../src/plugins/aurelia-cli/command-service';
import {Project} from '../../../../src/shared/index';
import {Task}    from '../../../../src/plugins/task-manager/index';

describe('Aurelia-CLI command-service', () => {
  let sut: CommandService;

  beforeEach(() => {
    sut = new CommandService();
  });

  it('detects project url from output', () => {
    let project = new Project();
    let task = new Task(project, 'au run --watch');
    let text = 'Application Available At: http://localhost:9000\r\n';
    sut.tryGetPort(project, text, task);
    expect(project.__meta__.url).toBe('http://localhost:9000');
  });

  it('explains ENOENT error', () => {
    let project = new Project();
    let task = new Task(project, 'au run --watch');
    let text = 'spawn au ENOENT';
    let spy = spyOn(task, 'addTaskLog');
    sut.warnENOENT(text, task);
    expect(spy).toHaveBeenCalledWith('ENOENT: Please install aurelia-cli: npm install aurelia-cli -g');
  });
});