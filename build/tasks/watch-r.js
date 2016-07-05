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
gulp.task('watch-r', ['build'], function() {
  electron.start();

  gulp.watch(paths.source, ['build-system', electron.reload]).on('change', reportChange);
  gulp.watch(paths.json, ['build-json', electron.reload]).on('change', reportChange);
  gulp.watch('app/index.js', electron.restart).on('change', reportChange);
  gulp.watch('app/index.html', electron.restart).on('change', reportChange);
  gulp.watch(paths.html, ['build-html', electron.reload]).on('change', reportChange);
  gulp.watch(paths.less, ['build-less', electron.reload]).on('change', reportChange);
});
