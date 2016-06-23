var gulp = require('gulp');
var paths = require('../paths');
var electron = require('electron-connect').server.create();

// outputs changes to files to the console
function reportChange(event) {
  console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
}

// this task wil watch for changes
// to js, html, and css files and call the
// reportChange method.
gulp.task('watch', ['build'], function() {
  electron.start();

  gulp.watch(paths.source, ['build-system', electron.restart]).on('change', reportChange);
  gulp.watch('index.js', electron.restart).on('change', reportChange);
  gulp.watch('index.html', electron.restart).on('change', reportChange);
  gulp.watch(paths.html, ['build-html', electron.restart]).on('change', reportChange);
  gulp.watch(paths.less, ['build-less', electron.restart]).on('change', reportChange);
});
