import test from 'ava'
import Vinyl from 'vinyl'
import fn from '.'

test(async t => {
  const stream = fn()

  stream.end(new Vinyl({}))

  t.is(1, 1)
})
