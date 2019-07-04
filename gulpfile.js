'use strict';

var gulp = require('gulp');
var ava = require('gulp-ava');
var express = require('gulp-express');

var test = function() {
  express.run(['test/server.js'], {
    shell: true
  }, false);

  gulp.src('test/cases.js')
    .pipe(ava({
      verbose: true
    }))
    .on('error', function(err) {
      console.log(err.message);
      express.stop();
      process.exit(1);
    })
    .pipe(gulp.dest('test'))
    .on('end', function() {
      express.stop();
      process.exit(0);
    });
};

gulp.task('test', gulp.series(test));

gulp.task('default', gulp.series('test'));
