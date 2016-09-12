var gulp = require('gulp');
var runSequence = require('run-sequence');
var changed = require('gulp-changed');
var plumber = require('gulp-plumber');
var typescript = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
var paths = require('../paths');
var assign = Object.assign || require('object.assign');
var notify = require('gulp-notify');
var less = require('gulp-less');
var rename = require('gulp-rename');

var typescriptCompiler = typescriptCompiler || null;
gulp.task('build-system', function() {
  if(!typescriptCompiler) {
    typescriptCompiler = typescript.createProject('tsconfig.json', {
      "typescript": require('typescript')
    });
  }
  return gulp.src(paths.dtsSrc.concat(paths.source))
    .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
    .pipe(changed(paths.output, {extension: '.ts'}))
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(typescript(typescriptCompiler))
    .pipe(sourcemaps.write('.', {includeContent: true, sourceRoot: '/app/src'}))
    .pipe(gulp.dest(paths.output));
});

gulp.task('build-system-release', function() {
  if(!typescriptCompiler) {
    typescriptCompiler = typescript.createProject('tsconfig.json', {
      "typescript": require('typescript')
    });
  }
  return gulp.src(paths.dtsSrc.concat(paths.source))
    .pipe(typescript(typescriptCompiler))
    .pipe(gulp.dest(paths.output));
});

// copies changed html files to the output directory
gulp.task('build-html', function() {
  return gulp.src(paths.html)
    .pipe(changed(paths.output, {extension: '.html'}))
    .pipe(gulp.dest(paths.output));
});

gulp.task('build-less:layout', function() {
  return gulp.src(['app/styles/less/layout/index.less'])
    .pipe(sourcemaps.init())
    .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
    .pipe(less())
    .pipe(rename('layout.css'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(paths.styles));
});

gulp.task('build-less:themes', function() {
  return gulp.src(['app/styles/less/themes/**/index.less'])
    .pipe(sourcemaps.init())
    .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
    .pipe(less())
    .pipe(rename(function (path) {
      path.basename = 'monterey.' + path.dirname;
      path.dirname = '';
    }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(paths.styles));
});

gulp.task('build-json', function() {
  return gulp.src(paths.json)
    .pipe(changed(paths.output, {extension: '.json'}))
    .pipe(gulp.dest(paths.output));
});


// this task calls the clean task (located
// in ./clean.js), then runs the build-system
// and build-html tasks in parallel
// https://www.npmjs.com/package/gulp-run-sequence
gulp.task('build', function(callback) {
  return runSequence(
    'clean',
    ['build-system', 'build-html', 'build-less', 'build-json'],
    callback
  );
});

gulp.task('build-less', function(callback) {
  return runSequence(
    ['build-less:themes', 'build-less:layout'],
    callback
  );
});

gulp.task('build-release', function(callback) {
  return runSequence(
    'clean',
    ['build-system-release', 'build-html', 'build-less', 'build-json'],
    callback
  );
});