var gulp = require('gulp');
var paths = require('../paths');
var electron = require('electron-connect').server.create();

electron.on('closed', function(){
    process.exit();
});

// outputs changes to files to the console
function reportChange(event) {
  console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
}

// this task wil watch for changes
// to js, html, and css files and call the
// reportChange method.
gulp.task('watch', ['build'], function() {
  electron.start();

  gulp.watch(paths.source, ['build-system']).on('change', reportChange);
  gulp.watch('custom_typings/**/*.d.ts', ['build-system']).on('change', reportChange);
  gulp.watch('typings/**/*.d.ts', ['build-system']).on('change', reportChange);
  gulp.watch(paths.json, ['build-json']).on('change', reportChange);
  gulp.watch('app/index.js').on('change', reportChange);
  gulp.watch('app/index.html').on('change', reportChange);
  gulp.watch(paths.html, ['build-html']).on('change', reportChange);
  gulp.watch('app/styles/**/*.less', ['build-less']).on('change', reportChange);
});
