//rebuild native modules under app/node_modules

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
