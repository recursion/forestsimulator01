var gulp = require('gulp');
var paths = require('../paths');

import {compile} from './build-js.js';

// watch scripts, sass, and html
// and run build tasks when they change
gulp.task('watch', function() {
  gulp.watch(paths.html, ['copy-html']);
  gulp.watch(paths.css, ['build-css']);

  // use watchify and our build-js task to recompile js on changes
  return compile(true);
});
