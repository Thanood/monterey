var gulp = require('gulp');
var paths = require('../paths');
var yargs = require('yargs');
var argv = yargs.argv;
var electron = require('electron-connect').server.create();
var params;

// this task wil watch for changes
// to js, html, and css files and call the
// reportChange method.
gulp.task('watch', ['build'], function() {
  params = [argv.env ? `--env=${argv.env}` : '--env=development'];
  reload = argv.manual ? false : true;
  electron.start(params);

  gulp.watch(paths.source, ['build-system', reload]).on('change', reportChange);
  gulp.watch(paths.json, ['build-json', reload]).on('change', reportChange);
  gulp.watch('custom_typings/**/*.d.ts', ['build-system', reload]).on('change', reportChange);
  gulp.watch('typings/**/*.d.ts', ['build-system', reload]).on('change', reportChange);
  gulp.watch('app/index.js', restart).on('change', reportChange);
  gulp.watch('app/index.html', restart).on('change', reportChange);
  gulp.watch(paths.html, ['build-html', reload]).on('change', reportChange);
  gulp.watch('app/styles/**/*.less', ['build-less', reload]).on('change', reportChange);
});

// reloads only the browser window
function reload() {
  if (!reload) return;
  electron.reload();
}

// reloads the main process as well
function restart() {
  if (!reload) return;
  electron.restart(params);
}

// outputs changes to files to the console
function reportChange(event) {
  console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
}

gulp.task('watch-r', function () { console.log('this is now the default (gulp watch)'); })