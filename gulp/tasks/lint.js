var gulp = require('gulp');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var paths = require('../paths');

// run jshint
gulp.task('lint', function(){
  return gulp.src(paths.js.all)
    .pipe(jshint({}))
    .pipe(jshint.reporter(stylish))
});
