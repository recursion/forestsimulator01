var gulp = require('gulp');
var paths = require('../paths');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var watchify = require('watchify');
var babel = require('babelify');

function compile(watch) {
  var bundler = watchify(browserify(paths.js.entry, { debug: true }).transform(babel));

  function rebundle() {
    bundler.bundle()
      .on('error', function(err) { console.error(err); this.emit('end'); })
      .pipe(source('app.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest(paths.dist));
  }

  if (watch) {
    bundler.on('update', function() {
      gulp.start('lint');
      console.log('-> bundling...');
      rebundle();
    });
  }

  rebundle();
}
export {compile};

gulp.task('build-js', ['lint'], function(){
  return compile();
});
