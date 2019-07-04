'use strict';

var gulp = require('gulp');
var ava = require('gulp-ava');
var gls = require('gulp-live-server');

var test = async function() {
  var server = gls.static('test/pages', 3297);
  server.start();

  gulp.src('test/cases.js')
    .pipe(ava({
      verbose: true
    }))
    .on('error', function(err) {
      console.log(err.message);
      server.stop();
      process.exit(1);
    })
    .pipe(gulp.dest('test'))
    .on('end', function() {
      server.stop();
      process.exit(0);
    });
};

gulp.task('test', gulp.series(test));

gulp.task('default', gulp.series('test'));
