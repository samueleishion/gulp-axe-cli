# gulp-axe-cli [![Build Status](https://travis-ci.org/samueleishion/gulp-axe-cli.svg?branch=master)](https://travis-ci.org/samueleishion/gulp-axe-cli)

> My perfect gulp plugin


## Install

```
$ npm install --save-dev gulp-axe-cli
```


## Usage

```js
const gulp = require('gulp');
const axeCli = require('gulp-axe-cli');

gulp.task('default', () =>
	gulp.src('src/file.ext')
		.pipe(axeCli())
		.pipe(gulp.dest('dist'))
);
```


## API

### axeCli([options])

#### options

Type: `Object`

##### foo

Type: `boolean`<br>
Default: `false`

Lorem ipsum.


## License

MIT © [Sam Acuna](http://samuelacuna.com)
