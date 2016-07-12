'use strict';

var gulp = require('gulp');
var fs = require('fs');


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