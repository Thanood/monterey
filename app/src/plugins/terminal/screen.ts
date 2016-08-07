import {inject, NewInstance}  from 'aurelia-framework';
import {ApplicationState}     from '../../shared/application-state';
declare var System: any;
declare var process: any;
const spawn = System._nodeRequire('child_process').spawn;
const treeKill = System._nodeRequire('tree-kill');


@inject(ApplicationState)
export class Screen {
  terminal: any;
  terminalText: string = "";
  input: string = "";
  path: string = "";
  restart: boolean = false;


  constructor(private state: ApplicationState) {
  }


  async activate(model) {
    this.path = model.selectedProject.path;
    this.startTerminal()
  }


  startTerminal() {
    let cmd = process.platform === 'win32' ? 'cmd' : 'bash';
    let terminal = spawn(cmd, {
      cwd: this.path
    });

    terminal.stdout.on('data', (data) => {
      this.terminalText = this.terminalText + data;
      this.scroll();
    });

    terminal.stderr.on('data', (data) => {
      this.terminalText = this.terminalText + data;
      this.scroll();
    });

    terminal.on('exit', (code) => {
      this.terminalText = this.terminalText + 'child process exited with code ' + code + '\n';
      if (this.restart) {
        this.restart = false;
        this.startTerminal();
      }
    });

    this.terminal = terminal;
  }


  scroll() {
    setTimeout(()=> {
      let textarea = document.getElementById('terminal-vr');
      textarea.scrollTop = textarea.scrollHeight;
    }, 300)
  }


  restartTerminal() {
    treeKill(this.terminal.pid, 'SIGKILL');
    this.restart = true;
  }


  keydown(e) {
    //listen for contrl+c
    if (e.ctrlKey && e.keyCode === 67) {
      this.restartTerminal();
    }

    if (e.keyCode === 13) {
      this.terminal.stdin.write(`${this.input}\n`);
      this.input = "";
      return false;
    } else {
      return true;
    }
  }


  detached() {
    this.terminal.stdin.end();
    //this.terminal.kill('SIGHUP');// -> not working
    treeKill(this.terminal.pid, 'SIGKILL');
  }


}
