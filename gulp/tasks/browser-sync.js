var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var sass        = require('gulp-sass');
var del = require('del');
var paths = require('../paths');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var cssmin = require('gulp-cssmin');
var rename = require('gulp-rename');

// clean sass
gulp.task('clean-css', function(cb){
  del([paths.dist + 'css/*.css'], cb);
});

// run our sass build pipeline
gulp.task('build-css', ['clean-css'], function() {
  return gulp.src(paths.css)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('main.css'))
    .pipe(cssmin())
    .pipe(rename('main.min.css'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.dist + 'css'))
    .pipe(browserSync.stream());
});

// Static Server + watching scss/html files
gulp.task('serve', ['build-css'], function() {

    browserSync.init({
        server: "./dist"
    });

    gulp.watch("dist/**/*.*").on('change', browserSync.reload);
});
