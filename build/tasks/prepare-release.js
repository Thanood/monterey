var gulp = require('gulp');
var runSequence = require('run-sequence');
var paths = require('../paths');
var conventionalChangelog = require('gulp-conventional-changelog');
var fs = require('fs');
var args = require('../args');
var bump = require('gulp-bump');

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

gulp.task('bump:app', function() {
  return gulp.src('./app/package.json')
    .pipe(bump({type:args.bump })) //major|minor|patch|prerelease
    .pipe(gulp.dest('./app'));
});

gulp.task('bump:repo', function() {
  return gulp.src('./package.json')
    .pipe(bump({type:args.bump })) //major|minor|patch|prerelease
    .pipe(gulp.dest('./'));
});

gulp.task('bump', function (callback) {
  return runSequence(
    'bump:app',
    'bump:repo',
    callback
  );
})

// calls the listed sequence of tasks in order
gulp.task('prepare-release', function(callback) {
  return runSequence(
    'build',
    'lint',
    'bump',
    'changelog',
    callback
  );
});
