import {Main}               from '../../main/main';
import {autoinject}         from 'aurelia-framework';

declare var System: any;
declare var process: any;

const PTY = System._nodeRequire('pty.js');
const XTERM = System._nodeRequire("xTerm");

@autoinject()
export class TerminalState {
  terminals: any;
  selectedTerminal: any;
  id: number = 0;
  path:string;

  constructor(private main: Main) {
    this.terminals = [];
    this.selectedTerminal = {};
    this.path = this.main.selectedProject.path;
  }

  getID() {
    return this.id++;
  }


  createXterm(id) {

    let length = this.terminals.length;

    let xterminal = new XTERM({
      cursorBlink: true,
      cols: 70,
      rows: 18
    });
    let element = document.createElement("DIV");
    xterminal.open(this.terminals[length - 1].element);

    xterminal.on('key', (key, ev)=> {
      var printable = (
        !ev.altKey && !ev.altGraphKey && !ev.ctrlKey && !ev.metaKey
      );

      if (ev.keyCode == 13) {
        this.selectedTerminal.pty.write(key)
      } else if (ev.keyCode == 8) {

        // Do not delete the prompt
        let children = xterminal.rowContainer.children;
        let length = xterminal.rowContainer.children.length;

        if (xterminal.x > children[length - 1].innerText.length) {
          this.selectedTerminal.pty.write('\b \b');
        }

      } else if (printable) {
        this.selectedTerminal.pty.write(key)
      }
    });

    xterminal.on('paste', function (data, ev) {
      this.selectedTerminal.pty.write(data);
    });

    return xterminal;

  }


  createPTY(id) {
    let terminalView = this.createXterm(id);
    let cmd = process.platform === 'win32' ? process.env['comspec'] || 'cmd.exe' : process.env.SHELL || 'sh';

    var ptyTerminal = PTY.spawn(cmd, [], {
      name: 'xterm-color',
      env: process.env,
      cwd: this.path,
      cols: terminalView.cols
    });

    ptyTerminal.on('data', (data)=> {
      terminalView.write(data)
    });

    ptyTerminal.on('exit', (code) => {
      this.terminals.forEach((t, i)=> {
        if (t.pty.pid === this.selectedTerminal.pty.pid) {
          this.terminals.splice(i, 1);
          this.selectedTerminal = null;
         // this.active = false;
        }
      })
    });

    let length = this.terminals.length;

    this.terminals[length - 1].xterm = terminalView;
    this.terminals[length - 1].pty = ptyTerminal;

    if(this.selectedTerminal){
      this.selectedTerminal.active = false;
    }
    this.selectedTerminal = this.terminals[length - 1];

    //this.active = true;

  }

}
