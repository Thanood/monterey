// all gulp tasks are located in the ./build/tasks directory
// gulp configuration is in files in ./build directory
require('require-dir')('build/tasks');


/************************************************************************
 *  Rebuild native modules under app/node_modules
 ************************************************************************/
var gulp = require('gulp');
gulp.task('rebuild-native', function () {

  //misc vars
  var installNodeHeaders = require('electron-rebuild').installNodeHeaders;
  var rebuildNativeModules = require('electron-rebuild').rebuildNativeModules;
  var shouldRebuildNativeModules = require('electron-rebuild').shouldRebuildNativeModules;
  var pathToElectron = require('electron-prebuilt');
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
});



/************************************************************************
 *  Install npm in root and under app && jspm install under app
 ************************************************************************/
gulp.task('first-install', function () {

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
      console.log("running NPM -> this will take a while!!!");

      let monterey1 = spawnExec(npm, ["install"], montereyPath);
      let monterey2 = spawnExec(npm, ["install"], montereyAppPath);

      Promise.all([monterey1, monterey2]).then(values => {
        console.log("NPM done");
        resolve()
      }).catch((err)=> {
        reject(err)
      })
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


});
