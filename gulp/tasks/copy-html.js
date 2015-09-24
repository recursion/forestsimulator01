var gulp = require('gulp');
var del = require('del');
var paths = require('../paths');

// clean html
gulp.task('clean-html', function(cb){
  del([paths.dist + '**/*.html'], cb);
});

// this copies html from our app components
// into the dist dir.
gulp.task('copy-html', ['clean-html'], function() {
  return gulp.src(paths.html)
    .pipe(gulp.dest('dist'));
});
