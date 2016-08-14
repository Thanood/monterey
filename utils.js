/**
 * Created by vegar on 8/13/2016.
 */
/************************************************************************
 *  Rebuild native modules under app/node_modules
 ************************************************************************/
var rebuildNative = ()=> {

  //misc vars
  var installNodeHeaders = require('electron-rebuild').installNodeHeaders;
  var rebuildNativeModules = require('electron-rebuild').rebuildNativeModules;
  var shouldRebuildNativeModules = require('electron-rebuild').shouldRebuildNativeModules;
  var preGypFixRun = require('electron-rebuild').preGypFixRun;
  var childProcess = require('child_process');
  var path = require("path");
  var pathToElectron = path.join(__dirname, '/node_modules/electron-prebuilt/dist/electron');
  var modulesPath = path.join(__dirname, '/app/node_modules');

  shouldRebuildNativeModules(pathToElectron)
    .then((shouldBuild) => {
      if (!shouldBuild) return true;

      let electronVersion = childProcess.execSync(`${pathToElectron} --version`, {
        encoding: 'utf8',
      });
      electronVersion = electronVersion.match(/v(\d+\.\d+\.\d+)/)[1];

      return installNodeHeaders(electronVersion)
        .then(() => rebuildNativeModules(electronVersion, modulesPath))
        .then(() => console.log("build success"))
        .then(() => preGypFixRun('./app/node_modules/pty.js', true, pathToElectron))
        .then(() => console.log("gypfix success"))
    })
    .catch((e) => {
      console.error("Building modules didn't work!");
      console.error(e);
    });
};


/************************************************************************
 *  Install npm in root and under app && jspm install under app
 ************************************************************************/
var firstInstall = ()=> {

  //mics vars
  var path = require("path");
  var spawn = require("child_process").spawn;
  var npm = process.platform === "win32" ? "npm.cmd" : "npm";
  var jspm = process.platform === "win32" ? "jspm.cmd" : "jspm";
  var montereyPath = __dirname;
  var montereyAppPath = path.join(__dirname, "app");
  var mode = "inherit";


  /************************************************************************
   *  Spawn helper
   ************************************************************************/
  var spawnExec = (cmd, args, dirname) => {
    return new Promise((resolve, reject) => {
      var childSpawn = spawn(cmd, args, {stdio: mode, cwd: dirname});
      childSpawn.on("exit", function (code) {
        if (code != 0) {
          console.log("Failed: " + code);
          reject();
        } else {
          resolve()
        }
      });
    });
  }


  /************************************************************************
   *  installs NPM
   ************************************************************************/
  var installNPM = () => {
    return new Promise((resolve, reject) => {
      console.log("running NPM -> main");
      spawnExec(npm, ["install"], montereyPath)
        .then(()=> {
          console.log("running NPM -> app");
          "use strict";
          return spawnExec(npm, ["install"], montereyAppPath)
        })
        .then(()=> {
          "use strict";
          console.log("NPM done");
          resolve()
        })
        .catch((err)=> {
          reject(err)
        });
    });
  }


  /************************************************************************
   *  installs JSPM
   ************************************************************************/
  var installJSPM = () => {
    return new Promise((resolve, reject) => {
      console.log("running JSPM install");

      spawnExec(jspm, ["install"], montereyAppPath)
        .then(()=> {
          console.log("JSPM install done");
          resolve()
        })
        .catch((err)=> {
          reject(err)
        });
    });
  }


  /************************************************************************
   *  run it all
   ************************************************************************/

  installNPM()
    .then(()=> {
      return installJSPM()
    })


};

console.log(process.argv[2])

if (process.argv[2] === "-setup") {
  firstInstall();
}

if (process.argv[2] === "-rebuild-native") {
  rebuildNative();
}
