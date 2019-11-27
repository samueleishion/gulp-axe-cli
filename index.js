'use strict'

const through = require('through2')
const PluginError = require('plugin-error')
const log = require('fancy-log')
const colors = require('ansi-colors')
const spawn = require('child_process').spawnSync

const PLUGIN_NAME = 'gulp-axe-cli'

function validateObject (object) {
  return object !== undefined &&
    object !== null &&
    typeof object === 'object' &&
    Object.keys(object).length > 0
}

function validateArray (array) {
  return array !== undefined &&
    array !== null &&
    typeof array === 'object' &&
    array.length > 0
}

function validateString (string) {
  return string !== undefined &&
    string !== null &&
    typeof string === 'string' &&
    string.length > 0
}

function validateNumber (number) {
  return number !== undefined &&
    number !== null &&
    typeof number === 'number' &&
    number >= 0
}

function parseTags (tags) {
  return validateArray(tags) ? ['--tags', tags.join(',')] : ['--tags','wcag2a,wcag2aa']
}

function parseRules (rules) {
  return validateArray(rules) ? ['--rules', rules.join(',')] : []
}

function parseDisables (disables) {
  return validateArray(disables) ? ['--disable', disables.join(',')] : []
}

function parseScope (scope) {
  var result = []

  if (validateObject(scope)) {
    if (validateString(scope.include)) {
      result.push("--include")
      result.push(scope.include.replace('#','\\#'))
    }

    if (validateString(scope.exclude)) {
      result.push("--exclude")
      result.push(scope.exclude.replace('#','\\#'))
    }
  }

  return result
}

function parseTimeout (timeout) {
  return (validateNumber(timeout)) ? ['--timeout=' + timeout] : []
}

function parseLoadDelay (loadDelay) {
  return (validateNumber(loadDelay)) ? ['--loadDelay=' + loadDelay] : []
}

function parseBrowser (browser) {
  return (validateString(browser)) ? ['--browser', browser] : []
}

function parseCromedriverPath(path) {
  return (validateString(path)) ?
    ['--chromedriver-path', path] :
    ['--chromedriver-path', './node_modules/chromedriver/bin/chromedriver']
}

function parseSave (save) {
  return save ? ['--dir', './axe-results'] : []
}

module.exports = options => {
  options = options || {}

  return through.obj(function (file, enc, cb) {
    if (file.isNull()) {
      cb(null, file)
      return
    }

    if (file.isBuffer()) {
      file.contents = Buffer.concat([file.contents])
    }

    if (file.isStream()) {
      cb(new PluginError(PLUGIN_NAME, 'Streaming not supported'))
      return
    }

    try {
      (() => {
        var buffer = file
        var params = options
        var url
        var command
        var args

        if (typeof params.urls === 'function') {
          url = params.urls(buffer.history[0])

          if (url === undefined || url.length <= 0) {
            this.emit('error', new PluginError(PLUGIN_NAME, 'the obj.url() must return a valid string'))
          }
        } else {
          url = buffer.history[0]
        }

        args = [url]
        args = args.concat(parseTags(params.tags))
        args = args.concat(parseRules(params.rules))
        args = args.concat(parseDisables(params.disable))
        args = args.concat(parseScope(params.scope))
        args = args.concat(parseTimeout(params.timeout))
        args = args.concat(parseLoadDelay(params['load-delay']))
        args = args.concat(parseBrowser(params.browser))
        args = args.concat(parseCromedriverPath(params['cromedriver-path']))
        args = args.concat(parseSave(params.save))
        args = args.concat('--timer')

        command = spawn('axe', args, { shell: true })

        if (command.status === 1) {
          log(colors.cyan(PLUGIN_NAME), colors.red('[ERROR]'), 'Issue while running aXe cli')
          throw (command && command.output) ? command.output.toString() : 'Issue while running aXe cli'
        } else if (command.output.toString().indexOf('Accessibility issues detected') > 0) {
          log(colors.cyan(PLUGIN_NAME), colors.red('[ERROR]'), 'Error testing ' + url)
          throw (command && command.output) ? command.output.toString() : 'Error testing ' + url
        } else if (command.output.toString().indexOf('0 violations found!') > 0) {
          log(colors.cyan(PLUGIN_NAME), colors.green('[PASS]'), url)
        }
      })()

      this.push(file)
    } catch (err) {
      this.emit('error', new PluginError(PLUGIN_NAME, err))
    }

    cb(null, file)
  })
}
