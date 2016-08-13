// install npm in root & under app/, then install jspm.


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





