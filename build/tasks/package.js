var packager = require('electron-packager');
var gulp = require('gulp');
var fs = require('fs');
var packageJSON = require('../../package.json');
var runSequence = require('run-sequence');

var deps = [];
var allowed = [];

gulp.task('package', function(callback) {
  var options = {
    dir: './',
    name: 'Monterey',
    platform: 'win32',
    arch: 'x64',
    ignore: getNodeModulesIgnoreGlob(),
    out: '_packages',
    overwrite: true,
    'app-version': '0.1.0'
  };

  packager(options, function done(err, appPath) {
    if (err) { return console.log(err); }
    callback();
  });
});

gulp.task('deploy', function(callback) {
  runSequence(
    'pre-package',
    'package',
    'post-package',
    callback
  );
});

gulp.task('pre-package', function(cb) {
  fs.renameSync('./index.html', 'index.dev.html');
  fs.renameSync('./index.prod.html', 'index.html');
  cb();
});

gulp.task('post-package', function(cb) {
  fs.renameSync('./index.html', 'index.prod.html');
  fs.renameSync('./index.dev.html', 'index.html');
  cb();
});

function getNodeModulesIgnoreGlob() {
  var dirs = fs.readdirSync('./node_modules');
  var ignore = [];
  var i = 0;
  var dir;
  allowed = [];

  for (i = 0; i < Object.keys(packageJSON.dependencies).length; i++) {
    getDeps(Object.keys(packageJSON.dependencies)[i]);
  }

  for (i = 0; i < dirs.length; i++) {
    dir = dirs[i];

    if (allowed.indexOf(dir) === -1) {
      ignore.push('/node_modules/' + dir + '($|/)');
    }
  }


  return ignore;
}

gulp.task('get_ignored_node_modules', function(cb) {
  // console.log(getNodeModulesIgnoreGlob());
  getNodeModulesIgnoreGlob();
  cb();
});

function getDeps(module) {
  var _packageJSON;
  var i = 0;
  var _deps;

  try {
    _packageJSON = require('../../node_modules/' + module + '/package.json');
    _deps = Object.keys(_packageJSON.dependencies);

    if (_deps) {
      for (i = 0; i < _deps.length; i++) {
        if (_deps[i] === "uglify-js") {
          console.log(module);
        }
        if (allowed.indexOf(_deps[i]) === -1) {
          allowed.push(_deps[i]);
          getDeps(_deps[i]);
        }
      }
    }
  } catch (e) {
    if (e.code !== 'MODULE_NOT_FOUND') {
      console.log(e);
    }
  }

  if (allowed.indexOf(module) === -1) {
    allowed.push(module);
  }

  return deps;
}
