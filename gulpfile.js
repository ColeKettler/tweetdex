var gulp = require('gulp');
var cache = require('gulp-cached');
var jshint = require('gulp-jshint');
var nodemon = require('gulp-nodemon');

var jsFiles = './*.js';

gulp.task('default', ['watch', 'lint', 'start']);

gulp.task('lint', function() {
  return gulp.src(jsFiles)
    .pipe(cache('linting'))
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('start', function() {
  return nodemon({
    script: 'bot.js',
    ext: 'js',
    ignore: ['gulpfile.js'],
    env: {
      'NODE_ENV': 'development'
    },
  });
});

gulp.task('watch', function() {
  gulp.watch(jsFiles, ['lint']);
});
