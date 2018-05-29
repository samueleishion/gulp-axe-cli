import path from 'path'
import test from 'ava'
import Vinyl from 'vinyl'
import fn from '../'

test.beforeEach(t => {
  t.context = {
    urls: function (file) {
      file = 'http://localhost:3000/' + file.substring(file.lastIndexOf('/') + 1)
      return file
    },
    'tags': ['wcag2a', 'wcag2aa'],
    'rules': ['color-contrast'],
    'disable': ['html-has-lang'],
    'scope': {
      'include': '#main',
      'exclude': '#brand'
    },
    'browser': '',
    'timeout': 120,
    'load-delay': 2000,
    'save': false
  }
})

test('Passing index.html', async t => {
  const stream = fn(t.context)

  stream.end(new Vinyl({
    base: __dirname,
    path: path.join(__dirname, 'pages/index.html'),
    contents: Buffer.from('unicorns')
  }))

  t.pass()
})

test.failing('Failing errors.html', async t => {
  const stream = fn(t.context)

  stream.end(new Vinyl({
    base: __dirname,
    path: path.join(__dirname, 'pages/errors.html'),
    contents: Buffer.from('unicorns')
  }))

  t.fail()
})
