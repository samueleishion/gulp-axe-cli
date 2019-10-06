// import path from 'path'
import test from 'ava'
// import Vinyl from 'vinyl'
// import fn from '../'
import colors from 'ansi-colors'

const count = 0

test.beforeEach(t => {
  // console.log(colors.magenta('cases.js'), 'before')
  t.context = {
    urls: function (file) {
      file = 'http://localhost:3297/' + file.substring(file.lastIndexOf('/') + 1)
      return file
    },
    tags: ['wcag2a', 'wcag2aa'],
    rules: ['color-contrast'],
    disable: ['html-has-lang'],
    scope: {
      include: '#main',
      exclude: '#brand'
    },
    browser: '',
    timeout: 120,
    'load-delay': 2000,
    save: false
  }
})

// test.afterEach(t => {
//   console.log(colors.magenta('cases.js'), 'after')
// })

test('Passing index.html', t => {
  console.log(colors.magenta('cases.js'), 'start:passing')
  t.is(count, 0)
  return t.pass()
  // console.log(colors.magenta('cases.js'), 'end:passing')
})

test.failing('Failing errors.html', t => {
  // console.log(colors.magenta('cases.js'), 'start:failing')
  t.is(count, 1)
  return t.fail()
  // console.log(colors.magenta('cases.js'), 'end:failing')
})

test.failing('Failing goodheader-badbody.html', t => {
  t.fail()
})
