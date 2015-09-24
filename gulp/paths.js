module.exports = {
  // directory to build to
  dist: 'dist/',
  js: {
    all: ['src/**/*.js'],
    modules: ['src/modules/**/*.js'],
    // main js file / entry point for babel/browserify
    entry: 'src/app.js'
  },
  html: ['src/index.html'],
  css: ['src/**/*.scss'],
  // put any vendor files here
  vendor: ['']
};
