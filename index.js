'use strict'

const through = require('through2')
const PluginError = require('plugin-error')
const gutil = require('gulp-util')
const exec = require('child_process').exec

const PLUGIN_NAME = 'gulp-axe-cli'

function parseTags (tags) {
  return (tags === null || tags.length <= 0) ? '' : ' --tags ' + tags.join(',')
}

function parseRules (rules) {
  return (rules === null || rules.length <= 0) ? '' : ' --rules ' + rules.join(',')
}

function parseDisables (disables) {
  return (disables === null || disables.length <= 0) ? '' : ' --disable ' + disables.join(',')
}

function parseScope (scope) {
  var result = ''

  if (scope !== null && Object.keys(scope).length > 0) {
    result += (scope.include === null || scope.include.length <= 0) ? '' : " --include '" + scope.include + "'"
    result += (scope.exclude === null || scope.exclude.length <= 0) ? '' : " --exclude '" + scope.exclude + "'"
  }

  return result
}

function parseTimeout (timeout) {
  return (timeout === null || timeout <= 0) ? '' : ' --timeout=' + timeout
}

function parseLoadDelay (loadDelay) {
  return (loadDelay === null || loadDelay <= 0) ? '' : ' --loadDelay=' + loadDelay
}

function parseBrowser (browser) {
  return (browser === null || browser.length <= 0) ? '' : ' --browser ' + browser
}

function parseSave (save) {
  return save ? ' --dir ./axe-results' : ''
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
        // var contents = Buffer.from(buffer.contents.toString())
        var params = options
        var url
        var query

        if (typeof params.urls === 'function') {
          url = params.urls(buffer.history[0])

          if (url === undefined || url.length <= 0) {
            this.emit('error', new PluginError(PLUGIN_NAME, 'the obj.url() must return a valid string'))
          }
        } else {
          url = buffer.history[0]
        }

        query = 'axe "' + url + '"'
        query += parseTags(params.tags)
        query += parseRules(params.rules)
        query += parseDisables(params.disable)
        query += parseScope(params.scope)
        query += parseTimeout(params.timeout)
        query += parseLoadDelay(params['load-delay'])
        query += parseBrowser(params.browser)
        query += parseSave(params.save)

        exec(query, function (error, response, body) {
          if (error !== null || response.indexOf('Accessibility issues detected') > 0) {
            gutil.log(gutil.colors.cyan(PLUGIN_NAME), gutil.colors.red('[ERROR]'), 'Error testing ' + url)
            throw response
          } else if (error !== null || response.indexOf('0 violations found!') > 0) {
            gutil.log(gutil.colors.cyan(PLUGIN_NAME), gutil.colors.green('[PASS]'), url)
          }
        })
      })()

      this.push(file)
    } catch (err) {
      this.emit('error', new PluginError(PLUGIN_NAME, err))
    }

    cb(null, file)
  })
}
