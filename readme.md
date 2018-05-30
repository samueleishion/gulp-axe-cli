# gulp-axe-cli

[![Build Status](https://travis-ci.org/samueleishion/gulp-axe-cli.svg?branch=master)](https://travis-ci.org/samueleishion/gulp-axe-cli) [![Version](https://img.shields.io/npm/v/gulp-axe-cli.svg)](https://www.npmjs.com/package/gulp-axe-cli) [![License](https://img.shields.io/npm/l/gulp-axe-cli.svg)](LICENSE)

Gulp plugin to test static pages with aXe as pre-commit hook or in CI environment.

## Why gulp-axe-cli?

Other axe-based plugins are built to generate reports. While these reports are great for analysis, these CLIs, plugins, and packages do not always work well with development pipelines. With gulp-axe-cli, we leverage the power of gulp as a task runner :muscle: and the automation for a11y testing of aXe :collision: to prevent bad code from being committed or built. :thumbsup:

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

__Note__ While aXe one of the best automated tools, it only covers 20%-50% of all a11y issues. Be sure to test manually after the aXe test.


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

## Gotchas

### Create ./axe-results on install to save

If you want to save the results, by default, we're saving them into an `./axe-results` directory. This directory should already be present by the time you run the tests, so you can add a script to [add it post install](https://github.com/samueleishion/gulp-axe-cli-demo/blob/master/package.json#L7).

### Test coverage

aXe helps to automate a11y testing, but it only covers certain rules for fully accessible sites. Here's the note from aXe after each test run:
```
Please note that only 20% to 50% of all accessibility issues can automatically be detected.
Manual testing is always required. For more information see:
https://dequeuniversity.com/curriculum/courses/testingmethods
```

There are only certain a11y rules that are covered, so for maximum coverage, do test your application manually.

## Demo

We're created a demo repo to test the integration at [https://github.com/samueleishion/gulp-axe-cli-demo](https://github.com/samueleishion/gulp-axe-cli-demo)

## License

MIT © [Sam Acuna](http://samuelacuna.com)
