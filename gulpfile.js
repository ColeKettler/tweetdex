'use strict';

var _ = require('lodash');
var gulp = require('gulp');
var cache = require('gulp-cached');
var jshint = require('gulp-jshint');
var mocha = require('gulp-mocha');
var nodemon = require('gulp-nodemon');
var tldr = require('mocha-tldr-reporter');

var jsFiles = ['*.js', 'src/*.js', 'test/*.js'];
var testFiles = ['test/*.js'];

// Detect state within tasks
var flags = {
  isWatching: false,
};

// Default Nodemon options
var nodemonOpts = {
    script: 'src/bot.js',
    ext: 'js',
    ignore: ['gulpfile.js'],
    env: {
      'NODE_ENV': 'development'
    },
};

gulp.task('default', ['watch', 'lint', 'test', 'start']);

gulp.task('lint', function() {
  return gulp.src(jsFiles)
    .pipe(cache('linting'))
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('test', function() {
  var reporter = flags.isWatching ? tldr : 'nyan';
  return gulp.src(testFiles, { read: false })
    .pipe(mocha({ reporter: reporter }));
});

gulp.task('start', function() {
  return nodemon(nodemonOpts);
});

gulp.task('debug', function() {
  var opts = { exec: 'node-inspector & node --debug' };
  return nodemon(_.assign(opts, nodemonOpts));
});

gulp.task('watch', function() {
  flags.isWatching = true;
  gulp.watch(jsFiles, ['lint', 'test']);
});
