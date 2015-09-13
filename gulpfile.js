'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var scsslint = require('gulp-scss-lint');
var minifyCss = require('gulp-minify-css');
var cache = require('gulp-cached');
var rename = require('gulp-rename');

gulp.task('scss-lint', function () {
  gulp.src('./src/*.scss')
    .pipe(cache('scsslint'))
    .pipe(scsslint());
});

gulp.task('sass-dev', function () {
  gulp.src('./src/*.scss')
    .pipe(cache('sassdev'))
    .pipe(sourcemaps.init())
      .pipe(sass())
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('sass-dist', function () {
  gulp.src('./src/*.scss')
    .pipe(cache('sassdist'))
    .pipe(sourcemaps.init())
      .pipe(sass())
      .pipe(minifyCss())
      .pipe(rename({ extname: '.min.css' }))
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('watch', function () {
  gulp.watch('./src/*.scss', ['scss-lint']);
});
