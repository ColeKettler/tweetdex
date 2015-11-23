'use strict';

var _ = require('lodash');
var gulp = require('gulp');
var cache = require('gulp-cached');
var jshint = require('gulp-jshint');
var nodemon = require('gulp-nodemon');

var jsFiles = ['*.js', 'src/*.js'];

gulp.task('default', ['watch', 'lint', 'start']);

gulp.task('lint', function() {
  return gulp.src(jsFiles)
    .pipe(cache('linting'))
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

// Default Nodemon options
var nodemonOpts = {
    script: 'src/bot.js',
    ext: 'js',
    ignore: ['gulpfile.js'],
    env: {
      'NODE_ENV': 'development'
    },
};

gulp.task('start', function() {
  return nodemon(nodemonOpts);
});

gulp.task('debug', function() {
  var opts = { exec: 'node-inspector & node --debug' };
  return nodemon(_.assign(opts, nodemonOpts));
});

gulp.task('watch', function() {
  gulp.watch(jsFiles, ['lint']);
});
