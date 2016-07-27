var gulp = require('gulp');
var runSequence = require('run-sequence');
var paths = require('../paths');
var conventionalChangelog = require('gulp-conventional-changelog');
var fs = require('fs');
var args = require('../args');

// generates the CHANGELOG.md file based on commit
// from git commit messages
gulp.task('changelog', function() {
  var pkg = JSON.parse(fs.readFileSync('./app/package.json', 'utf-8'));
  return gulp.src(paths.doc + '/CHANGELOG.md', {
    buffer: false
  })
  .pipe(conventionalChangelog({
    preset: 'angular',
    repository: pkg.repository.url,
    version: pkg.version
  }))
  .pipe(gulp.dest(paths.doc));
});


// calls the listed sequence of tasks in order
gulp.task('prepare-release', function(callback) {
  return runSequence(
    'build',
    'lint',
    'changelog',
    callback
  );
});
