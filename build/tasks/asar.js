var gulp = require('gulp');
var asar = require('asar');

gulp.task('asar', function(d) {
  asar.createPackage('app', 'app/app.asar', function() {
    console.log('created .asar file.');
    d();
  })
});
