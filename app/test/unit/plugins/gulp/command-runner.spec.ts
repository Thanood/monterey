import {CommandService} from '../../../../src/plugins/gulp/command-service';
import {Project} from '../../../../src/shared/index';
import {Task}    from '../../../../src/plugins/task-manager/index';

describe('Gulp command-service', () => {
  let sut: CommandService;

  beforeEach(() => {
    sut = new CommandService();
  });

  it('detects project url from output', () => {
    let project = new Project();
    let task = new Task('gulp watch');
    let text = 'Local URL: http://localhost:9000\r\n';
    sut.tryGetPort(project, text, task);
    expect(project.__meta__.url).toBe('http://localhost:9000');


    project = new Project();
    task = new Task('gulp watch');
    text = 'Local: http://localhost:9005\r\n';
    sut.tryGetPort(project, text, task);
    expect(project.__meta__.url).toBe('http://localhost:9005');
  });
});