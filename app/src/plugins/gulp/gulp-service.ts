import {OS, FS} from 'monterey-pal';

export class GulpService {
  async getTasks(gulpfile: string): Promise<Array<string>> {
    let gulpFileDir = FS.getFolderPath(gulpfile);
    let output = await OS.exec('gulp --tasks-simple', { cwd:  gulpFileDir });

    return output.match(/[^\r\n]+/g);
  }

  runTask(gulpfile: string, task: string, stdout, stderr) {
    let gulpFileDir = FS.getFolderPath(gulpfile);
    let result = OS.spawn(OS.getPlatform() === 'win32' ? 'gulp.cmd' : 'gulp', [task], { cwd:  gulpFileDir }, out => stdout(out), err => stderr(err));
    return result;
  }

  cancelTask(process) {
    OS.kill(process);
  }
}