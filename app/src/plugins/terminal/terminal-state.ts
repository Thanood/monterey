import {SelectedProject} from '../../shared/selected-project';
import {autoinject}      from 'aurelia-framework';
import {ELECTRON, OS}    from 'monterey-pal';

@autoinject()
export class TerminalState {
  terminals: any;
  selectedTerminal: any;
  id: number = 1;
  lastXtermInputLength: number = null;
  xterm;
  pty;

  constructor(private selectedProject: SelectedProject) {
    this.terminals = [];
    this.selectedTerminal = {};
    this.xterm = ELECTRON.getxTerm();
    this.pty = ELECTRON.getPty();
  }

  getID() {
    return this.id++;
  }


  createXterm() {

    let xterminal = new this.xterm({
      cursorBlink: true,
      cols: 70,
      rows: 18
    });

    let length = this.terminals.length;
    xterminal.open(this.terminals[length - 1].element);

    xterminal.on('key', (key, ev)=> {
      var printable = (
        !ev.altKey && !ev.altGraphKey && !ev.ctrlKey && !ev.metaKey
      );

      if (ev.keyCode == 13) {
        this.selectedTerminal.pty.write(key)
      } else if (ev.keyCode == 8) {

        // Do not delete the corrent text from terminal
        if (xterminal.x > this.lastXtermInputLength) {
          this.selectedTerminal.pty.write('\b \b');
        }

      } else if (printable) {
        this.selectedTerminal.pty.write(key)
      }
    });

    xterminal.on('paste', function (data) {
      this.selectedTerminal.pty.write(data);
    });

    return xterminal;
  }


  createPTY(id) {
    let terminalView = this.createXterm();
    let cmd = OS.getPlatform() === 'win32' ? OS.getEnv(['comspec']) || 'cmd.exe' : OS.getEnv('SHELL') || 'sh';

    
    let path = this.selectedProject.current ? this.selectedProject.current.path : undefined;

    var ptyTerminal = this.pty.spawn(cmd, [], {
      name: 'xterm-color',
      env: OS.getEnv(),
      cwd: path,
      cols: terminalView.cols
    });

    ptyTerminal.on('data', (data)=> {
      terminalView.write(data);
      if (this.lastXtermInputLength = null) {
        let children = terminalView.rowContainer.children;
        this.lastXtermInputLength = children[this.lastXtermInputLength - 1].innerText.length
      }
    });

    ptyTerminal.on('exit', () => {
      this.terminals.forEach((t, i)=> {
        if (this.selectedTerminal) {
          if (t.pty.pid === this.selectedTerminal.pty.pid) {
            this.terminals.splice(i, 1);
            this.selectedTerminal = null;
          }
        }
      });

    });

    let length = this.terminals.length;

    this.terminals[length - 1].xterm = terminalView;
    this.terminals[length - 1].pty = ptyTerminal;
    this.terminals[length - 1].name = id;

    if (this.selectedTerminal) {
      this.selectedTerminal.active = false;
    }
    this.selectedTerminal = this.terminals[length - 1];
  }
}
