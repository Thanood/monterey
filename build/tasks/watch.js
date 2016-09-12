var gulp = require('gulp');
var paths = require('../paths');
var path = require('path');
var yargs = require('yargs');
var watch = require('gulp-watch');
var runSequence = require('run-sequence');
var argv = yargs.argv;
var electron = require('electron-connect').server.create({ spawnOpt: { cwd: path.join(__dirname, '..', '..', 'app') }});
var params;

// this task wil watch for changes
// to js, html, and css files and call the
// reportChange method.
gulp.task('watch', ['build'], function() {
  params = [argv.env ? `--env=${argv.env}` : '--env=development'];
  _reload = argv.manual ? false : true;
  electron.start(params);

  watch(paths.source, function () {
    reportChange();
    runSequence('build-system', function () {
      reload();
    });
  });

  watch(paths.json, function () {
    reportChange();
    runSequence('build-json', function () {
      reload();
    });
  });

  watch('custom_typings/**/*.d.ts', function () {
    reportChange();
    runSequence('build-system', function () {
      reload();
    });
  });

  watch('typings/**/*.d.ts', function () {
    reportChange();
    runSequence('build-system', function () {
      reload();
    });
  });

  watch('app/locales/**/*.json', function () {
    reportChange();
    reload();
  });

  watch('app/!(config).js', function () {
    reportChange();
    restart();
  });

  watch('app/index.html', function () {
    reportChange();
    restart();
  });

  watch(paths.html, function () {
    reportChange();
    runSequence('build-html', function () {
      reload();
    });
  });

  watch('app/styles/**/*.less', function () {
    reportChange();
    runSequence('build-less', function () {
      reload();
    });
  });
});

// reloads only the browser window
function reload() {
  if (!_reload) return;
  electron.reload();
}

// reloads the main process as well
function restart() {
  if (!_reload) return;
  electron.restart(params);
}

// outputs changes to files to the console
function reportChange(event) {
  console.log('File changed, running tasks...');
}

gulp.task('watch-r', function () { console.log('this is now the default (gulp watch)'); })