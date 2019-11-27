'use strict';

var gulp = require('gulp');
var exec = require('child_process').exec;
var ava = require('gulp-ava');
var gls = require('gulp-live-server');
var colors = require('ansi-colors');

var server = gls.static('test/pages', 3297);

var test = (cb) => {
  server.start();
  // console.log(colors.yellow('gulpfile.js'), 'test');
  exec('./node_modules/ava/cli.js test/cases.js --verbose', function(err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
    server.stop();
  });
  // return gulp.src('test/cases.js')
  //   .pipe(ava({
  //     cache: true,
  //     concurrency: 1,
  //     failFast: true,
  //     failWithoutAssertions: true,
  //     serial: true,
  //     tap: false,
  //     verbose: false,
  //     watch: false
  //   }))
  //   .on('data', function() {
  //     console.log(colors.yellow('gulpfile.js'), 'data');
  //     server.start();
  //     // server.stop();
  //     // process.exit(0);
  //   })
  //   .on('finish', function() {
  //     console.log(colors.yellow('gulpfile.js'), 'finish');
  //   })
  //   // .pipe(gulp.dest('test'))
  //   .on('end', function() {
  //     console.log(colors.yellow('gulpfile.js'), 'end');
  //     // server.stop();
  //     // process.exit(0);
  //   })
  //   .on('error', function(err) {
  //     console.log(colors.yellow('gulpfile.js'), err.message);
  //     console.log(err.message);
  //     // server.stop();
  //     // process.exit(1);
  //   });
};

gulp.task('test', gulp.series(test));

gulp.task('default', gulp.series(test));
