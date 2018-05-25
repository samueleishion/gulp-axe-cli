'use strict'

const through = require('through2')
const PluginError = require('plugin-error')
const gutil = require('gulp-util')
const exec = require('child_process').exec

const PLUGIN_NAME = 'gulp-axe-cli'

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

        if (typeof params.urls === 'function') {
          url = params.urls(buffer.history[0])

          if (url === undefined || url.length <= 0) {
            this.emit('error', new PluginError(PLUGIN_NAME, 'the obj.url() must return a valid string'))
          }
        } else {
          url = buffer.history[0]
        }

        exec('axe "' + url + '" --tags wcag2a,wcag2aa', function (error, response, body) {
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
