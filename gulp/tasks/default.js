var gulp = require('gulp');

// the main build task
gulp.task('build', ['copy-html', 'build-css', 'build-js']);


// default task
gulp.task("default", ['build'], function () {
  gulp.start('watch');
});
