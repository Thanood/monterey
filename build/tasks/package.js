'use strict';

var packager = require('electron-packager');
var gulp = require('gulp');
var fs = require('fs');
var runSequence = require('run-sequence');
var appVersion = require('../../app/package.json').version;

gulp.task('package', function(callback) {
  var options = {
    dir: './app/export',
    name: 'monterey',
    platform: ['darwin', 'win32', 'linux'], // darwin = mac osx
    arch: 'all',
    out: 'release',
    overwrite: true,
    version: '1.2.6', // version of electron-prebuilt (https://github.com/electron-userland/electron-packager/issues/391#issuecomment-225380074)
    'app-version': appVersion
  };

  packager(options, function done(err, appPath) {
    if (err) { return console.log(err, appPath); }
    callback();
  });
});

gulp.task('deploy', function(callback) {
  runSequence(
    'clean-release',
    'export',
    'package',
    'clean-export',
    callback
  );
});

gulp.task('rename-index', function(cb) {
  fs.renameSync('./app/index.html', 'app/index.dev.html');
  fs.renameSync('./app/index.prod.html', 'app/index.html');
  fs.renameSync('./app/index.js', 'app/index.dev.js');
  fs.renameSync('./app/index.prod.js', 'app/index.js');
  cb();
});


gulp.task('rename-index-back', function(cb) {
  fs.renameSync('./app/index.html', 'app/index.prod.html');
  fs.renameSync('./app/index.dev.html', 'app/index.html');
  fs.renameSync('./app/index.js', 'app/index.prod.js');
  fs.renameSync('./app/index.dev.js', 'app/index.js');
  cb();
});