'use strict';

var gulp = require('gulp');
var jshint = require('gulp-jshint');
var less = require('gulp-less');
var rename = require('gulp-rename');
var jeditor = require('gulp-json-editor');
var shell = require('gulp-shell');
var gulpJasmine = require('gulp-jasmine');
var minifyCSS = require('gulp-minify-css');

gulp.task('default', ['watch']);

gulp.task('watch', function () {
    gulp.watch('public/css/**', ['compile-less']);
});

gulp.task('build', ['compile-less', 'bundle-js', 'type-production']);
gulp.task('unbuild', ['type-development']);

gulp.task('client-tests', function() {
  return gulp.src('tests/**')
    .pipe(gulpJasmine({
      verbose: true
    }));
});

gulp.task('jshint', function() {
  return gulp.src([
      'public/js/**/*js',
      'tests/**/*js'
    ])
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('compile-less', function () {
  return gulp.src('public/css/imports.less')
    .pipe(less({
      paths: ['public/css/']
    }))
    .pipe(rename('combined.css'))
    .pipe(gulp.dest('public/build/'))
    .pipe(minifyCSS())
    .pipe(rename('combined.min.css'))
    .pipe(gulp.dest('public/build/'));
});

gulp.task('type-production', function () {
  return gulp.src('configs/app.json')
    .pipe(jeditor({
      type: 'production'
    }, {
      'indent_size': 2
    }))
    .pipe(gulp.dest('configs/'));
});

gulp.task('type-development', function () {
  return gulp.src('configs/app.json')
    .pipe(jeditor({
        type: 'development'
      }, {
        'indent_size': 2
      }))
    .pipe(gulp.dest('configs/'));
});

gulp.task('bundle-js', shell.task([
  'node public/bower_components/rjs/dist/r.js -o public/build/build.json > public/build/build.js.log'
]));
