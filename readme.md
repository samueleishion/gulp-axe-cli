# gulp-axe-cli 

[![Build Status](https://travis-ci.org/samueleishion/gulp-axe-cli.svg?branch=master)](https://travis-ci.org/samueleishion/gulp-axe-cli) [![Version](https://img.shields.io/npm/v/gulp-axe-cli.svg)](https://www.npmjs.com/package/gulp-axe-cli) [![License](https://img.shields.io/npm/l/gulp-axe-cli.svg)](LICENSE)

Gulp plugin to test static pages with aXe as pre-commit hook or in CI environment.

## Install

```
$ npm install --save-dev gulp-axe-cli
```


## Usage

```js
const gulp = require('gulp');
const axe = require('gulp-axe-cli');

gulp.task('default', () =>
	gulp.src('src/file.ext')
		.pipe(axe())
		.pipe(gulp.dest('dist'))
);
```


## API

### axe(config)

#### config

Type: `Object`

All properties are optional.

```js
const gulp = require('gulp');
const axe = require('gulp-axe-cli');
const axeConfig = {
		urls: (file) => {
			...
		},
		tags: [ ... ],
		rules: [ ... ],
		disable: [ ... ],
		scope: {
			'include': ' ... ',
			'exclude': ' ... '
		},
		browser: ' ... ',
		timeout: 120, 
		'load-delay': 2000, 
		save: false
	};

gulp.task('default', () =>
	gulp.src('src/file.ext')
		.pipe(axe(axeConfig))
		.pipe(gulp.dest('dist'))
);
```

##### urls

Type: `function`<br>
Default: `f(file) { return file; }`

Allows you to modify the files from `gulp.src([...])` to match your routes either locally or remotely.

##### tags

Type: `array[strings]`<br>
Default: `['wcag2a','wcag2aa']`

Specify which level of a11y compliance to follow. These "tags" include a set of rules to test your pages. [Learn more about the rules](https://www.w3.org/WAI/standards-guidelines/wcag/) or [learn more about aXe tags](https://axe-core.org/docs/#api-name-axegetrules)

##### rules

Type: `array[strings]`<br>
Default: `null`

Add specific rules to test on your pages. These can be in addition to any rules already included in your tags (above). [Learn more about aXe's rules](https://dequeuniversity.com/rules/worldspace/3.0/) or [learn more about axe tags](https://axe-core.org/docs/#api-name-axegetrules)

##### disable

Type: `array[strings]`<br>
Default: `null`

Ignore specific rules as the test run on your pages. These rules will be skipped from the already included in your tags (above). [Learn more about aXe's rules](https://dequeuniversity.com/rules/worldspace/3.0/) or [learn more about axe tags](https://axe-core.org/docs/#api-name-axegetrules)

##### scope

Type: `object[string: string]`<br>
Default: `{ 'include': null, 'exclude': null }`

Scope your tests to either include or exclude particular sections of your page. The `include` and `exclude` keys take in a CSS3 selector for the elements to include/exclude from your test.

##### browser

Type: `string`<br>
Default: `null`

You can run your test on different browsers. By default it runs on a headless Chrome instance. <b>Running in another browser requires that browser's webdriver to be available on your PATH.</b> You can find a list of available webdrivers and how to install them at: [https://seleniumhq.github.io/docs/wd.html](https://seleniumhq.github.io/docs/wd.html)

##### timeout

Type: `number`<br>
Default: `null`

If you find the execution of axe-core takes too long, which can happen on very large pages, use `timeout` to increase the time axe has to test that page. The value represents time in seconds.

##### load-delay

Type: `number`<br>
Default: `null`

If you find your page is not ready after axe has determined it has loaded, you can use `load-delay`. This will make axe wait that time before running the audit after the page has loaded. The value represents time in milliseconds.

##### save

Type: `boolean`<br>
Default: `false`

gulp-axe-cli is meant to run and pass/fail on the terminal, but this doesn't mean you can't save the reports. By default, the reports will save as json files with all the errors in `./axe-results/`

## License

MIT © [Sam Acuna](http://samuelacuna.com)
