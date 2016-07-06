'use strict';

var packager = require('electron-packager');
var gulp = require('gulp');
var fs = require('fs');
var zip = require('gulp-zip');
var runSequence = require('run-sequence');
var zipDir;
var appVersion = require('../../app/package.json').version;

gulp.task('package', function(callback) {
  var options = {
    dir: './app/export',
    name: 'monterey',
    // platform: 'all',
    // arch: 'all',
    platform: 'win32',
    arch: 'x64',
    out: 'release',
    overwrite: true,
    'app-version': appVersion
  };

  packager(options, function done(err, appPath) {
    if (err) { return console.log(err); }
    callback();
  });
});

gulp.task('deploy', function(callback) {
  runSequence(
    'clean-release',
    'export',
    'package',
    'post-package',
    'clean-export',
    callback
  );
});

gulp.task('rename-index', function(cb) {
  fs.renameSync('./app/index.html', 'app/index.dev.html');
  fs.renameSync('./app/index.prod.html', 'app/index.html');
  cb();
});

gulp.task('post-package', function(cb) {
  runSequence(
    'zip-release',
    cb
  );
});

gulp.task('rename-index-back', function(cb) {
  fs.renameSync('./app/index.html', 'app/index.prod.html');
  fs.renameSync('./app/index.dev.html', 'app/index.html');
  cb();
});

gulp.task('zip-release', (callback) => {
  var releases = fs.readdirSync('./release/');
  var i = -1;
  var next = () => {
    i ++;
    zipDir = releases[i];

    if (zipDir) {
      runSequence('zip', next);
    } else {
      callback();
    }
  };

  next();
});

gulp.task('zip', () => {
  return gulp.src('./release/' + zipDir + '/**/*')
  	.pipe(zip(`${zipDir}-${appVersion}.zip`))
  	.pipe(gulp.dest('./release/'));
});
